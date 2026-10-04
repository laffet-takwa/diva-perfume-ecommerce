import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductGrid from '@/components/product/ProductGrid'
import Filters from '@/components/shop/Filters'
import type { FiltersProps } from '@/components/shop/Filters'
import SortSelect from '@/components/shop/SortSelect'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import Reveal from '@/components/ui/Reveal'
import { useCatalog, GENDER_OPTIONS } from '@/hooks/useCatalog'
import type { SortKey } from '@/hooks/useCatalog'
import { useSeo } from '@/hooks/useSeo'
import { products } from '@/data/products'
import { useToast } from '@/context'
import type { Gender } from '@/types'

/* ==========================================================================
   Shop — /perfumes, /perfumes/women, /perfumes/men, /perfumes/unisex
   Gender lives in the route; sort and search live in the query string;
   the remaining facets stay in local state.
   ========================================================================== */

const GENDER_FROM_PATH = new Set<string>(['women', 'men', 'unisex'])

const SUBTITLES: Record<Gender, string> = {
  women: 'Elegant. Feminine. Unforgettable.',
  men: 'Bold. Refined. Magnetic.',
  unisex: 'Beyond labels — composed for everyone.',
}

export function Shop() {
  const { gender: genderParam } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { notify } = useToast()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const queryParam = searchParams.get('q') ?? ''
  const sortParam = searchParams.get('sort') as SortKey | null

  const {
    filters,
    sort,
    results,
    activeCount,
    setQuery,
    setSort,
    toggleFacet,
    setPriceRange,
    setMinRating,
    resetFilters,
  } = useCatalog()

  const gender: Gender | null =
    genderParam && GENDER_FROM_PATH.has(genderParam) ? (genderParam as Gender) : null

  // Seed the facet state from the URL whenever those params change.
  useEffect(() => {
    setQuery(queryParam)
  }, [queryParam, setQuery])

  useEffect(() => {
    if (sortParam) setSort(sortParam)
  }, [sortParam, setSort])

  // Brief skeleton on first paint so the grid never pops in.
  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 420)
    return () => window.clearTimeout(id)
  }, [])

  const scoped = useMemo(
    () => (gender ? products.filter((p) => p.gender === gender) : products),
    [gender],
  )

  const visible = useMemo(
    () => (gender ? results.filter((p) => p.gender === gender) : results),
    [results, gender],
  )

  // The route is the source of truth for gender, so mirror it into the facet
  // state that the sidebar renders.
  const displayFilters = useMemo(
    () => ({ ...filters, genders: gender ? [gender] : filters.genders }),
    [filters, gender],
  )

  const heading = gender
    ? (GENDER_OPTIONS.find((g) => g.value === gender)?.label ?? 'Perfumes')
    : queryParam
      ? `Results for “${queryParam}”`
      : 'All perfumes'

  const subtitle = gender
    ? `${SUBTITLES[gender]} ${products.filter((p) => p.gender === gender).length} bottles, from the great houses.`
    : `The complete DIVA STORE shelf. ${products.length} fragrances, all authentic.`

  useSeo({
    title: gender ? `${heading} perfumes` : queryParam ? heading : 'Shop all perfumes',
    description: `${heading} at DIVA STORE. ${subtitle} Curated eau de parfum, free shipping over 150 DT.`,
    canonicalPath: gender ? `/perfumes/${gender}` : '/perfumes',
  })

  const clearAll = () => {
    resetFilters()
    navigate('/perfumes', { replace: true })
  }

  const onToggleFacet: FiltersProps['onToggleFacet'] = (key, value) => {
    if (key === 'genders') {
      const next = gender === (value as Gender) ? null : (value as Gender)
      toggleFacet('genders', value as Gender)
      notify(next ? `Showing ${next}.` : 'Showing every fragrance.', 'info')
      navigate(next ? `/perfumes/${next}` : '/perfumes', { replace: true })
      return
    }
    toggleFacet(key, value)
  }

  const applySort = (value: SortKey) => {
    setSort(value)
    const params = new URLSearchParams(searchParams)
    if (value === 'featured') params.delete('sort')
    else params.set('sort', value)
    setSearchParams(params, { replace: true })
  }

  const chips = [
    ...displayFilters.genders.map((g) => ({ key: 'genders' as const, value: g, label: g })),
    ...filters.families.map((f) => ({ key: 'families' as const, value: f, label: f })),
    ...filters.notes.map((n) => ({ key: 'notes' as const, value: n, label: n })),
    ...filters.brands.map((b) => ({ key: 'brands' as const, value: b, label: b })),
  ]

  const filterProps: FiltersProps = {
    filters: displayFilters,
    products: scoped,
    onToggleFacet,
    onPriceChange: setPriceRange,
    onMinRating: setMinRating,
    onReset: clearAll,
    activeCount,
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Page head */}
      <div className="border-b border-dark/10 bg-cream-deep/40">
        <div className="container-lux py-14 md:py-20">
          <Reveal variant="up">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                <li>
                  <Link to="/" className="transition-colors hover:text-burgundy">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-dark">{heading}</li>
              </ol>
            </nav>
            <h1 className="display-title text-[clamp(2.25rem,5.4vw,3.6rem)]">{heading}</h1>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted">{subtitle}</p>
          </Reveal>
        </div>
      </div>

      <div className="container-lux grid gap-10 py-12 lg:grid-cols-[16rem_1fr] lg:gap-14 lg:py-16">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
            <Filters {...filterProps} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dark/10 pb-5">
            <p className="text-[0.75rem] uppercase tracking-[0.18em] text-muted" aria-live="polite">
              {loading ? 'Loading…' : `${visible.length} fragrance${visible.length === 1 ? '' : 's'}`}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                Filter &amp; sort
                {activeCount > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-burgundy text-[0.5rem] text-cream">
                    {activeCount}
                  </span>
                )}
              </Button>
              <SortSelect value={sort} onChange={applySort} className="max-sm:hidden" />
            </div>
          </div>

          {/* Active chips */}
          <AnimatePresence initial={false}>
            {chips.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 overflow-hidden pt-5"
              >
                {chips.map((chip) => (
                  <li key={`${chip.key}-${chip.value}`}>
                    <button
                      type="button"
                      onClick={() => {
                        if (chip.key === 'genders') navigate('/perfumes', { replace: true })
                        else toggleFacet(chip.key, chip.value)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xs border border-dark/12 px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-burgundy hover:text-burgundy"
                    >
                      {chip.label}
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* Grid */}
          <div className="mt-8">
            {visible.length === 0 && !loading ? (
              <EmptyState
                icon={<SlidersHorizontal className="size-6" aria-hidden="true" />}
                eyebrow="No match"
                title="No fragrance found."
                description="Nothing on the shelf matches this combination. Loosen a filter, or start again."
                action={{ label: 'Explore all perfumes', to: '/perfumes' }}
              />
            ) : (
              <ProductGrid
                products={visible}
                animationKey={`${sort}-${gender ?? 'all'}-${activeCount}-${queryParam}`}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Drawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filter & sort"
        labelId="mobile-filters-title"
        footer={
          <Button
            variant="primary"
            size="lg"
            block
            onClick={() => {
              setMobileFiltersOpen(false)
              notify(`${visible.length} fragrance${visible.length === 1 ? '' : 's'} selected.`)
            }}
          >
            Show {visible.length} result{visible.length === 1 ? '' : 's'}
          </Button>
        }
      >
        <div className="px-6 py-6">
          <div className="mb-8">
            <p className="mb-3 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-dark">
              Sort by
            </p>
            <SortSelect
              value={sort}
              onChange={applySort}
              id="sort-mobile"
              className="w-full [&>select]:w-full"
            />
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 text-[0.625rem] uppercase tracking-[0.16em] text-burgundy"
            >
              Clear all filters
            </button>
          </div>

          <Filters {...filterProps} />
        </div>
      </Drawer>
    </div>
  )
}

export default Shop