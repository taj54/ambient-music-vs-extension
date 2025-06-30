import * as vscode from 'vscode';
import { fileManager, playlistManager, serverManager, webSocketManager } from './services';
import { registerCommands } from './commands';
import { logger, getExtensionConfig, tabState } from './utils';

/**
 * Initializes all extension services if autoPlay is enabled.
 */
export function initializeExtension(context: vscode.ExtensionContext) {
  logger.debug('[Ambient Music] Initializing Ambient Music Extension...');

  fileManager.initialize(context);
  serverManager.start(context);
  playlistManager.loadPlaylistWhenReady();

}

/**
 * Called once when the extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  const { autoPlayOnStartup } = getExtensionConfig();

  tabState.initialize();


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

/**
 * Graceful cleanup of servers and WebSockets.
 */
export function deactivate() {
  serverManager.stop();
  webSocketManager.shutdown();
}
