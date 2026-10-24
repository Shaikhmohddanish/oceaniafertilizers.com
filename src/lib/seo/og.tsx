import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

/*
 * Social share images. The site uses Arial, which cannot be bundled, so these
 * are drawn with Arimo: an open-licence typeface designed to match Arial.
 * Static TTF files in src/fonts/og (next/og cannot use woff2).
 */

export const OG_SIZE = { width: 1200, height: 630 };

const colors = {
  ground: '#0f1e17',
  ivory: '#f7f3ea',
  sage: '#b4bda7',
  gold: '#e2c988',
};

async function fonts() {
  const dir = path.join(process.cwd(), 'src', 'fonts', 'og');
  const [regular, bold] = await Promise.all([
    readFile(path.join(dir, 'arimo-400.ttf')),
    readFile(path.join(dir, 'arimo-700.ttf')),
  ]);
  return [
    { name: 'Arimo', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Arimo', data: bold, weight: 700 as const, style: 'normal' as const },
  ];
}

type ShareImageInput = {
  label: string;
  title: string;
  /** Optional pack shot from src/assets/products (file name only), shown on the right. */
  productImage?: string;
  /** Optional remote image URL (for example from the Sanity CDN), used when there is no local path. */
  imageUrl?: string;
  imageBackdrop?: string;
};

export async function shareImage({ label, title, productImage, imageUrl, imageBackdrop }: ShareImageInput) {
  let image: string | undefined = imageUrl;
  if (productImage) {
    // Scoped to the product folder so the build only traces those files.
    const file = await readFile(path.join(process.cwd(), 'src', 'assets', 'products', path.basename(productImage)));
    const type = productImage.endsWith('.png') ? 'image/png' : 'image/jpeg';
    image = `data:${type};base64,${file.toString('base64')}`;
  }

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: colors.ground, color: colors.ivory }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '64px 72px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'Arimo', fontWeight: 700, fontSize: 32, letterSpacing: 5 }}>OCEANIA</div>
            <div style={{ fontFamily: 'Arimo', fontWeight: 700, fontSize: 12, letterSpacing: 7, color: colors.gold, marginTop: 6 }}>FERTILIZERS</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'Arimo', fontWeight: 700, fontSize: 20, letterSpacing: 3, color: colors.gold, textTransform: 'uppercase' }}>{label}</div>
            <div
              style={{
                fontFamily: 'Arimo',
                fontWeight: 700,
                fontSize: title.length > 48 ? 52 : 62,
                lineHeight: 1.08,
                letterSpacing: -1.5,
                marginTop: 20,
                maxWidth: image ? 640 : 960,
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ fontFamily: 'Arimo', fontSize: 18, color: colors.sage }}>oceaniafertilizers.com</div>
        </div>
        {image ? (
          <div
            style={{
              display: 'flex',
              width: 420,
              height: '100%',
              background: imageBackdrop ?? colors.ivory,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" width={420} height={630} style={{ objectFit: imageBackdrop ? 'contain' : 'cover', width: 420, height: 630 }} />
          </div>
        ) : null}
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
