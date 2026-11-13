'use client';

import { useState } from 'react';

import { OPlay } from '@/components/brand/OFrame';
import { Picture } from '@/components/media/Picture';
import type { FarmingVideo } from '@/content/types';
import { track } from '@/lib/analytics';
import { formatDuration } from '@/lib/format';
import { embedSrc, videoPoster } from '@/lib/video';

/**
 * The player on a video page. The cover shows until someone presses play;
 * only then is the YouTube or Vimeo player loaded. Nothing autoplays on arrival.
 */
export function InlineVideo({ video }: { video: Pick<FarmingVideo, 'id' | 'title' | 'video' | 'poster'> }) {
  const [playing, setPlaying] = useState(false);
  const poster = videoPoster(video.video, video.poster);

  function play() {
    setPlaying(true);
    track('video_play', { video: video.id });
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-pine-900">
      {playing ? (
        <iframe
          src={embedSrc(video.video)}
          title={`Video: ${video.title}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={play}
          className="group absolute inset-0 block h-full w-full text-left"
          aria-label={`Play video: ${video.title}${video.video.durationSeconds ? `, ${formatDuration(video.video.durationSeconds)}` : ''}`}
        >
          {poster ? <Picture image={poster} fill alt="" preload sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" /> : null}
          <span className="absolute bottom-5 left-5 flex items-center gap-3">
            <OPlay size="lg" />
            {video.video.durationSeconds ? (
              <span className="type-numeral type-small bg-pine-900/85 px-2 py-1 text-paper">{formatDuration(video.video.durationSeconds)}</span>
            ) : null}
          </span>
        </button>
      )}
    </div>
  );
}
