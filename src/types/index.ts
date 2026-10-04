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

/** The volumes we decant. The house does not sell full bottles. */
export type DecantSize = 3 | 5 | 10

export interface PerfumeNotes {
  top: string[]
  heart: string[]
  base: string[]
}

export interface ProductSize {
  /** Decant volume in millilitres */
  ml: DecantSize
  /** Price for this volume, in DT */
  price: number
}

/** The original bottle a decant is poured from — the price comparison. */
export interface FullBottle {
  ml: number
  price: number
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  /** Price of the hero decant (5 ml), in DT */
  price: number
  /** Retail reference for the bottle this fragrance is decanted from */
  fullBottle: FullBottle
  category: FragranceFamily
  categoryLabel: string
  gender: Gender
  rating: number
  reviews: number
  badge?: ProductBadge
  notes: PerfumeNotes
  description: string
  longDescription: string
  /** The 3 / 5 / 10 ml ladder, always all three, smallest first */
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
  /** Product photography carried on the line so the cart shows the real flacon */
  photo?: string
  photoTone?: 'light' | 'dark'
  ml: number
  unitPrice: number
  /** Retail price of the full bottle, so the cart can show what the decant saved */
  fullBottlePrice: number
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

/** A decant shop takes no card details — cash on delivery or bank transfer. */
export type PaymentMethod = 'cod' | 'transfer'

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