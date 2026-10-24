import { ButtonLink } from '@/components/ui/Button';

type EmptyStateProps = {
  title: string;
  /** Render the title as a heading when the empty state stands in for a section's content. */
  headingId?: string;
  body: string;
  action?: { label: string; href: string };
  note?: string;
};

/**
 * Shown where content will appear once real, approved entries exist. It says
 * honestly what is coming and offers a genuine next step.
 */
export function EmptyState({ title, headingId, body, action, note }: EmptyStateProps) {
  const Title = headingId ? 'h2' : 'p';
  return (
    <div className="grid-site border-y border-[color:var(--line-strong)] py-14 lg:py-20">
      <div className="col-span-12 lg:col-span-7">
        <Title id={headingId} className="type-h2 max-w-[20ch] text-forest-900">
          {title}
        </Title>
        <p className="type-body-lg mt-6 max-w-[52ch] text-ink-700">{body}</p>
      </div>
      <div className="col-span-12 mt-10 flex flex-col items-start justify-end gap-4 lg:col-span-4 lg:col-start-9 lg:mt-0">
        {action ? <ButtonLink href={action.href}>{action.label}</ButtonLink> : null}
        {note ? <p className="type-caption max-w-[36ch] text-ink-500">{note}</p> : null}
      </div>
    </div>
  );
}
