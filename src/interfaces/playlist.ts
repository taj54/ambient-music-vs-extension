/**
 * PlaylistItem represents a single YouTube track entry for the ambient music VS Code extension.
 * 
 * Structure:
 * - title: The display name of the track
 * - url: The direct YouTube watch URL
 * - tags: Array of descriptive tags (e.g., genre, mood)
 * - channel: The publishing channel’s name and url
 */
export interface PlaylistItem {
  title: string;
  url: string;
  tags?: string[];
  channel?: {
    name: string;
    url: string;
  };
}
