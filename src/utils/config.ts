import * as vscode from 'vscode';

export function getExtensionConfig() {
  const config = vscode.workspace.getConfiguration('ambientMusic');

  return {
    preferredPort: config.get<number>('port', 3303),
    debug: config.get<boolean>('debug', false),
    playlist: config.get<string[]>('playlist', []),
    switchIntervalMinutes: config.get<number>('switchIntervalMinutes', 30),
  };
}
