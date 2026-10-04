/**
 * End-to-end smoke test of the DIVA STORE storefront.
 * Run with the dev server on http://localhost:5178.
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
  await sleep(400)
}

/** Click the first element whose trimmed text matches. */
const clickText = async (selector, text, { timeout = 6000 } = {}) => {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const handle = await page.evaluateHandle(
      (sel, needle) => {
        const nodes = [...document.querySelectorAll(sel)]
        return nodes.find((n) => (n.textContent ?? '').trim().toLowerCase().includes(needle.toLowerCase())) ?? null
      },
      selector,
      text,
    )
    const element = handle.asElement()
    if (element) {
      await element.click()
      return true
    }
    await sleep(120)
  }
  throw new Error(`Could not find ${selector} containing "${text}"`)
}

const textPresent = (text) =>
  page.evaluate((t) => document.body.innerText.toLowerCase().includes(t.toLowerCase()), text)

try {
  /* ---------------------------------------------------------------- 1 */
  await goto('/')
  record('home renders hero', await textPresent('Your Scent'))
  record('home renders nav', (await page.$$eval('nav[aria-label="Primary"] a', (n) => n.length)) === 7)

  /* ---------------------------------------------------------------- 2 */
  await goto('/perfumes')
  const cardCount = await page.$$eval('article', (n) => n.length)
  record('shop lists products', cardCount > 0, `${cardCount} cards`)

  /* --- filter by family --- */
  await clickText('label', 'Oriental')
  await sleep(600)
  const afterFilter = await page.$$eval('article', (n) => n.length)
  record('family filter narrows results', afterFilter > 0 && afterFilter < cardCount, `${cardCount} → ${afterFilter}`)

  /* --- clear --- */
  await clickText('button', 'Clear (')
  await sleep(500)
  const afterClear = await page.$$eval('article', (n) => n.length)
  record('clear filters restores results', afterClear === cardCount, `${afterClear} cards`)

  /* --- sort --- */
  await page.select('#sort', 'price-asc')
  await sleep(600)
  record('sort persists to URL', page.url().includes('sort=price-asc'))

  /* ---------------------------------------------------------------- 3 */
  await goto('/product/chanel-coco-mademoiselle')
  record('pdp renders notes', await textPresent('How it unfolds'))

  // Size switch updates price
  const priceBefore = await page.$eval('.font-display.text-2xl', (n) => n.textContent)
  await clickText('button', '100ml')
  await sleep(300)
  const priceAfter = await page.$eval('.font-display.text-2xl', (n) => n.textContent)
  record('size selector changes price', priceBefore !== priceAfter, `${priceBefore} → ${priceAfter}`)

  // Gallery navigation
  await page.click('button[aria-label="Next image"]').catch(async () => {
    const thumbs = await page.$$('[role="tab"][aria-label="Angled"]')
    await thumbs[0]?.click()
  })
  await sleep(500)
  record('gallery navigates', await page.$eval('[role="tab"][aria-label="Detail"]', (n) => n.getAttribute('aria-selected') === 'true'))

  // Add to bag → drawer opens
  await clickText('button', 'Add to bag')
  await sleep(800)
  record('cart drawer opens on add', await page.$('[aria-labelledby="cart-drawer-title"]') !== null)
  record('drawer shows product', await textPresent('coco mademoiselle'))

  // Quantity stepper in drawer
  await page.click('div[aria-labelledby="cart-drawer-title"] button[aria-label="Increase quantity"]')
  await sleep(400)
  const qty = await page.$eval('[aria-label="Quantity for Coco Mademoiselle"] span', (n) => n.textContent)
  record('drawer quantity increments', qty === '2', `qty=${qty}`)

  /* --- persistence --- */
  const storedCart = await page.evaluate(() => localStorage.getItem('diva.cart.v1'))
  record('cart persisted to localStorage', !!storedCart && storedCart.includes('chanel-coco-mademoiselle'))

  await goto('/cart')
  record('cart page shows line', await textPresent('coco mademoiselle'))

  /* ---------------------------------------------------------------- 4 */
  await goto('/wishlist')
  // Wishlist a product from the shop
  await goto('/perfumes')
  await page.click('button[aria-label^="Add Coco Mademoiselle"][aria-label$="to wishlist"]').catch(() => {})
  await sleep(400)
  await goto('/wishlist')
  record('wishlist captures product', (await page.$$eval('article', (n) => n.length)) > 0)

  /* ---------------------------------------------------------------- 5 */
  await goto('/checkout')
  record('checkout shows information step', await textPresent('Your information'))

  // Submit empty → validation errors
  await clickText('button', 'Continue to shipping')
  await sleep(400)
  const errorCount = await page.$$eval('p.text-burgundy', (n) => n.length)
  record('checkout validates required fields', errorCount > 0, `${errorCount} errors`)

  const type = async (labelText, value) => {
    const handle = await page.evaluateHandle((label) => {
      const labels = [...document.querySelectorAll('label')]
      const match = labels.find((l) => (l.textContent ?? '').trim().toLowerCase() === label.toLowerCase())
      return match ? document.getElementById(match.htmlFor) : null
    }, labelText)
    const el = handle.asElement()
    if (!el) throw new Error(`no field: ${labelText}`)
    await el.click({ clickCount: 3 })
    await el.type(value, { delay: 4 })
  }

  await type('First name', 'Amira')
  await type('Last name', 'Ben Salah')
  await type('Email', 'amira@example.com')
  await type('Phone', '+216 20 123 456')
  await type('Address', '14 Rue du Nile')
  await type('City', 'Tunis')
  await type('Postal code', '1000')
  await clickText('button', 'Continue to shipping')
  await sleep(500)
  record('checkout advances to shipping', await textPresent('Shipping method'))

  await clickText('button', 'Continue to payment')
  await sleep(500)
  record('checkout advances to payment', await textPresent('Cash on delivery'))

  await clickText('label', 'Cash on delivery')
  await sleep(400)
  await clickText('button', 'Place order')
  await sleep(1600)
  record('order placed → success page', page.url().includes('/order-success'))
  record('success page greets', await textPresent('Thank you, Diva.'))
  record('success page shows order number', await textPresent('DV-'))
  record('cart cleared after order', await page.evaluate(() => (localStorage.getItem('diva.cart.v1') ?? '[]') === '[]'))

  /* ---------------------------------------------------------------- 6 */
  await goto('/')
  // Search overlay
  await page.click('button[aria-label="Search"]')
  await sleep(600)
  record('search overlay opens', (await page.$('#site-search')) !== null)
  record('search shows trending', await textPresent('Trending notes'))

  await page.type('#site-search', 'oud', { delay: 12 })
  await sleep(700)
  const resultHits = await page.$$eval('li', (nodes) =>
    nodes.filter((n) => (n.textContent ?? '').includes('DT')).length,
  )
  record('search returns live results', resultHits > 0, `${resultHits} results`)

  await page.type('#site-search', 'zzzznope', { delay: 8 })
  await sleep(700)
  record('search empty state', await textPresent('No fragrance found'))

  await page.keyboard.press('Escape')
  await sleep(500)

  /* ---------------------------------------------------------------- 7 */
  await goto('/perfumes/women')
  record('gender route works', await textPresent('Elegant. Feminine. Unforgettable.'))
  record('gender facet reflects route', await textPresent('Women'))

  /* ---------------------------------------------------------------- 8 */
  await goto('/')
  // Perfume finder
  await clickText('button', 'Romantic')
  await sleep(1300)
  record('finder advances to notes', await textPresent('Which notes attract you'))
  await clickText('button', 'Rose')
  await clickText('button', 'Vanilla')
  await sleep(400)
  await clickText('button', 'Continue')
  await sleep(1300)
  record('finder advances to occasion', await textPresent('When will you wear it'))
  await clickText('button', 'Date Night')
  await sleep(1400)
  record('finder reveals matches', await textPresent('YOUR DIVA MATCH') || await textPresent('Your Diva match'))

  /* ---------------------------------------------------------------- 9 */
  // Toast feedback
  await goto('/perfumes')
  await clickText('button', 'Quick add')
  await sleep(600)
  record('add to cart raises a toast', await page.$('[role="region"][aria-label="Notifications"] .pointer-events-auto') !== null)

  /* ---------------------------------------------------------------- 10 */
  await goto('/')
  // Mobile menu
  await page.setViewport({ width: 390, height: 844 })
  await sleep(400)
  await page.click('button[aria-label="Open menu"]')
  await sleep(700)
  record('mobile menu opens', (await page.$$('nav[aria-label="Mobile"] a')).length >= 7)

  /* ---------------------------------------------------------------- 11 */
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