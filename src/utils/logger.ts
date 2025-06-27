import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

 class Logger {
  private static instance: Logger;
  private readonly outputChannel: vscode.OutputChannel;
  private logFilePath: string | undefined;

  private constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Ambient Music');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private isDebugMode(): boolean {
    return vscode.workspace.getConfiguration('ambientMusic').get<boolean>('debug', false);
  }

  private getLogFilePath(): string {
    if (!this.logFilePath) {
      const logDir = path.join(__dirname, '..', '..', 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      this.logFilePath = path.join(logDir, 'ambient.log');
    }
    return this.logFilePath;
  }

  private appendToDisk(message: string) {
    if (!this.isDebugMode()) return;

    const timestamp = new Date().toISOString();
    fs.appendFileSync(this.getLogFilePath(), `[${timestamp}] ${message}\n`);
  }

  private writeToOutput(formatted: string) {
    this.outputChannel.appendLine(formatted);
    this.appendToDisk(formatted);
  }

  public debug(message: string) {
    if (!this.isDebugMode()) return;
    this.writeToOutput(`[DEBUG] ${message}`);
  }

  public info(message: string) {
    if (this.isDebugMode()) {
      this.writeToOutput(`[INFO] ${message}`);
    }
  }

  public warn(message: string) {
    if (this.isDebugMode()) {
      this.writeToOutput(`[WARN] ${message}`);
    }
  }

  public error(message: string, error?: unknown) {
    this.writeToOutput(`[ERROR] ${message}`);

    if (error instanceof Error) {
      const errDetail = error.stack || error.message;
      this.writeToOutput(errDetail);
    } else if (typeof error === 'string') {
      this.writeToOutput(error);
    } else if (error) {
      this.writeToOutput(JSON.stringify(error, null, 2));
    }
  }

  public show() {
    this.outputChannel.show();
  }
}

// Singleton export
export const logger =  Logger.getInstance();