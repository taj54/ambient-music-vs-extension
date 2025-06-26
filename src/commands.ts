import * as vscode from 'vscode';
import { webSocketSingleton } from './webSocketManager';
import { updateUserPlaylist } from './playlist';
import { getExtensionConfig } from './utils/config';

export function registerCommands(context: vscode.ExtensionContext) {
  const { preferredPort } = getExtensionConfig();

  const sendCommand = (command: string, label: string) => {
    const client = webSocketSingleton.getClient();
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ command }));
      vscode.window.showInformationMessage(`${label} command sent.`);
    } else {
      vscode.window.showWarningMessage('⚠ No connected client.');
    }
  };

  const openCommand = vscode.commands.registerCommand('ambientMusic.open', () => {
    const url = `http://localhost:${preferredPort}`;
    vscode.env.openExternal(vscode.Uri.parse(url));
  });

  const playCommand = vscode.commands.registerCommand('ambientMusic.play', () =>
    sendCommand('play', '▶ Play')
  );

  const pauseCommand = vscode.commands.registerCommand('ambientMusic.pause', () =>
    sendCommand('pause', '⏸ Pause')
  );

  const resumeCommand = vscode.commands.registerCommand('ambientMusic.resume', () =>
    sendCommand('resume', '▶ Resume')
  );

  const setPlaylistCommand = vscode.commands.registerCommand('ambientMusic.setPlaylist', async () => {
    const input = await vscode.window.showInputBox({
      prompt: 'Enter YouTube URLs (comma-separated)',
      placeHolder: 'https://youtu.be/video1, https://youtu.be/video2',
    });

    if (input) {
      const urls = input
        .split(',')
        .map(url => url.trim())
        .filter(Boolean);

      if (urls.length > 0) {
        updateUserPlaylist(urls);
        vscode.window.showInformationMessage(`🎶 Playlist updated with ${urls.length} video(s).`);
      } else {
        vscode.window.showWarningMessage('❌ No valid URLs entered.');
      }
    }
  });

  context.subscriptions.push(
    openCommand,
    playCommand,
    pauseCommand,
    resumeCommand,
    setPlaylistCommand
  );
}
