# 🎵 Ambient Music AutoPlayer for VS Code


> **Inspiration**  
> One day, I realized I had been feeling unproductive for several days. After a quick self-reflection, I discovered that watching TV series and movies in the background while coding was draining my focus and creativity. This insight inspired me to build a tool for myself—and for thousands of other developers who face similar distractions—to help us stay in the zone with relaxing ambient music.


---

## 🆕 Version 1.2.0

Ambient music starts automatically with your project, and gently switches tracks every 30 minutes to keep your flow alive.

---

## ✨ Features

- ✅ Automatically plays ambient music when a workspace is opened
- ✅ Rotates to a new track every 30 minutes (configurable)
- ✅ Prevents multiple instances with singleton design
- ✅ Supports reconnecting WebSocket clients
- ✅ Manual play/pause/resume via Command Palette
- ✅ Easily set your own playlist via command
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

- `Ambient Music: ▶ Play`
- `Ambient Music: ⏸ Pause`
- `Ambient Music: ▶ Resume`
- `Ambient Music: 🌐 Open in Browser`
- `Ambient Music: 🎶 Set Playlist`

---

## 🔧 Configuration (Optional)

You can customize settings via your `settings.json` file:

```json
{
  "ambientMusic.port": 0, // 0 for dynamic port selection
  "ambientMusic.switchIntervalMinutes": 30, 
  "ambientMusic.playlist": [
    "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    "https://www.youtube.com/watch?v=5qap5aO4i9A"
  ]
}
```

> ℹ️ These settings allow you to personalize the experience without editing code.

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

Install directly from the [**Visual Studio Code Marketplace**](https://marketplace.visualstudio.com/items?itemName=taj54dev.ambient-music-extension).

---

## 🔗 Requirements

- VS Code version 1.80 or newer
- Internet access (for streaming YouTube audio)

---

## 🐛 Support

Have feedback or issues?

- 📂 [GitHub Repository](https://github.com/taj54/ambient-music-vs-extension)
- 📧 Email: [tajulislamj200@gmail.com](mailto:tajulislamj200@gmail.com)

---

## 💼 License

MIT License © 2025 [Tajul Islam](https://github.com/taj54)

---

## 💬 Credits

- Default music stream by [Lofi Girl](https://www.youtube.com/@lofigirl)

> ✨ _Focus better. Code deeper. Let your workspace sing._