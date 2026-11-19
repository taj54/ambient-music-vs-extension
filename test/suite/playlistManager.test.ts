import * as assert from 'assert';
import * as sinon from 'sinon';
import { suite, test, afterEach, beforeEach } from 'mocha';
import { playlistManager } from '../../src/services/playlistManager';
import { fileManager } from '../../src/services/fileManager';

suite('Playlist Manager Test Suite', () => {

  afterEach(() => {
    sinon.restore();
  });

  test('loadPlaylistFromFile should return an empty array on file read error', () => {
    const readMediaFileStub = sinon.stub(fileManager, 'readMediaFile').throws(new Error('File not found'));

    const result = (playlistManager as any).loadPlaylistFromFile();
    assert.deepStrictEqual(result, []);
    assert.ok(readMediaFileStub.calledOnceWith('playlist.json'));
  });

  test('loadPlaylistFromFile should return an empty array on JSON parse error', () => {
    const readMediaFileStub = sinon.stub(fileManager, 'readMediaFile').returns('invalid json');

    const result = (playlistManager as any).loadPlaylistFromFile();
    assert.deepStrictEqual(result, []);
    assert.ok(readMediaFileStub.calledOnceWith('playlist.json'));
  });

  test('loadPlaylistWhenReady should expose a configured playlist immediately', () => {
    const configuredPlaylist = [{
      title: 'Configured ambient track',
      url: 'https://www.youtube.com/watch?v=WH0lsTxcw4w',
      tags: [],
      channel: { name: 'Ambient Channel', url: 'https://www.youtube.com/@ambient' }
    }];

    playlistManager.loadPlaylistWhenReady(configuredPlaylist);

    assert.deepStrictEqual(playlistManager.getPlaylistMetadata(), configuredPlaylist);
    assert.deepStrictEqual(playlistManager.getCurrentTrackMetadata(), configuredPlaylist[0]);
  });
});
