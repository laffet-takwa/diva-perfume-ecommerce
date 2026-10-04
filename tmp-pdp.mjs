import { writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE_URL ?? 'http://localhost:5178'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const out = []

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})

try {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(`${BASE}/product/chanel-coco-mademoiselle`, { waitUntil: 'networkidle2', timeout: 45000 })
  await sleep(2500)
  const title = await page.evaluate(() => document.querySelector('h1')?.textContent ?? '(no h1)')
  const notes = await page.evaluate(() => document.body.innerText.includes('Notes') || document.body.innerText.includes('Top'))
  const img = await page.evaluate(() => {
    const el = document.querySelector('img[src*="/images/products/"]')
    return el ? `${el.getAttribute('src')} natural=${el.naturalWidth}x${el.naturalHeight}` : '(no product img)'
  })
  out.push(`h1: ${title}`)
  out.push(`notes section: ${notes}`)
  out.push(`image: ${img}`)
  out.push(`console errors: ${errors.length ? errors.join(' | ') : 'none'}`)
} catch (err) {
  out.push(`ERROR ${err.message}`)
}

writeFileSync('C:\\Users\\takwa\\AppData\\Local\\Temp\\kilo\\pdp-probe.txt', out.join('\n'))
await browser.close()
process.exit(0)