
export const defaultPlaylist = [
  "https://www.youtube.com/embed/jfKfPfyJRdk?enablejsapi=1",
  "https://www.youtube.com/embed/DWcJFNfaw9c?enablejsapi=1",
  "https://www.youtube.com/embed/kgx4WGK0oNU?enablejsapi=1"
];

let userPlaylist: string[] = [];

export function toEmbedUrl(url: string): string {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/);
  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}?enablejsapi=1`;
  }
  return url;
}

export function loadUserPlaylistFromConfig(playlist:any) {
  const raw = playlist;
  if (Array.isArray(raw)) {
    userPlaylist = raw.map(toEmbedUrl);
  }
}

export function getPlaylist(): string[] {
  return userPlaylist.length > 0 ? userPlaylist : defaultPlaylist;
}

export function getCurrentTrack(): string {
  const list = getPlaylist();
  return list[currentTrackIndex % list.length];
}

let currentTrackIndex = 0;

export function nextTrack(): string {
  const list = getPlaylist();
  currentTrackIndex = (currentTrackIndex + 1) % list.length;
  return getCurrentTrack();
}

export function updateUserPlaylist(urls: string[]) {
  userPlaylist = urls.map(toEmbedUrl);
  currentTrackIndex = 0;
}
