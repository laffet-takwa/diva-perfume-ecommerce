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
import { useCatalog, GENDER_OPTIONS, priceBoundsFor } from '@/hooks/useCatalog'
import type { SortKey } from '@/hooks/useCatalog'
import { useSeo } from '@/hooks/useSeo'
import { DECANT_SIZE_COPY, DECANT_SIZES, ENTRY_PRICE, HERO_DECANT, products } from '@/data/products'
import { useToast } from '@/context'
import type { DecantSize, Gender } from '@/types'
import { cn, formatPrice } from '@/lib/utils'

/* ==========================================================================
   Shop — /perfumes, /perfumes/:gender, /perfumes?size=3|5|10
   Gender lives in the route, the shopped volume and sort in the query string,
   the remaining facets in local state. Every card is priced at the volume
   selected here, so the size tabs are the shop's primary control.
   ========================================================================== */

const GENDER_FROM_PATH = new Set<string>(['women', 'men', 'unisex'])

const SUBTITLES: Record<Gender, string> = {
  women: 'Elegant. Feminine. Unforgettable.',
  men: 'Bold. Refined. Magnetic.',
  unisex: 'Beyond labels — composed for everyone.',
}

const SIZE_QUESTIONS: Record<Gender, string> = {
  women: 'her',
  men: 'him',
  unisex: 'everyone',
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
  const sizeParam = Number(searchParams.get('size'))

  const {
    filters,
    sort,
    size,
    results,
    activeCount,
    setQuery,
    setSort,
    setSize,
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

  useEffect(() => {
    if (DECANT_SIZES.includes(sizeParam as DecantSize)) setSize(sizeParam as DecantSize)
  }, [sizeParam, setSize])

  // Brief skeleton on first paint so the grid never pops in.
  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 420)
    return () => window.clearTimeout(id)
  }, [])

  const bounds = useMemo(() => priceBoundsFor(size), [size])

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
      : 'All fragrances'

  const sizeCopy = DECANT_SIZE_COPY[size]
  const count = gender ? products.filter((p) => p.gender === gender).length : products.length
  const subtitle = gender
    ? `${SUBTITLES[gender]} ${count} fragrances, decanted from the ${size} ml up.`
    : `The complete DIVA shelf — ${products.length} fragrances, decanted from the ${size} ml up.`

  useSeo({
    title: gender ? `${heading} decants` : queryParam ? heading : 'Shop all decants',
    description: `${heading} at DIVA STORE. ${subtitle} Authentic ${size} ml decants from ${formatPrice(ENTRY_PRICE[size])}, free delivery over 150 DT.`,
    canonicalPath: gender ? `/perfumes/${gender}` : '/perfumes',
  })

  const clearAll = () => {
    resetFilters()
    setSize(HERO_DECANT)
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

  const applySize = (next: DecantSize) => {
    setSize(next)
    const params = new URLSearchParams(searchParams)
    if (next === HERO_DECANT) params.delete('size')
    else params.set('size', String(next))
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
    bounds,
    onToggleFacet,
    onPriceChange: setPriceRange,
    onMinRating: setMinRating,
    onReset: clearAll,
    activeCount,
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Page head */}
      <div className="border-b border-noir/10 bg-sand/40">
        <div className="container-lux py-14 md:py-20">
          <Reveal variant="up">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                <li>
                  <Link to="/" className="transition-colors hover:text-noir">
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

      {/* Size tabs — the shop's primary control */}
      <div className="sticky top-16 z-30 border-b border-noir/10 bg-ivory/92 backdrop-blur-lg lg:top-20">
        <div className="container-lux no-scrollbar flex gap-2 overflow-x-auto py-3">
          <span className="hidden shrink-0 items-center pr-3 text-[0.5625rem] uppercase tracking-[0.22em] text-muted sm:flex">
            Shop by size
          </span>
          {DECANT_SIZES.map((ml) => {
            const selected = ml === size
            return (
              <button
                key={ml}
                type="button"
                onClick={() => applySize(ml)}
                aria-pressed={selected}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-left transition-all duration-300',
                  selected
                    ? 'border-noir bg-noir text-ivory'
                    : 'border-noir/15 text-muted hover:border-noir/45 hover:text-noir',
                )}
              >
                <span className="block font-display text-[0.8125rem] leading-tight">
                  {DECANT_SIZE_COPY[ml].label}
                </span>
                <span
                  className={cn(
                    'block text-[0.5625rem] uppercase tracking-[0.14em]',
                    selected ? 'text-gold' : 'text-muted/80',
                  )}
                >
                  from {formatPrice(ENTRY_PRICE[ml])}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="container-lux grid gap-10 py-12 lg:grid-cols-[16rem_1fr] lg:gap-14 lg:py-16">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-44 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
            <Filters {...filterProps} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-noir/10 pb-5">
            <p className="text-[0.75rem] uppercase tracking-[0.18em] text-muted" aria-live="polite">
              {loading
                ? 'Loading…'
                : `${visible.length} fragrance${visible.length === 1 ? '' : 's'} · ${size} ml`}
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
                  <span className="flex size-4 items-center justify-center rounded-full bg-noir text-[0.5rem] text-ivory">
                    {activeCount}
                  </span>
                )}
              </Button>
              <SortSelect value={sort} onChange={applySort} className="max-sm:hidden" />
            </div>
          </div>

          {/* Volume explainer — one line, always visible, never in the way */}
          <p className="pt-5 text-[0.8125rem] leading-relaxed text-muted">
            <span className="text-dark">{sizeCopy.kicker}:</span> {sizeCopy.blurb}{' '}
            {sizeCopy.sprays}, and{' '}
            {gender
              ? `it is the easiest way to find a scent for ${SIZE_QUESTIONS[gender]}.`
              : 'the volume most people start with.'}
          </p>

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
                      className="inline-flex items-center gap-1.5 rounded-xs border border-noir/12 px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-noir hover:text-noir"
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
                title="Nothing matches that."
                description="No fragrance matches this combination at this size. Loosen a filter, or start again."
                action={{ label: 'Explore all fragrances', to: '/perfumes' }}
              />
            ) : (
              <ProductGrid
                products={visible}
                ml={size}
                animationKey={`${sort}-${size}-${gender ?? 'all'}-${activeCount}-${queryParam}`}
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
              Size
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DECANT_SIZES.map((ml) => (
                <button
                  key={ml}
                  type="button"
                  onClick={() => applySize(ml)}
                  aria-pressed={ml === size}
                  className={cn(
                    'rounded-xs border px-3 py-2.5 text-center transition-colors',
                    ml === size
                      ? 'border-noir bg-noir text-ivory'
                      : 'border-noir/15 text-muted hover:border-noir/45',
                  )}
                >
                  <span className="block font-display text-[0.8125rem]">{DECANT_SIZE_COPY[ml].label}</span>
                  <span
                    className={cn(
                      'block text-[0.5625rem] uppercase tracking-[0.14em]',
                      ml === size ? 'text-gold' : 'text-muted/80',
                    )}
                  >
                    {formatPrice(ENTRY_PRICE[ml])}
                  </span>
                </button>
              ))}
            </div>
          </div>

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
              className="mt-4 text-[0.625rem] uppercase tracking-[0.16em] text-noir"
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
