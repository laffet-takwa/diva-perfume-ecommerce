import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '@/components/product/ProductGrid'
import Reveal from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { ButtonLink } from '@/components/ui/Button'
import ArtScene from '@/components/art/ArtScene'
import { BESTSELLERS, NEWEST_PRODUCTS, getPriceForSize, pricePerMl, products } from '@/data/products'
import type { DecantSize } from '@/types'
import { useSeo } from '@/hooks/useSeo'

/* ==========================================================================
   Collections — curated edits
   Each edit is scoped to one volume, so a collection is a decision, not a mood
   board: "3 ml to try", "10 ml because you already love it".
   ========================================================================== */

interface Edit {
  key: string
  name: string
  eyebrow: string
  title: string
  line: string
  to: string
  scene: 'women' | 'men' | 'unisex' | 'editorial' | 'ritual' | 'atelier'
  /** Pins the card size picker to one volume */
  ml?: DecantSize
  pick: () => typeof products
}

const EDITS: Edit[] = [
  {
    key: 'bestsellers',
    name: 'Best Sellers',
    eyebrow: 'The Icons',
    title: 'Proven, order after order',
    line: 'The fragrances our customers reorder most. Nothing here is a gamble.',
    to: '/collections?edit=bestsellers',
    scene: 'ritual',
    pick: () => BESTSELLERS.slice(0, 8),
  },
  {
    key: 'try-first',
    name: 'Try first',
    eyebrow: 'Start at 3 ml',
    title: 'The lowest-risk way in',
    line: 'Our cheapest decants. Cheap enough to try three of them before you commit to anything.',
    to: '/perfumes?size=3&sort=price-asc',
    scene: 'editorial',
    ml: 3,
    pick: () =>
      [...products].sort((a, b) => getPriceForSize(a, 3) - getPriceForSize(b, 3)).slice(0, 8),
  },
  {
    key: 'value',
    name: 'Best value',
    eyebrow: 'Go 10 ml',
    title: 'Cheapest per millilitre',
    line: 'Once a scent is yours, stop paying luxury prices for it. These cost the least per spray.',
    to: '/perfumes?size=10&sort=price-asc',
    scene: 'atelier',
    ml: 10,
    pick: () => [...products].sort((a, b) => pricePerMl(a, 10) - pricePerMl(b, 10)).slice(0, 8),
  },
  {
    key: 'new-arrivals',
    name: 'New Arrivals',
    eyebrow: 'Just poured',
    title: 'Fresh in the decanter',
    line: 'The newest bottles on the shelf, just added to the range.',
    to: '/perfumes?sort=newest',
    scene: 'women',
    pick: () => NEWEST_PRODUCTS.slice(0, 8),
  },
  {
    key: 'for-everyone',
    name: 'Unisex',
    eyebrow: 'For everyone',
    title: 'Composed without gender',
    line: 'Scents we hand to anyone without checking who it is for.',
    to: '/perfumes/unisex',
    scene: 'unisex',
    pick: () => products.filter((p) => p.gender === 'unisex'),
  },
]

export function Collections() {
  const [searchParams] = useSearchParams()
  const editParam = searchParams.get('edit')
  const highlight = EDITS.find((e) => e.key === editParam)

  useSeo({
    title: 'Collections',
    description:
      'Curated decant edits from DIVA STORE — bestsellers, 3 ml to try first, 10 ml for best value and new arrivals.',
    canonicalPath: '/collections',
  })

  const sections = useMemo(
    () => (highlight ? EDITS.filter((e) => e.key === highlight.key) : EDITS),
    [highlight],
  )

  if (sections.length === 0) {
    return (
      <div className="pt-16 lg:pt-20">
        <EmptyState
          eyebrow="Not found"
          title="This collection could not be found."
          description="It may have been renamed. Browse the full house catalogue instead."
          action={{ label: 'Explore all decants', to: '/perfumes' }}
        />
      </div>
    )
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Head */}
      <section className="border-b border-dark/10 bg-sand/40" aria-labelledby="collections-title">
        <div className="container-lux py-16 md:py-24">
          <Reveal variant="up">
            <div className="eyebrow eyebrow-rule mb-6">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              <span className="text-noir/70">Curated edits</span>
            </div>
            <h1 id="collections-title" className="display-title text-[clamp(2.1rem,5.4vw,3.6rem)]">
              Collections
            </h1>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              Five ways in. Each edit is priced at one volume, so you always know what you are
              committing to before you open the first card.
            </p>

            {/* Edit switcher */}
            <ul className="mt-10 flex flex-wrap gap-2.5">
              {EDITS.map((edit) => {
                const active = sections.length === 1 && sections[0].key === edit.key
                return (
                  <li key={edit.key}>
                    <Link
                      to={active ? '/collections' : `/collections?edit=${edit.key}`}
                      aria-current={active ? 'true' : undefined}
                      className={`rounded-xs border px-4 py-2.5 text-[0.6875rem] uppercase tracking-[0.16em] transition-all duration-300 ${
                        active
                          ? 'border-noir bg-noir text-ivory'
                          : 'border-dark/15 text-dark hover:border-noir/50 hover:text-noir'
                      }`}
                    >
                      {edit.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {sections.map((edit, index) => (
        <motion.section
          key={edit.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="py-16 md:py-24"
          aria-labelledby={`${edit.key}-title`}
        >
          <div className="container-lux">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_20rem] lg:gap-16">
              <Reveal variant="up">
                <SectionHeading
                  index={String(index + 1).padStart(2, '0')}
                  eyebrow={edit.eyebrow}
                  title={<span id={`${edit.key}-title`}>{edit.title}</span>}
                  subtitle={edit.line}
                  action={{ label: `Shop ${edit.name.toLowerCase()}`, to: edit.to }}
                />
              </Reveal>
              <Reveal variant="scale" delay={0.1} className="hidden lg:block">
                <div className="aspect-[4/3] overflow-hidden rounded-md">
                  <ArtScene variant={edit.scene} grain={0.3} className="h-full w-full" />
                </div>
              </Reveal>
            </div>

            <div className="mt-12 lg:mt-16">
              <ProductGrid products={edit.pick()} ml={edit.ml} animationKey={`collection-${edit.key}`} />
            </div>
          </div>
        </motion.section>
      ))}

      {/* A discovery prompt rather than a dead end */}
      <section className="border-t border-dark/10 bg-sand/40 py-16 md:py-20">
        <div className="container-lux flex flex-col items-center gap-6 text-center">
          <Reveal variant="up">
            <h2 className="display-title max-w-2xl text-[clamp(1.6rem,3.4vw,2.4rem)]">
              Not sure which edit is yours?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">
              Start at 3 ml. It is the cheapest way to meet a fragrance, and the only volume where
              trying something new costs less than a coffee.
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.08}>
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink to="/perfumes?size=3" variant="primary" size="lg" arrow>
                Shop all 3 ml decants
              </ButtonLink>
              <ButtonLink to="/perfumes" variant="ghost" size="lg">
                Browse everything
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Collections