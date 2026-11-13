'use client';

/**
 * Last-resort error page, used when the root layout itself fails. Styles are
 * inline because the site stylesheet may not have loaded.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, background: '#f5f1e8', color: '#1d2330', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#8a4f24' }}>
            Oceania Fertilizers
          </p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', margin: '1.5rem 0', color: '#24483c' }}>Something went wrong.</h1>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.6 }}>
            The website could not load this page. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '2rem',
              minHeight: '3rem',
              padding: '0 1.5rem',
              border: '1px solid #b06f3c',
              borderRadius: 2,
              background: '#edb58a',
              color: '#1d2330',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 700,
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
