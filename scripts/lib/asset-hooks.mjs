// Node module hooks used by scripts that import the content seed outside Next.js.
// Image imports become { src: absolute path, width, height }, mirroring Next's
// static image imports closely enough for scripts.
import { fileURLToPath } from 'node:url';

const IMAGE = /\.(jpe?g|png|webp|avif)$/i;

export async function load(url, context, nextLoad) {
  if (IMAGE.test(url)) {
    const filePath = fileURLToPath(url);
    const { default: sharp } = await import('sharp');
    const meta = await sharp(filePath).metadata();
    const value = { src: filePath, width: meta.width ?? 0, height: meta.height ?? 0 };
    return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify(value)};` };
  }
  if (url.endsWith('/server-only/index.js')) {
    return { format: 'module', shortCircuit: true, source: 'export {};' };
  }
  return nextLoad(url, context);
}
