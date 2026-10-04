import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

/* ==========================================================================
   analyze-images.mjs — measure every photograph in the project.

   Serves the repo over HTTP (canvas cannot read file:// pixels), loads each
   image in headless Chrome, and reports the same numbers
   public/images/products/CREDITS.md was written from: natural size, backdrop
   luma sampled from a border ring, mean saturation, dominant colour and the
   share of near-white pixels.

   Usage:  node analyze-images.mjs [subdir ...]
   ========================================================================== */

const ROOT = 'C:\Users\takwa\Desktop\DIVA'
const CHROME = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
const PORT = 4199
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' }

/** Which folders to walk, and which product each file belongs to. */
const TARGETS = [
  { dir: path.join(ROOT, 'public', 'images', 'products'), group: 'catalogue' },
  { dir: path.join(ROOT, 'public', 'images', 'perfumes', 'women'), group: 'reference/women' },
  { dir: path.join(ROOT, 'public', 'images', 'perfumes', 'men'), group: 'reference/men' },
  { dir: path.join(ROOT, 'public', 'images', 'campaign'), group: 'campaign' },
  { dir: path.join(ROOT, 'src', 'images'), group: 'src master set' },
]

const server = http.createServer(async (req, res) => {
  const rel = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '')
  const file = path.join(ROOT, rel)
  if (!file.startsWith(ROOT)) return res.writeHead(403).end()
  try {
    const buf = await fs.readFile(file)
    res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' })
    res.end(buf)
  } catch {
    res.writeHead(404).end()
  }
})
await new Promise((r) => server.listen(PORT, r))

const browser = await puppeteer.launch({
  executablePath:CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()

const measure = (url) =>
  page.evaluate(async (src) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    await img.decode()

    const W = 160
    const H = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * W))
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, W, H)
    const { data } = ctx.getImageData(0, 0, W, H)

    const px = (x, y) => {
      const i = (y * W + x) * 4
      return [data[i], data[i + 1], data[i + 2]]
    }
    const toL = ([r, g, b]) => {
      const f = (v) => {
        v /= 255
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
      }
      const Y = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
      return (Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y) / 100
    }
    const toS = ([r, g, b]) => {
      const mx = Math.max(r, g, b) / 255
      const mn = Math.min(r, g, b) / 255
      return mx === 0 ? 0 : (mx - mn) / mx
    }
    const hex = ([r, g, b]) =>
      '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()

    // border ring = outer 7% of the frame, which is the studio sweep
    const R = Math.max(2, Math.round(W * 0.07))
    const ring = []
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (x < R || y < R || x >= W - R || y >= H - R) ring.push(px(x, y))
      }
    }
    // inner subject area = middle 50%, what the bottle itself looks like
    const inner = []
    const M = Math.round(W * 0.25)
    for (let y = M; y < H - M; y++) for (let x = M; x < W - M; x++) inner.push(px(x, y))

    const stat = (arr) => {
      const L = arr.map(toL)
      const S = arr.map(toS)
      return {
        L: L.reduce((a, b) => a + b, 0) / L.length,
        S: S.reduce((a, b) => a + b, 0) / S.length,
      }
    }

    // 5-bit-per-channel histogram for the dominant colour
    const bins = new Map()
    let white = 0
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const p = px(x, y)
        if (p[0] > 244 && p[1] > 244 && p[2] > 244) white++
        const key = p.map((v) => (v >> 3).toString(16)).join('')
        bins.set(key, (bins.get(key) || 0) + 1)
      }
    }
    const top = [...bins.entries()].sort((a, b) => b[1] - a[1])[0]
    const domHex = '#' + top[0].split('').map((h) => parseInt(h + '0', 16).toString(16).padStart(2, '0')).join('').toUpperCase()

    const r = stat(ring)
    const i = stat(inner)
    const all = stat([...Array(W * H).keys()].map((k) => px(k % W, Math.floor(k / W))))

    return {
      nw: img.naturalWidth,
      nh: img.naturalHeight,
      ratio: img.naturalWidth / img.naturalHeight,
      ringL: r.L,
      ringS: r.S,
      innerL: i.L,
      innerS: i.S,
      allL: all.L,
      allS: all.S,
      domHex,
      domPct: top[1] / (W * H),
      whitePct: white / (W * H),
    }
  }, url)

const pad = (v, n) => String(v).padEnd(n)
const num = (v, n, d = 1) => String(v.toFixed(d)).padStart(n)
const lumaToL = (v) => Math.round(v * 100)

const rows = []
for (const t of TARGETS) {
  let entries = []
  try {
    entries = (await fs.readdir(t.dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
  } catch {
    continue
  }
  for (const f of entries) {
    const rel = path.relative(ROOT, path.join(t.dir, f)).split(path.sep).join('/')
    const m = await measure(`http://localhost:${PORT}/${rel}`)
    rows.push({ group: t.group, file: f, rel, ...m })
  }
}

const head = ['group', 'file', 'size', 'ar', 'ringL', 'ringS', 'innerL', 'allL', 'allS', 'dom', 'dom%', 'white%', 'tone']
console.log(
  pad(head[0], 16) + pad(head[1], 34) + pad(head[2], 11) + pad(head[3], 6) + pad(head[4], 7) + pad(head[5], 7) + pad(head[6], 7) + pad(head[7], 7) + pad(head[8], 7) + pad(head[9], 9) + pad(head[10], 6) + pad(head[11], 7) + head[12],
)
console.log('-'.repeat(140))

let group = null
for (const r of rows) {
  if (r.group !== group) {
    group = r.group
    console.log(`\n### ${group}`)
  }
  // photoTone rule that matches the existing catalogue convention:
  // a high-key sweep is multiplied into the house plate, anything else fills
  const tone = r.ringL >= 0.72 && r.whitePct >= 0.12 ? 'light' : 'dark'
  console.log(
    pad(r.group, 16) +
      pad(r.file, 34) +
      pad(`${r.nw}x${r.nh}`, 11) +
      pad(r.ratio.toFixed(2), 6) +
      num(lumaToL(r.ringL), 5, 0) +
      pad(' ') +
      num(r.ringS.toFixed(2), 6, 2) +
      pad(' ') +
      num(lumaToL(r.innerL), 5, 0) +
      pad(' ') +
      num(lumaToL(r.allL), 5, 0) +
      pad(' ') +
      num(r.allS.toFixed(2), 6, 2) +
      pad(' ') +
      pad(r.domHex, 9) +
      num((r.domPct * 100).toFixed(0), 5) +
      pad('%') +
      num((r.whitePct * 100).toFixed(0), 5) +
      pad('%') +
      tone,
  )
}

console.log('-'.repeat(140))
console.log(`total images measured: ${rows.length}`)

const byTone = rows.reduce((a, r) => {
  const t = r.ringL >= 0.72 && r.whitePct >= 0.12 ? 'light' : 'dark'
  const k = `${r.group} ${t}`
  a[k] = (a[k] || 0) + 1
  return a
}, {})
for (const [k, v] of Object.entries(byTone)) console.log(`  ${pad(k, 34)} ${v}`)

const sizes = rows.filter((r) => r.nw < 400 || r.nh < 400)
if (sizes.length) {
  console.log(`\nunder 400px on one edge (will look soft): ${sizes.length}`)
  for (const r of sizes) console.log(`  ${r.rel}  ${r.nw}x${r.nh}`)
}

await browser.close()
server.close()
