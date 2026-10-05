import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

/* ==========================================================================
   shots-jpg.mjs — capture every route of the storefront as a JPEG.

   Full-page shots at desktop and mobile widths. Cart, wishlist and order state
   are driven through the real UI first, so the cart, checkout and confirmation
   screenshots show populated pages rather than empty states.

   Usage:  BASE_URL=http://localhost:4180 node shots-jpg.mjs
   Output: ./docs  (override with SHOT_DIR)
   ========================================================================== */

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE_URL ?? 'http://localhost:4180'
const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = process.env.SHOT_DIR ?? path.join(ROOT, 'docs')
const QUALITY = 82

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await fs.mkdir(OUT, { recursive: true })

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 390, height: 844 }

/** Every route in the app, in the order a visitor would meet them. */
const ROUTES = [
  { name: '01-home', path: '/' },
  { name: '02-shop-all', path: '/perfumes' },
  { name: '03-shop-women', path: '/perfumes/women' },
  { name: '04-shop-men', path: '/perfumes/men' },
  { name: '05-shop-unisex', path: '/perfumes/unisex' },
  { name: '06-shop-filtered-3ml', path: '/perfumes?size=3' },
  { name: '07-product-sauvage', path: '/product/dior-sauvage' },
  { name: '08-product-you-dark', path: '/product/glossier-you' },
  { name: '09-product-bergamote', path: '/product/le-labo-bergamote-22' },
  { name: '10-collections', path: '/collections' },
  { name: '11-collections-bestsellers', path: '/collections?edit=bestsellers' },
  { name: '12-collections-try-first', path: '/collections?edit=try-first' },
  { name: '13-about', path: '/about' },
  { name: '14-wishlist', path: '/wishlist' },
  { name: '15-cart', path: '/cart' },
  { name: '16-checkout', path: '/checkout' },
  { name: '17-order-success', path: '/order-success' },
  { name: '18-account', path: '/account' },
  { name: '19-help', path: '/help' },
  { name: '20-help-contact', path: '/help/contact' },
  { name: '21-help-shipping', path: '/help/shipping' },
  { name: '22-help-returns', path: '/help/returns' },
  { name: '23-help-faq', path: '/help/faq' },
  { name: '24-help-track-order', path: '/help/track-order' },
  { name: '25-not-found', path: '/this-route-does-not-exist' },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none', '--hide-scrollbars'],
})

let failures = 0

/** Scroll the whole document so lazy images and `whileInView` reveals fire. */
async function settle(page, { scroll = true } = {}) {
  if (scroll) {
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.8)
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 110))
      }
      window.scrollTo(0, 0)
    })
  }
  await page.waitForFunction(
    () => [...document.images].every((i) => i.complete),
    { timeout: 15000 },
  ).catch(() => {})
  // framer-motion reveals settle in ~0.6s once they are in view
  await sleep(1100)
}

async function capture(page, name, { fullPage = true } = {}) {
  const file = path.join(OUT, `${name}.jpg`)
  try {
    await page.screenshot({ path: file, type: 'jpeg', quality: QUALITY, fullPage })
    const { size } = await fs.stat(file)
    console.log(`  ok   ${name}.jpg  ${(size / 1024).toFixed(0)} kB`)
  } catch (e) {
    failures++
    console.log(`  FAIL ${name}  ${e.message}`)
  }
}

const clickText = (page, selector, text) =>
  page.evaluate(
    (sel, t) => {
      const n = [...document.querySelectorAll(sel)].find((x) => x.textContent.includes(t))
      if (!n) throw new Error(`no ${sel} containing "${t}"`)
      n.click()
    },
    selector,
    text,
  )

const typeInto = (page, label, value) =>
  page.evaluate(
    (l, v) => {
      const field = [...document.querySelectorAll('input, textarea')].find(
        (n) => (n.labels?.[0]?.textContent ?? n.getAttribute('aria-label') ?? '').includes(l),
      )
      if (!field) throw new Error(`no field labelled "${l}"`)
      const setter = Object.getOwnPropertyDescriptor(field.constructor.prototype, 'value').set
      setter.call(field, v)
      field.dispatchEvent(new Event('input', { bubbles: true }))
      field.dispatchEvent(new Event('change', { bubbles: true }))
      field.blur()
    },
    label,
    value,
  )

async function open(page, routePath, viewport = DESKTOP) {
  await page.setViewport({ ...viewport, deviceScaleFactor: 1 })
  await page.goto(`${BASE}${routePath}`, { waitUntil: 'networkidle2', timeout: 60000 })
  await sleep(600)
  await settle(page)
}

console.log(`\nserving ${BASE}  ->  ${OUT}\n`)

/* ---- seed real state through the UI ------------------------------------ */
const CART_SLUGS = ['dior-sauvage', 'parfums-de-marly-delina', 'bvlgari-bzero1']
const WISH_SLUGS = ['dior-sauvage', 'parfums-de-marly-delina', 'tom-ford-neroli-portofino']

async function seed(seedPage) {
  for (const slug of CART_SLUGS) {
    await seedPage.goto(`${BASE}/product/${slug}`, { waitUntil: 'networkidle2' })
    await sleep(700)
    await clickText(seedPage, 'button', 'Add to cart')
    await sleep(700)
    // the drawer follows an add; close it so the next add is not intercepted
    await seedPage.keyboard.press('Escape').catch(() => {})
    await sleep(500)
  }
  for (const slug of WISH_SLUGS) {
    await seedPage.goto(`${BASE}/product/${slug}`, { waitUntil: 'networkidle2' })
    await sleep(700)
    await seedPage.click('button[aria-label*="wishlist"]').catch(() => {})
    await sleep(400)
  }
}

const state = await browser.newPage()
await state.setViewport({ ...DESKTOP, deviceScaleFactor: 1 })
await state.goto(BASE, { waitUntil: 'networkidle2' })
await seed(state)
await state.close()
console.log(`seeded: ${CART_SLUGS.length} cart lines, ${WISH_SLUGS.length} wishlist items`)

/* ---- every route, desktop ------------------------------------------------ */
console.log('\ndesktop 1440')
const page = await browser.newPage()
for (const route of ROUTES) {
  if (route.name === '17-order-success') continue
  await open(page, route.path)
  await capture(page, route.name)
}

/* order-success only exists after a real order, and placing one empties the
   cart — so it goes last, once every page that needs a full basket is shot */
await open(page, '/checkout')
await typeInto(page, 'First name', 'Amira')
await typeInto(page, 'Last name', 'Ben Salah')
await typeInto(page, 'Email', 'amira@example.com')
await typeInto(page, 'Phone', '+216 55 123 456')
await typeInto(page, 'Address', '14 Rue du Lac')
await typeInto(page, 'City', 'Tunis')
await typeInto(page, 'Postal code', '1000')
await clickText(page, 'button', 'Continue to delivery')
await sleep(700)
await clickText(page, 'button', 'Continue to payment')
await sleep(700)
await clickText(page, 'button', 'Confirm order')
await sleep(2200)
await open(page, '/order-success')
await capture(page, '17-order-success')
await page.close()

/* ---- overlay states ------------------------------------------------------ */
console.log('\noverlays 1440')
const overlays = await browser.newPage()
await overlays.setViewport({ ...DESKTOP, deviceScaleFactor: 1 })

await overlays.goto(`${BASE}/`, { waitUntil: 'networkidle2' })
await sleep(1200)
await overlays.evaluate(() => window.scrollTo(0, 900))
await sleep(900)
await overlays.click('button[aria-label="Cart"]')
await sleep(1400)
await capture(overlays, '26-cart-drawer', { fullPage: false })
await overlays.keyboard.press('Escape')
await sleep(700)

await overlays.goto(`${BASE}/perfumes`, { waitUntil: 'networkidle2' })
await sleep(1200)
// the desktop search control is a field labelled "Search fragrances"; the
// aria-labelled icon button beside it is `lg:hidden` and not clickable here
await clickText(overlays, 'button', 'Search fragrances')
await sleep(1000)
await overlays.type('#site-search', 'oud', { delay: 20 })
await sleep(1200)
await capture(overlays, '27-search-overlay', { fullPage: false })

await overlays.goto(`${BASE}/`, { waitUntil: 'networkidle2' })
await sleep(1200)
await overlays.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await sleep(1600)
await capture(overlays, '28-footer')
await overlays.close()

/* ---- every route, mobile ------------------------------------------------- */
console.log('\nmobile 390')
// placing the desktop order emptied the cart, so refill it before this pass
const refill = await browser.newPage()
await refill.goto(BASE, { waitUntil: 'networkidle2' })
await seed(refill)
await refill.close()

const mob = await browser.newPage()
for (const route of ROUTES) {
  await open(mob, route.path, MOBILE)
  await capture(mob, `mobile-${route.name}`)
}

await mob.goto(`${BASE}/`, { waitUntil: 'networkidle2' })
await sleep(1400)
await mob.click('button[aria-label="Open menu"]')
await sleep(1200)
await capture(mob, 'mobile-29-menu', { fullPage: false })
await mob.close()

await browser.close()

const files = (await fs.readdir(OUT)).filter((f) => f.endsWith('.jpg'))
console.log(`\n---`)
console.log(`captured ${files.length} jpg  ->  ${OUT}`)
if (failures) console.log(`failures: ${failures}`)
