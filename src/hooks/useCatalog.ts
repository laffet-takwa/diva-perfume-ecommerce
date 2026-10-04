import { useCallback, useMemo, useState } from 'react'
import type { DecantSize, FragranceFamily, Gender, Product, ProductBadge } from '@/types'
import {
  ALL_BRANDS,
  ALL_FAMILIES,
  ALL_NOTES,
  DECANT_SIZES,
  HERO_DECANT,
  getPriceForSize,
  products,
} from '@/data/products'

export { ALL_BRANDS, ALL_NOTES }

/* ==========================================================================
   Catalogue filtering, sorting and search.
   Pure functions where possible so they can be reused by the shop page,
   the search overlay and the scent shelf.

   The catalogue is priced per volume, so every filter and sort works on the
   price of the volume currently being shopped (`size`). Change the size and
   the price range, the price sort and the price range slider all follow.
   ========================================================================== */

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'saving'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' },
  { value: 'saving', label: 'Biggest saving' },
  { value: 'rating', label: 'Best rated' },
]

export interface CatalogFilters {
  genders: Gender[]
  families: FragranceFamily[]
  brands: string[]
  notes: string[]
  badges: ProductBadge[]
  minRating: number
  /** Price bounds at the shopped volume */
  priceRange: [number, number]
  query: string
}

/** Price bounds are derived per volume, so each size gets its own range. */
export function priceBoundsFor(size: DecantSize): [number, number] {
  const prices = products.map((p) => getPriceForSize(p, size))
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
}

export function isDecantSize(value: string | null): boolean {
  return value !== null && DECANT_SIZES.includes(Number(value) as DecantSize)
}

export const EMPTY_FILTERS: CatalogFilters = {
  genders: [],
  families: [],
  brands: [],
  notes: [],
  badges: [],
  minRating: 0,
  priceRange: priceBoundsFor(HERO_DECANT),
  query: '',
}

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex' },
]

export const FAMILY_OPTIONS = ALL_FAMILIES.map((f) => ({ value: f, label: f }))

/* --------------------------------------------------------------------------
   Pure operations
   -------------------------------------------------------------------------- */

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function toggleInArray<T>(list: T[], value: T): T[] {
  return toggle(list, value)
}

export function matchesQuery(product: Product, query: string): boolean {
  if (!query) return true
  const haystack = [
    product.name,
    product.brand,
    product.category,
    product.categoryLabel,
    product.gender,
    product.description,
    ...product.notes.top,
    ...product.notes.heart,
    ...product.notes.base,
    ...product.noteTags,
  ]
    .join(' ')
    .toLowerCase()

  // Every whitespace-separated term must appear somewhere.
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

export function applyFilters(list: Product[], filters: CatalogFilters, size: DecantSize): Product[] {
  const [minPrice, maxPrice] = filters.priceRange

  return list.filter((product) => {
    if (filters.genders.length && !filters.genders.includes(product.gender)) return false
    if (filters.families.length && !filters.families.includes(product.category)) return false
    if (filters.brands.length && !filters.brands.includes(product.brand)) return false
    if (filters.badges.length && (!product.badge || !filters.badges.includes(product.badge))) return false
    const price = getPriceForSize(product, size)
    if (price < minPrice || price > maxPrice) return false
    if (filters.minRating > 0 && product.rating < filters.minRating) return false
    if (filters.notes.length && !filters.notes.some((n) => product.noteTags.includes(n))) return false
    if (!matchesQuery(product, filters.query)) return false
    return true
  })
}

/** Percentage saved against the full bottle, at the shopped volume. */
function savingPercent(product: Product, size: DecantSize): number {
  const perMl = getPriceForSize(product, size) / size
  const fullPerMl = product.fullBottle.price / product.fullBottle.ml
  return 1 - perMl / fullPerMl
}

export function applySort(list: Product[], sort: SortKey, size: DecantSize): Product[] {
  const copy = [...list]
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt))
    case 'price-asc':
      return copy.sort((a, b) => getPriceForSize(a, size) - getPriceForSize(b, size))
    case 'price-desc':
      return copy.sort((a, b) => getPriceForSize(b, size) - getPriceForSize(a, size))
    case 'saving':
      return copy.sort((a, b) => savingPercent(b, size) - savingPercent(a, size))
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    case 'featured':
    default:
      // Badged first, then by house popularity.
      const rank = (p: Product) => (p.badge ? 1 : 0)
      return copy.sort((a, b) => rank(b) - rank(a) || b.popularity - a.popularity)
  }
}

export function searchProducts(query: string, limit = 8): Product[] {
  if (!query.trim()) return []
  return applySort(applyFilters(products, { ...EMPTY_FILTERS, query }, HERO_DECANT), 'featured', HERO_DECANT).slice(
    0,
    limit,
  )
}

/* --------------------------------------------------------------------------
   Facet counts — "Floral (12)" beside each checkbox
   -------------------------------------------------------------------------- */

export function countBy(list: Product[], pick: (p: Product) => string | undefined): Map<string, number> {
  const counts = new Map<string, number>()
  for (const item of list) {
    const key = pick(item)
    if (!key) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

/* --------------------------------------------------------------------------
   Hook
   -------------------------------------------------------------------------- */

export function countActiveFilters(filters: CatalogFilters, bounds: [number, number]): number {
  return (
    filters.genders.length +
    filters.families.length +
    filters.brands.length +
    filters.notes.length +
    filters.badges.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] !== bounds[0] || filters.priceRange[1] !== bounds[1] ? 1 : 0) +
    (filters.query ? 1 : 0)
  )
}

type FacetKey = 'genders' | 'families' | 'brands' | 'notes' | 'badges'

export interface CatalogApi {
  filters: CatalogFilters
  sort: SortKey
  /** The volume currently being shopped */
  size: DecantSize
  results: Product[]
  activeCount: number
  setSort: (sort: SortKey) => void
  setFilters: (updater: (prev: CatalogFilters) => CatalogFilters) => void
  toggleFacet: <K extends FacetKey>(key: K, value: CatalogFilters[K][number]) => void
  setPriceRange: (range: [number, number]) => void
  setMinRating: (rating: number) => void
  setQuery: (query: string) => void
  setSize: (size: DecantSize) => void
  resetFilters: () => void
}

export function useCatalog(initial?: Partial<CatalogFilters>): CatalogApi {
  const [filters, setFiltersState] = useState<CatalogFilters>(() => ({ ...EMPTY_FILTERS, ...initial }))
  const [sort, setSort] = useState<SortKey>('featured')
  const [size, setSizeState] = useState<DecantSize>(HERO_DECANT)

  const results = useMemo(
    () => applySort(applyFilters(products, filters, size), sort, size),
    [filters, sort, size],
  )

  const setFilters = useCallback(
    (updater: (prev: CatalogFilters) => CatalogFilters) => setFiltersState(updater),
    [],
  )

  const toggleFacet = useCallback(<K extends FacetKey>(key: K, value: CatalogFilters[K][number]) => {
    setFiltersState((prev) => {
      const list = prev[key] as string[]
      const next = toggle(list, value as string)
      return { ...prev, [key]: next } as CatalogFilters
    })
  }, [])

  const setPriceRange = useCallback(
    (priceRange: [number, number]) => setFiltersState((prev) => ({ ...prev, priceRange })),
    [],
  )
  const setMinRating = useCallback(
    (minRating: number) => setFiltersState((prev) => ({ ...prev, minRating })),
    [],
  )
  const setQuery = useCallback(
    (query: string) =>
      setFiltersState((prev) => (prev.query === query ? prev : { ...prev, query })),
    [],
  )

  // Switching volume re-bases the price window onto that volume's own range.
  const setSize = useCallback((next: DecantSize) => {
    setSizeState(next)
    setFiltersState((prev) => ({ ...prev, priceRange: priceBoundsFor(next) }))
  }, [])

  const resetFilters = useCallback(() => setFiltersState({ ...EMPTY_FILTERS }), [])

  return useMemo(
    () => ({
      filters,
      sort,
      size,
      results,
      activeCount: countActiveFilters(filters, priceBoundsFor(size)),
      setSort,
      setFilters,
      toggleFacet,
      setPriceRange,
      setMinRating,
      setQuery,
      setSize,
      resetFilters,
    }),
    [filters, sort, size, results, setSort, setFilters, toggleFacet, setPriceRange, setMinRating, setQuery, setSize, resetFilters],
  )
}
