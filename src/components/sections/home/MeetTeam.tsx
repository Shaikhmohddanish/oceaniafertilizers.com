import { LeadershipGrid } from '@/components/about/LeadershipGrid';
import { TextLink } from '@/components/ui/Button';
import type { LeadershipMember } from '@/content/types';

/**
 * Meet, when there is no farmer story yet: the accountable people behind
 * Oceania. Renders only once the client supplies real team details.
 */
export function MeetTeam({ members }: { members: LeadershipMember[] }) {
  if (members.length === 0) return null;
  return (
    <section aria-labelledby="meet-team-title" className="section-space render-later bg-surface">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal="rise">
          <h2 id="meet-team-title" className="type-h1 max-w-[14ch] text-pine-700">
            The people you will talk to.
          </h2>
          <TextLink href="/about" className="text-pine-700">
            About Oceania
          </TextLink>
        </div>
        <div className="mt-14">
          <LeadershipGrid members={members.slice(0, 3)} />
        </div>
      </div>
    </section>
  );
}
