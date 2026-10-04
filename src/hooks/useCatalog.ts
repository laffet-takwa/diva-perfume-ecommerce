import { useCallback, useMemo, useState } from 'react'
import type { FragranceFamily, Gender, Product, ProductBadge } from '@/types'
import { ALL_BRANDS, ALL_FAMILIES, ALL_NOTES, products } from '@/data/products'

export { ALL_BRANDS, ALL_NOTES }

/* ==========================================================================
   Catalogue filtering, sorting and search.
   Pure functions where possible so they can be reused by the shop page,
   the search overlay and the scent finder.
   ========================================================================== */

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' },
  { value: 'rating', label: 'Best rated' },
]

export interface CatalogFilters {
  genders: Gender[]
  families: FragranceFamily[]
  brands: string[]
  notes: string[]
  badges: ProductBadge[]
  minRating: number
  priceRange: [number, number]
  query: string
}

export const PRICE_BOUNDS: [number, number] = [
  Math.floor(Math.min(...products.map((p) => p.price))),
  Math.ceil(Math.max(...products.map((p) => p.price))),
]

export const EMPTY_FILTERS: CatalogFilters = {
  genders: [],
  families: [],
  brands: [],
  notes: [],
  badges: [],
  minRating: 0,
  priceRange: [PRICE_BOUNDS[0], PRICE_BOUNDS[1]],
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

export function applyFilters(list: Product[], filters: CatalogFilters): Product[] {
  const [minPrice, maxPrice] = filters.priceRange

  return list.filter((product) => {
    if (filters.genders.length && !filters.genders.includes(product.gender)) return false
    if (filters.families.length && !filters.families.includes(product.category)) return false
    if (filters.brands.length && !filters.brands.includes(product.brand)) return false
    if (filters.badges.length && (!product.badge || !filters.badges.includes(product.badge))) return false
    if (product.price < minPrice || product.price > maxPrice) return false
    if (filters.minRating > 0 && product.rating < filters.minRating) return false
    if (filters.notes.length && !filters.notes.some((n) => product.noteTags.includes(n))) return false
    if (!matchesQuery(product, filters.query)) return false
    return true
  })
}

export function applySort(list: Product[], sort: SortKey): Product[] {
  const copy = [...list]
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt))
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
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
  return applySort(applyFilters(products, { ...EMPTY_FILTERS, query }), 'featured').slice(0, limit)
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

export function countActiveFilters(filters: CatalogFilters): number {
  return (
    filters.genders.length +
    filters.families.length +
    filters.brands.length +
    filters.notes.length +
    filters.badges.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] !== PRICE_BOUNDS[0] || filters.priceRange[1] !== PRICE_BOUNDS[1] ? 1 : 0) +
    (filters.query ? 1 : 0)
  )
}

type FacetKey = 'genders' | 'families' | 'brands' | 'notes' | 'badges'

export interface CatalogApi {
  filters: CatalogFilters
  sort: SortKey
  results: Product[]
  activeCount: number
  setSort: (sort: SortKey) => void
  setFilters: (updater: (prev: CatalogFilters) => CatalogFilters) => void
  toggleFacet: <K extends FacetKey>(key: K, value: CatalogFilters[K][number]) => void
  setPriceRange: (range: [number, number]) => void
  setMinRating: (rating: number) => void
  setQuery: (query: string) => void
  resetFilters: () => void
}

export function useCatalog(initial?: Partial<CatalogFilters>): CatalogApi {
  const [filters, setFiltersState] = useState<CatalogFilters>(() => ({ ...EMPTY_FILTERS, ...initial }))
  const [sort, setSort] = useState<SortKey>('featured')

  const results = useMemo(() => applySort(applyFilters(products, filters), sort), [filters, sort])

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
  const resetFilters = useCallback(() => setFiltersState({ ...EMPTY_FILTERS }), [])

  return useMemo(
    () => ({
      filters,
      sort,
      results,
      activeCount: countActiveFilters(filters),
      setSort,
      setFilters,
      toggleFacet,
      setPriceRange,
      setMinRating,
      setQuery,
      resetFilters,
    }),
    [filters, sort, results, setSort, setFilters, toggleFacet, setPriceRange, setMinRating, setQuery, resetFilters],
  )
}