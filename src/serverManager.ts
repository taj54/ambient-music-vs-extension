import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as vscode from 'vscode';
import { tryOpenTab } from './utils/browser';
import { webSocketSingleton } from './webSocketManager';
import { getCurrentTrack, loadUserPlaylistFromConfig } from './playlist';
import { logInfo } from './utils/logger';
import { getExtensionConfig } from './utils/config';

const LOCK_FILE = path.join(os.tmpdir(), 'ambient-music-extension.lock');

export class serverManager {
  private static instance: serverManager;
  private server: http.Server | undefined;

  private constructor() {}

  public static getInstance(): serverManager {
    if (!serverManager.instance) {
      serverManager.instance = new serverManager();
    }
    return serverManager.instance;
  }

  public start(context: vscode.ExtensionContext) {
    // 🔒 Prevent multiple instances using a lock file
    logInfo("the lock file location"+LOCK_FILE)
    if (fs.existsSync(LOCK_FILE)) {
      console.warn('[Ambient Music] Another instance is already active.');
      vscode.window.showWarningMessage(
        'Ambient Music Extension is already running in another VS Code window.'
      );
      return;
    }

    // 📝 Write PID to lock file
    try {
      fs.writeFileSync(LOCK_FILE, process.pid.toString(), { flag: 'wx' });
    } catch (err) {
      console.error('[Ambient Music] Failed to create lock file:', err);
      return;
    }

    const { switchIntervalMinutes, preferredPort, playlist } = getExtensionConfig();
    loadUserPlaylistFromConfig(playlist);

    const clientHtmlPath = path.join(context.extensionPath, 'media', 'client.html');

    this.server = http.createServer((req, res) => {
      const urlPath = req.url?.split('?')[0];
      if (urlPath === '/' || urlPath === '/client.html') {
        fs.readFile(clientHtmlPath, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading client.html');
          } else {
            const html = data.replace(/{{VIDEO_URL}}/g, getCurrentTrack());
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
          }
        });
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    this.server.listen(preferredPort, () => {
      const address = this.server?.address();
      const actualPort = typeof address === 'object' && address?.port ? address.port : preferredPort;

      const clientUrl = `http://localhost:${actualPort}?port=${actualPort}`;
      const message = `[Ambient Music] Server running at ${clientUrl}`;
      logInfo(message);
      console.log(message);

      const wsManager = webSocketSingleton;
      wsManager.setup(this.server!, clientUrl);

      tryOpenTab(clientUrl);
      wsManager.startRotation(clientUrl, switchIntervalMinutes);
      wsManager.trySendPlay(5, 1000);
    });

    context.subscriptions.push({ dispose: () => this.stop() });
  }

  public stop() {
    // ❌ Cleanup lock file
    if (fs.existsSync(LOCK_FILE)) {
      try {
        fs.unlinkSync(LOCK_FILE);
        console.log('[Ambient Music] Lock file removed.');
      } catch (err) {
        console.error('[Ambient Music] Failed to remove lock file:', err);
      }
    }

    if (this.server) {
      this.server.close(() => {
        console.log('[Ambient Music] HTTP server closed.');
      });
      this.server = undefined;
    }
  }
}

export const serverSingleton = serverManager.getInstance();
