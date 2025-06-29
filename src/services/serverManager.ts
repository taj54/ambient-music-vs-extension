import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { logger, getExtensionConfig, tryOpenTab } from '../utils';
import { playlistManager, webSocketManager } from '.';
import { createWebServer } from '../server';

const LOCK_FILE = path.join(os.tmpdir(), 'ambient-music-extension.lock');

export class ServerManager {
  private static instance: ServerManager;
  private server: ReturnType<typeof createWebServer> | undefined;

  private constructor() { }

  public static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager();
    }
    return ServerManager.instance;
  }

  public start(context: vscode.ExtensionContext): void {
    if (this.isAlreadyRunning()) return;
    this.createLockFile();

    const config = getExtensionConfig();
    playlistManager.updateUserPlaylist(config.playlist);

    this.server = createWebServer(context.extensionPath);
    this.server.listen(config.preferredPort, () => {
      const address = this.server?.address();
      const port = typeof address === 'object' && address?.port ? address.port : config.preferredPort;
      const clientUrl = `http://localhost:${port}?port=${port}`;

      logger.debug(`[Ambient Music] Server running at ${clientUrl}`);

      const wsManager = webSocketManager;
      wsManager.setup(this.server!, clientUrl);
      wsManager.startRotation(clientUrl, config.switchIntervalMinutes);
      wsManager.trySendPlay(5, 1000);

      tryOpenTab(clientUrl);
    });

    context.subscriptions.push({ dispose: () => this.stop() });
  }

  public stop(): void {
    this.removeLockFile();

    if (this.server) {
      this.server.close(() => {
        logger.debug('[Ambient Music] HTTP server closed.');
      });
      this.server = undefined;
    }
  }

  private isAlreadyRunning(): boolean {
    if (fs.existsSync(LOCK_FILE)) {
      vscode.window.showWarningMessage(
        'Ambient Music Extension is already running in another VS Code window.'
      );
      logger.debug('[Ambient Music] Another instance is already active.');
      return true;
    }
    return false;
  }

  private createLockFile(): void {
    try {
      fs.writeFileSync(LOCK_FILE, process.pid.toString(), { flag: 'wx' });
      logger.debug(`Lock file created at: ${LOCK_FILE}`);
    } catch (err) {
      logger.error('[Ambient Music] Failed to create lock file:', err);
    }
  }

  private removeLockFile(): void {
    if (fs.existsSync(LOCK_FILE)) {
      try {
        fs.unlinkSync(LOCK_FILE);
        logger.debug('[Ambient Music] Lock file removed.');
      } catch (err) {
        logger.error('[Ambient Music] Failed to remove lock file:', err);
      }
    }
  }
}

export const serverManager = ServerManager.getInstance();
