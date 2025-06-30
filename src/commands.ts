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
    initializeExtension(context);
  });

  const playCommand = vscode.commands.registerCommand('ambientMusic.play', () =>
    sendCommand('play', '▶ Play')
  );

  const pauseCommand = vscode.commands.registerCommand('ambientMusic.pause', () =>
    sendCommand('pause', '⏸ Pause')
  );

  const resumeCommand = vscode.commands.registerCommand('ambientMusic.resume', () =>
    sendCommand('resume', '⏯  Resume')
  );

  const setPlaylistCommand = vscode.commands.registerCommand('ambientMusic.setPlaylist', async () => {
    const tags = playlistManager.getAvailableTags();
    const picked = await vscode.window.showQuickPick(tags, {
      placeHolder: 'Choose a tag to filter playlist',
    });
    if (picked) {
      const filtered = playlistManager.filterByOptions({ tag: picked });
      if (filtered.length > 0) {
        playlistManager.updateUserPlaylist(filtered);
        vscode.window.showInformationMessage(`🎶 Filtered playlist with ${filtered.length} video(s) tagged "${picked}".`);
      } else {
        vscode.window.showWarningMessage(`⚠️ No videos found with tag "${picked}".`);
      }
    }
  });

  const closeTabCommand = vscode.commands.registerCommand('ambientMusic.closeTab', () => {
    sendCommand('close_tab', '❌ Close Tab');
    serverManager.stop();
    webSocketManager.shutdown();


  });
  const resetCommand = vscode.commands.registerCommand('ambientMusic.resetPlaylist', () => {
    playlistManager.resetPlaylist();
    vscode.window.showInformationMessage('🎵 Playlist has been reset to the default.');
  });


  context.subscriptions.push(resetCommand);



  context.subscriptions.push(
    openCommand,
    playCommand,
    pauseCommand,
    resumeCommand,
    setPlaylistCommand,
    closeTabCommand,
    resetCommand
  );
}
