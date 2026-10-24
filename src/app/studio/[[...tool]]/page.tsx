import { isSanityConfigured } from '@/sanity/env';

import { Studio } from './Studio';

export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

/** The content studio. Without a Sanity project it explains how to connect one. */
export default function StudioPage() {
  if (isSanityConfigured) return <Studio />;

  return (
    <main style={{ maxWidth: '44rem', margin: '0 auto', padding: '5rem 1.5rem', fontFamily: 'Arial, Helvetica, sans-serif', color: '#1a1d18', lineHeight: 1.6 }}>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a5c1c' }}>Content studio</p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: '2.5rem', lineHeight: 1.1, margin: '1rem 0 1.5rem' }}>
        The studio is not connected yet.
      </h1>
      <p>
        The website is currently showing the content bundled with the code. To edit content here, connect a Sanity project:
      </p>
      <ol>
        <li>Create a project at sanity.io/manage and note its project ID.</li>
        <li>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code> in the environment, then redeploy.
        </li>
        <li>
          Run <code>npm run sanity:seed</code> once to load the current content into the project.
        </li>
      </ol>
      <p>The full steps are in docs/handover/cms-guide.md.</p>
    </main>
  );
}
