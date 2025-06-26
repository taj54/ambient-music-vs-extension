# 🛠️ Developer Guide – Ambient Music VS Code Extension

> **Inspiration**  
> One day, I realized I had been feeling unproductive for several days. After a quick self-reflection, I discovered that watching TV series and movies in the background while coding was draining my focus and creativity. This insight inspired me to build a tool for myself—and for thousands of other developers who face similar distractions—to help us stay in the zone with relaxing ambient music.

---

## 🆕 Version 1.2.42

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
│   ├── webSocketManager.ts # WebSocket logic (singleton)
│   ├── serverManager.ts   # HTTP + WebSocket entry point
│   └── utils/             # Utilities (browser, config, logger)
├── test/                  # Mocha test suite for extension
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
2. A WebSocket server opens to control playback (singleton).
3. Ambient music plays automatically, rotating every X minutes.
4. If no VS Code workspace is open, the extension self-deactivates and closes the browser tab (via `close_tab` signal).

Command Palette support:

- `Ambient Music: Open` – opens the tab manually
- `Ambient Music: Play`, `Pause`, `Resume`
- `Ambient Music: Set Playlist` – change the active list of YouTube tracks
- `Ambient Music: Close Tab` – manually request the client to close

---

## 🔧 Configuration

You can customize your setup using VS Code settings (`settings.json`):

```json
{
  "ambientMusic.port": 0, // Dynamic or fixed port
  "ambientMusic.switchIntervalMinutes": 30,
  "ambientMusic.playlist": [
    "https://youtu.be/jfKfPfyJRdk",
    "https://youtu.be/5qap5aO4i9A"
  ]
}
```

---

## 🌀 Track Rotation Logic

Implemented using `setInterval()` in the WebSocket manager. It sends a `"switch"` command with the next track URL:

```ts
startRotation(clientUrl, intervalMinutes);
```

---

## 🔐 Singleton + Lockfile

- Prevents duplicate server or tab instances using a `.ambient-music-extension.lock` file.
- Removed automatically on shutdown or deactivation.

---

## 📦 Packaging the Extension

1. **Install `vsce`**:

```bash
npm install -g vsce
```

2. **Package It**:

```bash
vsce package
```

3. Upload the `.vsix` to the VS Code Marketplace.

---

## 🧪 Testing

- Tests are located in `/test` and use Mocha.
- Run using VS Code Extension test runner.
- Use `Developer: Toggle Developer Tools` for JS errors.

---

## 📜 License

MIT License © 2025 [Tajul Islam](mailto:tajulislamj200@gmail.com)

---

## 🙌 Credits

- Music by [Lofi Girl](https://www.youtube.com/@lofigirl)

> *Turn your VS Code into a calming workspace. And contribute mindfully.*