// Lighthouse on the key pages, mobile and desktop, against a running server.
// Usage: BASE_URL=http://localhost:3100 node scripts/lighthouse.mjs
// Reports go to reports/lighthouse/; a summary prints at the end.
import { execFile } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);
const base = process.env.BASE_URL ?? 'http://localhost:3100';
const pages = (process.env.PAGES ?? '/,/products,/products/halad-special,/insights,/become-a-partner').split(',');
const presets = (process.env.PRESETS ?? 'mobile,desktop').split(',');
const outDir = 'reports/lighthouse';

await mkdir(outDir, { recursive: true });

// Warm the image optimiser first. In production the CDN serves these from cache,
// so a cold local optimiser would only measure its own start-up time.
for (const page of pages) {
  const html = await (await fetch(`${base}${page}`)).text();
  const urls = new Set(
    [...html.matchAll(/\/_next\/image\?[^"\s,]+/g)].map((match) => match[0].replaceAll('&amp;', '&')),
  );
  await Promise.all(
    [...urls].map((url) => fetch(`${base}${url}`, { headers: { accept: 'image/avif,image/webp,*/*' } }).then((r) => r.arrayBuffer())),
  );
}

const rows = [];
for (const preset of presets) {
  for (const page of pages) {
    const name = `${preset}-${page === '/' ? 'home' : page.replace(/^\//, '').replace(/\//g, '_')}`;
    const output = `${outDir}/${name}.json`;
    const args = [
      'lighthouse@13',
      `${base}${page}`,
      '--quiet',
      '--output=json',
      `--output-path=${output}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags=--headless=new --no-first-run',
      ...(preset === 'desktop' ? ['--preset=desktop'] : []),
    ];
    // Chrome occasionally fails to hand over its debugging socket; try again before giving up.
    for (let attempt = 1; ; attempt += 1) {
      try {
        await run('npx', args, { maxBuffer: 64 * 1024 * 1024 });
        break;
      } catch (error) {
        if (attempt >= 3) throw error;
        console.log(`${name}: attempt ${attempt} failed, retrying`);
      }
    }
    const report = JSON.parse(await readFile(output, 'utf8'));
    const score = (id) => Math.round((report.categories[id]?.score ?? 0) * 100);
    const audit = (id) => report.audits[id]?.displayValue ?? '';
    rows.push({
      page: `${preset} ${page}`,
      performance: score('performance'),
      accessibility: score('accessibility'),
      bestPractices: score('best-practices'),
      seo: score('seo'),
      lcp: audit('largest-contentful-paint'),
      cls: audit('cumulative-layout-shift'),
      tbt: audit('total-blocking-time'),
      fcp: audit('first-contentful-paint'),
    });
    console.log(`${name}: done`);
  }
}

console.table(rows);
