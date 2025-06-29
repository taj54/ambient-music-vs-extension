# 🎵 Ambient Music AutoPlayer for VS Code

> **Inspiration**  
> One day, I realized I had been feeling unproductive for several days. After a quick self-reflection, I discovered that watching TV series and movies in the background while coding was draining my focus and creativity. This insight inspired me to build a tool for myself—and for thousands of other developers who face similar distractions—to help us stay in the zone with relaxing ambient music.

---
## Badges

[![Version](https://img.shields.io/visual-studio-marketplace/v/taj154dev.ambient-music-vs-extension)](https://marketplace.visualstudio.com/items?itemName=taj154dev.ambient-music-vs-extension)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/taj154dev.ambient-music-vs-extension)](https://marketplace.visualstudio.com/items?itemName=taj154dev.ambient-music-vs-extension)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/taj154dev.ambient-music-vs-extension)](https://marketplace.visualstudio.com/items?itemName=taj154dev.ambient-music-vs-extension)
[![License](https://img.shields.io/github/license/taj54/ambient-music-vs-extension)](https://github.com/taj54/ambient-music-vs-extension/blob/main/LICENSE)
![TypeScript](https://img.shields.io/badge/built_with-TypeScript-3178c6?logo=typescript&logoColor=white)

---

## 🎧 What It Does

Ambient music starts automatically with your project and seamlessly transitions to a new track every 30 minutes (by default) to keep you in the zone.

---

## ✨ Features

- ✅ Automatically plays ambient music when a workspace is opened
- ✅ Rotates to a new track every 30 minutes (configurable)
- ✅ Prevents multiple instances with singleton design
- ✅ Supports reconnecting WebSocket clients
- ✅ Manual play/pause/resume via Command Palette
- ✅ Easily set your own playlist via command
- ✅ Manually close the tab via `Ambient Music: ❌ Close Tab` command
- ✅ No configuration required for default usage

---

## 🚀 How to Use

### Automatic Playback

1. Install the extension from Marketplace
2. Open any folder/project in VS Code
3. A browser tab will auto-launch playing ambient music
4. You'll receive a confirmation notification

### Manual Controls

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


## 📁 Installation

Install from [**Visual Studio Code Marketplace**](https://marketplace.visualstudio.com/items?itemName=taj154dev.ambient-music-vs-extension).

> 💡 Want to close the music tab without shutting down the extension? Use the `Ambient Music: ❌ Close Tab` command.

---

## 🔗 Requirements

- VS Code version 1.80+
- Internet access for streaming

---

## 🐛 Support

Have feedback or issues?

- 📂 [GitHub Repository](https://github.com/taj54/ambient-music-vs-extension)
- 📧 Email: [tajulislamj200@gmail.com](mailto:tajulislamj200@gmail.com)

---

## 💼 License

[MIT License](LICENSE) © 2025 [Taj](https://github.com/taj54)

---

## 💬 Credits

Built with ❤️ by [Taj](https://github.com/taj54), inspired by a need for focus and flow while coding.

Special thanks to these amazing YouTube creators whose music powers the ambient experience:

- 🎧 [Dreamy Lofi](https://www.youtube.com/@Mellow_lofi)
- 🎧 [Chillhop Music](https://www.youtube.com/@ChillhopMusic)
- 🎧 [la vinyls](https://www.youtube.com/@lavinyls)
- 🎧 [SereneBeats](https://www.youtube.com/@SereneBeatsRelax)
- 🎧 [STEEZYASFUCK](https://www.youtube.com/@steezyasfvck)
- 🎧 [EasyLofiGrooves](https://www.youtube.com/@EasyLofiGrooves)
- 🎧 [Abao in Tokyo](https://www.youtube.com/@abaointokyo)
- 🎧 [The AMP Channel](https://www.youtube.com/@TheAMPProject)
- 🎧 [Lofi Girl](https://www.youtube.com/@LofiGirl)
- 🎧 [Chill Dev_ | Chill Music for Work & Study](https://www.youtube.com/@ChillDevIO)
- 🎧 [TheSilentWatcher](https://www.youtube.com/@TheSilentWatcher)
- 🎧 [Kai's Dojo](https://www.youtube.com/@KaisDojo31)
- 🎧 [Cafe Music BGM channel](https://www.youtube.com/@cafemusicbgmchannel)
- 🎧 [Chill Music Lab](https://www.youtube.com/@MusicLabChill)

> If you're one of these creators and would like your content removed or credited differently, please [open an issue](https://github.com/taj54/ambient-music-vs-extension/issues) or reach out.

## 🧰 Developer Guide

If you're interested in contributing or modifying this extension, check out the [**DEVELOPER_GUIDE.md**](./DEVELOPER_GUIDE.md) for setup instructions, architecture overview, packaging guide, and testing tips.

---

> ✨ _Focus better. Code deeper. Let your workspace sing._
