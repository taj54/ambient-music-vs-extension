/**
 * Converts a YouTube watch URL to an embeddable URL format.
 */
export function toEmbedUrl(url: string): string {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/);
  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}?enablejsapi=1`;
  }
  return url;
}
