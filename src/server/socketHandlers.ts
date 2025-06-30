import { WebSocket } from 'ws';
import { logger,tabState } from '../utils';
import { webSocketManager } from '../services';

export function handleWebSocketConnection(ws: WebSocket, clientUrl: string): void {
  logger.debug(`Client connected via WebSocket: ${clientUrl}`);

  webSocketManager.setClient(ws);
  tabState.markOpen(); 
  webSocketManager.resetManualCloseFlag();

  ws.on('message', msg => {
    logger.debug(`Received WebSocket message: ${msg}`);
    try {
      const data = JSON.parse(msg.toString());

      // ✅ Handle client registration
      if (data.type === 'register' && data.client === 'browser') {
        logger.debug('✅ Browser tab registered via WebSocket.');
        webSocketManager.setClient(ws);
        tabState.markOpen(); 
        return;
      }

      // ✅ Handle normal command
      if (data.command === 'clientClosed') {
        logger.debug('Client sent "clientClosed" command.');
        tabState.markClosed(); // Replaces markTabClosed()
        webSocketManager.setManualCloseFlag(true);
      }

    } catch (e) {
      logger.error('WebSocket message error:', e);
    }
  });

  ws.on('close', () => {
    logger.debug('WebSocket client disconnected.');
    webSocketManager.setClient(undefined);
    tabState.markClosed(); 

    if (!webSocketManager.wasManuallyClosed()) {
      logger.debug('Tab was not manually closed — attempting to reopen.');
      webSocketManager.trySendPlay();
    } else {
      logger.debug('Tab was manually closed — will not auto-reopen.');
    }
  });

  ws.on('error', err => {
    logger.error('🚨 WebSocket error:', err);
  });
}
