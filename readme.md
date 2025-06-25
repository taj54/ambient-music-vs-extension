# 🎵 Ambient Music AutoPlayer for VS Code

> **Inspiration**  
> One day, I realized I had been feeling unproductive for several days. After a quick self-reflection, I discovered that watching TV series and movies in the background while coding was draining my focus and creativity. This insight inspired me to build a tool for myself—and for thousands of other developers who face similar distractions—to help us stay in the zone with relaxing ambient music.


Boost your focus and flow with ambient music that plays automatically when you open a project in Visual Studio Code.

---

## ✨ Features

- ✅ Auto-plays ambient music when you open a VS Code workspace
- ✅ Run manually from the Command Palette anytime
- ✅ Friendly notification on playback start
- ✅ No setup or configuration required

---

## 🚀 How to Use

### Automatic Playback

Once the extension is installed:

- Open any project folder in VS Code
- A browser tab will open with relaxing ambient music
- You’ll see a toast notification confirming it started

### Manual Playback

You can also trigger playback anytime:

- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Search for `Ambient Music: Play Ambient Music`
- Press Enter to play

---

## 📁 Installation

### Installation from Marketplace

You can install it directly from the VS Code Marketplace:

[**Ambient Music Extension – VS Code Marketplace**](https://marketplace.visualstudio.com/items?itemName=taj54dev.ambient-music-extension)

---

## 🎧 Custom Music (Advanced)

You can ask a developer to change the music source by editing the extension's code in:

```ts
// src/extension.ts
const musicURL = vscode.Uri.parse("https://your.custom.url");
```

After changing the URL, the extension must be recompiled.

---

## 🔗 Requirements

- Visual Studio Code v1.80 or newer
- Internet connection (for streaming)

---

## 🔖 Support

Have suggestions or issues? Visit the [GitHub repo](https://github.com/taj54/ambient-music-vs-extension) or email [tajulislamj200@gmail.com](mailto\:tajulislamj200@gmail.com)

---

## 💼 License

MIT License © 2025 Tajul Islam

---

## 💬 Credits

- Default stream by [Lofi Girl](https://www.youtube.com/@lofigirl)

> ✨ *Focus better. Code deeper. Let your workspace sing.*

