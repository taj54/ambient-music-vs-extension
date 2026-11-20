import { WebSocket } from 'ws';
import { logger,tabState } from '../utils';
import { playlistManager, webSocketManager } from '../services';

export function handleWebSocketConnection(ws: WebSocket, clientUrl: string): void {
  logger.debug(`Client connected via WebSocket: ${clientUrl}`);

  ws.on('message', msg => {
    logger.debug(`Received WebSocket message: ${msg}`);
    try {
      const data = JSON.parse(msg.toString());

      // ✅ Handle client registration
      if (data.type === 'register' && data.client === 'browser') {
        logger.debug('✅ Browser tab registered via WebSocket.');
        return;
      }

      if (data.type === 'playerStatus') {
        webSocketManager.handleBrowserPlayerStatus(ws, data);
        return;
      }

      if (data.command === 'open_player') {
        webSocketManager.openBrowserTab();
        return;
      }

      if (data.command && data.command !== 'clientClosed') {
        if (data.command === 'switch' && typeof data.url === 'string') {
          playlistManager.setCurrentTrack(data.url);
          const track = playlistManager.getCurrentTrackMetadata();
          if (track) {
            webSocketManager.emitCurrentTrack({ title: track.title, url: data.url });
          }
        }
        webSocketManager.send(data);
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
    webSocketManager.unregisterBrowserClient(ws);
    if (!webSocketManager.isBrowserTabConnected()) {
      tabState.markClosed();
    }

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
