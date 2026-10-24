import type { Metadata } from 'next';

import { LeadershipGrid } from '@/components/about/LeadershipGrid';
import { RichText } from '@/components/content/RichText';
import { PageHeader } from '@/components/layout/PageHeader';
import { Figure } from '@/components/media/Picture';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { getAboutPage } from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return pageMetadata({
    title: about.seo?.title ?? 'About Oceania Fertilizers',
    description: about.seo?.description ?? about.hero.standfirst,
    path: '/about',
  });
}

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <>
      <PageHeader
        variant="split"
        title={about.hero.headline}
        standfirst={about.hero.standfirst}
        image={about.hero.image}
        crumbs={[{ label: 'About', href: '/about' }]}
      />

      <section aria-labelledby="purpose-title" className="section-space bg-paper">
        <div className="container-site grid-site gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="purpose-title" className="type-h2 text-forest-900">
              {about.purpose.headline}
            </h2>
          </div>
          <RichText value={about.purpose.body} className="type-lead col-span-12 max-w-[34ch] text-ink-700 lg:col-span-7 lg:col-start-6" />
        </div>
      </section>

      <section aria-labelledby="approach-title" className="section-space bg-ivory-50">
        <div className="container-site">
          <div className="grid-site gap-y-6">
            <div className="col-span-12 lg:col-span-6">
              <h2 id="approach-title" className="type-h1 text-forest-900">
                {about.approach.headline}
              </h2>
            </div>
            <p className="type-lead col-span-12 text-ink-700 lg:col-span-4 lg:col-start-9 lg:self-end">{about.approach.intro}</p>
          </div>
          <ol className="mt-14 grid border-t border-[color:var(--line-strong)] sm:grid-cols-2 lg:grid-cols-4">
            {about.approach.steps.map((step, index) => (
              <li
                key={step.title}
                data-reveal="rise"
                style={{ ['--reveal-index' as string]: index }}
                className="border-b border-[color:var(--line)] py-8 sm:pr-8 lg:border-b-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-8"
              >
                <p className="type-numeral font-display text-[3rem] leading-none text-gold-500">{index + 1}</p>
                <h3 className="type-h3 mt-6 text-forest-900">{step.title}</h3>
                <p className="mt-3 text-ink-700">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="on-dark section-space bg-botanical-950 text-ivory-50">
        <div className="container-site grid-site gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="principles-title" className="type-h2">
              {about.principles.headline}
            </h2>
          </div>
          <dl className="col-span-12 lg:col-span-7 lg:col-start-6">
            {about.principles.items.map((item) => (
              <div key={item.title} className="grid gap-3 border-t border-[color:var(--line-on-dark)] py-7 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10">
                <dt className="font-display text-[1.375rem] leading-snug font-bold">{item.title}</dt>
                <dd className="text-sage-200">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {about.story ? (
        <section aria-labelledby="story-title" className="section-space bg-ivory-50">
          <div className="container-site grid-site gap-y-10">
            <div className="col-span-12 lg:col-span-5">
              <h2 id="story-title" className="type-h2 text-forest-900">
                {about.story.headline}
              </h2>
              <RichText value={about.story.body} className="type-body-lg mt-8 text-ink-700" />
            </div>
            {about.story.image ? (
              <Figure image={about.story.image} aspect="4 / 5" sizes="(min-width: 1024px) 45vw, 100vw" figureClassName="col-span-12 lg:col-span-6 lg:col-start-7" />
            ) : null}
          </div>
        </section>
      ) : null}

      {about.leadership.length > 0 ? (
        <section aria-labelledby="leadership-title" className="section-space bg-paper">
          <div className="container-site">
            <h2 id="leadership-title" className="type-h2 mb-14 text-forest-900">
              The people behind Oceania
            </h2>
            <LeadershipGrid members={about.leadership} />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="vision-title" className="section-space bg-ivory-100">
        <div className="container-site grid-site items-center gap-y-12">
          <Figure image={about.vision.image} aspect="3 / 2" sizes="(min-width: 1024px) 50vw, 100vw" figureClassName="col-span-12 lg:col-span-6" />
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <h2 id="vision-title" className="type-h2 text-forest-900">
              {about.vision.headline}
            </h2>
            <p className="type-lead mt-8 text-ink-700">{about.vision.body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="/products">See the products</ButtonLink>
              <TextLink href="/become-a-partner" className="text-forest-800">
                Partner with us
              </TextLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
