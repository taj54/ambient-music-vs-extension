import * as vscode from 'vscode';
import { webSocketManager } from '../services';

export async function sendTrackCommand(command: 'switch' | 'set_playlist', url: string): Promise<void> {

  let client = webSocketManager.getClient();
  let retries = 10;
  while ((!client || client.readyState !== WebSocket.OPEN) && retries-- > 0) {
    await new Promise((r) => setTimeout(r, 200));
    client = webSocketManager.getClient();
  }

  if (client?.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({ command, url }));
    const message = command === 'switch'
      ? '🎵 Switched to next track.'
      : '🎵 Playlist set and playing.';
    vscode.window.showInformationMessage(message);
  } else {
    vscode.window.showWarningMessage('⚠️ No active WebSocket client to perform track update.');
  }
}

