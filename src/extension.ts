import * as vscode from 'vscode';
import { fileManager, playlistManager, serverManager, webSocketManager } from './services';
import { registerCommands } from './commands';
import { logger, getExtensionConfig } from './utils';

export function initializeExtension(context: vscode.ExtensionContext) {

  logger.debug('[Ambient Music] Initializing Ambient Music Extension...');

  fileManager.initialize(context);
  serverManager.start(context);
  playlistManager.loadPlaylistWhenReady();
}

/**
 * VS Code will call this once when the extension is activated (if activationEvents trigger it)
 */
export function activate(context: vscode.ExtensionContext) {
  const { autoPlayOnStartup } = getExtensionConfig();

  registerCommands(context);

  if (autoPlayOnStartup) {
    initializeExtension(context);
  }
  vscode.workspace.onDidChangeWorkspaceFolders(() => {
    if (vscode.workspace.workspaceFolders?.length === 0) {
      logger.debug('[Ambient Music] All workspaces closed. Shutting down.');
      deactivate();
    }
  });
}

export function deactivate() {
  serverManager.stop();
  webSocketManager.shutdown();
}
