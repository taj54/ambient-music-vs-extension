const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const vsixName = `${packageJson.name}-${packageJson.version}.vsix`;
const vsixPath = path.join(__dirname, '..', vsixName);
const vsceCli = path.join(__dirname, '..', 'node_modules', '@vscode', 'vsce', 'vsce');
const codeCommand = process.platform === 'win32'
  ? path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'bin', 'code.cmd')
  : 'code';

const packageResult = spawnSync(
  process.execPath,
  [vsceCli, 'package', '--no-dependencies', '--out', vsixPath],
  { cwd: path.join(__dirname, '..'), stdio: 'inherit' }
);

if (packageResult.status !== 0) {
  process.exit(packageResult.status ?? 1);
}

if (process.argv[2] === 'install') {
  const installArgs = ['--install-extension', vsixPath, '--force'];
  const installResult = process.platform === 'win32'
    ? spawnSync(
      process.env.ComSpec || 'cmd.exe',
      ['/d', '/c', 'call', codeCommand, ...installArgs],
      { cwd: path.join(__dirname, '..'), stdio: 'inherit' }
    )
    : spawnSync(
      codeCommand,
      installArgs,
      { cwd: path.join(__dirname, '..'), stdio: 'inherit' }
    );

  if (installResult.error) {
    console.error(`Failed to launch VS Code CLI: ${installResult.error.message}`);
    process.exit(1);
  }

  process.exit(installResult.status ?? 1);
}
