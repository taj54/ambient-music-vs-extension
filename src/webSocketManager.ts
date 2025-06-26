import * as vscode from 'vscode';
import { WebSocketServer, WebSocket } from 'ws';
import { nextTrack } from './playlist';
import { tryOpenTab, markTabOpen, markTabClosed, isTabCurrentlyOpen } from './utils/browser';

class webSocketManager {
  private static instance: webSocketManager;
  private wss: WebSocketServer | undefined;
  private connectedClient: WebSocket | undefined;

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
    if (this.wss) {
      console.warn('🧠 WebSocket server already initialized.');
      return this.wss;
    }

    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', ws => {
      console.log('✅ WebSocket client connected', clientUrl);
      this.connectedClient = ws;
      markTabOpen();

      ws.on('message', msg => {
        console.log(`💬 Received from client: ${msg}`);
      });

      ws.on('close', () => {
        console.log('❌ Client disconnected');
        this.connectedClient = undefined;
        markTabClosed();
        tryOpenTab(clientUrl);
        this.trySendPlay();
      });

      ws.on('error', err => {
        console.error('🚨 WebSocket error:', err);
      });
    });

    return this.wss;
  }

  public startRotation(clientUrl: string, intervalMinutes: number ) {
    setInterval(() => {
      const next = nextTrack();

      if (this.connectedClient?.readyState === WebSocket.OPEN) {
        this.connectedClient.send(JSON.stringify({ command: 'switch', url: next }));
        vscode.window.showInformationMessage('🎵 Switched to next track.');
      } else {
        vscode.window.showWarningMessage('⚠️ No active WebSocket client to switch track.');
      }

      if (!isTabCurrentlyOpen()) {
        tryOpenTab(clientUrl);
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
        console.warn('⚠️ Client did not reconnect in time. Aborting play command.');
      }
    }, delayMs);
  }

  public shutdown() {
    if (this.wss) {
      this.wss.close(() => console.log('[Ambient Music] WebSocket server closed.'));
      this.wss = undefined;
      this.connectedClient = undefined;
    }
  }
}

export const webSocketSingleton = webSocketManager.getInstance();
