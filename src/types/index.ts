/* ==========================================================================
   DIVA STORE — Domain types
   ========================================================================== */

export type Gender = 'women' | 'men' | 'unisex'

export type ProductBadge = 'NEW' | 'BESTSELLER' | 'LIMITED' | 'EXCLUSIVE'

export type FragranceFamily =
  | 'Floral'
  | 'Oriental'
  | 'Woody'
  | 'Fresh'
  | 'Citrus'
  | 'Gourmand'
  | 'Musk'

export interface PerfumeNotes {
  top: string[]
  heart: string[]
  base: string[]
}

export interface ProductSize {
  /** Volume in millilitres */
  ml: 30 | 50 | 100
  /** Price for this volume, in DT */
  price: number
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  /** Price of the default (featured) volume, in DT */
  price: number
  oldPrice?: number
  category: FragranceFamily
  categoryLabel: string
  gender: Gender
  rating: number
  reviews: number
  badge?: ProductBadge
  notes: PerfumeNotes
  description: string
  longDescription: string
  sizes: ProductSize[]
  /** Real product photography, served from /public. Absent = drawn flacon. */
  photo?: string
  /** Alt text for the photograph */
  photoAlt?: string
  /**
   * `light` photography is multiplied into the plate so the white studio
   * backdrop disappears; `dark` photography fills the frame instead.
   */
  photoTone?: 'light' | 'dark'
  /** Visual recipe for the generated bottle artwork */
  art: ProductArt
  /** Free-form tags used by the scent finder + note filters */
  moods: ScentMood[]
  noteTags: string[]
  /** ISO date, drives the "Newest" sort */
  releasedAt: string
  /** Denormalised popularity score used by the "Popular" sort */
  popularity: number
}

export interface ProductArt {
  /** Liquid / juice colour */
  juice: string
  /** Glass body tint */
  glass: string
  /** Cap finish */
  cap: string
  /** Cap hardware */
  hardware: string
  /** Backdrop hue behind the bottle */
  backdrop: string
  /** Silhouette variant */
  silhouette: 'rect' | 'oval' | 'tall' | 'faceted'
}

export type ScentMood = 'Romantic' | 'Confident' | 'Fresh' | 'Mysterious' | 'Elegant' | 'Energetic'

export type Occasion = 'Everyday' | 'Office' | 'Date Night' | 'Evening' | 'Special Occasion'

/* --------------------------------------------------------------------------
   Cart
   -------------------------------------------------------------------------- */

export interface CartLine {
  /** `${productId}::${ml}` — one line per product+volume */
  key: string
  productId: string
  slug: string
  name: string
  brand: string
  image: ProductArt
  /** Product photography carried on the line so the bag shows the real flacon */
  photo?: string
  photoTone?: 'light' | 'dark'
  ml: number
  unitPrice: number
  quantity: number
}

export interface ShippingMethod {
  id: 'standard' | 'express'
  label: string
  detail: string
  price: number
  etaDays: [number, number]
}

/* --------------------------------------------------------------------------
   Orders
   -------------------------------------------------------------------------- */

export interface CustomerDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  notes?: string
}

export type PaymentMethod = 'card' | 'cod'

export interface Order {
  id: string
  createdAt: string
  items: CartLine[]
  customer: CustomerDetails
  payment: PaymentMethod
  shipping: ShippingMethod
  subtotal: number
  shippingPrice: number
  total: number
  etaDays: [number, number]
}