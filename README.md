# 🎵 Ambient Music AutoPlayer for VS Code

> **Inspiration**  
> One day, I realized I had been feeling unproductive for several days. After a quick self-reflection, I discovered that watching TV series and movies in the background while coding was draining my focus and creativity. This insight inspired me to build a tool for myself—and for thousands of other developers who face similar distractions—to help us stay in the zone with relaxing ambient music.

---

## 🆕 Version 1.2.47

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

- `ambient-taj: 🎶 Set Playlist` – Choose from relaxing playlists like Rain, Forest, Ocean, etc.
- `ambient-taj: 🌐 Open Ambient Music Tab` – Opens the ambient player tab inside VS Code.
- `ambient-taj: ▶ Play Ambient Music` – Begin playing the ambient track.
- `ambient-taj: ⏸ Pause Ambient Music` – Temporarily pause the current music.
- `ambient-taj: ▶ Resume Ambient Music` – Resume playback from where it was paused.
- `ambient-taj: ❌ Close Ambient Music Tab` – Close the music tab and stop playback.

---
> 💡 **Tip:** You can customize keybindings for these commands or use them in your automation workflows inside VS Code.

---

## 🔧 Configuration (Optional)

Customize settings via `settings.json`:

```json
{
  "ambientMusic.port": 0,
  "ambientMusic.switchIntervalMinutes": 30,
  "ambientMusic.playlist": [
    "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    "https://www.youtube.com/watch?v=5qap5aO4i9A"
  ]
}
```

> ℹ️ Use these to personalize your flow.

---

## 🎵 Custom Playlist

To replace the default music with your own:

1. Open Command Palette
2. Select `Ambient Music: Set Playlist`
3. Paste YouTube video URLs (comma-separated)

Example:
```
https://youtu.be/video1, https://youtu.be/video2
```

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

MIT License © 2025 [Taj](https://github.com/taj54)

---

## 💬 Credits

- Default music stream by [Lofi Girl](https://www.youtube.com/@lofigirl)
-- Built with ❤️ by [Taj](https://github.com/taj54)

## 🧰 Developer Guide

If you're interested in contributing or modifying this extension, check out the [**DEVELOPER_GUIDE.md**](./DEVELOPER_GUIDE.md) for setup instructions, architecture overview, packaging guide, and testing tips.

---

> ✨ _Focus better. Code deeper. Let your workspace sing._
