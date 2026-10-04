import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE_URL ?? 'http://localhost:5178'
const OUT = 'C:\\Users\\takwa\\AppData\\Local\\Temp\\kilo\\shots'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
})

const shots = [
  // Hero crop matrix — the campaign portrait must keep its face at every size
  { name: 'hero-1920x1080', path: '/', w: 1920, h: 1080, full: false, wait: 2400 },
  { name: 'hero-1600x900', path: '/', w: 1600, h: 900, full: false, wait: 2400 },
  { name: 'hero-1440x1000', path: '/', w: 1440, h: 1000, full: false, wait: 2400 },
  { name: 'hero-1366x768', path: '/', w: 1366, h: 768, full: false, wait: 2400 },
  { name: 'hero-1280x720', path: '/', w: 1280, h: 720, full: false, wait: 2400 },
  { name: 'hero-1024x768', path: '/', w: 1024, h: 768, full: false, wait: 2400 },
  { name: 'hero-834x1112', path: '/', w: 834, h: 1112, full: false, wait: 2400 },
  { name: 'hero-390x844', path: '/', w: 390, h: 844, full: false, wait: 2400 },
  { name: 'hero-360x640', path: '/', w: 360, h: 640, full: false, wait: 2400 },

  { name: 'home-hero', path: '/', w: 1440, h: 1000, full: false, wait: 2600 },
  { name: 'home-full', path: '/', w: 1440, h: 1000, full: true, wait: 3200 },
  { name: 'home-mobile', path: '/', w: 390, h: 844, full: false, wait: 2600 },
  { name: 'home-finder', path: '/', w: 1440, h: 1000, full: false, wait: 2400, scroll: 5400 },
  { name: 'home-promo', path: '/', w: 1440, h: 1000, full: false, wait: 2400, scroll: 8400 },
  { name: 'shop', path: '/perfumes', w: 1440, h: 1000, full: false, wait: 2000 },
  { name: 'shop-mobile', path: '/perfumes', w: 390, h: 844, full: false, wait: 2000 },
  { name: 'cart-empty', path: '/cart', w: 1440, h: 900, full: false, wait: 1800 },
  { name: 'pdp', path: '/product/chanel-coco-mademoiselle', w: 1440, h: 1100, full: false, wait: 2200 },
  { name: 'pdp-notes', path: '/product/chanel-coco-mademoiselle', w: 1440, h: 1000, full: false, wait: 2200, scroll: 1500 },
  { name: 'pdp-mobile', path: '/product/chanel-coco-mademoiselle', w: 390, h: 844, full: false, wait: 2200 },
  { name: 'about', path: '/about', w: 1440, h: 1000, full: false, wait: 2200 },
  { name: 'collections', path: '/collections', w: 1440, h: 1000, full: false, wait: 2200 },
  { name: 'checkout', path: '/checkout', w: 1440, h: 1000, full: false, wait: 1800 },
]

for (const shot of shots) {
  const page = await browser.newPage()
  await page.setViewport({ width: shot.w, height: shot.h, deviceScaleFactor: 1 })
  await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle2' })
  await sleep(shot.wait)
  if (shot.scroll) {
    await page.evaluate((y) => window.scrollTo(0, y), shot.scroll)
    await sleep(1400)
  }
  await page.screenshot({ path: `${OUT}\\${shot.name}.png`, fullPage: shot.full })
  console.log(`shot: ${shot.name}`)
  await page.close()
}

await browser.close()