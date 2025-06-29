import * as http from 'http';
import { handleRequest } from './routes';
import { logger } from '../utils';

/**
 * Initializes and returns a configured HTTP server instance for the Ambient Music Extension.
 * 
 * This server is responsible for serving the client-side HTML UI, handling static file requests,
 * and optionally interacting with playlist and WebSocket features. It delegates routing logic
 * to the `handleRequest` function.
 * 
 * @param extensionPath - The absolute path to the root directory of the VS Code extension.
 *                        Used to locate static files such as `media/client.html`.
 * 
 * @returns A configured Node.js HTTP server ready to be started with `.listen()`.
 */
export function createWebServer(extensionPath: string): http.Server {
  const server = http.createServer((req, res) => {
    handleRequest(req, res, extensionPath);
  });
  logger.debug('Web server created.');
  return server;
}
