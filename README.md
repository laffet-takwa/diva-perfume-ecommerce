# DIVA STORE

A storefront for a fictional perfume house: catalogue, product detail, wishlist, cart, a
three-step checkout and a scent finder. Built as a front-end only application — there is no
backend, so payments, auth and orders are simulated in the browser.

The house is invented. `src/data/products.ts` states it plainly: *fictional house, fictional
names, no real brand packaging*. Every product renders real photography, lit and graded to one
shared studio look so the grid reads as a single shoot.

---

## Quick start

```bash
npm install
npm run dev
```

Vite prints the URL it bound to, usually <http://localhost:5173>. If that port is taken it
fails rather than auto-incrementing, so pass an explicit one:

```bash
npm run dev -- --port 5174
```

> On Windows, PowerShell's execution policy blocks `npm.ps1`. Use `npm.cmd` instead
> (`npm.cmd run dev`), or run `node node_modules/vite/bin/vite.js`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then production build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run lint` | Oxlint, configured by `.oxlintrc.json` |

Three Puppeteer scripts sit at the repo root. They are **not** wired into `package.json`
because they need a real Chrome install and a running dev server:

```bash
# end-to-end smoke test (36 checks: filters, PDP, cart, checkout, search, finder)
npm run dev -- --port 5178
node flow.smoke.mjs

# screenshot capture into %TEMP%\kilo\shots
node shots.mjs

# full-page JPEG capture of every route, desktop + mobile, into ./docs
npm run preview -- --port 4180
BASE_URL=http://localhost:4180 node shots-jpg.mjs
```

All three read `BASE_URL` (default `http://localhost:5178`) and expect Chrome at
`C:\Program Files\Google\Chrome\Application\chrome.exe`. They drive Chrome through
`puppeteer-core`, so they read the DOM rather than the TypeScript — treat them as a safety
net, not a substitute for `npm run build` and `npm run lint`.

`shots-jpg.mjs` seeds the cart, wishlist and order through the real UI before capturing, so
`15-cart`, `16-checkout` and `17-order-success` show populated pages rather than empty
states. It writes 54 JPEGs (quality 82) into `docs/` — every route in `ROUTES` at 1440 and
at 390, plus the cart drawer, the search overlay, the footer and the mobile menu. Files are
numbered in visiting order; mobile shots are prefixed `mobile-`. Override the output
directory with `SHOT_DIR` and the JPEG quality in the `QUALITY` constant at the top.

## Stack

- **React 19** + **TypeScript 6** (strict, `noUnusedLocals`, `verbatimModuleSyntax`)
- **Vite 8** — build target `es2022`, CSS minified with Lightning CSS
- **react-router-dom 7**, declarative mode (`BrowserRouter` + `<Routes>`)
- **Tailwind CSS 4** via `@tailwindcss/vite`, no config file — theme lives in `src/index.css`
- **framer-motion 14** for all animation
- **lucide-react** for icons
- **Oxlint** for linting

## Layout

```
src/
  App.tsx              route table, page transitions, global overlays
  main.tsx             providers + router
  components/
    art/               ArtScene, BottleArt, PhotoFrame — generated artwork
    cart/              CartDrawer, CartItem + QuantityStepper, CartSummary
    checkout/          CheckoutSteps, OrderSummary
    home/              Hero, FeaturedProducts, CategorySection, PerfumeFinder,
                       NewArrivals, EditorialSection, PromoBanner
    layout/            Header, Footer, Logo, MobileMenu, SearchOverlay, ScrollToTop
    product/           ProductCard, ProductGrid, ProductCarousel, ProductGallery,
                       ProductNotes, ProductRating, ProductShot
    shop/              Filters, SortSelect
    ui/                Button, Badge, Field, Modal, Drawer, Reveal, SectionHeading,
                       EmptyState, Skeleton, CustomCursor
  context/             Cart, Wishlist, Order, Toast, UI
  data/                products.ts (catalogue), navigation.ts
  hooks/               useCatalog, useDebouncedValue, useMediaQuery, useScrollLock, useSeo
  lib/                 motion.ts (animation presets), utils.ts (formatting, storage, validation)
  pages/               one file per route
  types/               shared domain types
public/
  images/products/    the catalogue photography, one file per slug, see CREDITS.md
  images/perfumes/     women/ + men/ reference photography, not wired into the UI
```

## Routes

| Path | Page | Notes |
| --- | --- | --- |
| `/` | `Home` | The only eagerly imported page |
| `/perfumes` | `Shop` | Full catalogue with filters |
| `/perfumes/:gender` | `Shop` | `women`, `men` or `unisex` |
| `/product/:slug` | `ProductDetails` | Unknown slug renders an inline empty state |
| `/collections` | `Collections` | `?edit=` selects one of four curated edits |
| `/about` | `About` | House story |
| `/wishlist`, `/cart`, `/checkout`, `/order-success`, `/account` | matching pages | |
| `/help`, `/help/:topic` | `HelpIndex`, `Help` | One module exports both |
| `*` | `NotFound` | |

Every page except `Home` is `React.lazy`, wrapped in `<Suspense>` with `PageSkeleton` and
given a shared motion transition by the `Page` wrapper in `App.tsx`.

`PROJECT_DEMO` in `src/data/navigation.ts` holds the deployed Vercel build. It is linked
twice, both as an outline `buttonStyles` anchor with an `ArrowUpRight`: `size="lg"` beside
the CTAs on `About`, and `size="sm"` in the footer next to "Search the collection" so the
link is reachable from every page. Change the URL in that one constant to repoint both.

## State and persistence

No state library. Five contexts nest in `src/context/index.tsx`, outermost first:
`Toast → Wishlist → Cart → Order → UI`. Import the hooks from `@/context`, never from the
individual files. Each hook throws outside its provider.

| Context | Mechanism | localStorage key |
| --- | --- | --- |
| `Cart` | `useReducer` (`add`/`remove`/`quantity`/`replace`/`clear`) | `diva.cart.v1` |
| `Wishlist` | `useState<string[]>` of product ids | `diva.wishlist.v1` |
| `Order` | single `lastOrder` | `diva.order.v1` |
| `Toast` | queue of max 3, auto-dismiss 2.8s | — |
| `UI` | search + mobile menu flags | — |

`Cart` and `Wishlist` listen for the `storage` event, so two open tabs stay in sync. Stored
cart lines are validated against the catalogue on read and silently dropped if the product is
gone. The newsletter form in the footer uses `diva.newsletter.v1`.

## Product imagery

Every product carries a `photo`, a `photoAlt` and a `photoTone`, and `Flacon` renders the
photograph in place of the drawn bottle. `photoTone: 'light'` is a white-studio shot multiplied
into the house plate so its own white sweep disappears into the page; `photoTone: 'dark'` fills
the frame instead, for the four shots that genuinely carry a dark or mid backdrop. The
`photoTone` records what a frame actually is, so a photograph is never falsely flattened onto
the white plate.

The set was graded to one look by measuring it rather than eyeballing it: backdrop luma in a
narrow **L208–L255** band, `#FFFFFF` the most common dominant colour, mean saturation 0.02–0.28,
a near-black cap and warm gold hardware recurring across the frames. `STUDIO_PLATES` in
`products.ts` reproduces that same band in vector form, keyed by olfactive family, so a drawn
flacon sits on the same sweep as a photograph beside it. `public/images/products/CREDITS.md`
records the measurement and the licence status of every file.

The `art` recipe — five colours plus a silhouette (`rect`, `oval`, `tall`, `faceted`) — is still
there as the vector fallback and as the tint of the plate a photograph multiplies into.
`ProductShot` composes the drawing with a backdrop, light pool and plinth when a product has no
photograph, and its four `view` indices (front / detail / angled / label) give the product page a
gallery from one asset.

Secondary reference photography lives in `public/images/perfumes/{women,men}/` and is **not**
wired into the UI. See `public/images/perfumes/CREDITS.md` for licensing; the CC BY and CC BY-SA
entries require attribution, so keep that file if you redistribute them.

## Conventions worth knowing

**Adding a page.** Create `src/pages/Foo.tsx` with a default export, add a `lazy()` import in
`App.tsx`, register the route inside the existing `<Page>` wrapper, and call
`useSeo({ title, description, canonicalPath })` first. Add the entry to `NAV_ITEMS` or
`FOOTER_COLUMNS` in `src/data/navigation.ts` and it appears in the header, mobile menu or
footer with no further work.

**Path alias.** `@` maps to `src/` in both `vite.config.ts` and `tsconfig.app.json`.

**Page layout.** Pages use `pt-16 lg:pt-20` to clear the fixed header, then `container-lux`,
`display-title` for headings and `eyebrow` / `eyebrow-rule` kickers. Sticky sidebars are
`lg:sticky lg:top-28`.

**Animation.** Import presets from `@/lib/motion` instead of writing `whileInView` inline.
`<Reveal variant="up" index={n} />` covers most cases and staggers by 90ms per index.
`useReducedMotion()` is honoured in the route transition, hero particles and photo parallax.

**Text.** Anything user-supplied passes through `sanitizeText(value, maxLength)` before it
reaches the DOM — it flows into `document.title` and aria labels, not just visible text.
Prices go through `formatPrice`; never hardcode the currency.

**Design tokens.** Tailwind 4 `@theme` in `src/index.css` defines the palette
(`burgundy`, `gold`, `cream`, `rose`, `champagne`, `dark`, `ink`, `muted`), three font
families, three shadows, and utilities including `container-lux`, `display-title`,
`body-copy`, `grain-layer`, `gold-hairline`, `no-scrollbar`, `safe-bottom` and `shimmer`.
Use these rather than raw hex values.

**Breakpoints.** Tailwind defaults plus one explicit hook: `useIsDesktop()` is
`min-width: 1024px`, matching the `lg` breakpoint. Mobile-only hiding uses `max-lg:hidden`
deliberately, because `.inline-flex` is emitted after `.hidden` and would otherwise win.

## Accessibility

Skip link, landmarks and labelled sections throughout. Modals and drawers trap focus by
capturing `document.activeElement` and restoring it after the exit animation; their backdrops
are real buttons kept out of the tab order with `tabIndex={-1}`. Icon-only controls carry
`sr-only` labels, toggles use `aria-pressed`, and the gallery takes arrow keys scoped to
`[data-gallery]`. The scent pyramid in `ProductNotes` duplicates its diagram as an `sr-only`
list. Scroll lock is reference-counted in `useScrollLock`, so nested overlays restore
correctly. Decorative layers are `aria-hidden` and SVGs are `focusable="false"` unless they
carry a title.

## SEO

`useSeo` mutates the document client-side: it sets `document.title` and upserts the
description, Open Graph, Twitter and canonical tags. `index.html` holds the static defaults.
Every page except `Home` supplies its own title; canonical URLs default to the current
pathname unless `canonicalPath` is passed.

## Catalogue

26 products in `src/data/products.ts` — 11 women, 8 men, 7 unisex — each with a scent
pyramid (top/heart/base), a 30/50/100 ml price ladder, rating, popularity and release date.
`BESTSELLERS` and `NEWEST_PRODUCTS` are derived on import. Filtering and sorting are pure
functions in `useCatalog.ts` (`applyFilters`, `matchesQuery`, `applySort`, `searchProducts`)
so the shop, search overlay and new-arrivals tabs all share one implementation.

## Known rough edges

Worth fixing if you are working in this area:

- The footer links to `/about#careers`, but `About.tsx` only renders `id="careers-title"`.
  `ScrollToTop` finds no target and falls back to scrolling to the top.
- An unknown gender segment (`/perfumes/foo`) renders the full catalogue instead of a 404.
- `AnimatePresence` is keyed on `location.pathname`, not `location.key`, so navigation that
  only changes a param or query string does not remount the page or play an exit animation.
  Pages therefore sync their own state from `useParams` / `useSearchParams`.
- `/help/:topic` with an unknown slug falls back to the first topic while the canonical URL
  still advertises `/help/contact`.
- The Open Graph and Twitter image is always `/og-default.svg`; no page passes `image`.
- `ANNOUNCEMENT` in `src/data/navigation.ts` is exported but never consumed. The header
  marquee uses `FREE_SHIPPING_COPY` instead.
- `SearchOverlay` re-declares the `'diva.recentSearches.v1'` key as a local constant instead
  of importing `RECENT_SEARCH_STORAGE` from `@/lib/utils`.
- There is no pagination. `Shop` renders every match; `NewArrivals` hard-caps at 8.
- `src/images/` holds nineteen files named after real brands (Chanel, Dior, Prada, Gucci and
  others), a uniform 474 px white-sweep studio set. Nothing in `src/` imports them; they are the
  source the catalogue photography was graded from. Sixteen were promoted into
  `public/images/products/` under their product slug, so the folder is kept as the master set
  rather than deleted.
