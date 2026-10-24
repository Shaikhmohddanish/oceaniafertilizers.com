'use client';

/**
 * Last-resort error page, used when the root layout itself fails. Styles are
 * inline because the site stylesheet may not have loaded.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, background: '#f7f3ea', color: '#1a1d18', fontFamily: 'Georgia, serif' }}>
        <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a5c1c' }}>
            Oceania Fertilizers
          </p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 400, lineHeight: 1.1, margin: '1.5rem 0' }}>Something went wrong.</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '1.0625rem', lineHeight: 1.6 }}>
            The website could not load this page. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '2rem',
              minHeight: '3rem',
              padding: '0 1.5rem',
              border: 0,
              borderRadius: 2,
              background: '#1e3a2b',
              color: '#f7f3ea',
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.9375rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
