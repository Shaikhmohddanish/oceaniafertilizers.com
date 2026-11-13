import Link from 'next/link';

import { OPlay } from '@/components/brand/OFrame';
import { Picture } from '@/components/media/Picture';
import { PendingTag } from '@/components/ui/PendingTag';
import type { FarmingVideo } from '@/content/types';
import { formatDuration } from '@/lib/format';
import { presenterLine } from '@/lib/learn';
import { videoPoster } from '@/lib/video';

/** A farmer video in a list: the cover with the O play mark, then the topic, title and who speaks. */
export function VideoCard({
  video,
  revealIndex = 0,
  headingLevel: Heading = 'h3',
}: {
  video: FarmingVideo;
  revealIndex?: number;
  headingLevel?: 'h2' | 'h3' | 'h4';
}) {
  const poster = videoPoster(video.video, video.poster);
  return (
    <article className="group relative" data-reveal="rise" style={{ ['--reveal-index' as string]: revealIndex }}>
      <div className="relative aspect-video overflow-hidden bg-pine-700">
        {poster ? (
          <Picture
            image={poster}
            fill
            alt=""
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : null}
        <span className="absolute bottom-4 left-4 flex items-center gap-3">
          <OPlay />
          {video.video.durationSeconds ? (
            <span className="type-numeral type-caption bg-pine-900/85 px-2 py-1 text-paper">
              {formatDuration(video.video.durationSeconds)}
            </span>
          ) : null}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {video.topic ? <p className="type-label text-clay-700">{video.topic.title}</p> : null}
        <PendingTag status={video.status} />
      </div>
      <Heading className="type-h3 mt-3 text-pine-700">
        <Link href={`/learn/videos/${video.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {video.title}
        </Link>
      </Heading>
      <p className="type-small mt-3 text-ink-700">{presenterLine(video)}</p>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 hidden outline-2 outline-clay-700 group-has-[a:focus-visible]:block"
      />
    </article>
  );
}
