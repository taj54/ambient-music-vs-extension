import * as vscode from 'vscode';
import { WebSocketServer, WebSocket } from 'ws';
import { playlistManager } from './playlistManager';
import {  logger, sendTrackCommand } from '../utils';
import { handleWebSocketConnection } from '../server';

class WebSocketManager {
  private static instance: WebSocketManager;
  private wss: WebSocketServer | undefined;
  private connectedClient: WebSocket | undefined;

  // Track all clients
  private vscodeClients: Set<WebSocket> = new Set();
  private browserClient: WebSocket | null = null;

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

  public isBrowserTabConnected(): boolean {
    return this.browserClient?.readyState === WebSocket.OPEN;
  }

  public setup(server: any, clientUrl: string): WebSocketServer {
    if (this.wss) return this.wss;

    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      ws.once('message', (msg: Buffer) => {
        try {
          const data = JSON.parse(msg.toString());
          if (data?.type === 'register') {
            if (data.client === 'browser') {
              this.browserClient = ws;
              this.resetManualCloseFlag();
              logger.debug('[WebSocket] Browser client connected.');
            } else if (data.client === 'vscode') {
              this.vscodeClients.add(ws);
              logger.debug('[WebSocket] VSCode client connected.');
            }
          }
        } catch (e) {
          logger.error('[WebSocket] Failed to parse client registration', e);
        }
      });

      ws.on('close', () => {
        if (ws === this.browserClient) {
          this.browserClient = null;
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

    const interval = setInterval(() => {
      const client = this.getClient(); 
      if (client?.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ command: 'play' }));
        setTimeout(() => client?.send(JSON.stringify({ command: 'unmute' })), 5);
        logger.debug('🔁 Sent play + unmute.');
        clearInterval(interval);
      } else if (++attempts >= maxRetries) {
        clearInterval(interval);
        logger.debug('⚠️ Client did not reconnect in time. Aborting play command.');
      }
    }, delayMs);
  }
  public send(message: any) {
    const payload = JSON.stringify(message);
    this.wss?.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  public startRotation(intervalMinutes: number) {
    setInterval(() => {
      const next = playlistManager.getNextTrack();

      sendTrackCommand('switch', next);

      // Only auto-reopen tab if NOT manually closed and tab not connected
      if (!this.isBrowserTabConnected() && !this.tabWasManuallyClosed) {
        if (!this.isBooting) {
          this.trySendPlay();
        }
      }
    }, intervalMinutes * 60 * 1000);
  }

  public shutdown() {
    this.send({ command: 'close_tab' });

    this.wss?.close(() => logger.debug('[Ambient Music] WebSocket server closed.'));
    this.wss = undefined;
    this.browserClient = null;
    this.vscodeClients.clear();
  }
}

export const webSocketManager = WebSocketManager.getInstance();
