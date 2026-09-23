/**
 * regenerates every raster brand asset from inline svg sources.
 * run with `bun run assets` whenever the mark or the brand colour changes,
 * so the icons, the apple touch icon and the og image never drift apart.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

const BRAND = '#287bff'
const INK = '#0b1220'

/** the mark, drawn at whatever size is asked for. */
const mark = (size, { padded = false } = {}) => {
  const scale = padded ? 0.62 : 1
  const inner = size * scale
  const offset = (size - inner) / 2
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${padded ? `<rect width="${size}" height="${size}" fill="${BRAND}"/>` : ''}
      <g transform="translate(${offset} ${offset}) scale(${inner / 32})">
        ${padded ? '' : `<rect width="32" height="32" rx="9" fill="${BRAND}"/>`}
        <rect x="8" y="19" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.4"/>
        <rect x="8" y="14" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.7"/>
        <rect x="8" y="9" width="11" height="3" rx="1.5" fill="#ffffff"/>
        <circle cx="22.5" cy="10.5" r="2.5" fill="#ffffff"/>
      </g>
    </svg>`
}

/** 1200x630 social card. plain type on a flat background, no gradients. */
const ogCard = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#ffffff"/>
    <rect x="0" y="0" width="1200" height="8" fill="${BRAND}"/>

    <g transform="translate(80 92) scale(1.75)">
      <rect width="32" height="32" rx="9" fill="${BRAND}"/>
      <rect x="8" y="19" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.4"/>
      <rect x="8" y="14" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.7"/>
      <rect x="8" y="9" width="11" height="3" rx="1.5" fill="#ffffff"/>
      <circle cx="22.5" cy="10.5" r="2.5" fill="#ffffff"/>
    </g>

    <text x="148" y="126" font-family="Poppins, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="34" font-weight="600" fill="${INK}" letter-spacing="-1">updatebase</text>

    <text x="80" y="290" font-family="Poppins, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="78" font-weight="600" fill="${INK}" letter-spacing="-3">stop rewriting every</text>
    <text x="80" y="382" font-family="Poppins, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="78" font-weight="600" fill="${INK}" letter-spacing="-3">opportunity by hand</text>

    <text x="80" y="462" font-family="Manrope, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="30" font-weight="400" fill="#46536a">paste it once. branded, numbered and ready to send.</text>

    <rect x="80" y="516" width="286" height="58" rx="12" fill="${BRAND}"/>
    <text x="223" y="553" text-anchor="middle" font-family="Manrope, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="23" font-weight="600" fill="#ffffff">get early access</text>
  </svg>`

const targets = [
  { name: 'icons/icon-192.png', svg: mark(192), size: 192 },
  { name: 'icons/icon-512.png', svg: mark(512), size: 512 },
  { name: 'icons/icon-maskable-512.png', svg: mark(512, { padded: true }), size: 512 },
  { name: 'apple-touch-icon.png', svg: mark(180, { padded: true }), size: 180 },
  { name: 'og-image.png', svg: ogCard(), size: null },
]

await mkdir(join(publicDir, 'icons'), { recursive: true })

for (const target of targets) {
  const out = join(publicDir, target.name)
  const buffer = await sharp(Buffer.from(target.svg)).png({ compressionLevel: 9 }).toBuffer()
  await writeFile(out, buffer)
  console.log(`wrote ${target.name} (${(buffer.length / 1024).toFixed(1)} kb)`)
}
