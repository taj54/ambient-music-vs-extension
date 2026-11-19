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
      }
    });

    let wasVisible = webviewView.visible;
    const openPlayerWhenVisible = () => {
      if (webviewView.visible) {
        webSocketManager.send({ command: 'get_status' });
        void vscode.commands.executeCommand('ambientMusic.openTab');
      }
    };
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible && !wasVisible) {
        openPlayerWhenVisible();
      } else if (webviewView.visible) {
        webSocketManager.send({ command: 'get_status' });
      }
      wasVisible = webviewView.visible;
    });

    webSocketManager.send({ command: 'get_status' });
    if (wasVisible) openPlayerWhenVisible();
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
        <span class="track-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="track-copy">
          <span class="track-title">${this.escapeHtml(item.title)}</span>
          ${item.channel?.name ? `<span class="track-channel">${this.escapeHtml(item.channel.name)}</span>` : ''}
        </span>
        <span class="active-mark" aria-hidden="true">
          <i></i><i></i><i></i>
        </span>
      </button>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 12px;
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
    }
    button, input { font: inherit; }
    button { color: inherit; }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 2px 2px 12px;
    }
    .brand { display: flex; align-items: center; gap: 8px; }
    .brand-mark {
      width: 28px; height: 28px; border-radius: 9px;
      display: grid; place-items: center;
      background: linear-gradient(145deg, color-mix(in srgb, var(--vscode-focusBorder) 82%, transparent), var(--vscode-button-background));
      box-shadow: 0 7px 18px color-mix(in srgb, var(--vscode-focusBorder) 22%, transparent);
      color: var(--vscode-button-foreground);
      font-size: 13px;
    }
    .brand-name { font-size: 12px; font-weight: 700; letter-spacing: .02em; }
    .status {
      display: flex; align-items: center; gap: 6px;
      font-size: 10px; opacity: .72;
    }
    .status-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--vscode-charts-green, #89d185);
      box-shadow: 0 0 8px var(--vscode-charts-green, #89d185);
    }
    .player-card {
      border: 1px solid color-mix(in srgb, var(--vscode-foreground) 9%, transparent);
      border-radius: 14px;
      padding: 14px;
      background: linear-gradient(145deg,
        color-mix(in srgb, var(--vscode-sideBar-background) 88%, var(--vscode-focusBorder) 12%),
        var(--vscode-sideBar-background));
      box-shadow: 0 10px 28px color-mix(in srgb, #000 12%, transparent);
    }
    .now-label {
      margin-bottom: 7px;
      font-size: 9px; font-weight: 700; letter-spacing: .16em;
      text-transform: uppercase; opacity: .55;
    }
    .current-title {
      min-height: 38px;
      font-size: 14px; line-height: 1.35; font-weight: 650;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .controls {
      display: grid; grid-template-columns: 40px 48px 40px;
      justify-content: center; align-items: center; gap: 12px;
      margin: 13px 0 10px;
    }
    .control {
      height: 40px; border: 0; border-radius: 50%;
      display: grid; place-items: center;
      background: transparent; cursor: pointer;
      transition: transform .15s ease, background .15s ease;
    }
    .control:hover { background: var(--vscode-toolbar-hoverBackground); transform: translateY(-1px); }
    .control:active { transform: scale(.94); }
    .control.primary {
      height: 48px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      box-shadow: 0 8px 20px color-mix(in srgb, var(--vscode-button-background) 28%, transparent);
    }
    .control.primary:hover { background: var(--vscode-button-hoverBackground); }
    .control svg { width: 18px; height: 18px; fill: currentColor; }
    .progress-row { display: grid; grid-template-columns: 38px 1fr 38px; align-items: center; gap: 7px; }
    .time { font-size: 9px; opacity: .68; text-align: center; font-variant-numeric: tabular-nums; }
    input[type="range"] {
      width: 100%; height: 3px; margin: 8px 0;
      border-radius: 999px; cursor: pointer;
      accent-color: var(--vscode-progressBar-background);
    }
    .volume-row {
      display: grid; grid-template-columns: 28px 1fr;
      align-items: center; gap: 8px;
      margin-top: 8px;
    }
    .volume-toggle {
      width: 28px; height: 28px; border: 0; border-radius: 7px;
      display: grid; place-items: center;
      background: transparent; opacity: .78; cursor: pointer;
    }
    .volume-toggle:hover { background: var(--vscode-toolbar-hoverBackground); opacity: 1; }
    .volume-toggle svg { width: 16px; height: 16px; fill: currentColor; }
    .playlist-section { margin-top: 14px; }
    .playlist-header {
      display: flex; align-items: center; justify-content: space-between;
      margin: 0 4px 7px;
    }
    .playlist-header h2 { margin: 0; font-size: 11px; }
    .track-count {
      min-width: 20px; height: 18px; padding: 0 6px;
      display: grid; place-items: center;
      border-radius: 999px; font-size: 9px;
      background: color-mix(in srgb, var(--vscode-foreground) 7%, transparent);
      opacity: .75;
    }
    #playlist {
      display: flex; flex-direction: column; gap: 3px;
      max-height: 280px; overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--vscode-scrollbarSlider-background) transparent;
    }
    .track {
      width: 100%; min-height: 48px;
      display: grid; grid-template-columns: 24px minmax(0, 1fr) 18px;
      align-items: center; gap: 7px;
      text-align: left; border: 1px solid transparent; border-radius: 9px;
      padding: 7px 8px;
      background: transparent; color: var(--vscode-foreground); cursor: pointer;
      transition: background .15s ease, border-color .15s ease;
    }
    .track:hover { background: var(--vscode-list-hoverBackground); }
    .track.active {
      border-color: color-mix(in srgb, var(--vscode-focusBorder) 34%, transparent);
      background: color-mix(in srgb, var(--vscode-list-activeSelectionBackground) 62%, transparent);
      color: var(--vscode-list-activeSelectionForeground);
    }
    .track-number { font-size: 9px; opacity: .42; font-variant-numeric: tabular-nums; }
    .track-copy { min-width: 0; }
    .track-title, .track-channel { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .track-title { font-size: 11px; font-weight: 550; }
    .track-channel { margin-top: 3px; font-size: 9px; opacity: .58; }
    .active-mark { display: none; height: 12px; align-items: flex-end; justify-content: center; gap: 2px; }
    .active-mark i { width: 2px; border-radius: 2px; background: var(--vscode-focusBorder); animation: bounce 1s ease-in-out infinite alternate; }
    .active-mark i:nth-child(1) { height: 5px; }
    .active-mark i:nth-child(2) { height: 10px; animation-delay: -.35s; }
    .active-mark i:nth-child(3) { height: 7px; animation-delay: -.65s; }
    .track.active .active-mark { display: flex; }
    .track.active .track-number { opacity: 0; }
    @keyframes bounce { to { height: 3px; } }
    @media (prefers-reduced-motion: reduce) { .active-mark i { animation: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">♪</div>
      <span class="brand-name">Ambient Music</span>
    </div>
    <div class="status"><span class="status-dot"></span><span id="statusText">Ready</span></div>
  </div>

  <main class="player-card">
    <div class="now-label">Now playing</div>
    <div class="current-title" id="currentTitle">${this.escapeHtml(current?.title || 'No track loaded')}</div>

    <div class="controls">
      <button class="control" id="previous" title="Previous track" aria-label="Previous track">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
      </button>
      <button class="control primary" id="playPause" title="Play" aria-label="Play">
        <svg id="playIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <button class="control" id="next" title="Next track" aria-label="Next track">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 6h2v12h-2zM5 18l8.5-6L5 6z"/></svg>
      </button>
    </div>

    <div class="progress-row">
      <span class="time" id="elapsed">0:00</span>
      <input id="progress" type="range" min="0" max="100" value="0" aria-label="Track progress">
      <span class="time" id="time">0:00</span>
    </div>

    <div class="volume-row">
      <button class="volume-toggle" id="mute" title="Mute" aria-label="Mute" aria-pressed="false">
        <svg id="speakerIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 15.5 12zm-2.5-8v2.06a9 9 0 0 1 0 14v-2.06a7 7 0 0 0 0-11.88V4z"/></svg>
      </button>
      <input id="volume" type="range" min="0" max="100" value="100" aria-label="Volume">
    </div>

  </main>

  <section class="playlist-section">
    <div class="playlist-header">
      <h2>Playlist</h2>
      <span class="track-count">${playlist.length}</span>
    </div>
    <div id="playlist">${items}</div>
  </section>

  <script>
    const vscode = acquireVsCodeApi();
    const post = (command, extra = {}) => vscode.postMessage({ command, ...extra });
    let isPlaying = false;
    let isMuted = false;
    const formatTime = value => {
      const seconds = Math.max(0, Math.floor(value || 0));
      return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
    };

    document.getElementById('previous').onclick = () => post('previous');
    document.getElementById('next').onclick = () => post('next');
    const playPause = document.getElementById('playPause');
    playPause.onclick = () => post(isPlaying ? 'pause' : 'play');
    const mute = document.getElementById('mute');
    mute.onclick = () => post(isMuted ? 'unmute' : 'mute');
    document.getElementById('volume').oninput = event => post('set_volume', { value: Number(event.target.value) });
    document.getElementById('progress').onchange = event => post('seek', { value: Number(event.target.value) });
    document.querySelectorAll('.track').forEach(button => {
      button.onclick = () => post('select_track', { index: Number(button.dataset.index) });
    });
    window.addEventListener('message', event => {
      if (event.data.type === 'playerStatus') {
        const status = event.data.status;
        isPlaying = status.state === 1;
        const playIcon = document.getElementById('playIcon');
        if (playIcon) {
          playIcon.innerHTML = isPlaying
            ? '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>'
            : '<path d="M8 5v14l11-7z"/>';
        }
        playPause.title = isPlaying ? 'Pause' : 'Play';
        playPause.setAttribute('aria-label', playPause.title);
        const statusText = document.getElementById('statusText');
        if (statusText) statusText.textContent = isPlaying ? 'Playing' : 'Paused';
        const progress = document.getElementById('progress');
        const time = document.getElementById('time');
        const elapsed = document.getElementById('elapsed');
        const volume = document.getElementById('volume');
        isMuted = status.muted;
        const speakerIcon = document.getElementById('speakerIcon');
        if (speakerIcon) {
          speakerIcon.innerHTML = isMuted
            ? '<path d="M3 9v6h4l5 4V5L7 9H3z"/><path d="m16 9 1.4-1.4L20 10.2l2.6-2.6L24 9l-2.6 2.6L24 14l-1.4 1.4-2.6-2.6-2.6 2.6L16 14l2.6-2.6z"/>'
            : '<path d="M3 9v6h4l5 4V5L7 9H3zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 15.5 12zm-2.5-8v2.06a9 9 0 0 1 0 14v-2.06a7 7 0 0 0 0-11.88V4z"/>';
        }
        mute.title = isMuted ? 'Unmute' : 'Mute';
        mute.setAttribute('aria-label', mute.title);
        mute.setAttribute('aria-pressed', String(isMuted));
        if (progress && status.duration > 0) {
          progress.value = String(Math.round(status.currentTime / status.duration * 100));
        }
        if (elapsed) elapsed.textContent = formatTime(status.currentTime);
        if (time) time.textContent = formatTime(status.duration);
        if (volume && !volume.matches(':active')) volume.value = String(status.volume);
      }
      if (event.data.type === 'currentTrack') {
        document.getElementById('currentTitle').textContent = event.data.title;
        document.querySelectorAll('.track').forEach(button => {
          const title = button.querySelector('.track-title');
          button.classList.toggle('active', title?.textContent === event.data.title);
        });
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
