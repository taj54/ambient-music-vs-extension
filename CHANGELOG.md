# 📦 Changelog for Ambient Music VS Code Extension

All notable changes for each version of the Ambient Music extension.

---

## v1.6.0 2025-09-03

### Changed

- add ws to external dependencies
- Merge pull request #10 from taj54/version-bump/v1.5.2
- bump version to v1.5.2
- update universal-version-bump to v0.13.2
- bump version to 1.5.1

## v1.5.2 2025-09-03

### Changed

- update universal-version-bump to v0.13.2
- bump version to 1.5.1

## v1.5.0 2025-08-28

### Changed

- change release trigger to 'created'
- //github.com/taj54/ambient-music-vs-extension
- update release workflow

## v1.4.0 2025-08-28

### Changed

- add GitHub Actions workflow for tagging and releasing
- remove dist folder from .vscodeignore

## v1.3.15 2025-08-28

## v1.3.11 2025-08-28

### Added

- github action bot added

### Changed

- add unit tests for playlist filtering and management
- update build system to use tsup
- update test runner
- update dependencies
- use xvfb to run tests in github actions
- use pnpm instead of npm in test script
- //github.com/taj54/ambient-music-vs-extension
- remove old CI workflow; add new test workflow
- Merge pull request #5 from taj54/version/v1.3.10
- update CHANGELOG.md with v1.3.5
- bump version to v1.3.10
- update version bumping workflow
- Merge pull request #4 from taj54/release/v1.3.9
- bump version to v1.3.9
- Merge pull request #3 from taj54/feature/github-workflows
- npm cofig updated
- Merge pull request #2 from taj54/feature/github-workflows
- Merge pull request #1 from taj54/feature/github-workflows
- Add version bump workflow\"
- developer guide linked in readme file
- developer_guide to developer renamed
- security file added
- codeof conduct added
- deploy reverted
- ci updated
- 1.3.8
- ci/cd upgraded
- executable path updated
- updated windows
- update the ci flow
- allignment in changelog
- change log updated
- version updated for visibility
- keywords are updated
- change log updated
- minor file change and changelog updated
- v1.3.4
- v1.3.3
- V1.3.2
- v1.3.1

## v1.3.10 2025-08-28

### Added

- github action bot added

### Changed

- update version bumping workflow
- Merge pull request #4 from taj54/release/v1.3.9
- bump version to v1.3.9
- Merge pull request #3 from taj54/feature/github-workflows
- npm cofig updated
- Merge pull request #2 from taj54/feature/github-workflows
- Merge pull request #1 from taj54/feature/github-workflows
- Add version bump workflow\"
- developer guide linked in readme file
- developer_guide to developer renamed
- security file added
- codeof conduct added
- deploy reverted
- ci updated
- 1.3.8
- ci/cd upgraded
- executable path updated
- updated windows
- update the ci flow
- allignment in changelog
- change log updated
- version updated for visibility
- keywords are updated
- change log updated
- minor file change and changelog updated
- v1.3.4
- v1.3.3
- V1.3.2
- v1.3.1


## v1.3.5  2025-07-05

### ✨ Added
- **package.json**
   - Keywords enhanced for better visibility in vs code market place

## v1.3.4  2025-06-30

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

## v1.0.0  Initial Release

- 🎧 Auto-launches ambient YouTube music in an incognito Chrome tab.
- 🛰 WebSocket server to control playback from VS Code.
- 🔁 Automatic video rotation every 30 minutes.
- 🎮 Commands for play, pause, resume, close, and playlist control.
- 🛡 Lockfile prevents multiple VS Code instances from running server concurrently.

---

> For full usage details, see [README.md](./README.md).


