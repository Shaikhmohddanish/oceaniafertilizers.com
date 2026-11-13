import type { ImageAsset, VideoSource } from '@/content/types';

/** Player address: YouTube's privacy-enhanced domain with captions on, or Vimeo without tracking. */
export function embedSrc(video: VideoSource): string {
  return video.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1`
    : `https://player.vimeo.com/video/${video.id}?autoplay=1&dnt=1`;
}

/** The cover: the editor's own image, otherwise YouTube's thumbnail. */
export function videoPoster(video: VideoSource, poster?: ImageAsset): ImageAsset | undefined {
  if (poster) return poster;
  if (video.provider !== 'youtube') return undefined;
  return { src: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`, width: 480, height: 360, alt: '' };
}
