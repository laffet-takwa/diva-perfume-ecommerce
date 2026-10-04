import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '@/components/product/ProductGrid'
import Reveal from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { ButtonLink } from '@/components/ui/Button'
import ArtScene from '@/components/art/ArtScene'
import { BESTSELLERS, NEWEST_PRODUCTS, products } from '@/data/products'
import { useSeo } from '@/hooks/useSeo'

/* ==========================================================================
   Collections — curated edits
   ========================================================================== */

interface Edit {
  key: string
  name: string
  eyebrow: string
  title: string
  line: string
  to: string
  scene: 'women' | 'men' | 'unisex' | 'editorial' | 'ritual'
  pick: () => typeof products
}

const EDITS: Edit[] = [
  {
    key: 'bestsellers',
    name: 'Bestsellers',
    eyebrow: 'The Icons',
    title: 'Proven, year after year',
    line: 'The bottles that keep coming back — our most reordered signatures.',
    to: '/perfumes?sort=rating',
    scene: 'ritual',
    pick: () => BESTSELLERS.slice(0, 8),
  },
  {
    key: 'new-arrivals',
    name: 'New Arrivals',
    eyebrow: 'Just In',
    title: 'Fresh from the bench',
    line: 'The newest releases on the shelf. Limited runs included.',
    to: '/perfumes?sort=newest',
    scene: 'editorial',
    pick: () => NEWEST_PRODUCTS.slice(0, 8),
  },
  {
    key: 'signatures',
    name: 'House signatures',
    eyebrow: 'The Core',
    title: 'What defines the shelf',
    line: 'Every fragrance we would build the edit around if we could only keep three.',
    to: '/perfumes/unisex',
    scene: 'unisex',
    pick: () => {
      const core = ['p-signature', 'p-ambre', 'p-muse']
      const signatures = products.filter((p) => core.includes(p.id))
      const exclusives = products.filter(
        (p) => p.badge === 'EXCLUSIVE' && !core.includes(p.id),
      )
      return [...signatures, ...exclusives].slice(0, 6)
    },
  },
  {
    key: 'unisex',
    name: 'Beyond labels',
    eyebrow: 'For Everyone',
    title: 'Composed without gender',
    line: 'Zero gender, all character — the fragrances we recommend to everyone.',
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
      'Curated edits from the DIVA STORE house — bestsellers, new arrivals and house signatures.',
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
          action={{ label: 'Explore all perfumes', to: '/perfumes' }}
        />
      </div>
    )
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Head */}
      <section className="border-b border-dark/10 bg-cream-deep/40" aria-labelledby="collections-title">
        <div className="container-lux py-16 md:py-24">
          <Reveal variant="up">
            <div className="eyebrow eyebrow-rule mb-6">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              <span className="text-burgundy/70">Curated edits</span>
            </div>
            <h1 id="collections-title" className="display-title text-[clamp(2.1rem,5.4vw,3.6rem)]">
              Collections
            </h1>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              The house is small on purpose. These are the edits we assemble most often — whether
              you are buying your first bottle or your tenth.
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
                          ? 'border-burgundy bg-burgundy text-cream'
                          : 'border-dark/15 text-dark hover:border-burgundy/50 hover:text-burgundy'
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
              <ProductGrid products={edit.pick()} animationKey={`collection-${edit.key}`} />
            </div>
          </div>
        </motion.section>
      ))}

      {/* A discovery prompt rather than a dead end */}
      <section className="border-t border-dark/10 bg-cream-deep/40 py-16 md:py-20">
        <div className="container-lux flex flex-col items-center gap-6 text-center">
          <Reveal variant="up">
            <h2 className="display-title max-w-2xl text-[clamp(1.6rem,3.4vw,2.4rem)]">
              Not sure which edit is yours?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">
              Three questions, three recommendations. It takes less than a minute.
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.08}>
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink to="/#finder" variant="primary" size="lg" arrow>
                Find my signature
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