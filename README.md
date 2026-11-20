# Ambient Music AutoPlayer for VS Code

Bring a little calm to your coding sessions. Ambient Music AutoPlayer plays a curated ambient playlist while you work, with tracks rotating automatically so you can stay focused without managing the music yourself.

[![Marketplace version](https://vsmarketplacebadges.dev/version-short/taj154dev.ambient-music-vs-extension.svg)](https://marketplace.visualstudio.com/items?itemName=taj154dev.ambient-music-vs-extension)
[![Installs](https://vsmarketplacebadges.dev/installs-short/taj154dev.ambient-music-vs-extension.svg)](https://marketplace.visualstudio.com/items?itemName=taj154dev.ambient-music-vs-extension)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/taj154dev.ambient-music-vs-extension.svg)](https://marketplace.visualstudio.com/items?itemName=taj154dev.ambient-music-vs-extension)
[![Tests](https://github.com/taj54/ambient-music-vs-extension/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/taj54/ambient-music-vs-extension/actions/workflows/test.yml)
[![License](https://img.shields.io/github/license/taj54/ambient-music-vs-extension)](LICENSE)

## Get started

1. [Install Ambient Music AutoPlayer](https://marketplace.visualstudio.com/items?itemName=taj154dev.ambient-music-vs-extension).
2. Open a workspace in VS Code.
3. The extension starts the local player and opens it in a Chrome window.

Automatic playback is enabled by default. Chrome must be installed for the player window to open. You can turn off automatic startup with the `ambientMusic.autoPlayOnStartup` setting.

The extension uses one shared local server for all VS Code windows. Additional windows connect to that server instead of starting duplicate player instances.

## Features

- Start ambient music when VS Code launches.
- Rotate through tracks every 30 minutes by default.
- Control playback from the Ambient Music sidebar or the Command Palette.
- Filter the playlist by tag or provide your own playlist in settings.
- Avoid launching duplicate players when multiple VS Code windows are open.

### Sidebar controls

Select the music-note icon in the VS Code Activity Bar to open the Ambient Music sidebar. The sidebar shows the current track and playlist, with controls to play or pause, skip tracks, seek, and adjust volume. Select the speaker icon to mute or unmute; muting sets the volume to zero, and unmuting restores the previous volume.

Use the small browser icon in the sidebar header to open or close the player window. Opening the sidebar also opens the player.

## Commands

Open the Command Palette with `Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on macOS, then search for one of these commands:

| Command | What it does |
| --- | --- |
| `ambient-taj: 🌐 Open Ambient Music Player` | Opens the player. |
| `ambient-taj: ▶️ Play Ambient Music` | Starts playback. |
| `ambient-taj: ⏸️ Pause Music` | Pauses playback. |
| `ambient-taj: ⏯ Resume Music` | Resumes playback. |
| `ambient-taj: 🎶 Set Playlist (Rain, Forest, Ocean...)` | Filters the playlist by a tag. |
| `ambient-taj: 🔄 Reset Playlist to Default` | Restores the default playlist. |
| `ambient-taj: ❌ Close Music Player` | Closes the player and stops its local server. |

## Settings

These settings are available in VS Code Settings or your `settings.json`:

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `ambientMusic.autoPlayOnStartup` | `boolean` | `true` | Start ambient music when VS Code launches. |
| `ambientMusic.port` | `number` | `3303` | Local server port. Set to `0` to choose an available port automatically. |
| `ambientMusic.switchIntervalMinutes` | `number` | `30` | Minutes between playlist rotations. |
| `ambientMusic.debug` | `boolean` | `false` | Enable verbose logging in the Ambient Music output channel. |
| `ambientMusic.playlist` | `array` | `[]` | Use a custom playlist. Each item needs a title, YouTube watch URL, tags, and channel details. |

### Custom playlist example

Add a playlist to your VS Code `settings.json`. YouTube URLs must use the `youtube.com/watch?v=...` format.

```json
{
  "ambientMusic.playlist": [
    {
      "title": "Lofi hip hop radio",
      "url": "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      "tags": ["lofi", "focus"],
      "channel": {
        "name": "Lofi Girl",
        "url": "https://www.youtube.com/@LofiGirl"
      }
    }
  ]
}
```

## Requirements

- VS Code 1.80 or later.
- Google Chrome installed to open the player window.
- An internet connection to stream YouTube videos.

## Support

Found a problem or have an idea? [Open an issue](https://github.com/taj54/ambient-music-vs-extension/issues) or visit the [GitHub repository](https://github.com/taj54/ambient-music-vs-extension).

## Credits

Built by [Taj](https://github.com/taj54) to make it easier to find a little focus and flow while coding. Music in the default playlist is provided by these creators:

- [Dreamy Lofi](https://www.youtube.com/@Mellow_lofi)
- [Chillhop Music](https://www.youtube.com/@ChillhopMusic)
- [la vinyls](https://www.youtube.com/@lavinyls)
- [SereneBeats](https://www.youtube.com/@SereneBeatsRelax)
- [STEEZYASFUCK](https://www.youtube.com/@steezyasfvck)
- [EasyLofiGrooves](https://www.youtube.com/@EasyLofiGrooves)
- [Abao in Tokyo](https://www.youtube.com/@abaointokyo)
- [The AMP Channel](https://www.youtube.com/@TheAMPProject)
- [Lofi Girl](https://www.youtube.com/@LofiGirl)
- [Chill Dev_](https://www.youtube.com/@ChillDevIO)
- [TheSilentWatcher](https://www.youtube.com/@TheSilentWatcher)
- [Kai's Dojo](https://www.youtube.com/@KaisDojo31)
- [Cafe Music BGM channel](https://www.youtube.com/@cafemusicbgmchannel)
- [Chill Music Lab](https://www.youtube.com/@MusicLabChill)

If you're a credited creator and would like a change, please [open an issue](https://github.com/taj54/ambient-music-vs-extension/issues).

## Contributing

See the [Developer Guide](DEVELOPER.md) for setup, architecture, packaging, and testing instructions.

## License

[MIT](LICENSE) © [Taj](https://github.com/taj54)
