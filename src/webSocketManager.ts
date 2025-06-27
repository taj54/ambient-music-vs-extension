import * as vscode from 'vscode';
import { WebSocketServer, WebSocket } from 'ws';
import { getNextTrack } from './playlist';
import { tryOpenTab, markTabOpen, markTabClosed, isTabCurrentlyOpen } from './utils/browser';
import { handleWebSocketConnection } from './server';
import { logger } from './utils/logger';

class webSocketManager {
  private static instance: webSocketManager;
  private wss: WebSocketServer | undefined;
  private connectedClient: WebSocket | undefined;
  private tabWasManuallyClosed: boolean = false;

  private constructor() { }

  public static getInstance(): webSocketManager {
    if (!webSocketManager.instance) {
      webSocketManager.instance = new webSocketManager();
    }
    return webSocketManager.instance;
  }

  public getServer(): WebSocketServer | undefined {
    return this.wss;
  }

  public getClient(): WebSocket | undefined {
    return this.connectedClient;
  }
  public setup(server: any, clientUrl: string): WebSocketServer {
    if (this.wss) return this.wss;

    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', ws => {
      handleWebSocketConnection(ws, clientUrl);
    });

    return this.wss;
  }

  public setClient(ws: WebSocket | undefined) {
    this.connectedClient = ws;
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

  public startRotation(clientUrl: string, intervalMinutes: number) {
    setInterval(() => {
      const next = getNextTrack();

      if (this.connectedClient?.readyState === WebSocket.OPEN) {
        this.connectedClient.send(JSON.stringify({ command: 'switch', url: next }));
        vscode.window.showInformationMessage('🎵 Switched to next track.');
      } else {
        vscode.window.showWarningMessage('⚠️ No active WebSocket client to switch track.');
      }

      if (!isTabCurrentlyOpen() && this.connectedClient === undefined) {
        if (!this.tabWasManuallyClosed) {
          tryOpenTab(clientUrl);
          this.trySendPlay();
        }
      }


    }, intervalMinutes * 60 * 1000); //default 1 minute
  }

  public trySendPlay(maxRetries = 10, delayMs = 1000) {
    let attempts = 0;

    const interval = setInterval(() => {
      if (this.connectedClient?.readyState === WebSocket.OPEN) {
        this.connectedClient.send(JSON.stringify({ command: 'play' }));
        setTimeout(() => {
          this.connectedClient?.send(JSON.stringify({ command: 'unmute' }));
        }, 5);

        vscode.window.showInformationMessage('🔁 Reconnected and resumed ambient music.');
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
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });
  }


  public shutdown() {
    if (this.wss) {
      // ✅ Broadcast tab close command before shutdown
      this.send({ command: 'close_tab' });

      this.wss.close(() => logger.debug('[Ambient Music] WebSocket server closed.'));
      this.wss = undefined;
      this.connectedClient = undefined;
    }
  }
}

export const webSocketSingleton = webSocketManager.getInstance();
