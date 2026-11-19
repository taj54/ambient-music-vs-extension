import * as vscode from 'vscode';
import { webSocketManager, playlistManager } from './services';

export class SidebarController implements vscode.WebviewViewProvider {
  public static readonly viewType = 'ambientMusic.sidebar';
  private webviewView: vscode.WebviewView | undefined;
  private statusDisposable: vscode.Disposable | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.webviewView = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    webviewView.webview.html = this.getHtml();
    this.statusDisposable?.dispose();
    this.statusDisposable = webSocketManager.onPlayerStatus(status => {
      webviewView.webview.postMessage({ type: 'playerStatus', status });
    });

    webviewView.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'play':
        case 'pause':
        case 'unmute':
        case 'mute':
        case 'get_status':
          webSocketManager.send({ command: message.command });
          break;
        case 'next':
          this.sendTrack(playlistManager.getNextTrack());
          break;
        case 'previous':
          this.sendTrack(playlistManager.getPreviousTrack());
          break;
        case 'select_track':
          this.sendTrack(playlistManager.selectTrack(message.index));
          break;
        case 'set_volume':
        case 'seek':
          webSocketManager.send({ command: message.command, url: message.value });
          break;
        case 'openPlayer':
          vscode.commands.executeCommand('ambientMusic.openTab');
          break;
      }
    });

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) webSocketManager.send({ command: 'get_status' });
    });

    webSocketManager.send({ command: 'get_status' });
  }

  private sendTrack(url: string): void {
    if (url) {
      webSocketManager.send({ command: 'switch', url });
      const metadata = playlistManager.getCurrentTrackMetadata();
      if (metadata) {
        this.webviewView?.webview.postMessage({
          type: 'currentTrack',
          title: metadata.title
        });
      }
    }
  }

  private getHtml(): string {
    const playlist = playlistManager.getPlaylistMetadata();
    const current = playlistManager.getCurrentTrackMetadata();
    const items = playlist.map((item, index) =>
      `<button class="track${current?.title === item.title ? ' active' : ''}" data-index="${index}">
        <span class="track-title">${this.escapeHtml(item.title)}</span>
        ${item.channel?.name ? `<span class="track-channel">${this.escapeHtml(item.channel.name)}</span>` : ''}
      </button>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root { color-scheme: dark; }
    body { padding: 10px; font-family: var(--vscode-font-family); color: var(--vscode-foreground); }
    h2 { font-size: 13px; margin: 0 0 10px; }
    .current { margin-bottom: 10px; }
    .current-title { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .controls { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    button, input { box-sizing: border-box; }
    .controls button, #openPlayer { width: 100%; border: 1px solid var(--vscode-button-border, transparent); background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); height: 32px; cursor: pointer; }
    .range-row { display: grid; grid-template-columns: 52px 1fr 52px; align-items: center; gap: 6px; margin: 10px 0; }
    input[type="range"] { width: 100%; accent-color: var(--vscode-progressBar-background); }
    #playlist { display: flex; flex-direction: column; gap: 4px; max-height: 280px; overflow-y: auto; }
    .track { text-align: left; border: 0; border-radius: 3px; padding: 7px; background: transparent; color: var(--vscode-foreground); cursor: pointer; }
    .track:hover { background: var(--vscode-list-hoverBackground); }
    .track.active { background: var(--vscode-list-activeSelectionBackground); color: var(--vscode-list-activeSelectionForeground); }
    .track-title, .track-channel { display: block; }
    .track-title { font-size: 12px; }
    .track-channel { margin-top: 2px; font-size: 10px; opacity: 0.75; }
  </style>
</head>
<body>
  <h2>Ambient Music</h2>
  <div class="current">
    <div class="current-title" id="currentTitle">${this.escapeHtml(current?.title || 'No track loaded')}</div>
  </div>
  <div class="controls">
    <button id="previous" title="Previous track">|&lt;</button>
    <button id="playPause" title="Play" aria-label="Play">▶</button>
    <button id="next" title="Next track">&gt;|</button>
  </div>
  <div class="range-row">
    <label for="progress">Time</label>
    <input id="progress" type="range" min="0" max="100" value="0">
    <span id="time">0:00</span>
  </div>
  <div class="range-row">
    <label for="volume">Volume</label>
    <input id="volume" type="range" min="0" max="100" value="100">
    <button id="mute" title="Mute">Mute</button>
  </div>
  <button id="openPlayer">Open Player</button>
  <h2>Playlist</h2>
  <div id="playlist">${items}</div>

  <script>
    const vscode = acquireVsCodeApi();
    const post = (command, extra = {}) => vscode.postMessage({ command, ...extra });
    let isPlaying = false;
    const formatTime = value => {
      const seconds = Math.max(0, Math.floor(value || 0));
      return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
    };

    document.getElementById('previous').onclick = () => post('previous');
    document.getElementById('next').onclick = () => post('next');
    const playPause = document.getElementById('playPause');
    playPause.onclick = () => post(isPlaying ? 'pause' : 'play');
    document.getElementById('mute').onclick = () => post('mute');
    document.getElementById('openPlayer').onclick = () => post('openPlayer');
    document.getElementById('volume').oninput = event => post('set_volume', { value: Number(event.target.value) });
    document.getElementById('progress').onchange = event => post('seek', { value: Number(event.target.value) });
    document.querySelectorAll('.track').forEach(button => {
      button.onclick = () => post('select_track', { index: Number(button.dataset.index) });
    });
    window.addEventListener('message', event => {
      if (event.data.type === 'playerStatus') {
        const status = event.data.status;
        isPlaying = status.state === 1;
        playPause.textContent = isPlaying ? '⏸' : '▶';
        playPause.title = isPlaying ? 'Pause' : 'Play';
        playPause.setAttribute('aria-label', playPause.title);
        const progress = document.getElementById('progress');
        const time = document.getElementById('time');
        const volume = document.getElementById('volume');
        const mute = document.getElementById('mute');
        if (progress && status.duration > 0) {
          progress.value = String(Math.round(status.currentTime / status.duration * 100));
        }
        if (time) time.textContent = formatTime(status.currentTime);
        if (volume && !volume.matches(':active')) volume.value = String(status.volume);
        if (mute) {
          mute.textContent = status.muted ? 'Unmute' : 'Mute';
          mute.onclick = () => post(status.muted ? 'unmute' : 'mute');
        }
      }
      if (event.data.type === 'currentTrack') {
        document.getElementById('currentTitle').textContent = event.data.title;
      }
    });
  </script>
</body>
</html>`;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
