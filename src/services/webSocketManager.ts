import * as vscode from 'vscode';
import { WebSocketServer, WebSocket } from 'ws';
import { playlistManager } from './playlistManager';
import { logger, openInIncognito, sendTrackCommand } from '../utils';
import { handleWebSocketConnection } from '../server';

interface PlayerStatus {
  state: number;
  videoId?: string;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  timestamp: number;
}

class WebSocketManager {
  private static instance: WebSocketManager;
  private wss: WebSocketServer | undefined;
  private connectedClient: WebSocket | undefined;
  private playerStatusListeners: Set<(status: any) => void> = new Set();
  private currentTrackListeners: Set<(track: { title: string; url: string }) => void> = new Set();
  private browserConnectionListeners: Set<(connected: boolean) => void> = new Set();

  // Track all clients
  private vscodeClients: Set<WebSocket> = new Set();
  private browserClients: Set<WebSocket> = new Set();
  private currentPlayerStatus: PlayerStatus | undefined;
  private remoteServerClient: WebSocket | undefined;
  private remoteReconnectTimer: NodeJS.Timeout | undefined;
  private remoteServerPort: number | undefined;
  private remotePendingMessages: string[] = [];
  private playerUrl: string | undefined;
  private browserOpenPending = false;
  private browserOpenTimeout: NodeJS.Timeout | undefined;

  private tabWasManuallyClosed: boolean = false;
  private isBooting: boolean = true;

  private constructor() { }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public getServer(): WebSocketServer | undefined {
    return this.wss;
  }
  public setClient(ws: WebSocket | undefined) {
    this.connectedClient = ws;
  }

  public getClient(): WebSocket | undefined {
    return this.connectedClient;
  }

  public onPlayerStatus(listener: (status: any) => void): vscode.Disposable {
    this.playerStatusListeners.add(listener);
    return new vscode.Disposable(() => this.playerStatusListeners.delete(listener));
  }

  public onCurrentTrack(listener: (track: { title: string; url: string }) => void): vscode.Disposable {
    this.currentTrackListeners.add(listener);
    return new vscode.Disposable(() => this.currentTrackListeners.delete(listener));
  }

  public onBrowserConnectionChange(listener: (connected: boolean) => void): vscode.Disposable {
    this.browserConnectionListeners.add(listener);
    return new vscode.Disposable(() => this.browserConnectionListeners.delete(listener));
  }

  private emitBrowserConnectionChange(connected: boolean): void {
    this.browserConnectionListeners.forEach(listener => listener(connected));
    const payload = JSON.stringify({ type: 'browserConnection', connected });
    this.vscodeClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
  }

  public emitPlayerStatus(status: any): void {
    this.playerStatusListeners.forEach(listener => listener(status));
    const payload = JSON.stringify({ type: 'playerStatus', status });
    this.vscodeClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
  }

  public emitCurrentTrack(track: { title: string; url: string }): void {
    this.currentTrackListeners.forEach(listener => listener(track));
    const payload = JSON.stringify({ type: 'currentTrack', track });
    this.vscodeClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
  }

  public isBrowserTabConnected(): boolean {
    return Array.from(this.browserClients).some(client => client.readyState === WebSocket.OPEN);
  }

  public isRemoteClient(): boolean {
    return this.remoteServerPort !== undefined;
  }

  public hasOtherVSCodeClients(): boolean {
    return Array.from(this.vscodeClients).some(client => client.readyState === WebSocket.OPEN);
  }

  public registerBrowserClient(ws: WebSocket): void {
    const previousClient = this.connectedClient;
    this.browserClients.add(ws);
    if (!previousClient || previousClient.readyState !== WebSocket.OPEN) {
      this.connectedClient = ws;
    }
    this.browserOpenPending = false;
    clearTimeout(this.browserOpenTimeout);
    this.resetManualCloseFlag();
    this.emitBrowserConnectionChange(true);

    if (this.currentPlayerStatus) {
      ws.send(JSON.stringify({
        command: 'syncStatus',
        url: this.currentPlayerStatus
      }));
    }
  }

  public handleBrowserPlayerStatus(ws: WebSocket, status: PlayerStatus): void {
    if (ws !== this.connectedClient) return;

    this.currentPlayerStatus = status;
    this.emitPlayerStatus(status);
    const payload = JSON.stringify({ command: 'syncStatus', url: status });
    this.browserClients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  public unregisterBrowserClient(ws: WebSocket): void {
    this.browserClients.delete(ws);
    if (this.connectedClient === ws) {
      this.connectedClient = Array.from(this.browserClients).find(
        client => client.readyState === WebSocket.OPEN
      );
    }
    if (!this.isBrowserTabConnected()) {
      this.emitBrowserConnectionChange(false);
    }
  }

  public setup(server: any, clientUrl: string): WebSocketServer {
    if (this.wss) return this.wss;

    this.playerUrl = clientUrl;
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      ws.once('message', (msg: Buffer) => {
        try {
          const data = JSON.parse(msg.toString());
          if (data?.type === 'register') {
            if (data.client === 'browser') {
              this.registerBrowserClient(ws);
              logger.debug('[WebSocket] Browser client connected.');
            } else if (data.client === 'vscode') {
              this.vscodeClients.add(ws);
              ws.send(JSON.stringify({
                type: 'browserConnection',
                connected: this.isBrowserTabConnected()
              }));
              logger.debug('[WebSocket] VSCode client connected.');
            }
          }
        } catch (e) {
          logger.error('[WebSocket] Failed to parse client registration', e);
        }
      });

      ws.on('close', () => {
        if (this.browserClients.has(ws)) {
          this.unregisterBrowserClient(ws);
          logger.debug('[WebSocket] Browser client disconnected.');
        } else {
          this.vscodeClients.delete(ws);
        }
      });

      // Delegate to custom handler
      handleWebSocketConnection(ws, clientUrl);
    });

    // Finish boot after short delay
    setTimeout(() => (this.isBooting = false), 1000);
    return this.wss;
  }

  public wasManuallyClosed() {
    return this.tabWasManuallyClosed;
  }

  public setManualCloseFlag(value: boolean) {
    this.tabWasManuallyClosed = value;
  }

  public resetManualCloseFlag() {
    this.tabWasManuallyClosed = false;
  }

  public trySendPlay(maxRetries = 20, delayMs = 1000) {
    let attempts = 0;

    const trySend = () => {
      const client = this.getClient(); 
      if (client?.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ command: 'unmute' }));
        client.send(JSON.stringify({ command: 'play' }));
        logger.debug('🔁 Sent unmute + play.');
        return true;
      }
      if (++attempts >= maxRetries) {
        logger.debug('⚠️ Client did not reconnect in time. Aborting play command.');
        return true;
      }
      return false;
    };

    if (trySend()) return;

    const interval = setInterval(() => {
      if (trySend()) clearInterval(interval);
    }, delayMs);
  }

  public openBrowserTab(): void {
    if (!this.playerUrl || this.isBrowserTabConnected() || this.browserOpenPending) return;

    this.browserOpenPending = true;
    openInIncognito(this.playerUrl, false);
    clearTimeout(this.browserOpenTimeout);
    this.browserOpenTimeout = setTimeout(() => {
      this.browserOpenPending = false;
    }, 10000);
  }

  public send(message: any) {
    const payload = JSON.stringify(message);
    if (this.remoteServerPort !== undefined) {
      if (this.remoteServerClient?.readyState === WebSocket.OPEN) {
        this.remoteServerClient.send(payload);
      } else {
        this.remotePendingMessages.push(payload);
      }
      return;
    }
    this.wss?.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  public connectToServer(port: number): void {
    if (this.wss || (this.remoteServerPort === port && this.remoteServerClient?.readyState === WebSocket.OPEN)) {
      return;
    }
    this.remoteServerPort = port;
    this.connectRemoteServer();
  }

  private connectRemoteServer(): void {
    if (this.remoteServerPort === undefined) return;

    const ws = new WebSocket(`ws://127.0.0.1:${this.remoteServerPort}`);
    this.remoteServerClient = ws;

    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'register', client: 'vscode' }));
      this.remotePendingMessages.splice(0).forEach(payload => ws.send(payload));
    });

    ws.on('message', message => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'playerStatus') {
          this.emitPlayerStatus(data.status);
        } else if (data.type === 'currentTrack' && data.track) {
          playlistManager.setCurrentTrack(data.track.url);
          this.emitCurrentTrack(data.track);
        } else if (data.type === 'browserConnection') {
          this.browserConnectionListeners.forEach(listener => listener(data.connected));
        }
      } catch (error) {
        logger.error('[WebSocket] Failed to process remote player status', error);
      }
    });

    ws.on('close', () => {
      this.emitBrowserConnectionChange(false);
      if (this.remoteServerPort !== undefined) {
        clearTimeout(this.remoteReconnectTimer);
        this.remoteReconnectTimer = setTimeout(() => this.connectRemoteServer(), 1000);
      }
    });

    ws.on('error', error => {
      logger.error('[WebSocket] Remote server connection error', error);
    });
  }

  public startRotation(intervalMinutes: number) {
    setInterval(() => {
      const next = playlistManager.getNextTrack();

      sendTrackCommand('switch', next);
      const currentTrack = playlistManager.getCurrentTrackMetadata();
      if (currentTrack) {
        this.emitCurrentTrack({ title: currentTrack.title, url: next });
      }

      // Only auto-reopen tab if NOT manually closed and tab not connected
      if (!this.isBrowserTabConnected() && !this.tabWasManuallyClosed) {
        if (!this.isBooting) {
          this.trySendPlay();
        }
      }
    }, intervalMinutes * 60 * 1000);
  }

  public shutdown(closeBrowser = false) {
    if (closeBrowser) {
      this.send({ command: 'close_tab' });
    }

    this.wss?.close(() => logger.debug('[Ambient Music] WebSocket server closed.'));
    this.wss = undefined;
    this.browserClients.clear();
    this.connectedClient = undefined;
    this.currentPlayerStatus = undefined;
    this.remoteServerPort = undefined;
    this.playerUrl = undefined;
    this.remotePendingMessages = [];
    this.browserOpenPending = false;
    clearTimeout(this.remoteReconnectTimer);
    clearTimeout(this.browserOpenTimeout);
    if (this.remoteServerClient?.readyState === WebSocket.OPEN) {
      this.remoteServerClient.close();
    }
    this.remoteServerClient = undefined;
    this.emitBrowserConnectionChange(false);
    this.vscodeClients.clear();
  }
}

export const webSocketManager = WebSocketManager.getInstance();
