import * as vscode from 'vscode';
import { webSocketManager } from '../services';

export function sendTrackCommand(command: 'switch' | 'set_playlist', url: string): void {
  const client = webSocketManager.getClient();

  if (client?.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({  command: 'switch', url }));
    const message = command === 'switch' 
      ? '🎵 Switched to next track.'
      : '🎵 Playlist set and playing.';
    vscode.window.showInformationMessage(message);
  } else {
    vscode.window.showWarningMessage('⚠️ No active WebSocket client to perform track update.');
  }
}
