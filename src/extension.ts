import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const musicURL = vscode.Uri.parse('https://www.youtube.com/watch?v=jfKfPfyJRdk');

  vscode.env.openExternal(musicURL);
  vscode.window.showInformationMessage('Lofi music started 🎧');

  const disposable = vscode.commands.registerCommand('ambientMusic.start', () => {
    vscode.env.openExternal(musicURL);
    vscode.window.showInformationMessage('Now playing ambient music 🎵');
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}