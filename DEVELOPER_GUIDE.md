
# 🛠️ Developer Guide – Ambient Music VS Code Extension

> **Inspiration**  
> One day, I realized I had been feeling unproductive for several days. After a quick self-reflection, I discovered that watching TV series and movies in the background while coding was draining my focus and creativity.  
> This insight inspired me to build a tool—for myself and others—to stay focused with relaxing ambient music.

---


## Guide

This guide helps you **set up**, **build**, **test**, and **contribute** to the Ambient Music AutoPlayer extension for Visual Studio Code.

---

## 📁 Project Structure

```
ambient-music-vs-extension/
├── .vscode/               # Debug configs for dev mode
├── dist/                  # Compiled JS output (built via TypeScript)
├── media/                 # YouTube HTML player
├── src/                   # Main TypeScript source code
│   ├── extension.ts       # Entry point (activate/deactivate)
│   ├── commands.ts        # VS Code command registration
│   ├── playlist.ts        # Playlist management
│   ├── serverManager.ts   # Singleton HTTP server
│   ├── webSocketManager.ts# Singleton WebSocket logic
│   └── utils/             # Helper functions (browser, config, logger)
├── test/                  # Mocha-based test suite
├── package.json           # VS Code extension manifest
├── tsconfig.json          # TypeScript configuration
└── README.md              # End-user instructions
```

---

## 🚀 Getting Started (Dev Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/taj54/ambient-music-vs-extension.git
cd ambient-music-vs-extension
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Extension

```bash
npm run compile
```

### 4. Launch in Dev Mode

- Open the project in VS Code
- Press `F5` to start a new Extension Development Host

Expected:
- Ambient YouTube music auto-launches in a browser tab
- WebSocket connects and displays confirmation

---

## 🧠 How It Works

- The extension spins up a local HTTP server that serves a YouTube-based HTML client (`media/client.html`)
- A WebSocket connection allows the extension to send commands (play, pause, switch track, close tab)
- Music auto-plays when VS Code opens a workspace
- Track rotation happens every X minutes (default 30)

---

## ⚙️ Key Components

| Component | Responsibility |
|----------|----------------|
| `serverManager.ts` | HTTP server with singleton pattern |
| `webSocketManager.ts` | WebSocket communication (client commands + rotation) |
| `playlist.ts` | Load/parse/manage YouTube video playlist |
| `browser.ts` | Open/close browser tabs (Chrome) |
| `extension.ts` | Entry point – activates server, WebSocket, commands |
| `commands.ts` | Exposes VS Code command palette actions |

---

## 🎯 Commands (Dev or Test)
Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for:


| Command ID                      | Title                                                  | Description                            |
|--------------------------------|---------------------------------------------------------|----------------------------------------|
| `ambientMusic.setPlaylist`     | 🎶 Set Playlist (Rain, Forest, Ocean...)               | Choose or define a relaxing playlist   |
| `ambientMusic.openTab`         | 🌐 Open Ambient Music Player                            | Opens the embedded music player tab    |
| `ambientMusic.play`            | ▶️ Play Ambient Music                                   | Starts playing ambient music           |
| `ambientMusic.pause`           | ⏸️ Pause Music                                          | Pauses the currently playing track     |
| `ambientMusic.resume`          | ⏯ Resume Music                                          | Resumes paused ambient music           |
| `ambientMusic.closeTab`        | ❌ Close Music Player                                   | Closes the music player tab            |
| `ambientMusic.resetPlaylist`   | 🔄 Reset Playlist to Default                            | Restores the default ambient playlist  |


---
> 💡 **Tip:** You can customize keybindings for these commands or use them in your automation workflows inside VS Code.

---

## 🔧 Configuration (Optional)

These settings can be customized in your VS Code `settings.json`.


| Setting Key                                | Type      | Default | Description                                                                                      |
|-------------------------------------------|-----------|---------|--------------------------------------------------------------------------------------------------|
| `ambientMusic.autoPlayOnStartup`          | `boolean` | `false` | Automatically start ambient music when VS Code launches.                                         |
| `ambientMusic.port`                       | `number`  | `3303`  | Port for the WebSocket server. Set to `0` for dynamic port allocation.                          |
| `ambientMusic.switchIntervalMinutes`      | `number`  | `30`    | Time interval (in minutes) to automatically switch to the next video in the playlist.           |
| `ambientMusic.debug`                      | `boolean` | `false` | Enables verbose debug logging for easier troubleshooting.                                        |
| `ambientMusic.playlist`                   | `array`   | `[]`    | Custom list of ambient YouTube videos with rich metadata. See example below.                    |

### 🎵 Playlist Format Example

```json
{
  "title": "Peaceful Piano",
  "url": "https://youtu.be/abc123",
  "tags": ["piano", "relax"],
  "channel": {
    "name": "Chill Music Co.",
    "url": "https://youtube.com/@chillmusicco"
  }
}

```

> ℹ️ Use these to personalize your flow.

---

## 🌀 Rotation Logic

The extension will auto-switch to the next track based on:

```ts
startRotation(clientUrl, intervalMinutes);
```

---

## 📦 Packaging the Extension

```bash
npm install -g vsce
vsce package
```

You’ll get a `.vsix` file that can be installed or published to the VS Code Marketplace.

---

## 🧪 Testing

- Run `npm run test` (uses `@vscode/test-electron`)
- Watch WebSocket & HTTP logs in VS Code terminal
- Debug client with DevTools → right-click → Inspect on the player tab

---

## 🖥️ Lockfile Behavior

To prevent multiple instances, a `.ambient-music-extension.lock` file is created at runtime.
On extension deactivate or VS Code close, this lock is removed. 

---

## 📌 Requirements

- Node.js v18+
- VS Code v1.80+
- Chrome installed (for tab open/close logic)

---

## 🙌 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

