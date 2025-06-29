import * as path from "path";
import * as fs from "fs";
import * as vscode from 'vscode';
import { logger } from "../utils";

class FileManager {
  private static instance: FileManager;
  private extensionPath: string | null = null;

  private constructor() { }

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  initialize(context: vscode.ExtensionContext) {
    if (this.extensionPath !== null) return;
    this.extensionPath = context.extensionPath;
  }

  private ensureInitialized() {
    if (!this.extensionPath) {
      const msg = "FileManager not initialized. Call fileManager.initialize(context) in activate().";
      logger.error(msg);
      throw new Error(msg);
    }
  }

  getMediaFilePath(fileName: string): string {
    this.ensureInitialized();
    return path.join(this.extensionPath!, "media", fileName);
  }

  readMediaFile(fileName: string, encoding: BufferEncoding = "utf-8"): string {
    const filePath = this.getMediaFilePath(fileName);
    return fs.readFileSync(filePath, encoding);
  }
}

export const fileManager =  FileManager.getInstance();
