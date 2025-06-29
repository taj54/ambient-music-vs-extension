import { PlaylistItem } from '../interfaces';

export type PlaylistFilterOptions = {
  title?: string;
  tag?: string;
  channelName?: string;
  channelUrl?: string;
};

/**
 * Filters a playlist based on various optional criteria.
 * @param playlist - Full playlist array.
 * @param filters - Filter options.
 * @returns Filtered list of videos.
 */
export function filterPlaylist(
  playlist: PlaylistItem[],
  filters: PlaylistFilterOptions
): PlaylistItem[] {
  const { title, tag, channelName, channelUrl } = filters;

  return playlist.filter(item => {
    const itemTitle = item.title?.toLowerCase() || '';
    const itemTags = item.tags?.map(t => t.toLowerCase()) || [];
    const itemChannelName = item.channel?.name?.toLowerCase() || '';
    const itemChannelUrl = item.channel?.url?.toLowerCase() || '';

    const matchTitle = title ? itemTitle.includes(title.toLowerCase().trim()) : true;
    const matchTag = tag ? itemTags.includes(tag.toLowerCase().trim()) : true;
    const matchChannelName = channelName ? itemChannelName.includes(channelName.toLowerCase().trim()) : true;
    const matchChannelUrl = channelUrl ? itemChannelUrl.includes(channelUrl.toLowerCase().trim()) : true;

    return matchTitle && matchTag && matchChannelName && matchChannelUrl;
  });
}

