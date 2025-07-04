# 📦 Changelog for Ambient Music VS Code Extension

All notable changes for each version of the Ambient Music extension.

---

## [v1.3.5] - 2025-07-05

### ✨ Added
- **package.json**
   -keywords enhanced for better visibility in vs code market place

## [v1.3.4] - 2025-06-30

### ✨ Added

- **Enhanced README (v1.3.4)**
  - Expanded feature list and usage instructions.
  - Added developer-focused credits and YouTube creator acknowledgements.
  - New section for playlist JSON format.
  - Added visual marketplace badges.
  - Included `Developer Guide` link.

- **Dynamic Port Support**
  - Added support for using port `0` for dynamic allocation.
  - Prevents port conflicts and unsafe port issues.

- **Robust WebSocket Tab Tracking**
  - Replaced `globalState` with a singleton in-memory `TabState` for more reliable tracking.
  - Improved detection of manual vs. automatic tab closures.

- **`ensureTabConnected()` Utility**
  - Ensures WebSocket reconnection and tab relaunch only if needed.
  - Optional delay support.

### 🛠 Improved

- **Singleton Service Refactoring**
  - All core services now follow Singleton pattern: `serverManager`, `webSocketManager`, `playlistManager`, etc.
  - Reduced redundant service re-instantiation.

- **WebSocket Registration Flow**
  - Browser client registers on connect with `{ type: 'register', client: 'browser' }`.
  - Extension respects re-registration to prevent tab duplication.

- **Startup Flow Logic**
  - Prevents unnecessary tab openings when tab is already marked open.
  - Respects manual closure state to avoid auto-relaunching.

### 🐛 Fixed

- Fixed bug where `localhost:0` would cause browser to open invalid/unsafe ports.
- Prevented duplicate tab openings due to early misreported tab state.
- Play commands now gracefully abort when no client is connected.

### 🧹 Removed

- Deprecated use of `vscode.globalState` for tracking tab state.
- Removed legacy `markTabOpen`, `markTabClosed`, `isTabCurrentlyOpen()` helpers.

---

## [v1.0.0] - Initial Release

- 🎧 Auto-launches ambient YouTube music in an incognito Chrome tab.
- 🛰 WebSocket server to control playback from VS Code.
- 🔁 Automatic video rotation every 30 minutes.
- 🎮 Commands for play, pause, resume, close, and playlist control.
- 🛡 Lockfile prevents multiple VS Code instances from running server concurrently.

---

> For full usage details, see [README.md](./README.md).

