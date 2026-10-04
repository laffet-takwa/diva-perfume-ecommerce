/* ==========================================================================
   DIVA STORE — Navigation, footer and store constants
   ========================================================================== */

import { WHATSAPP_LINK } from '@/lib/whatsapp'

export interface NavItem {
  label: string
  to: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Shop All', to: '/perfumes' },
  { label: '3 ml', to: '/perfumes?size=3' },
  { label: '5 ml', to: '/perfumes?size=5' },
  { label: '10 ml', to: '/perfumes?size=10' },
  { label: 'For Her', to: '/perfumes/women' },
  { label: 'For Him', to: '/perfumes/men' },
  { label: 'About', to: '/about' },
]

export interface FooterColumn {
  title: string
  links: NavItem[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All fragrances', to: '/perfumes' },
      { label: '3 ml decants', to: '/perfumes?size=3' },
      { label: '5 ml decants', to: '/perfumes?size=5' },
      { label: '10 ml decants', to: '/perfumes?size=10' },
      { label: 'Best Sellers', to: '/collections?edit=bestsellers' },
    ],
  },
  {
    title: 'For',
    links: [
      { label: 'For Her', to: '/perfumes/women' },
      { label: 'For Him', to: '/perfumes/men' },
      { label: 'Unisex', to: '/perfumes/unisex' },
      { label: 'Try first · 3 ml', to: '/collections?edit=try-first' },
      { label: 'Best value · 10 ml', to: '/collections?edit=value' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact', to: '/help/contact' },
      { label: 'How decants work', to: '/help/shipping' },
      { label: 'Returns', to: '/help/returns' },
      { label: 'FAQ', to: '/help/faq' },
      { label: 'Track order', to: '/help/track-order' },
    ],
  },
]

export interface SocialLink {
  label: string
  href: string
  handle: string
}

/** Only the three channels the house actually runs. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Instagram', handle: '@divastore', href: 'https://instagram.com/divastore' },
  { label: 'TikTok', handle: '@divastore', href: 'https://tiktok.com/@divastore' },
  { label: 'WhatsApp', handle: 'Chat with us', href: WHATSAPP_LINK },
]

export const FREE_SHIPPING_COPY = 'Free delivery over 150 DT'

export const ANNOUNCEMENT =
  'Decanted to order · 3 / 5 / 10 ml · Free delivery over 150 DT · Pay cash on delivery'
