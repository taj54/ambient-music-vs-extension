# 🛠️ Developer Guide – Ambient Music VS Code Extension


> **Inspiration**  
> One day, I realized I had been feeling unproductive for several days. After a quick self-reflection, I discovered that watching TV series and movies in the background while coding was draining my focus and creativity. This insight inspired me to build a tool for myself—and for thousands of other developers who face similar distractions—to help us stay in the zone with relaxing ambient music.


---

## 🆕 Version 1.2.31

This document helps you set up, build, run, and customize the Ambient Music AutoPlayer extension for Visual Studio Code.

---



## 📁 Project Structure

```
ambient-music-vs-extension/
├── .vscode/               # VS Code launch configs
├── media/                 # HTML client for YouTube playback
├── dist/                  # Compiled JavaScript output
├── src/                   # Source TypeScript files
│   ├── extension.ts       # Main activation script
│   ├── commands.ts        # VS Code command registration
│   ├── playlist.ts        # Playlist management logic
│   ├── socket.ts          # WebSocket logic (singleton)
│   ├── server.ts          # HTTP + WebSocket entry point
│   └── utils/             # Utilities (browser, config, logger)
├── package.json           # Extension metadata and commands
├── tsconfig.json          # TypeScript config
└── README.md              # User-facing README
```

---

## ✨ Getting Started (Local Dev Setup)

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
- Press `F5` to launch a **new Extension Development Host**

Expected result:
- A YouTube lofi stream opens in your browser
- A toast notification appears in VS Code

---

## 🧠 How It Works

1. On activation, the extension launches a local HTTP server and serves a YouTube player HTML client.
2. A WebSocket is opened to control playback.
3. Ambient music plays automatically, and rotates every 30 minutes (or user-configured interval).

Command Palette support:

- `Ambient Music: Open` – opens the tab manually
- `Ambient Music: Play`, `Pause`, `Resume`
- `Ambient Music: Set Playlist` – change the active list of YouTube tracks

---

## 🔧 Customization

To customize the playlist permanently, you can:

```json
// settings.json (user or workspace)
"ambientMusic.playlist": [
  "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  "https://www.youtube.com/watch?v=5qap5aO4i9A"
]
```

Or update during runtime using `Ambient Music: Set Playlist`.

---

## 🌀 Rotation Logic

The extension automatically switches to the next track every X minutes:

```ts
startRotation(clientUrl, intervalMs);
```

To change the rotation interval:

```json
"ambientMusic.switchIntervalMinutes": 30
```

---

## 📦 Packaging the Extension

1. **Install `vsce`**:

```bash
npm install -g vsce
```

2. **Package the Extension**:

```bash
vsce package
```

3. Distribute `.vsix` or publish to Marketplace

---

## 🧪 Testing Tips

- Check `client.html` for YouTube embed readiness.
- Use `Developer: Toggle Developer Tools` for JS errors.
- Watch logs in VS Code terminal for WebSocket events.

---

## 🔗 Requirements

- Node.js v18+
- VS Code v1.80+
- Internet connection

---

## 📜 License

MIT License © 2025 [Tajul Islam](mailto:tajulislamj200@gmail.com)

---

## 🙌 Credits

- Music by [Lofi Girl](https://www.youtube.com/@lofigirl)

> *Turn your VS Code into a calming workspace.*