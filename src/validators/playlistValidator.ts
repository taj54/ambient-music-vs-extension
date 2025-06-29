import { PlaylistItem } from "../interfaces";
import { logger } from "../utils";

function isValidUrl(url: string): boolean {
  return /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/.test(url);
}

export function validatePlaylist(data: any): PlaylistItem[] {
  if (!Array.isArray(data)) {
    throw new Error("Playlist must be an array.");
  }
 
  const hasObject = data.some(item => typeof item === 'object' && item !== null);
  if(!data && !hasObject){
        throw new Error("Playlist must be contain play object");
  }

  const validated: PlaylistItem[] = [];

  data.forEach((item, index) => {
    const errors: string[] = [];
    
    if (!item.title || typeof item.title !== "string") {
      errors.push("Missing or invalid 'title'");
    }

    if (!item.url || typeof item.url !== "string" || !isValidUrl(item.url)) {
      errors.push("Missing or invalid 'url'");
    }

    if (!Array.isArray(item.tags) || item.tags.some((tag: string) => typeof tag !== "string")) {
      errors.push("Missing or invalid 'tags'");
    }

    if (
      !item.channel ||
      typeof item.channel.name !== "string" ||
      typeof item.channel.url !== "string"
    ) {
      errors.push("Missing or invalid 'channel'");
    }

    if (errors.length > 0) {
      logger.error(`❌ Invalid playlist item at index ${index}: ${errors.join(", ")}`)
    } else {
      validated.push(item);
    }
  });

  return validated;
}
