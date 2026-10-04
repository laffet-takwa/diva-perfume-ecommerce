import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProductGrid from '@/components/product/ProductGrid'
import { SectionHeading } from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { BESTSELLERS, FOR_EVERYONE, FOR_HER, FOR_HIM, products } from '@/data/products'
import type { Gender } from '@/types'
import { cn } from '@/lib/utils'

/* ==========================================================================
   ScentShelf — Best Sellers with a For Him / For Her switch.
   The filter swaps the pool client-side; nothing refetches and nothing
   unmounts the shell, so switching tabs stays instant. The default tab shows
   the house's bestsellers across every gender.
   ========================================================================== */

type ShelfKey = 'best' | Gender

const TABS: { key: ShelfKey; label: string; to: string }[] = [
  { key: 'best', label: 'Best Sellers', to: '/collections?edit=bestsellers' },
  { key: 'women', label: 'For Her', to: '/perfumes/women' },
  { key: 'men', label: 'For Him', to: '/perfumes/men' },
  { key: 'unisex', label: 'Unisex', to: '/perfumes/unisex' },
]

const POOLS: Record<ShelfKey, typeof products> = {
  best: BESTSELLERS,
  women: FOR_HER,
  men: FOR_HIM,
  unisex: FOR_EVERYONE,
}

const SHELF_SIZE = 8

export function ScentShelf() {
  const [tab, setTab] = useState<ShelfKey>('best')

  const items = useMemo(() => POOLS[tab].slice(0, SHELF_SIZE), [tab])
  const active = TABS.find((t) => t.key === tab) ?? TABS[0]

  return (
    <section className="relative py-20 md:py-28 lg:py-32" aria-labelledby="shelf-title">
      <div className="container-lux">
        <Reveal variant="up">
          <SectionHeading
            index="04"
            eyebrow="Best sellers"
            title={<span id="shelf-title">The shelf everyone empties</span>}
            subtitle="Ranked by what our customers reorder, not by what we would like to sell you."
          />
        </Reveal>

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Filter best sellers"
          className="no-scrollbar mt-10 flex gap-2 overflow-x-auto border-b border-noir/10 pb-4"
        >
          {TABS.map((t) => {
            const selected = t.key === tab
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(t.key)}
                className={cn(
                  'shrink-0 rounded-full border px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-all duration-300',
                  selected
                    ? 'border-noir bg-noir text-ivory'
                    : 'border-noir/15 text-muted hover:border-noir/50 hover:text-noir',
                )}
              >
                {t.label}
                <span className={cn('ml-2 text-[0.5625rem]', selected ? 'text-gold' : 'text-muted/70')}>
                  {POOLS[t.key].length}
                </span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 lg:mt-16"
          >
            <ProductGrid products={items} animationKey={`shelf-${tab}`} />
          </motion.div>
        </AnimatePresence>

        <div className="mt-14 flex justify-center">
          <ButtonLink to={active.to} variant="outline" size="lg" arrow>
            Shop all {active.label.toLowerCase()}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

export default ScentShelf
