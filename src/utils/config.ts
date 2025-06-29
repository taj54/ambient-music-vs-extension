import * as vscode from 'vscode';
import { PlaylistItem } from '../interfaces';

export function getExtensionConfig() {
  const config = vscode.workspace.getConfiguration('ambientMusic');

  return {
    autoPlayOnStartup: config.get<boolean>('autoPlayOnStartup'),
    preferredPort: config.get<number>('port', 3303),
    debug: config.get<boolean>('debug', false),
    playlist: config.get<PlaylistItem[]>('playlist', []),
    switchIntervalMinutes: config.get<number>('switchIntervalMinutes', 30),
  };
}
