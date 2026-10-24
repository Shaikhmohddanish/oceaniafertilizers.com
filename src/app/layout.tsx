import type { Viewport } from 'next';

/*
 * Root layout: the document shell only. Text is set in Arial, which visitors'
 * devices already have, so no web fonts are downloaded. Site styles are
 * imported by the (site) and (admin) layouts so the embedded Sanity Studio
 * keeps its own look.
 */
export const viewport: Viewport = {
  themeColor: '#f7f3ea',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
