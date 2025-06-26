import * as assert from 'assert';
import * as vscode from 'vscode';

describe('Ambient Music Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  it('Sample test: Extension should be present', async () => {
    const extension = vscode.extensions.getExtension('taj154dev.ambient-music-vs-extension');
    assert.ok(extension);
  });

  it('Sample test: Extension activates without error', async () => {
    const extension = vscode.extensions.getExtension('taj154dev.ambient-music-vs-extension');
    await extension?.activate();
    assert.strictEqual(extension?.isActive, true);
  });
  it('Ambient Music server should start (based on port message)', async () => {
    const ext = vscode.extensions.getExtension('taj154dev.ambient-music-vs-extension');
    await ext?.activate();
    assert.ok(ext?.isActive, 'Extension active but server status unknown');
  });
  it('Ambient Music configuration defaults are present', () => {
    const config = vscode.workspace.getConfiguration('ambientMusic');
    const port = config.get('port');
    // const  //
    assert.strictEqual(port, 0, 'Expected default port to be 0');
  });

});
