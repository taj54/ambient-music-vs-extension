import * as vscode from 'vscode';
import { exec } from 'child_process';
import { logger } from './logger';

let isTabOpen = false;

const chromePaths: Record<'win32' | 'darwin' | 'linux', string> = {
    win32: `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`,
    darwin: `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome`,
    linux: `google-chrome`,
};

/**
 * Builds the platform-specific command to launch Chrome.
 */
function buildLaunchCommand(url: string, chrome: string, platform: string): string {
    const baseFlags = ['--incognito'];

    if (platform === 'win32') {
        const flags = [...baseFlags, `--new-window`, `--app=${url}`, `--start-minimized`];
        return `start "" ${chrome} ${flags.join(' ')}`;
    }


    return `${chrome} ${baseFlags.join(' ')} "${url}"`;
}

// TODO

/**
 * Launches Chrome in incognito mode with optional background behavior.
 */
export function openInIncognito(url: string) {
    const platform = process.platform as 'win32' | 'darwin' | 'linux';
    const chrome = chromePaths[platform];

    if (!chrome) {
        vscode.window.showWarningMessage(`Unsupported platform for incognito mode: ${platform}`);
        logger.debug(`Unsupported platform for incognito mode: ${platform}`);
        return;
    }

    const cmd = buildLaunchCommand(url, chrome, platform);

    exec(cmd, { shell: 'cmd.exe', windowsHide: true }, err => {
        if (err) {
            vscode.window.showErrorMessage('❌ Failed to open browser in incognito mode.');
            logger.error('❌ Failed to open browser in incognito mode.', err);
        } else {
            isTabOpen = true;
            // Try to refocus VS Code after 3s
            // setTimeout(refocusVSCode, 5000);
        }
    });
}

/**
 * Tries to open a browser tab if one is not already open.
 */
export function tryOpenTab(url: string) {
    if (!isTabOpen) {
        logger.debug('🔵 Opening browser tab for the first time.');
        openInIncognito(url);
    } else {
        logger.debug('⚠️ Browser tab already open. Skipping.');
    }
}


export function markTabOpen() {
    isTabOpen = true;
}

export function markTabClosed() {
    isTabOpen = false;
}

export function isTabCurrentlyOpen(): boolean {
    return isTabOpen;
}
