export interface NavItem {
  label: string
  to: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Perfumes', to: '/perfumes' },
  { label: 'Women', to: '/perfumes/women' },
  { label: 'Men', to: '/perfumes/men' },
  { label: 'Unisex', to: '/perfumes/unisex' },
  { label: 'Collections', to: '/collections' },
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
      { label: 'Women', to: '/perfumes/women' },
      { label: 'Men', to: '/perfumes/men' },
      { label: 'Unisex', to: '/perfumes/unisex' },
      { label: 'Best Sellers', to: '/collections?edit=bestsellers' },
      { label: 'New Arrivals', to: '/collections?edit=new-arrivals' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact', to: '/help/contact' },
      { label: 'Shipping', to: '/help/shipping' },
      { label: 'Returns', to: '/help/returns' },
      { label: 'FAQ', to: '/help/faq' },
      { label: 'Track Order', to: '/help/track-order' },
    ],
  },
  {
    title: 'Diva Store',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Story', to: '/about#story' },
      { label: 'Careers', to: '/about#careers' },
      { label: 'Journal', to: '/about#journal' },
    ],
  },
]

export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'Pinterest', href: 'https://pinterest.com' },
]

export const ANNOUNCEMENT =
  'Free shipping on orders over 150 DT — Free delivery • Easy returns • Secure payment'

export const FREE_SHIPPING_COPY = 'Free shipping on orders over 150 DT'