import { Star, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/types'
import type { CatalogFilters } from '@/hooks/useCatalog'
import { ALL_NOTES, FAMILY_OPTIONS, GENDER_OPTIONS, PRICE_BOUNDS } from '@/hooks/useCatalog'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'

/* ==========================================================================
   Filters — shared by the desktop sidebar and the mobile drawer.
   Facet counts come from the currently visible pool, minus the facet itself
   is too subtle; we simply show how many products carry each attribute.
   ========================================================================== */

export interface FiltersProps {
  filters: CatalogFilters
  products: Product[]
  onToggleFacet: <K extends 'genders' | 'families' | 'brands' | 'notes' | 'badges'>(
    key: K,
    value: CatalogFilters[K][number],
  ) => void
  onPriceChange: (range: [number, number]) => void
  onMinRating: (rating: number) => void
  onReset: () => void
  activeCount: number
  className?: string
}

const RATING_OPTIONS = [4, 3, 2]

export function Filters({
  filters,
  products,
  onToggleFacet,
  onPriceChange,
  onMinRating,
  onReset,
  activeCount,
  className,
}: FiltersProps) {
  const allNotes = ALL_NOTES.map((note) => ({
    note,
    count: products.filter((p) => p.noteTags.includes(note)).length,
  }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)

  const brands = [...new Set(products.map((p) => p.brand))]

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <div className="flex items-center justify-between">
        <h2 className="eyebrow text-dark">Refine</h2>
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-[0.625rem] uppercase tracking-[0.16em] text-burgundy transition-colors hover:text-burgundy-deep"
            >
              <X className="size-3" aria-hidden="true" />
              Clear ({activeCount})
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <Group title="Gender">
        {GENDER_OPTIONS.map((option) => (
          <CheckboxRow
            key={option.value}
            label={option.label}
            count={products.filter((p) => p.gender === option.value).length}
            checked={filters.genders.includes(option.value)}
            onChange={() => onToggleFacet('genders', option.value)}
          />
        ))}
      </Group>

      <Group title="Fragrance family">
        {FAMILY_OPTIONS.map((option) => (
          <CheckboxRow
            key={option.value}
            label={option.label}
            count={products.filter((p) => p.category === option.value).length}
            checked={filters.families.includes(option.value)}
            onChange={() => onToggleFacet('families', option.value)}
          />
        ))}
      </Group>

      <Group title="Price">
        <PriceRange value={filters.priceRange} onChange={onPriceChange} />
      </Group>

      <Group title="Brand">
        {brands.map((brand) => (
          <CheckboxRow
            key={brand}
            label={brand}
            count={products.filter((p) => p.brand === brand).length}
            checked={filters.brands.includes(brand)}
            onChange={() => onToggleFacet('brands', brand)}
          />
        ))}
      </Group>

      <Group title="Notes">
        <div className="max-h-56 overflow-y-auto pr-1">
          {allNotes.map(({ note, count }) => (
            <CheckboxRow
              key={note}
              label={note}
              count={count}
              checked={filters.notes.includes(note)}
              onChange={() => onToggleFacet('notes', note)}
            />
          ))}
        </div>
      </Group>

      <Group title="Rating">
        <ul className="flex flex-col gap-1">
          {RATING_OPTIONS.map((rating) => (
            <li key={rating}>
              <button
                type="button"
                onClick={() => onMinRating(filters.minRating === rating ? 0 : rating)}
                aria-pressed={filters.minRating === rating}
                className={cn(
                  'flex w-full items-center gap-2 py-1.5 text-left text-[0.8125rem] transition-colors',
                  filters.minRating === rating ? 'text-burgundy' : 'text-muted hover:text-dark',
                )}
              >
                <span className="flex items-center gap-0.5" aria-hidden="true">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 text-gold" fill="currentColor" />
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, i) => (
                    <Star key={`e${i}`} className="size-3.5 text-dark/15" />
                  ))}
                </span>
                <span className="text-[0.75rem]">&amp; up</span>
              </button>
            </li>
          ))}
        </ul>
      </Group>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Pieces
   -------------------------------------------------------------------------- */

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-dark/10 pt-6">
      <legend className="sr-only">{title}</legend>
      <p className="mb-4 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-dark">{title}</p>
      <div className="flex flex-col">{children}</div>
    </fieldset>
  )
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      className={cn(
        'group flex cursor-pointer items-center gap-3 py-1.5 text-[0.8125rem] transition-colors',
        checked ? 'text-burgundy' : 'text-muted hover:text-dark',
      )}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'flex size-4 shrink-0 items-center justify-center border transition-all duration-200',
          checked ? 'border-burgundy bg-burgundy' : 'border-dark/25 bg-transparent group-hover:border-burgundy/60',
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="#F7F1EA" strokeWidth="2">
            <path d="M2 6.2l2.6 2.6L10 3.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex-1">{label}</span>
      <span className="text-[0.6875rem] text-muted/70">{count}</span>
    </label>
  )
}

function PriceRange({
  value,
  onChange,
}: {
  value: [number, number]
  onChange: (range: [number, number]) => void
}) {
  const [min, max] = PRICE_BOUNDS

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-1 flex justify-between text-[0.6875rem] text-muted">
          <label htmlFor="price-min">Min</label>
          <span>{formatPrice(value[0])}</span>
        </div>
        <input
          id="price-min"
          type="range"
          min={min}
          max={max}
          step={5}
          value={value[0]}
          onChange={(e) =>
            onChange([Math.min(Number(e.target.value), value[1] - 5), value[1]])
          }
          className="w-full"
        />
      </div>
      <div>
        <div className="mb-1 flex justify-between text-[0.6875rem] text-muted">
          <label htmlFor="price-max">Max</label>
          <span>{formatPrice(value[1])}</span>
        </div>
        <input
          id="price-max"
          type="range"
          min={min}
          max={max}
          step={5}
          value={value[1]}
          onChange={(e) =>
            onChange([value[0], Math.max(Number(e.target.value), value[0] + 5)])
          }
          className="w-full"
        />
      </div>
      <Button variant="ghost" size="sm" className="self-start px-0" onClick={() => onChange([min, max])}>
        Reset price
      </Button>
    </div>
  )
}

export default Filters