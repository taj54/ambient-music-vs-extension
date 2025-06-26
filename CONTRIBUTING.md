
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
npm install
```

### 3. Open in VS Code

Launch the project in VS Code and press `F5` to start the **Extension Development Host**.

---

## 🛠️ Development Tips

- **Main Entry**: `src/extension.ts`
- **Web UI**: `media/client.html` (YouTube player)
- **WebSocket Logic**: `src/webSocketManager.ts`
- **Server Logic**: `src/serverManager.ts`
- **Playlist Logic**: `src/playlist.ts`

Use `npm run compile` or enable TypeScript auto-compilation in VS Code.

---

## ✅ Before You Submit a PR

- Format your code with Prettier (if configured)
- Ensure existing functionality works
- Write or update relevant test cases
- Run `npm run compile` and check for build errors
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
  npm test
  ```

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct. By participating, you are expected to uphold this standard.

---

## 🙏 Thanks!

Whether you’re fixing a typo, reporting a bug, or building a new feature — your contribution matters!  
Let’s make coding more calming, together 🎵

— **Taj** ([@taj54](https://github.com/taj54))
