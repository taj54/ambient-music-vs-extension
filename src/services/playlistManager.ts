import { PlaylistItem } from "../interfaces";
import { toEmbedUrl } from "../utils";
import { validatePlaylist } from "../validators";
import { fileManager } from "./fileManager";

class PlaylistManager {
  private static instance: PlaylistManager;

  private richUserPlaylist: PlaylistItem[] = [];
  private embedUrls: string[] = [];
  private currentTrackIndex = 0;
  private isInitialized = false;

  private constructor() { }

  public static getInstance(): PlaylistManager {
    if (!PlaylistManager.instance) {
      PlaylistManager.instance = new PlaylistManager();
    }
    return PlaylistManager.instance;
  }

  private ensureInitialized() {
    if (!this.isInitialized) {
      const playlist = this.loadPlaylistFromFile();
      this.initializePlaylist(playlist);
      this.isInitialized = true;
    }
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
    // console.log( this.richUserPlaylist)
    this.embedUrls = data.map(item => toEmbedUrl(item.url));
    this.currentTrackIndex = 0;
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
    console.log(data); 
    const validated = validatePlaylist(data);
    console.log(validated);
    this.initializePlaylist(validated);
  }
}

export const playlistManager = PlaylistManager.getInstance();
