import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const outputChannel = vscode.window.createOutputChannel('Ambient Music');
let logFilePath: string | undefined;

// Initialize log file
function getLogFilePath(): string {
  if (!logFilePath) {
    const logDir = path.join(__dirname, '..', '..', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    logFilePath = path.join(logDir, 'ambient.log');
  }
  return logFilePath;
}

// Append log to disk
function appendToDisk(message: string) {
  if (!isDebugMode()) return;
  const timestamp = new Date().toISOString();
  fs.appendFileSync(getLogFilePath(), `[${timestamp}] ${message}\n`);
}

// Check if debug mode is enabled
function isDebugMode(): boolean {
  return vscode.workspace.getConfiguration('ambientMusic').get<boolean>('debug', false);
}

// Logging functions
export function logInfo(message: string) {
  if (isDebugMode()) {
    const formatted = `[INFO] ${message}`;
    outputChannel.appendLine(formatted);
    appendToDisk(formatted);
  }
}

export function logWarn(message: string) {
  if (isDebugMode()) {
    const formatted = `[WARN] ${message}`;
    outputChannel.appendLine(formatted);
    appendToDisk(formatted);
  }
}

export function logError(message: string, error?: unknown) {
  const errorMsg = `[ERROR] ${message}`;
  outputChannel.appendLine(errorMsg);
  appendToDisk(errorMsg);

  if (error instanceof Error) {
    const errDetail = error.stack || error.message;
    outputChannel.appendLine(errDetail);
    appendToDisk(errDetail);
  } else if (typeof error === 'string') {
    outputChannel.appendLine(error);
    appendToDisk(error);
  } else if (error) {
    const objStr = JSON.stringify(error, null, 2);
    outputChannel.appendLine(objStr);
    appendToDisk(objStr);
  }
}

export function showOutput() {
  outputChannel.show();
}
