import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as net from 'net';
import * as vscode from 'vscode';
import { logger, getExtensionConfig, openInIncognito, tryOpenTab } from '../utils';
import { webSocketManager } from '.';
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
    void this.startIfPrimary(context, false);
  }

  public openPlayer(context: vscode.ExtensionContext): void {
    void this.startIfPrimary(context, true);
  }

  private async startIfPrimary(context: vscode.ExtensionContext, openPlayer: boolean): Promise<void> {
    const runningPort = await this.getRunningPort();
    const isPrimary = runningPort === undefined;
    const config = getExtensionConfig();

    if (isPrimary) {
      this.server = createWebServer(context.extensionPath);
      this.server.listen(config.preferredPort, () => {
        const address = this.server?.address();
        if (typeof address !== 'object' || !address?.port) {
          logger.error('[Ambient Music] Failed to resolve valid port. Aborting launch.');
          return;
        }

        const port = address.port;
        this.createLockFile(port);
        const clientUrl = `http://localhost:${port}?port=${port}`;
        logger.debug(`[Ambient Music] Server running at ${clientUrl}`);

        const wsManager = webSocketManager;
        wsManager.setup(this.server!, clientUrl);
        wsManager.startRotation(config.switchIntervalMinutes);

        if (openPlayer) {
          openInIncognito(clientUrl, false);
        } else {
          tryOpenTab(clientUrl);
        }
        wsManager.trySendPlay(25, 200);

      });

      context.subscriptions.push({ dispose: () => this.stop() });
    } else {
      logger.debug('[Ambient Music] Secondary window detected — not starting server.');
      if (openPlayer && runningPort) {
        openInIncognito(`http://localhost:${runningPort}?port=${runningPort}`, false);
      }
    }


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

  private async getRunningPort(): Promise<number | undefined> {
    if (!fs.existsSync(LOCK_FILE)) return undefined;

    try {
      const raw = fs.readFileSync(LOCK_FILE, 'utf8').trim();
      const lock = JSON.parse(raw) as { port?: number };
      const port = lock.port;
      if (typeof port === 'number' && await this.canConnect(port)) {
        logger.debug('[Ambient Music] Another instance is already active.');
        return port;
      }
    } catch (err) {
      logger.error('[Ambient Music] Failed to validate the instance lock:', err);
    }

    this.removeLockFile();
    return undefined;
  }

  private canConnect(port: number): Promise<boolean> {
    return new Promise(resolve => {
      const socket = net.createConnection({ host: '127.0.0.1', port });
      socket.setTimeout(500);
      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.once('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      socket.once('error', () => resolve(false));
    });
  }

  private createLockFile(port: number): void {
    try {
      fs.writeFileSync(
        LOCK_FILE,
        JSON.stringify({ pid: process.pid, port }),
        { flag: 'wx' }
      );
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
