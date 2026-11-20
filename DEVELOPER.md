# Developer Guide

This guide covers setup, architecture, testing, packaging, and contribution conventions for Ambient Music AutoPlayer.

## Project structure

```text
ambient-music-vs-extension/
├── .github/workflows/       # Test, version, tag, and release automation
├── .vscode/                 # Extension Development Host launch config
├── media/                   # Player HTML, default playlist, and extension icons
├── scripts/                 # VSIX packaging and local installation
├── src/
│   ├── extension.ts         # Activation and deactivation
│   ├── commands.ts          # Command Palette registration
│   ├── sidebarController.ts # Activity Bar webview
│   ├── filters/             # Playlist filtering
│   ├── interfaces/          # Playlist type definitions
│   ├── server/              # HTTP routes and WebSocket handlers
│   ├── services/            # File, playlist, server, and WebSocket services
│   ├── utils/               # Browser, configuration, logging, URL, and tab helpers
│   └── validators/          # Playlist validation
├── test/                    # Mocha and VS Code Electron tests
├── package.json             # Extension manifest and scripts
├── tsconfig.json            # TypeScript options
├── tsup.config.ts           # Build and bundle configuration
└── README.md                # End-user documentation
```

## Development setup

Requirements:

- Node.js 22 or later
- pnpm 10.15 or later
- VS Code 1.80 or later
- Google Chrome

From the repository root:

```bash
corepack enable
corepack pnpm install
pnpm run compile
```

Press `F5` in VS Code or use **Run > Start Debugging** to launch the extension in the Extension Development Host.

## How it works

- `src/extension.ts` initializes the playlist and services, registers commands, and adds the sidebar view.
- `src/services/serverManager.ts` starts the local HTTP/WebSocket server and manages the primary VS Code instance.
- `src/services/webSocketManager.ts` synchronizes playback status and sends commands between VS Code and the browser.
- `src/services/playlistManager.ts` loads the default or configured playlist and manages track selection.
- `src/sidebarController.ts` renders the Activity Bar controller and forwards sidebar actions.
- `media/client.html` embeds and controls the YouTube player.
- `src/utils/browser.ts` opens Chrome in an app-style, incognito window.

Only the primary VS Code window starts the server. Other windows connect to the running server through the lock file in the operating-system temporary directory.

## Commands

| Command ID | Title | Purpose |
| --- | --- | --- |
| `ambientMusic.openTab` | Open Ambient Music Player | Starts or opens the player window |
| `ambientMusic.play` | Play Ambient Music | Starts playback |
| `ambientMusic.pause` | Pause Music | Pauses playback |
| `ambientMusic.resume` | Resume Music | Resumes playback |
| `ambientMusic.setPlaylist` | Set Playlist | Filters the playlist by a tag |
| `ambientMusic.resetPlaylist` | Reset Playlist to Default | Restores the default playlist |
| `ambientMusic.closeTab` | Close Music Player | Closes the browser player and stops owned server resources |

## Settings

| Setting | Type | Default | Purpose |
| --- | --- | --- | --- |
| `ambientMusic.autoPlayOnStartup` | `boolean` | `true` | Start ambient music after activation |
| `ambientMusic.port` | `number` | `3303` | Preferred local server port; `0` requests an available port |
| `ambientMusic.switchIntervalMinutes` | `number` | `30` | Minutes between automatic track changes |
| `ambientMusic.debug` | `boolean` | `false` | Enable verbose extension logging |
| `ambientMusic.playlist` | `array` | `[]` | Replace the default playlist |

Custom playlist URLs must use the YouTube watch format:

```json
{
  "ambientMusic.playlist": [
    {
      "title": "Peaceful Piano",
      "url": "https://www.youtube.com/watch?v=abcdefghijkl",
      "tags": ["piano", "relax"],
      "channel": {
        "name": "Chill Music Co.",
        "url": "https://youtube.com/@chillmusicco"
      }
    }
  ]
}
```

The playlist validator requires a title, an 11-character YouTube video ID in the watch URL, a string tag array, and channel name/URL fields.

## Testing

Run the Mocha suite and VS Code Electron test runner:

```bash
pnpm test
```

The test command first compiles the extension and test entry points with `tsup`, then launches VS Code in test mode.

On Linux CI, use Xvfb:

```bash
xvfb-run -a pnpm test
```

Use the test runner and Extension Development Host to verify browser, WebSocket, sidebar, and playlist behavior end to end.

## Building and packaging

Compile the extension:

```bash
pnpm run compile
```

Create a VSIX package:

```bash
pnpm run package:vsix
```

Package and install it into the local VS Code installation:

```bash
pnpm run install:local
```

The VSIX filename is `ambient-music-vs-extension-<version>.vsix`.

## Instance locking

The server manager creates `<os-temporary-directory>/ambient-music-extension.lock` for the primary instance. The file contains the process ID and active server port.

- A running server makes the lock usable by secondary VS Code windows.
- A stale or invalid lock is removed.
- The primary window owns shutdown and lock cleanup.

## Contribution workflow

1. Fork and clone the repository.
2. Install dependencies with pnpm.
3. Make focused changes and add or update tests.
4. Run `pnpm run compile` and `pnpm test`.
5. Open a pull request with a clear summary and testing notes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the project-specific contribution guide and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards.
