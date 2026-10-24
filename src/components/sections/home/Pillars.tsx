/** The three client statements, set as a hairline index directly under the hero. */
export function Pillars({ items }: { items: string[] }) {
  return (
    <section aria-label="What Oceania does" className="bg-ivory-50">
      <div className="container-site">
        <ol className="grid border-b border-[color:var(--line)] md:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item}
              data-reveal="rise"
              style={{ ['--reveal-index' as string]: index }}
              className="border-t border-[color:var(--line)] py-7 md:border-t-0 md:py-10 md:pr-8 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-8"
            >
              <p className="font-display text-[1.375rem] leading-[1.3] text-ink-900 lg:text-[1.5rem]">{item}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
