import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Search, TrendingUp } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { ProductRating } from '@/components/product/ProductRating'
import { Flacon } from '@/components/product/Flacon'
import { useUI } from '@/context'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { searchProducts } from '@/hooks/useCatalog'
import { products } from '@/data/products'
import {
  formatPrice,
  readStorage,
  sanitizeText,
  spellCount,
  writeStorage,
} from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/motion'

const RECENT_KEY = 'diva.recentSearches.v1'
const TRENDING = ['Vanilla', 'Oud', 'Rose', 'Musk']

/* ==========================================================================
   SearchOverlay — fullscreen, live results as the visitor types.
   ========================================================================== */

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUI()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const [raw, setRaw] = useState('')
  const [recent, setRecent] = useState<string[]>(() => readStorage<string[]>(RECENT_KEY, []))
  const query = sanitizeText(raw, 60)
  const debounced = useDebouncedValue(query, 140)

  const results = useMemo(() => searchProducts(debounced, 6), [debounced])

  useEffect(() => {
    if (!isSearchOpen) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => window.clearTimeout(id)
  }, [isSearchOpen])

  // Reset the field when the overlay is dismissed.
  useEffect(() => {
    if (!isSearchOpen) {
      const id = window.setTimeout(() => setRaw(''), 300)
      return () => window.clearTimeout(id)
    }
  }, [isSearchOpen])

  const remember = (term: string) => {
    const value = sanitizeText(term, 60)
    if (value.length < 2) return
    const next = [value, ...recent.filter((r) => r.toLowerCase() !== value.toLowerCase())].slice(0, 6)
    setRecent(next)
    writeStorage(RECENT_KEY, next)
  }

  const goToProduct = (slug: string) => {
    remember(query)
    closeSearch()
    navigate(`/product/${slug}`)
  }

  const submitSearch = () => {
    if (!query.trim()) return
    remember(query)
    closeSearch()
    navigate(`/perfumes?q=${encodeURIComponent(query)}`)
  }

  const showSuggestions = debounced.trim().length === 0

  return (
    <Modal open={isSearchOpen} onClose={closeSearch} fullscreen labelId="search-title" hideClose>
      <div className="flex h-full flex-col">
        <h2 id="search-title" className="sr-only">
          Search decants
        </h2>

        {/* Search field */}
        <div className="border-b border-dark/10 px-5 py-6 sm:px-10 sm:py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitSearch()
            }}
            role="search"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <Search className="size-5 shrink-0 text-noir sm:size-6" aria-hidden="true" />
              <label htmlFor="site-search" className="sr-only">
                Search decants, brands, notes
              </label>
              <input
                id="site-search"
                ref={inputRef}
                type="search"
                value={raw}
                onChange={(e) => setRaw(e.target.value.slice(0, 60))}
                placeholder="Search decants, brands, notes..."
                autoComplete="off"
                spellCheck={false}
                aria-describedby="search-hint"
                className="w-full bg-transparent font-display text-[1.25rem] text-dark placeholder:text-muted/70 focus:outline-none sm:text-3xl"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="shrink-0 rounded-xs border border-dark/12 px-3 py-1.5 text-[0.5625rem] uppercase tracking-[0.2em] text-muted transition-colors hover:border-noir hover:text-noir"
              >
                Esc
              </button>
            </div>
            <p id="search-hint" className="sr-only">
              Results update as you type. Press Enter to see all matching decants.
            </p>
          </form>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-10 sm:py-8">
          {showSuggestions ? (
            <motion.div
              key="suggestions"
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
              className="grid gap-10 md:grid-cols-2 md:gap-16"
            >
              {recent.length > 0 && (
                <motion.section variants={fadeUp}>
                  <h3 className="eyebrow eyebrow-rule mb-5 text-noir/70">
                    <Clock className="size-3" aria-hidden="true" />
                    Recent searches
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {recent.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => setRaw(term)}
                          className="group flex w-full items-center justify-between border-b border-dark/8 py-2.5 text-left transition-colors hover:text-noir"
                        >
                          <span className="font-display text-base text-dark group-hover:text-noir">
                            {term}
                          </span>
                          <ArrowRight
                            className="size-4 text-muted opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}

              <motion.section variants={fadeUp}>
                <h3 className="eyebrow eyebrow-rule mb-5 text-noir/70">
                  <TrendingUp className="size-3" aria-hidden="true" />
                  Trending notes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((note) => (
                    <button
                      key={note}
                      type="button"
                      onClick={() => setRaw(note)}
                      className="rounded-xs border border-dark/12 px-3.5 py-2 text-[0.6875rem] uppercase tracking-[0.14em] text-dark transition-all duration-300 hover:border-noir hover:bg-noir hover:text-ivory"
                    >
                      {note}
                    </button>
                  ))}
                </div>

                <p className="mt-10 max-w-sm text-[0.8125rem] leading-relaxed text-muted">
                  {spellCount(products.length).replace(/^./, (c) => c.toUpperCase())} fragrances, one shelf. Search by mood, note, family or the name you have been thinking about.
                </p>
              </motion.section>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={staggerContainer(0.05)}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-3xl"
            >
              <p className="eyebrow mb-6 text-muted">
                {results.length > 0
                  ? `${results.length} result${results.length > 1 ? 's' : ''}`
                  : 'No fragrance found'}
              </p>

              {results.length > 0 ? (
                <ul className="flex flex-col">
                  {results.map((product) => (
                    <motion.li key={product.id} variants={fadeUp}>
                      <button
                        type="button"
                        onClick={() => goToProduct(product.slug)}
                        className="group flex w-full items-center gap-4 border-b border-dark/8 py-3.5 text-left transition-colors hover:border-noir/40 sm:gap-6"
                      >
                        <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-taupe/35 sm:size-20">
                          <Flacon
                            art={product.art}
                            photo={product.photo}
                            photoTone={product.photoTone}
                            photoAlt={product.name}
                            bare
                            className="h-[130%] w-[130%] object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                            {product.brand}
                          </span>
                          <span className="mt-1 block truncate font-display text-base text-dark sm:text-lg">
                            {product.name}
                          </span>
                          <span className="mt-0.5 block text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                            {product.categoryLabel}
                          </span>
                        </span>
                        <span className="hidden shrink-0 sm:block">
                          <ProductRating rating={product.rating} size="xs" />
                        </span>
                        <span className="shrink-0 font-display text-sm text-dark">
                          {formatPrice(product.price)}
                        </span>
                        <ArrowRight
                          className="size-4 shrink-0 text-noir opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="py-10">
                  <p className="font-display text-2xl text-dark">No fragrance found.</p>
                  <p className="mt-3 max-w-sm text-[0.875rem] leading-relaxed text-muted">
                    We could not match “{debounced}”. Try a note like vanilla, oud or rose, or browse
                    the full collection.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeSearch()
                      navigate('/perfumes')
                    }}
                    className="mt-7 inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-noir"
                  >
                    Explore all decants
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}

              {results.length > 0 && (
                <button
                  type="button"
                  onClick={submitSearch}
                  className="mt-8 inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-noir transition-colors hover:text-noir-deep"
                >
                  View all results
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default SearchOverlay