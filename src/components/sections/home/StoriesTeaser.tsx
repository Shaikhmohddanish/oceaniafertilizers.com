import { VideoStory } from '@/components/proof/VideoStory';
import { TextLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { HomePage, Testimonial } from '@/content/types';

/** Renders only once real, consented farmer stories are published. */
export function StoriesTeaser({ section, stories }: { section: HomePage['stories']; stories: Testimonial[] }) {
  if (stories.length === 0) return null;
  const [lead, ...rest] = [...stories].sort((a, b) => Number(b.featured) - Number(a.featured));
  if (!lead) return null;

  return (
    <section aria-labelledby="stories-teaser-title" className="section-space render-later bg-ivory-50">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div data-reveal="rise">
            <Eyebrow>{section.eyebrow}</Eyebrow>
            <h2 id="stories-teaser-title" className="type-h1 mt-6 max-w-[16ch] text-forest-900">
              <Lines text={section.headline} />
            </h2>
          </div>
          <TextLink href="/farmer-stories" className="text-forest-800">
            All farmer stories
          </TextLink>
        </div>
        <div className="grid-site mt-14 gap-y-14">
          <div className="col-span-12 lg:col-span-7">
            <VideoStory story={lead} size="feature" />
          </div>
          {rest.length > 0 ? (
            <div className="col-span-12 grid gap-12 sm:grid-cols-2 lg:col-span-4 lg:col-start-9 lg:grid-cols-1">
              {rest.slice(0, 2).map((story) => (
                <VideoStory key={story.id} story={story} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
