# 🎧 Ambient Music AutoPlayer (VS Code Extension)

Boost your focus and flow with ambient music that plays automatically when you open a project in Visual Studio Code.

---

## ✨ Features

- ✅ Auto-plays lofi/ambient music on project startup  
- ✅ Manual command to toggle ambient music from Command Palette  
- ✅ Friendly status notifications  
- ✅ Lightweight and zero config

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/taj54/ambient-music-vs-extension.git
cd ambient-music-extension
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Extension
```bash
npm run compile
```

### 4. Run in Development Mode
Press `F5` in VS Code to open a new Extension Development Host.

You’ll see:
- 🎶 Your lofi music opens in the browser
- 🍅 A toast notification appears

---

## 🧠 How It Works

On activation (`onStartupFinished`), the extension opens a YouTube lofi stream in your browser:

```ts
const musicURL = vscode.Uri.parse("https://www.youtube.com/watch?v=jfKfPfyJRdk");
vscode.env.openExternal(musicURL);
```

You can also run `Ambient Music: Play Ambient Music` from the Command Palette to trigger it manually.

---

## 🛠 Configuration

No configuration is required.  
To use a **custom music link**, edit `src/extension.ts`:

```ts
const musicURL = vscode.Uri.parse("https://your.custom.url");
```

Then recompile:
```bash
npm run compile
```

---

## 📦 Packaging for Distribution

Make sure `vsce` is installed:

```bash
npm install -g vsce
```

Then run:
```bash
vsce package
```

This will create a `.vsix` file you can install or share.

---

## 📌 Requirements

- Node.js (v18 or newer recommended)
- Visual Studio Code 1.80+
- Internet connection to stream music

---

## 🔖 License

MIT License © 2025 [taj](tajulislamj200@gmail.com)

---

## 💬 Credits

Default music provided by [Lofi Girl](https://www.youtube.com/@lofigirl)

---

> 💡 *Improve focus. Eliminate friction. Let your workspace sing.*
