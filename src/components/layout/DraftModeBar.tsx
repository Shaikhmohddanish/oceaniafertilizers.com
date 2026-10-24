import { VisualEditing } from 'next-sanity/visual-editing';
import { draftMode } from 'next/headers';

/** Shown only to editors previewing unpublished changes from the Studio. */
export async function DraftModeBar() {
  if (!(await draftMode()).isEnabled) return null;
  return (
    <>
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-4 bg-botanical-950 px-4 py-3 text-ivory-50">
        <p className="type-small">Previewing unpublished changes</p>
        <a href="/api/draft-mode/disable" className="type-small font-semibold text-gold-300 underline">
          Exit preview
        </a>
      </div>
      <VisualEditing />
    </>
  );
}
