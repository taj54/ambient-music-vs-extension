import * as vscode from 'vscode';
import { webSocketManager, playlistManager, fileManager, serverManager } from './services';
import { logger } from './utils';
import { initializeExtension } from './extension';

export function registerCommands(context: vscode.ExtensionContext) {

  const sendCommand = (command: string, label: string) => {
    const client = webSocketManager.getClient();
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ command }));
      logger.debug(`${label} command sent.`)
      vscode.window.showInformationMessage(`${label} command sent.`);
    } else {
      logger.debug(`'⚠ No connected client.'`);
      vscode.window.showWarningMessage('⚠ No connected client.');
    }
  };

  const openCommand = vscode.commands.registerCommand('ambientMusic.openTab', () => {
    console.log('start')
    initializeExtension(context);
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
        .map(url => ({ 'title': '', 'url': url.trim(), 'tags': [], 'channel': { 'name': '', 'url': '' } }))
        .filter(Boolean);

      if (urls.length > 0) {
        playlistManager.updateUserPlaylist(urls);
        logger.debug(`🎶 Playlist updated with ${urls.length} video(s).`);
        vscode.window.showInformationMessage(`🎶 Playlist updated with ${urls.length} video(s).`);
      } else {
        logger.debug('❌ No valid URLs entered.');
        vscode.window.showWarningMessage('❌ No valid URLs entered.');
      }
    }
  });

  const closeTabCommand = vscode.commands.registerCommand('ambientMusic.closeTab', () => {
    sendCommand('close_tab', '❌ Close Tab');
    serverManager.stop();
    webSocketManager.shutdown();

  });


  context.subscriptions.push(
    openCommand,
    playCommand,
    pauseCommand,
    resumeCommand,
    setPlaylistCommand,
    closeTabCommand
  );
}
