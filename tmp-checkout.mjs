import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000 })
await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle2' })
await sleep(1500)

const clicked = await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) =>
    (b.textContent ?? '').includes('Continue to shipping'),
  )
  if (!btn) return 'no button'
  btn.click()
  return 'clicked'
})
console.log('click:', clicked)

for (const wait of [200, 400, 800, 1600]) {
  await sleep(wait === 200 ? 200 : wait - 200)
  const n = await page.$$eval('p.text-burgundy', (els) => els.length).catch(() => -1)
  console.log(`after ~${wait}ms: ${n} burgundy paragraphs`)
}

await browser.close()