import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Ambient Music Extension Test Suite', () => {
  vscode.window.showInformationMessage('Running Ambient Music Tests...');

  test('Sample test - openCommand should be registered', () => {
    const command = 'ambientMusic.open';
    const found = vscode.commands.getCommands(true).then(commands => {
      assert.ok(commands.includes(command), `Command ${command} not found`);
    });
  });
});
