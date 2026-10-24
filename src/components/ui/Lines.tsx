/**
 * Renders text with deliberate line breaks. Editors add a new line in the CMS
 * where a heading should break; each line is then set on its own.
 */
export function Lines({ text }: { text: string }) {
  const lines = text.split('\n').filter(Boolean);
  if (lines.length <= 1) return <>{text}</>;
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </>
  );
}

/** Plain text of a heading with line breaks, for metadata and accessible names. */
export function flattenLines(text: string): string {
  return text.replace(/\s*\n\s*/g, ' ').trim();
}
