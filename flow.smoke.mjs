/**
 * End-to-end smoke test of the DIVA STORE decant storefront.
 * Run against a served build on http://localhost:5178:
 *   npm run build && node node_modules/vite/bin/vite.js preview --port 5178 --strictPort
 *   node flow.smoke.mjs
 */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE_URL ?? 'http://localhost:5178'

const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
  defaultViewport: { width: 1440, height: 1000 },
})

const page = await browser.newPage()
const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`))

const goto = async (path) => {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle2' })
  // Route chunks are lazy; give the page skeleton time to swap out.
  await sleep(1000)
}

const textPresent = (text) =>
  page.evaluate((t) => document.body.innerText.toLowerCase().includes(t.toLowerCase()), text)

/**
 * Click the first clickable whose trimmed text matches, optionally scoped to a
 * container. Exact matches win over substring matches so "10 ml" does not land
 * on a compact card picker when the detail picker was meant.
 */
const clickText = async (selector, text, { within, timeout = 6000 } = {}) => {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const handle = await page.evaluateHandle(
      (sel, needle, scope) => {
        const root = scope ? document.querySelector(scope) : document
        if (!root) return null
        const nodes = [...root.querySelectorAll(sel)].filter((n) => !n.disabled && n.offsetParent !== null)
        const exact = nodes.find(
          (n) => (n.textContent ?? '').replace(/\s+/g, ' ').trim().toLowerCase() === needle.toLowerCase(),
        )
        if (exact) return exact
        return (
          nodes.find((n) =>
            (n.textContent ?? '').replace(/\s+/g, ' ').trim().toLowerCase().includes(needle.toLowerCase()),
          ) ?? null
        )
      },
      selector,
      text,
      within ?? null,
    )
    const element = handle.asElement()
    if (element) {
      await element.evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }))
      // `scroll-behavior: smooth` means the box is still moving on the next tick
      // unless we wait for it to settle before clicking by coordinates.
      await sleep(250)
      await element.click()
      return true
    }
    await sleep(120)
  }
  throw new Error(`Could not find ${selector} containing "${text}"${within ? ` within ${within}` : ''}`)
}

const type = async (labelText, value) => {
  const handle = await page.evaluateHandle((label) => {
    const match = [...document.querySelectorAll('label')].find(
      (l) => (l.textContent ?? '').replace('*', '').trim().toLowerCase() === label.toLowerCase(),
    )
    return match ? document.getElementById(match.htmlFor) : null
  }, labelText)
  const el = handle.asElement()
  if (!el) throw new Error(`no field: ${labelText}`)
  await el.click({ clickCount: 3 })
  await el.type(value, { delay: 4 })
}

/** The price rendered on the first product card. */
const cardPrice = () =>
  page.evaluate(() => {
    const node = [...document.querySelectorAll('article span')].find((n) =>
      /^[\d\s]+DT$/.test((n.textContent ?? '').replace(/\u00a0/g, ' ').trim()),
    )
    return node ? node.textContent.replace(/\s+/g, ' ').trim() : null
  })

const whatsappHrefs = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('a[href^="https://wa.me/"]')].map((a) => decodeURIComponent(a.href)),
  )

/** Decoded WhatsApp links whose message contains a needle. */
const waMessages = async (needle) => (await whatsappHrefs()).filter((h) => h.includes(needle))

try {
  /* ------------------------------------------------------------- 1  home */
  await goto('/')
  record('hero headline', (await textPresent('Luxury Scents')) && (await textPresent('Affordable Decants')))
  record(
    'hero CTA is Shop Now',
    (await page.$$eval('a', (n) => n.filter((a) => a.textContent.trim() === 'Shop Now').length)) === 1,
  )
  record('primary nav has 8 entries', (await page.$$eval('nav[aria-label="Primary"] a', (n) => n.length)) === 8)
  record('header carries a WhatsApp action', (await whatsappHrefs()).length > 0)
  record('shop-by-size has 3 tiles', (await page.$$eval('#shop-by-size a[href*="size="]', (n) => n.length)) === 3)
  record(
    'why DIVA has 3 promises',
    (await textPresent('100% Authentic')) && (await textPresent('Fast Delivery')) && (await textPresent('Best Price')),
  )
  record(
    'shelf has For Him / For Her filters',
    (await page.$$eval('[role="tab"]', (n) => n.map((t) => t.textContent).join(' '))).toLowerCase().includes('for her'),
  )

  /* ------------------------------------------------- 2  card volume pricing */
  const priceAt5 = await cardPrice()
  await clickText('fieldset button', '3 ml', { within: 'article' })
  const priceAt3 = await cardPrice()
  record('card volume selector reprices the card', priceAt5 !== null && priceAt5 !== priceAt3, `${priceAt5} → ${priceAt3}`)

  /* --------------------------------------------------------- 3  shop page */
  await goto('/perfumes')
  const cardCount = await page.$$eval('article', (n) => n.length)
  record('shop lists products', cardCount > 0, `${cardCount} cards`)

  await clickText('button', '3 ml')
  record('size tab writes ?size=3', page.url().includes('size=3'))
  record('3 ml tab pins the volume', await textPresent('27 fragrances · 3 ml'))

  await clickText('label', 'Oriental')
  await sleep(700)
  const afterFilter = await page.$$eval('article', (n) => n.length)
  record('family filter narrows results', afterFilter > 0 && afterFilter < cardCount, `${cardCount} → ${afterFilter}`)

  await clickText('button', 'Clear (')
  await sleep(600)
  record('clear filters restores results', (await page.$$eval('article', (n) => n.length)) === cardCount)

  await page.select('#sort', 'price-asc')
  await sleep(700)
  record('sort persists to URL', page.url().includes('sort=price-asc'))

  /* ----------------------------------------------------------------- 4  PDP */
  await goto('/product/chanel-coco-mademoiselle')
  record('pdp renders scent pyramid', await textPresent('How it unfolds'))

  const pdpPrice5 = await page.$eval('.font-display.text-3xl', (n) => n.textContent.trim())
  await clickText('fieldset button', '10 ml', { within: 'main, #root > div' })
  const pdpPrice10 = await page.$eval('.font-display.text-3xl', (n) => n.textContent.trim())
  record('pdp volume selector reprices', pdpPrice5 !== pdpPrice10, `${pdpPrice5} → ${pdpPrice10}`)
  record('pdp shows the saving', await textPresent('Save'))

  const pdpWa = (await waMessages('Coco Mademoiselle')).find((h) => h.includes('10 ml'))
  record('pdp builds a WhatsApp order deep link', Boolean(pdpWa), pdpWa ? pdpWa.slice(0, 110) : 'none')

  /* ------------------------------------------------------------- 5  add to cart */
  await clickText('button', 'Add to cart')
  await sleep(900)
  record('cart drawer opens on add', (await page.$('[aria-labelledby="cart-drawer-title"]')) !== null)
  record('drawer shows the decant volume', (await page.$eval('[aria-labelledby="cart-drawer-title"]', (n) => n.innerText)).toLowerCase().includes('ml decant'))
  const drawerWa = await waMessages('MY ORDER')
  record('drawer checkout builds the order message', drawerWa.length > 0, drawerWa[0] ? drawerWa[0].slice(0, 70) : 'none')

  await page.click('[aria-labelledby="cart-drawer-title"] button[aria-label="Increase quantity"]')
  await sleep(400)
  record(
    'drawer quantity increments',
    (await page.$eval('[aria-label="Quantity for Coco Mademoiselle"] span', (n) => n.textContent)) === '2',
  )
  record('drawer shows the saving vs bottles', await textPresent('You save'))

  const stored = await page.evaluate(() => localStorage.getItem('diva.cart.v2'))
  record('cart persisted to localStorage', Boolean(stored) && stored.includes('chanel-coco-mademoiselle'))

  await goto('/cart')
  record('cart page shows the line', await textPresent('Coco Mademoiselle'))
  record('cart page offers WhatsApp checkout', (await waMessages('MY ORDER')).length > 0)

  /* -------------------------------------------------------------- 6  checkout */
  await goto('/checkout')
  record('checkout starts on information', await textPresent('Your information'))

  await clickText('button', 'Continue to delivery')
  await sleep(500)
  record('checkout validates required fields', (await page.$$eval('input[aria-invalid="true"]', (n) => n.length)) > 0)

  await type('First name', 'Amira')
  await type('Last name', 'Ben Salah')
  await type('Email', 'amira@example.com')
  await type('Phone', '+216 20 123 456')
  await type('Address', '14 Rue du Nil')
  await type('City', 'Tunis')
  await type('Postal code', '1000')
  await clickText('button', 'Continue to delivery')
  await sleep(600)
  record('checkout advances to delivery', await textPresent('Standard delivery'))

  await clickText('button', 'Continue to payment')
  await sleep(600)
  record('checkout advances to payment', await textPresent('Cash on delivery'))
  record('checkout has no card form', (await page.$$eval('input[autocomplete="cc-number"], input[name*="card"]', (n) => n.length)) === 0)

  const confirmWa = (await waMessages('DELIVER TO'))[0]
  record('payment step carries the address into WhatsApp', Boolean(confirmWa), confirmWa ? confirmWa.slice(-120) : 'none')

  await clickText('button', 'Confirm order')
  await sleep(1800)
  record('order placed → success page', page.url().includes('/order-success'))
  record('success page greets', await textPresent('Thank you, Diva.'))
  record('success page shows an order number', await textPresent('DV-'))
  record('cart cleared after order', (await page.evaluate(() => localStorage.getItem('diva.cart.v2') ?? '[]')) === '[]')

  /* ------------------------------------------------------------- 7  wishlist */
  await goto('/perfumes')
  await page.click('button[aria-label^="Add Coco Mademoiselle"][aria-label$="to wishlist"]').catch(() => {})
  await sleep(500)
  await goto('/wishlist')
  record('wishlist captures a product', (await page.$$eval('article', (n) => n.length)) > 0)

  /* -------------------------------------------------------------- 8  search */
  await goto('/')
  await page.click('button[aria-label="Search"]')
  await sleep(700)
  record('search overlay opens', (await page.$('#site-search')) !== null)
  record('search shows trending notes', await textPresent('Trending notes'))
  await page.type('#site-search', 'oud', { delay: 12 })
  await sleep(800)
  record('search returns live results', (await page.$$eval('li', (n) => n.filter((x) => x.textContent.includes('DT')).length)) > 0)
  await page.type('#site-search', 'zzzznope', { delay: 8 })
  await sleep(800)
  record('search empty state', await textPresent('No fragrance found'))
  await page.keyboard.press('Escape')
  await sleep(500)

  /* --------------------------------------------------------------- 9  routes */
  await goto('/perfumes/women')
  record('gender route works', await textPresent('Elegant. Feminine. Unforgettable.'))
  await goto('/collections?edit=try-first')
  record('try-first collection is scoped to 3 ml', await textPresent('3 ml'))
  await goto('/')
  record('footer carries the three channels', await textPresent('Instagram') && (await textPresent('TikTok')) && (await textPresent('WhatsApp')))

  /* ------------------------------------------------------- 10  mobile surface */
  await page.setViewport({ width: 390, height: 844 })
  await goto('/')
  await page.click('button[aria-label="Open menu"]')
  await sleep(800)
  record('mobile menu opens', (await page.$$('nav[aria-label="Mobile"] a')).length >= 8)
  record('mobile menu carries WhatsApp', (await whatsappHrefs()).length > 0)
  await page.keyboard.press('Escape')
  await sleep(400)
  await page.evaluate(() => window.scrollTo(0, 1400))
  await sleep(900)
  record('WhatsApp handle appears on scroll', (await page.$$('a[aria-label="Order on WhatsApp"]')).length > 0)

  /* ------------------------------------------------------------ 11  console */
  const majorErrors = consoleErrors.filter(
    (e) => !e.includes('favicon') && !e.toLowerCase().includes('fonts.googleapis'),
  )
  record('no console errors', majorErrors.length === 0, majorErrors.slice(0, 3).join(' | '))
} catch (error) {
  record('unexpected failure', false, error.message)
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (failed.length) {
  console.log('FAILED:')
  for (const f of failed) console.log(`  - ${f.name} ${f.detail}`)
  process.exitCode = 1
}
