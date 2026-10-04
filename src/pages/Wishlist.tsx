import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Heart } from 'lucide-react'
import ProductGrid from '@/components/product/ProductGrid'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import Reveal from '@/components/ui/Reveal'
import { useWishlist } from '@/context'
import { useSeo } from '@/hooks/useSeo'
import { getProductById } from '@/data/products'

/* ==========================================================================
   Wishlist — /wishlist
   ========================================================================== */

export function Wishlist() {
  useSeo({
    title: 'Your wishlist',
    description: 'The DIVA STORE fragrances you have saved for later.',
    canonicalPath: '/wishlist',
  })

  const { ids } = useWishlist()
  const items = ids.map((id) => getProductById(id)).filter((p) => p !== undefined)

  if (items.length === 0) {
    return (
      <div className="pt-16 lg:pt-20">
        <EmptyState
          icon={<Heart className="size-6" aria-hidden="true" />}
          eyebrow="Saved"
          title="Your fragrance wishlist is waiting."
          description="Tap the heart on any flacon to save it here. Nothing is reserved, nothing expires — take your time."
          action={{ label: 'Discover perfumes', to: '/perfumes' }}
          secondaryAction={{ label: 'The Diva Edit', to: '/collections' }}
        />
      </div>
    )
  }

  return (
    <div className="pt-16 lg:pt-20">
      <div className="border-b border-dark/10 bg-cream-deep/40">
        <div className="container-lux py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
              <li>
                <Link to="/" className="transition-colors hover:text-burgundy">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3" />
              </li>
              <li className="text-dark">Wishlist</li>
            </ol>
          </nav>
          <h1 className="display-title text-[clamp(2.1rem,5vw,3.2rem)]">Wishlist</h1>
          <p className="mt-3 text-[0.875rem] text-muted">
            {items.length} saved fragrance{items.length > 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      <section className="container-lux py-12 md:py-16" aria-label="Saved products">
        <Reveal variant="up">
          <ProductGrid products={items} animationKey={`wishlist-${ids.join(',')}`} />
        </Reveal>
      </section>

      <section className="container-lux pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-between gap-6 rounded-md border border-gold/30 bg-champagne/25 px-6 py-8 text-center sm:flex-row sm:text-left md:px-10"
        >
          <div>
            <h2 className="font-display text-xl text-dark">Ready to decide?</h2>
            <p className="mt-2 max-w-md text-[0.875rem] text-muted">
              Not sure which one is yours? Answer three questions and we will match three
              signatures to your mood, notes and occasion.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <ButtonLink to="/#finder" variant="primary" size="md" arrow>
              Find my signature
            </ButtonLink>
            <ButtonLink to="/perfumes" variant="ghost" size="md">
              Shop perfumes
            </ButtonLink>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Wishlist