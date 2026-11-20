import * as vscode from 'vscode';
import { exec, spawn } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { logger } from './logger';
import { tabState } from './TabState';

const chromePaths: Record<'win32' | 'darwin' | 'linux', string> = {
  win32: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`,
  darwin: `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome`,
  linux: `google-chrome`,
};

let browserProcessId: number | undefined;
let browserWindowMinimizationRequested = false;

function buildLaunchCommand(url: string, chrome: string, platform: string, minimized: boolean): string {
  const baseFlags = [
    '--incognito',
    '--no-first-run',
    '--autoplay-policy=no-user-gesture-required',
    `--user-data-dir="${path.join(os.tmpdir(), `ambient-music-chrome-${process.pid}`)}"`
  ];
  if (platform === 'win32') {
    const flags = [...baseFlags, '--new-window', `--app=${url}`];
    if (minimized) flags.push('--start-minimized');
    return `start ${minimized ? '/min ' : ''}"" "${chrome}" ${flags.join(' ')}`;
  }
  return `${chrome} ${baseFlags.join(' ')} "${url}"`;
}

function minimizeWindow(processId: number): void {
  const script = [
    'Add-Type -TypeDefinition \'using System; using System.Runtime.InteropServices; public static class AmbientMusicWindow { public delegate bool EnumWindowsProc(IntPtr handle, IntPtr parameter); [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc callback, IntPtr parameter); [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr handle, out uint processId); [DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr handle, int command); public static bool MinimizeProcessWindows(uint processId) { bool found = false; EnumWindows((handle, parameter) => { uint ownerProcessId; GetWindowThreadProcessId(handle, out ownerProcessId); if (ownerProcessId == processId) { ShowWindowAsync(handle, 6); found = true; } return true; }, IntPtr.Zero); return found; } }\'',
    `$processId = [uint32]${processId}`,
    '$foundWindow = $false',
    'for ($attempt = 0; $attempt -lt 40; $attempt++) {',
    '  if ([AmbientMusicWindow]::MinimizeProcessWindows($processId)) { $foundWindow = $true }',
    '  Start-Sleep -Milliseconds 250',
    '}',
    'if (-not $foundWindow) { throw "Chrome window did not become available for minimization." }'
  ].join('\n');
  const encodedScript = Buffer.from(script, 'utf16le').toString('base64');

  exec(
    `powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -EncodedCommand ${encodedScript}`,
    { windowsHide: true },
    err => {
      if (err) {
        logger.error('[Ambient Music] Failed to minimize the Chrome window:', err);
        vscode.window.showWarningMessage('Ambient Music opened, but Chrome could not be minimized.');
      }
    }
  );
}

export function openInIncognito(url: string, minimized = true) {
  const platform = process.platform as 'win32' | 'darwin' | 'linux';
  const chrome = chromePaths[platform];

  if (!chrome) {
    vscode.window.showWarningMessage(`Unsupported platform: ${platform}`);
    logger.debug(`Unsupported platform: ${platform}`);
    return;
  }

  if (platform === 'win32') {
    const flags = [
      '--incognito',
      '--no-first-run',
      '--autoplay-policy=no-user-gesture-required',
      `--user-data-dir=${path.join(os.tmpdir(), `ambient-music-chrome-${process.pid}`)}`,
      '--new-window',
      `--app=${url}`
    ];
    const browser = spawn(chrome, flags, {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    });
    browser.once('error', err => {
      vscode.window.showErrorMessage('❌ Failed to open browser.');
      logger.error('❌ Failed to open browser.', err);
    });
    browser.once('spawn', () => {
      browserProcessId = browser.pid;
      browserWindowMinimizationRequested = false;
      tabState.markOpen();
      logger.debug('🌐 Browser opened.');
    });
    browser.unref();
    return;
  }

  const cmd = buildLaunchCommand(url, chrome, platform, minimized);

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

export function minimizeBrowserWindow(): void {
  if (
    process.platform !== 'win32'
    || browserProcessId === undefined
    || browserWindowMinimizationRequested
  ) {
    return;
  }

  browserWindowMinimizationRequested = true;
  minimizeWindow(browserProcessId);
}

export function tryOpenTab(url: string) {
  if (!tabState.isOpen()) {
    logger.debug('🔵 Opening new tab.');
    openInIncognito(url);
  } else {
    logger.debug('⚠️ Tab already open, skipping.');
  }
}
