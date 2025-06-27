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
        const flags = [...baseFlags, `--new-window`, `--app=${url}`,`--start-minimized`];
        return `start "" ${chrome} ${flags.join(' ')}`;
    }


    return `${chrome} ${baseFlags.join(' ')} "${url}"`;
}

// TODO this piece of code induse some unexpected behaviour from chrome tab in windows
/**
 * Refocus VS Code window (macOS & Windows).
 */
// function refocusVSCode() {
//     const platform = process.platform;
//     if (platform === 'darwin') {
//         // macOS: AppleScript to activate VS Code
//         exec(`osascript -e 'tell application "Visual Studio Code" to activate'`, err => {
//             if (err) {
//                 logger.error('❌ Failed to refocus VS Code on macOS:', err);
//             }
//         });
//     } else if (platform === 'win32') {
//         // Windows: Powershell to refocus VS Code window using EncodedCommand
//         const psScript = `
//       $codeProc = Get-Process -Name "Code" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
//       if ($codeProc) {
//         Add-Type @"
//         using System;
//         using System.Runtime.InteropServices;
//         public class User32 {
//           [DllImport("user32.dll")]
//           public static extern bool SetForegroundWindow(IntPtr hWnd);
//         }
// "@
//         [User32]::SetForegroundWindow($codeProc.MainWindowHandle)
//       }
//     `;
//         const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
//         exec(`powershell -EncodedCommand ${encoded}`, err => {
//             if (err) {
//                 logger.error('❌ Failed to refocus VS Code on Windows:', err);
//             }
//         });
//     }
// }

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
            logger.error('❌ Failed to open browser in incognito mode.',err) ;         
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
        openInIncognito(url);
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
