
# 🛠️ Developer Guide – Ambient Music VS Code Extension

> **Inspiration**  
> One day, I realized I had been feeling unproductive for several days. After a quick self-reflection, I discovered that watching TV series and movies in the background while coding was draining my focus and creativity.  
> This insight inspired me to build a tool—for myself and others—to stay focused with relaxing ambient music.

---

## 🆕 Version 1.2.47

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

| Command                                 | Description                                           |
|-----------------------------------------|-------------------------------------------------------|
| `ambient-taj: 🎶 Set Playlist`          | Choose from relaxing playlists like Rain, Forest, Ocean, etc. |
| `ambient-taj: 🌐 Open Ambient Music Tab` | Opens the ambient player tab inside VS Code.         |
| `ambient-taj: ▶ Play Ambient Music`     | Begin playing the ambient track.                     |
| `ambient-taj: ⏸ Pause Ambient Music`    | Temporarily pause the current music.                 |
| `ambient-taj: ▶ Resume Ambient Music`   | Resume playback from where it was paused.            |
| `ambient-taj: ❌ Close Ambient Music Tab`| Close the music tab and stop playback.               |

---
> 💡 **Tip:** You can customize keybindings for these commands or use them in your automation workflows inside VS Code.

---

## 🔧 Configuration (Optional)

```json
// .vscode/settings.json or user settings
{
  "ambientMusic.port": 0, // 0 = dynamic port
  "ambientMusic.switchIntervalMinutes": 30,
  "ambientMusic.playlist": [
    "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    "https://www.youtube.com/watch?v=5qap5aO4i9A"
  ]
}
```

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

## 🔗 Credits

- Default music from [Lofi Girl](https://www.youtube.com/@lofigirl)
- Built with ❤️ by [Taj](https://github.com/taj54)
