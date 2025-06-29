// routes.ts

import * as fs from 'fs';
import * as path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { playlistManager } from '../services';
import { getMimeType, logger } from '../utils';

/**
 * Handles incoming HTTP requests based on the requested URL.
 *
 * @param req IncomingMessage
 * @param res ServerResponse
 * @param extensionPath Root directory of the extension
 */
export function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  extensionPath: string
): void {
  const urlPath = decodeURIComponent(req.url?.split('?')[0] || '/');

  logger.debug(`Incoming HTTP request: ${req.method} ${urlPath}`);

  switch (urlPath) {
    case '/':
    case '/client.html':
      return serveClientHtml(extensionPath, res);


    default:
      if (urlPath.startsWith('/media/')) {
        return serveStaticFile(extensionPath, urlPath, res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
        logger.debug(`404 Not Found: ${urlPath}`);
      }
  }
}

function serveClientHtml(extensionPath: string, res: ServerResponse): void {
  const clientHtmlPath = path.join(extensionPath, 'media', 'client.html');

  fs.readFile(clientHtmlPath, 'utf8', (err, data) => {
    if (err) {
      logger.debug(`Error loading client.html: ${err.message}`);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    const html = data.replace(/{{VIDEO_URL}}/g, playlistManager.getCurrentTrack());
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    logger.debug('Served client.html successfully.');
  });
}

function serveStaticFile(
  extensionPath: string,
  urlPath: string,
  res: ServerResponse
): void {
  const filePath = path.join(extensionPath, urlPath);
  const ext = path.extname(filePath);
  const contentType = getMimeType(ext);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      logger.debug(`Error serving static file: ${filePath}, ${err.message}`);
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    logger.debug(`Served static file: ${filePath}`);
  });
}