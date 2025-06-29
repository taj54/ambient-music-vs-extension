import { filterPlaylist, PlaylistFilterOptions } from "../filters";
import { PlaylistItem } from "../interfaces";
import { logger, toEmbedUrl } from "../utils";
import { validatePlaylist } from "../validators";
import { fileManager } from "./fileManager";

class PlaylistManager {
  private static instance: PlaylistManager;

  private richUserPlaylist: PlaylistItem[] = [];
  private embedUrls: string[] = [];
  private currentTrackIndex = 0;
  private isInitialized = false;
  private isUserHavePlaylist = false;

  private constructor() { }

  public static getInstance(): PlaylistManager {
    if (!PlaylistManager.instance) {
      PlaylistManager.instance = new PlaylistManager();
    }
    return PlaylistManager.instance;
  }

  private ensureInitialized() {
    if (this.isInitialized) return;

    if (!this.isUserHavePlaylist) {
      const playlist = this.loadPlaylistFromFile();
      this.initializePlaylist(playlist);
    }
    this.isInitialized = true;
  }

  private loadPlaylistFromFile(): PlaylistItem[] {
    try {
      const rawJson = fileManager.readMediaFile("playlist.json");
      const parsed = JSON.parse(rawJson);
      return validatePlaylist(parsed);
    } catch (e) {
      console.error("Failed to load or validate playlist.json:", e);
      return [];
    }
  }

  public loadPlaylistWhenReady(): void {
    const playlist = this.loadPlaylistFromFile();
    this.initializePlaylist(playlist);
  }


  private initializePlaylist(data: PlaylistItem[]) {
    this.richUserPlaylist = data;
    console.log(this.richUserPlaylist);

    this.embedUrls = data.map(item => toEmbedUrl(item.url));
    this.currentTrackIndex = 0;
  }
  
  public resetPlaylist(): void {
    const defaultPlaylist = this.loadPlaylistFromFile();
    this.isUserHavePlaylist = false;
    this.isInitialized = true;
    this.initializePlaylist(defaultPlaylist);
   logger.debug("✅ Playlist has been reset to default.");
  }



  public getPlaylist(): string[] {
    return this.embedUrls;
  }

  public getCurrentTrack(): string {
    this.ensureInitialized();
    return this.embedUrls.length > 0
      ? this.embedUrls[this.currentTrackIndex % this.embedUrls.length]
      : "";
  }

  public getNextTrack(): string {
    if (this.embedUrls.length === 0) return "";
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.embedUrls.length;
    return this.getCurrentTrack();
  }

  public getCurrentTrackMetadata(): PlaylistItem | null {
    return this.richUserPlaylist.length > 0
      ? this.richUserPlaylist[this.currentTrackIndex % this.richUserPlaylist.length]
      : null;
  }

  public updateUserPlaylist(data: PlaylistItem[]): void {

    const validated = validatePlaylist(data);
    this.isInitialized = true;
    this.isUserHavePlaylist = true;
    this.initializePlaylist(validated);
  }
  public filterByOptions(filters: PlaylistFilterOptions): PlaylistItem[] {
    return filterPlaylist(this.richUserPlaylist, filters);
  }

  public getAvailableTags(): string[] {
    const allTags = this.richUserPlaylist.flatMap(item => item.tags || []);
    const uniqueTags = [...new Set(allTags.map(tag => tag.trim().toLowerCase()))];
    return uniqueTags.sort();

  }

}

export const playlistManager = PlaylistManager.getInstance();
