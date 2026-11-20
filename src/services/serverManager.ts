import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as net from 'net';
import * as vscode from 'vscode';
import { logger, getExtensionConfig } from '../utils';
import { webSocketManager } from '.';
import { createWebServer } from '../server';

const LOCK_FILE = path.join(os.tmpdir(), 'ambient-music-extension.lock');

export class ServerManager {
  private static instance: ServerManager;
  private server: ReturnType<typeof createWebServer> | undefined;
  private startupPromise: Promise<void> | undefined;
  private ownsLock = false;

  private constructor() { }

  public static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager();
    }
    return ServerManager.instance;
  }

  public start(context: vscode.ExtensionContext): void {
    this.ensureStarted(context, false);
  }

  public openPlayer(context: vscode.ExtensionContext): void {
    this.ensureStarted(context, true);
  }

  private ensureStarted(context: vscode.ExtensionContext, openPlayer: boolean): void {
    if (this.server) {
      if (openPlayer) webSocketManager.openBrowserTab();
      return;
    }

    if (this.startupPromise) {
      void this.startupPromise.then(() => {
        if (openPlayer) {
          if (this.server) webSocketManager.openBrowserTab();
          else webSocketManager.send({ command: 'open_player' });
        }
      });
      return;
    }

    this.startupPromise = this.startIfPrimary(context, openPlayer).finally(() => {
      this.startupPromise = undefined;
    });
  }

  private async startIfPrimary(context: vscode.ExtensionContext, openPlayer: boolean): Promise<void> {
    let runningPort = await this.getRunningPort();
    const config = getExtensionConfig();

    if (runningPort === undefined && !this.claimLock()) {
      for (let attempt = 0; attempt < 50 && runningPort === undefined; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        runningPort = await this.getRunningPort();
      }

      if (runningPort === undefined) {
        logger.error('[Ambient Music] Another instance is starting, but its server did not become available.');
        return;
      }
    }

    if (this.ownsLock) {
      this.server = createWebServer(context.extensionPath);
      this.server.once('error', err => {
        logger.error('[Ambient Music] Failed to start the local server:', err);
        this.server = undefined;
        this.removeLockFile();
      });
      this.server.listen(config.preferredPort, () => {
        const address = this.server?.address();
        if (typeof address !== 'object' || !address?.port) {
          logger.error('[Ambient Music] Failed to resolve valid port. Aborting launch.');
          this.stop();
          return;
        }

        const port = address.port;
        this.updateLockFile(port);
        const clientUrl = `http://localhost:${port}?port=${port}`;
        logger.debug(`[Ambient Music] Server running at ${clientUrl}`);

        const wsManager = webSocketManager;
        wsManager.setup(this.server!, clientUrl);
        wsManager.startRotation(config.switchIntervalMinutes);

        wsManager.openBrowserTab();
        wsManager.trySendPlay(25, 200);

      });

      context.subscriptions.push({ dispose: () => this.stop() });
    } else {
      logger.debug('[Ambient Music] Secondary window detected — not starting server.');
      webSocketManager.connectToServer(runningPort);
      if (openPlayer && runningPort) {
        webSocketManager.send({ command: 'open_player' });
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
      const lock = JSON.parse(raw) as { pid?: number; port?: number };
      const port = lock.port;
      if (typeof port === 'number' && port > 0 && await this.canConnect(port)) {
        logger.debug('[Ambient Music] Another instance is already active.');
        return port;
      }

      if (typeof lock.pid === 'number' && this.isProcessRunning(lock.pid)) {
        return undefined;
      }

      this.removeStaleLockFile(raw);
    } catch (err) {
      logger.error('[Ambient Music] Failed to validate the instance lock:', err);
      try {
        if (Date.now() - fs.statSync(LOCK_FILE).mtimeMs > 5000) {
          this.removeStaleLockFile();
        }
      } catch (statError) {
        logger.error('[Ambient Music] Failed to inspect the instance lock:', statError);
      }
    }

    return undefined;
  }

  private claimLock(): boolean {
    let fd: number | undefined;
    try {
      fd = fs.openSync(LOCK_FILE, 'wx');
      fs.writeSync(fd, JSON.stringify({ pid: process.pid, port: 0 }));
      this.ownsLock = true;
      logger.debug('[Ambient Music] Primary instance lock acquired.');
      return true;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
        logger.error('[Ambient Music] Failed to acquire the instance lock:', err);
      }
      return false;
    } finally {
      if (fd !== undefined) fs.closeSync(fd);
    }
  }

  private updateLockFile(port: number): void {
    try {
      fs.writeFileSync(LOCK_FILE, JSON.stringify({ pid: process.pid, port }));
      logger.debug('[Ambient Music] Instance lock updated with server port.');
    } catch (err) {
      logger.error('[Ambient Music] Failed to update the instance lock:', err);
      this.stop();
    }
  }

  private isProcessRunning(pid: number): boolean {
    try {
      process.kill(pid, 0);
      return true;
    } catch (err) {
      return (err as NodeJS.ErrnoException).code === 'EPERM';
    }
  }

  private removeStaleLockFile(expectedContent?: string): void {
    try {
      if (!fs.existsSync(LOCK_FILE)) return;
      if (expectedContent !== undefined && fs.readFileSync(LOCK_FILE, 'utf8').trim() !== expectedContent) return;
      fs.unlinkSync(LOCK_FILE);
      logger.debug('[Ambient Music] Stale instance lock removed.');
    } catch (err) {
      logger.error('[Ambient Music] Failed to remove stale instance lock:', err);
    }
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

  private removeLockFile(): void {
    if (!this.ownsLock) return;
    try {
      if (fs.existsSync(LOCK_FILE)) {
        const lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8')) as { pid?: number };
        if (lock.pid === process.pid) {
          fs.unlinkSync(LOCK_FILE);
          logger.debug('[Ambient Music] Instance lock removed.');
        }
      }
    } catch (err) {
      logger.error('[Ambient Music] Failed to remove instance lock:', err);
    }
    this.ownsLock = false;
  }
}

export const serverManager = ServerManager.getInstance();
