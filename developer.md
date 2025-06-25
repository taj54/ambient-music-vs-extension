# 🛠️ Developer Guide – Ambient Music VS Code Extension

This document helps you set up, build, run, and customize the Ambient Music AutoPlayer extension for Visual Studio Code.

---

## 📁 Project Structure

```
ambient-music-vs-extension/
├── .vscode/               # VS Code launch configs
├── media/                 # Extension icon/media (if any)
├── dist/                   # Compiled JavaScript output
├── src/                   # Source TypeScript files
│   └── extension.ts       # Main activation script
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
- A lofi music stream opens in your browser
- A toast notification appears in VS Code

---

## 🧠 How It Works

The extension activates on startup:

```ts
const musicURL = vscode.Uri.parse("https://www.youtube.com/watch?v=jfKfPfyJRdk");
vscode.env.openExternal(musicURL);
```

It also exposes a command:
- `Ambient Music: Play Ambient Music` – can be triggered manually from the Command Palette (`Ctrl+Shift+P`)

---

## 🎵 Customizing the Music Source

You can change the stream URL by modifying:

```ts
// src/extension.ts
const musicURL = vscode.Uri.parse("https://your.custom.url");
```

Then recompile:

```bash
npm run compile
```

---

## 📦 Packaging the Extension

To distribute the extension:

1. **Install `vsce`** (Visual Studio Code Extension Manager):

```bash
npm install -g vsce
```

2. **Create a `.vsix` file**:

```bash
vsce package
```

3. This generates a `.vsix` file you can:
   - Share with users
   - Install locally via `Extensions: Install from VSIX`
   - Publish to the [VS Code Marketplace](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

---

## 🧪 Testing Tips

- Ensure your internet connection is active (YouTube stream won't open offline).
- Use incognito mode or a different browser to test external link behavior.
- Use breakpoints in `extension.ts` to debug activation logic.

---

## 🧰 Dev Requirements

- Node.js v18 or newer
- VS Code v1.80+
- Internet access to stream music

---

## �� License

MIT License © 2025 [Tajul Islam](mailto:tajulislamj200@gmail.com)

---

## 🙌 Credits

- Music provided by [Lofi Girl](https://www.youtube.com/@lofigirl)

> *Make VS Code not just smart, but soothing.*

