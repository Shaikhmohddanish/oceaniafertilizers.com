/**
 * Shown on development and preview builds only. Explains the pending markers
 * so a client review never mistakes unapproved content for final content.
 */
export function PreviewNotice() {
  return (
    <div className="border-b border-[color:var(--line)] bg-ivory-100">
      <p className="container-site type-caption flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1 py-2 text-ink-700">
        <span className="type-label text-gold-700">Preview build</span>
        <span>
          Items marked Pending approval are not yet confirmed by Oceania and are hidden on the live site.
        </span>
      </p>
    </div>
  );
}
