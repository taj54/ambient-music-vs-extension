import * as assert from 'assert';
import { suite, test } from 'mocha';
import { filterPlaylist } from '../../src/filters/playlistFilter';
import { PlaylistItem } from '../../src/interfaces';

const samplePlaylist: PlaylistItem[] = [
  {
    title: 'Rainy Day Lofi',
    url: 'https://youtube.com/watch?v=1',
    tags: ['lofi', 'rain'],
    channel: { name: 'Lofi Girl', url: 'https://youtube.com/lofigirl' },
  },
  {
    title: 'Forest Sounds',
    url: 'https://youtube.com/watch?v=2',
    tags: ['nature', 'forest'],
    channel: { name: 'Nature Sounds', url: 'https://youtube.com/naturesounds' },
  },
  {
    title: 'Ocean Waves',
    url: 'https://youtube.com/watch?v=3',
    tags: ['nature', 'ocean'],
    channel: { name: 'Nature Sounds', url: 'https://youtube.com/naturesounds' },
  },
];

suite('Playlist Filter Test Suite', () => {
  test('should filter by title', () => {
    const filtered = filterPlaylist(samplePlaylist, { title: 'Rainy' });
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].title, 'Rainy Day Lofi');
  });

  test('should filter by tag', () => {
    const filtered = filterPlaylist(samplePlaylist, { tag: 'nature' });
    assert.strictEqual(filtered.length, 2);
  });

  test('should filter by channel name', () => {
    const filtered = filterPlaylist(samplePlaylist, { channelName: 'Lofi Girl' });
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].channel.name, 'Lofi Girl');
  });

  test('should filter by channel url', () => {
    const filtered = filterPlaylist(samplePlaylist, { channelUrl: 'https://youtube.com/naturesounds' });
    assert.strictEqual(filtered.length, 2);
  });

  test('should return full playlist with no filters', () => {
    const filtered = filterPlaylist(samplePlaylist, {});
    assert.strictEqual(filtered.length, 3);
  });

  test('should filter by multiple criteria', () => {
    const filtered = filterPlaylist(samplePlaylist, { tag: 'nature', title: 'Ocean' });
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].title, 'Ocean Waves');
  });

  test('should return empty array for no matches', () => {
    const filtered = filterPlaylist(samplePlaylist, { title: 'Non Existent' });
    assert.strictEqual(filtered.length, 0);
  });
});
