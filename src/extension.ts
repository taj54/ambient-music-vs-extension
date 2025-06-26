import * as vscode from 'vscode';
import { serverSingleton } from './serverManager';
import { registerCommands } from './commands';
import { webSocketSingleton } from './webSocketManager';

let hasInitialized = false;


/**
 * Called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  if (hasInitialized) {
    console.warn('[Ambient Music] Extension already initialized.');
    return;
  }

  hasInitialized = true;
  console.log('[Ambient Music] Activating extension...');

  serverSingleton.start(context);
  registerCommands(context);

  vscode.workspace.onDidChangeWorkspaceFolders(() => {
    if (vscode.workspace.workspaceFolders?.length === 0) {
      console.log('[Ambient Music] All workspaces closed. Shutting down.');
      deactivate(); 
    }
  });
}

/**
 * Called when the extension is deactivated
 */
export function deactivate() {
  serverSingleton.stop();
  webSocketSingleton.shutdown();
}
