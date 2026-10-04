import { useEffect } from 'react'
import { sanitizeText } from '@/lib/utils'

/* ==========================================================================
   SEO — a lightweight document-level manager.

   Full SSR metadata is set in index.html; this keeps the title, description
   and OpenGraph tags in sync as the visitor navigates a SPA.
   ========================================================================== */

const SITE = 'DIVA STORE'
const DEFAULT_TITLE = 'DIVA STORE — Luxury Perfume Decants | 3 / 5 / 10 ml'
const DEFAULT_DESCRIPTION =
  'Discover your signature scent with DIVA STORE. Explore curated fragrances for women, men and everyone.'
const DEFAULT_IMAGE = '/og-default.svg'

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export interface SeoOptions {
  title?: string
  description?: string
  image?: string
  /** Relative or absolute. Falls back to the current location. */
  canonicalPath?: string
}

export function useSeo({ title, description, image, canonicalPath }: SeoOptions = {}): void {
  const fullTitle = title ? `${sanitizeText(title, 70)} — ${SITE}` : DEFAULT_TITLE
  const desc = description ? sanitizeText(description, 180) : DEFAULT_DESCRIPTION
  const img = image ?? DEFAULT_IMAGE

  useEffect(() => {
    document.title = fullTitle

    upsertMeta('meta[name="description"]', 'name', 'description', desc)
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', img)
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE)
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', img)

    const path = canonicalPath ?? window.location.pathname
    const url = `${window.location.origin}${path}`
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url)

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }, [fullTitle, desc, img, canonicalPath])
}