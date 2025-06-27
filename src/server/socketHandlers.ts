import { WebSocket } from 'ws';
import { markTabClosed, markTabOpen } from '../utils/browser';
import { webSocketSingleton } from '../webSocketManager';
import { tryOpenTab } from '../utils/browser';
import { logger } from '../utils/logger';

export function handleWebSocketConnection(ws: WebSocket, clientUrl: string): void {
  logger.debug(`Client connected via WebSocket: ${clientUrl}`);

  webSocketSingleton.setClient(ws);
  markTabOpen();
  webSocketSingleton.resetManualCloseFlag();

  ws.on('message', msg => {
    logger.debug(`Received WebSocket message: ${msg}`);
    try {
      const data = JSON.parse(msg.toString());
      if (data.command === 'clientClosed') {
        logger.debug('Client sent "clientClosed" command.');
        markTabClosed();
        webSocketSingleton.setManualCloseFlag(true);
      }
    } catch (e) {
      logger.error('WebSocket message error:', e);
    }
  });

  ws.on('close', () => {
    logger.debug('WebSocket client disconnected.');
    webSocketSingleton.setClient(undefined);
    markTabClosed();

    if (!webSocketSingleton.wasManuallyClosed()) {
      logger.debug('Tab was not manually closed — attempting to reopen.');
      tryOpenTab(clientUrl);
      webSocketSingleton.trySendPlay();
    } else {
      logger.debug('Tab was manually closed — will not auto-reopen.');
    }
  });

  ws.on('error', err => {
    logger.error('🚨 WebSocket error:', err);
  });
}
