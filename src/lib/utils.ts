/* ==========================================================================
   DIVA STORE — Utilities
   ========================================================================== */

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/* --------------------------------------------------------------------------
   Formatting
   -------------------------------------------------------------------------- */

/** Prices are displayed in DT with a non-breaking space and no decimals. */
const priceFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)}\u00a0DT`
}

export function formatNumber(value: number): string {
  return priceFormatter.format(value)
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  )
}

/* --------------------------------------------------------------------------
    Editorial number words
    Catalogue counts appear inside prose ("twenty-six fragrances"), so they
    are derived from the data rather than typed into the copy.
   -------------------------------------------------------------------------- */

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]

const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

/** British hyphenation: 26 → "twenty-six". Falls back to digits above 99. */
export function spellCount(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > 99) return String(value)
  if (value < 20) return ONES[value]
  const tens = TENS[Math.floor(value / 10)]
  const ones = value % 10
  return ones === 0 ? tens : `${tens}-${ONES[ones]}`
}

/* --------------------------------------------------------------------------
   Text sanitisation — search input never reaches the DOM as markup
   -------------------------------------------------------------------------- */

const CONTROL_CHARS = /\p{Cc}/gu
const ANGLE_CHARS = /[<>{}$`\\]/g

/**
 * Strips control characters and markup-significant characters from free text.
 * React escapes by default, but search terms also flow into `document.title`
 * and aria-labels, so we normalise at the boundary.
 */
export function sanitizeText(input: string, maxLength = 80): string {
  return input.replace(CONTROL_CHARS, '').replace(ANGLE_CHARS, '').trim().slice(0, maxLength)
}

/* --------------------------------------------------------------------------
   Local storage (safe against private mode / quota errors)
   -------------------------------------------------------------------------- */

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* Storage unavailable — the app still works, it just will not persist. */
  }
}

/* --------------------------------------------------------------------------
   Validation
   -------------------------------------------------------------------------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 15
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/* --------------------------------------------------------------------------
   Misc
   -------------------------------------------------------------------------- */

/** Deterministic 32-bit hash — lets us derive stable art from an id. */
export function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function productLineKey(productId: string, ml: number): string {
  return `${productId}::${ml}`
}

export function formatDeliveryWindow(eta: [number, number]): string {
  const today = new Date()
  const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' })
  const start = new Date(today)
  start.setDate(start.getDate() + eta[0])
  const end = new Date(today)
  end.setDate(end.getDate() + eta[1])
  return `${fmt.format(start)} — ${fmt.format(end)}`
}

export function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** Shared localStorage keys. */
export const NEWSLETTER_STORAGE = 'diva.newsletter.v1'
export const RECENT_SEARCH_STORAGE = 'diva.recentSearches.v1'
export const ONBOARDED_STORAGE = 'diva.onboarded.v1'