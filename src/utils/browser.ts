import * as vscode from 'vscode';
import { exec } from 'child_process';
import { logger } from './logger';
import { tabState } from './TabState';

const chromePaths: Record<'win32' | 'darwin' | 'linux', string> = {
  win32: `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`,
  darwin: `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome`,
  linux: `google-chrome`,
};

function buildLaunchCommand(url: string, chrome: string, platform: string): string {
  const baseFlags = ['--incognito'];
  if (platform === 'win32') {
    const flags = [...baseFlags, '--new-window', `--app=${url}`, '--start-minimized'];
    return `start "" ${chrome} ${flags.join(' ')}`;
  }
  return `${chrome} ${baseFlags.join(' ')} "${url}"`;
}

export function openInIncognito(url: string) {
  const platform = process.platform as 'win32' | 'darwin' | 'linux';
  const chrome = chromePaths[platform];

  if (!chrome) {
    vscode.window.showWarningMessage(`Unsupported platform: ${platform}`);
    logger.debug(`Unsupported platform: ${platform}`);
    return;
  }

  const cmd = buildLaunchCommand(url, chrome, platform);

  exec(cmd, { shell: 'cmd.exe', windowsHide: true }, err => {
    if (err) {
      vscode.window.showErrorMessage('❌ Failed to open browser.');
      logger.error('❌ Failed to open browser.', err);
    } else {
      tabState.markOpen();
      logger.debug('🌐 Browser tab opened.');
    }
  });
}

export function tryOpenTab(url: string) {
  if (!tabState.isOpen()) {
    logger.debug('🔵 Opening new tab.');
    openInIncognito(url);
  } else {
    logger.debug('⚠️ Tab already open, skipping.');
  }
}
