import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

/** Interim monogram for favicons: a bold "O" on forest green, matching the wordmark. Replace with the official logo mark. */
export async function monogram(size: number) {
  const font = await readFile(path.join(process.cwd(), 'src', 'fonts', 'og', 'arimo-700.ttf'));
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1e3a2b',
          color: '#f7f3ea',
          fontFamily: 'Arimo',
          fontWeight: 700,
          fontSize: size * 0.72,
          lineHeight: 1,
          paddingBottom: size * 0.06,
        }}
      >
        O
      </div>
    ),
    { width: size, height: size, fonts: [{ name: 'Arimo', data: font, weight: 700, style: 'normal' }] },
  );
}
