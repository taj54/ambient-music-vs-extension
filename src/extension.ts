import * as vscode from 'vscode';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { WebSocketServer, WebSocket } from 'ws';

let wss: WebSocketServer | undefined;
let connectedClient: WebSocket | undefined;

export function activate(context: vscode.ExtensionContext) {
    const port = 3000;
    const clientHtmlPath = path.join(context.extensionPath, 'media', 'client.html');

    // HTTP server to serve client.html
    const server = http.createServer((req, res) => {
        if (req.url === '/' || req.url === '/client.html') {
            fs.readFile(clientHtmlPath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error loading client.html');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });

    server.listen(port, () => {
        console.log(`HTTP & WebSocket server at http://localhost:${port}`);
        const clientUrl = `http://localhost:${port}`;

        wss = new WebSocketServer({ server });

        wss.on('connection', ws => {
            console.log('WebSocket client connected');
            connectedClient = ws;

            ws.on('message', msg => console.log(`Received: ${msg}`));

            ws.on('close', () => {
                console.log('Client disconnected');
                connectedClient = undefined;

                // 🔁 Reopen client tab in incognito
                openInIncognito(clientUrl);
                trySendPlay(10, 1000);
            });

            ws.on('error', err => console.error('WebSocket error:', err));
        });

        // ✅ Automatically open in incognito on folder open
        openInIncognito(clientUrl);

        // ⏱ Try sending "play" and "unmute"
        setTimeout(() => {
            if (connectedClient?.readyState === WebSocket.OPEN) {
                connectedClient.send(JSON.stringify({ command: 'play' }));
                setTimeout(() => {
                    if (connectedClient?.readyState === WebSocket.OPEN) {
                        connectedClient.send(JSON.stringify({ command: 'unmute' }));
                    }
                }, 500); // 0.5s delay before unmuting
            } else {
                console.warn('Client not connected yet. Play skipped.');
            }
        }, 5000);
    });

    // --- Commands ---
    const openCommand = vscode.commands.registerCommand('ambientMusic.open', () => {
        openInIncognito(`http://localhost:${port}`);
    });

    const playCommand = vscode.commands.registerCommand('ambientMusic.play', () => {
        if (connectedClient?.readyState === WebSocket.OPEN) {
            connectedClient.send(JSON.stringify({ command: 'play' }));
            vscode.window.showInformationMessage('▶ Sent "play" to client.');
        } else {
            vscode.window.showWarningMessage('No connected client.');
        }
    });

    const pauseCommand = vscode.commands.registerCommand('ambientMusic.pause', () => {
        if (connectedClient?.readyState === WebSocket.OPEN) {
            connectedClient.send(JSON.stringify({ command: 'pause' }));
            vscode.window.showInformationMessage('⏸ Sent "pause" to client.');
        } else {
            vscode.window.showWarningMessage('No connected client.');
        }
    });

    const resumeCommand = vscode.commands.registerCommand('ambientMusic.resume', () => {
        if (connectedClient?.readyState === WebSocket.OPEN) {
            connectedClient.send(JSON.stringify({ command: 'resume' }));
            vscode.window.showInformationMessage('▶ Sent "resume" to client.');
        } else {
            vscode.window.showWarningMessage('No connected client.');
        }
    });

    context.subscriptions.push(openCommand, playCommand, pauseCommand, resumeCommand);
}

function trySendPlay(maxRetries = 10, delay = 1000) {
    let attempt = 0;
    const interval = setInterval(() => {
        if (connectedClient?.readyState === WebSocket.OPEN) {
            connectedClient.send(JSON.stringify({ command: 'play' }));
            setTimeout(() => {
                connectedClient?.send(JSON.stringify({ command: 'unmute' }));
            }, 500);
            vscode.window.showInformationMessage('🔁 Reconnected and resumed ambient music.');
            clearInterval(interval);
        } else if (++attempt >= maxRetries) {
            clearInterval(interval);
            console.warn('Client did not reconnect in time. Play command aborted.');
        }
    }, delay);
}

function openInIncognito(url: string) {
    const chromePaths: Record<'win32' | 'darwin' | 'linux', string> = {
        win32: `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`,
        darwin: `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome`,
        linux: `google-chrome`,
    };

    const platform = process.platform;
    const chrome = chromePaths[platform as 'win32' | 'darwin' | 'linux'];

    if (!chrome) {
        vscode.window.showWarningMessage(`Unsupported platform for incognito mode: ${platform}`);
        return;
    }

    const cmd = `${chrome} --incognito "${url}"`;
    exec(cmd, (err) => {
        if (err) {
            vscode.window.showErrorMessage('❌ Failed to open browser in incognito mode.');
            console.error(err);
        }
    });
}


export function deactivate() {
    if (wss) wss.close(() => console.log('WebSocket server closed.'));
}
