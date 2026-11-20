
# 🙌 Contributing to Ambient Music VS Code Extension

Thank you for considering contributing to the **Ambient Music VS Code Extension**! Your help makes this project better for thousands of developers looking to stay focused and productive.

---

## 📦 How to Contribute

### 1. Fork the Repository

Click the **Fork** button in the top-right corner of the [GitHub repo](https://github.com/taj54/ambient-music-vs-extension), and clone your fork locally:

```bash
git clone https://github.com/taj54/ambient-music-vs-extension.git
cd ambient-music-vs-extension
```

### 2. Install Dependencies

```bash
corepack enable
corepack pnpm install
```

### 3. Open in VS Code

Launch the project in VS Code and press `F5` to start the **Extension Development Host**.

---

## 🛠️ Development Tips

- **Main entry**: `src/extension.ts`
- **Web UI**: `media/client.html`
- **Sidebar**: `src/sidebarController.ts`
- **WebSocket logic**: `src/services/webSocketManager.ts`
- **Server logic**: `src/services/serverManager.ts`
- **Playlist logic**: `src/services/playlistManager.ts`
- **Build config**: `tsup.config.ts`

Use `pnpm run compile` before packaging or testing.

---

## ✅ Before You Submit a PR

- Follow the existing TypeScript style and keep changes focused
- Ensure existing functionality works
- Write or update relevant test cases
- Run `pnpm run compile` and check for build errors
- Run `pnpm test`
- Describe your changes clearly in the PR message

---

## 🚀 Good First Issues

Check out the [Issues Tab](https://github.com/taj54/ambient-music-vs-extension/issues) for tasks marked with:

- `good first issue`
- `help wanted`

---

## 🧪 Testing

- Test your changes via Extension Development Host (`F5`)
- Watch logs in VS Code terminal for output
- To run tests:
  ```bash
  pnpm test
  ```

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct. By participating, you are expected to uphold this standard.

---

## 🙏 Thanks!

Whether you’re fixing a typo, reporting a bug, or building a new feature — your contribution matters!  
Let’s make coding more calming, together 🎵

— **Taj** ([@taj54](https://github.com/taj54))
