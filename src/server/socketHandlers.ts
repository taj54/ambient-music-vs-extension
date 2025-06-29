import { WebSocket } from 'ws';
import { markTabClosed, markTabOpen, tryOpenTab,logger } from '../utils';
import { webSocketManager } from '../services';


export function handleWebSocketConnection(ws: WebSocket, clientUrl: string): void {
  logger.debug(`Client connected via WebSocket: ${clientUrl}`);

  webSocketManager.setClient(ws);
  markTabOpen();
  webSocketManager.resetManualCloseFlag();

  ws.on('message', msg => {
    logger.debug(`Received WebSocket message: ${msg}`);
    try {
      const data = JSON.parse(msg.toString());
      if (data.command === 'clientClosed') {
        logger.debug('Client sent "clientClosed" command.');
        markTabClosed();
        webSocketManager.setManualCloseFlag(true);
      }
    } catch (e) {
      logger.error('WebSocket message error:', e);
    }
  });

  ws.on('close', () => {
    logger.debug('WebSocket client disconnected.');
    webSocketManager.setClient(undefined);
    markTabClosed();

    if (!webSocketManager.wasManuallyClosed()) {
      logger.debug('Tab was not manually closed — attempting to reopen.');
      tryOpenTab(clientUrl);
      webSocketManager.trySendPlay();
    } else {
      logger.debug('Tab was manually closed — will not auto-reopen.');
    }
  });

  ws.on('error', err => {
    logger.error('🚨 WebSocket error:', err);
  });
}
