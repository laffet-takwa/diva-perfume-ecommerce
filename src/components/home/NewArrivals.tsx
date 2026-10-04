import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProductGrid from '@/components/product/ProductGrid'
import Reveal from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { NEWEST_PRODUCTS } from '@/data/products'
import { applySort } from '@/hooks/useCatalog'
import type { SortKey } from '@/hooks/useCatalog'
import { cn } from '@/lib/utils'

/* ==========================================================================
   New arrivals — "Just In"
   Three sorts, animated on change.
   ========================================================================== */

const TABS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price' },
  { value: 'featured', label: 'Popularity' },
]

export function NewArrivals() {
  const [tab, setTab] = useState<SortKey>('newest')

  const items = useMemo(() => applySort(NEWEST_PRODUCTS, tab).slice(0, 8), [tab])

  return (
    <section className="bg-sand/40 py-20 md:py-28" aria-labelledby="just-in-title">
      <div className="container-lux">
        <Reveal variant="up" className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="05"
            eyebrow="Just In"
            title={<span id="just-in-title">The newest arrivals</span>}
            subtitle="Straight from the houses — new releases and limited runs, as they arrive."
          />

          <div
            className="flex shrink-0 items-center gap-1 self-start rounded-xs border border-dark/12 p-1"
            role="tablist"
            aria-label="Sort new arrivals"
          >
            {TABS.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={tab === item.value}
                onClick={() => setTab(item.value)}
                className={cn(
                  'relative rounded-xs px-4 py-2 text-[0.625rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300',
                  tab === item.value ? 'text-ivory' : 'text-muted hover:text-dark',
                )}
              >
                {tab === item.value && (
                  <motion.span
                    layoutId="justin-pill"
                    className="absolute inset-0 rounded-xs bg-noir"
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 lg:mt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductGrid products={items} animationKey={tab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default NewArrivals