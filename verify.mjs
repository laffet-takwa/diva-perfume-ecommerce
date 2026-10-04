import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:4180'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})

/* ---- 1. every product image actually loads, across every listing route ---- */
const seen = new Map()
const routes = ['/perfumes', '/perfumes/women', '/perfumes/men', '/perfumes/unisex', '/collections']

for (const route of routes) {
  const page = await browser.newPage()
  const failed = []
  page.on('requestfailed', (r) => failed.push(r.url()))
  const responses = []
  page.on('response', (r) => {
    if (/\/images\/products\//.test(r.url())) responses.push([r.status(), r.url()])
  })
  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2' })
  await sleep(2200)
  // scroll the whole page so lazy images enter the viewport
  await page.evaluate(async () => {
    const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
  })
  await sleep(1500)

  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter((i) => i.src.includes('/images/products/'))
      .map((i) => ({ src: i.src.split('/').pop(), w: i.naturalWidth, blend: getComputedStyle(i).mixBlendMode, fit: getComputedStyle(i).objectFit })),
  )
  const broken = imgs.filter((i) => i.w === 0)
  for (const i of imgs) seen.set(i.src, i)
  console.log(`${route.padEnd(20)} imgs ${String(imgs.length).padStart(3)}  broken ${broken.length}  blend[${[...new Set(imgs.map((i) => i.blend))].join(',')}]`)
  if (broken.length) console.log('   BROKEN ->', broken.map((b) => b.src).join(', '))
  const bad = responses.filter(([s]) => s >= 400)
  if (bad.length) console.log('   HTTP ERROR ->', JSON.stringify(bad))
  if (failed.length) console.log('   REQ FAILED ->', failed.join(', '))
  await page.close()
}

console.log('---')
console.log(`distinct product images rendered: ${seen.size}`)
const stillBroken = [...seen.values()].filter((i) => i.w === 0)
console.log(`still broken anywhere: ${stillBroken.length}`)

/* ---- 2. the PDP gallery for a newly-photographed product ---- */
for (const slug of ['glossier-you', 'ysl-y-edp', 'carolina-herrera-good-girl', 'chanel-cristalle']) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1100 })
  await page.goto(`${BASE}/product/${slug}`, { waitUntil: 'networkidle2' })
  await sleep(1800)
  const info = await page.evaluate(() => {
    const i = document.querySelector('img[src*="/images/products/"]')
    return i ? { src: i.src.split('/').pop(), w: i.naturalWidth, alt: i.alt, blend: getComputedStyle(i).mixBlendMode, fit: getComputedStyle(i).objectFit } : null
  })
  console.log(`pdp ${slug.padEnd(26)} ${info ? `${info.src} ${info.w}px alt="${info.alt}" ${info.blend}/${info.fit}` : 'NO IMAGE'}`)
  await page.close()
}

/* ---- 3. the contact page Instagram link ---- */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(`${BASE}/help/contact`, { waitUntil: 'networkidle2' })
  await sleep(1200)
  const ig = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="instagram.com"]')].map((a) => ({
      href: a.getAttribute('href'),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel'),
      svg: !!a.querySelector('svg[viewBox="0 0 24 24"]'),
      text: a.textContent.trim(),
    })),
  )
  console.log('---')
  console.log('contact page instagram links:', JSON.stringify(ig, null, 2))
  await page.close()
}

/* ---- 4. footer + mobile menu social links ---- */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(BASE, { waitUntil: 'networkidle2' })
  await sleep(1500)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await sleep(1500)
  const socials = await page.evaluate(() =>
    [...document.querySelectorAll('footer a[target="_blank"]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => h && !h.includes('wa.me')),
  )
  console.log('footer external (non-WhatsApp) links:', JSON.stringify(socials))
  await page.close()
}

await browser.close()