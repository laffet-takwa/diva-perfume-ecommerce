import { useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, Heart, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import ProductGallery from '@/components/product/ProductGallery'
import ProductNotes from '@/components/product/ProductNotes'
import ProductRating from '@/components/product/ProductRating'
import ProductGrid from '@/components/product/ProductGrid'
import { DecantSizePicker } from '@/components/product/DecantSizePicker'
import { QuantityStepper } from '@/components/cart/CartItem'
import { Badge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { WhatsAppLink } from '@/components/ui/WhatsAppLink'
import { EmptyState } from '@/components/ui/EmptyState'
import Reveal from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  getPriceForSize,
  getProductBySlug,
  HERO_DECANT,
  products,
  savingsPercent,
} from '@/data/products'
import type { DecantSize } from '@/types'
import { useCart, useToast, useWishlist } from '@/context'
import { useSeo } from '@/hooks/useSeo'
import { whatsappProductEnquiry } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'

/* ==========================================================================
   Product details — /product/:slug
   ========================================================================== */

const ASSURANCES = [
  { icon: ShieldCheck, label: '100% authentic — poured from sealed bottles' },
  { icon: Truck, label: 'Poured to order, dispatched within 24h' },
  { icon: Sparkles, label: 'One-tap ordering on WhatsApp' },
]

export function ProductDetails() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)

  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { notify } = useToast()

  const [ml, setMl] = useState<DecantSize>(HERO_DECANT)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  // Switching flacons resets the purchase controls. Adjusting during render
  // keeps the very first paint after a route change correct.
  const lastSlug = useRef(slug)
  if (lastSlug.current !== slug) {
    lastSlug.current = slug
    setMl(HERO_DECANT)
    setQuantity(1)
    setJustAdded(false)
  }

  useSeo({
    title: product ? `${product.name} — ${product.categoryLabel}` : 'Fragrance not found',
    description: product?.description ?? 'This fragrance could not be found.',
    canonicalPath: `/product/${slug}`,
  })

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.id !== product.id)
      .map((p) => ({
        product: p,
        score:
          (p.category === product.category ? 3 : 0) +
          (p.gender === product.gender ? 2 : 0) +
          p.noteTags.filter((n) => product.noteTags.includes(n)).length,
      }))
      .sort((a, b) => b.score - a.score || b.product.popularity - a.product.popularity)
      .slice(0, 4)
      .map((entry) => entry.product)
  }, [product])

  if (!product) {
    return (
      <div className="pt-32">
        <EmptyState
          eyebrow="404"
          title="This fragrance could not be found."
          description="The page may have moved, or we have sold out of that batch. The full collection is waiting."
          action={{ label: 'Explore all decants', to: '/perfumes' }}
        />
      </div>
    )
  }

  const wished = isInWishlist(product.id)
  const price = getPriceForSize(product, ml)
  const saving = savingsPercent(product, ml)
  const perMl = Math.round((price / ml) * 10) / 10
  const fullPerMl = Math.round((product.fullBottle.price / product.fullBottle.ml) * 10) / 10

  const handleAdd = () => {
    addToCart(product.id, ml, quantity)
    notify(`${product.name} · ${ml} ml added to your cart.`)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1800)
  }

  const handleWish = () => {
    const added = toggleWishlist(product.id)
    notify(added ? `${product.name} added to wishlist.` : `${product.name} removed from wishlist.`, 'info')
  }

  return (
    <div className="pt-16 lg:pt-20">
      <div className="container-lux">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="py-6">
          <ol className="flex flex-wrap items-center gap-2 text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
            <li>
              <Link to="/" className="transition-colors hover:text-noir">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li>
              <Link to="/perfumes" className="transition-colors hover:text-noir">
                Decants
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li>
              <Link
                to={`/perfumes/${product.gender}`}
                className="transition-colors hover:text-noir"
              >
                {product.gender}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="text-dark">{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* Main */}
      <div className="container-lux grid gap-10 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24">
        <Reveal variant="reveal">
          <ProductGallery product={product} />
        </Reveal>

        <Reveal variant="up" delay={0.08} className="lg:pt-6">
          <div className="flex items-center gap-3">
            <span className="text-[0.5625rem] uppercase tracking-[0.3em] text-muted">
              {product.brand}
            </span>
            {product.badge && <Badge tone={product.badge}>{product.badge}</Badge>}
          </div>

          <h1 className="mt-4 display-title text-[clamp(1.9rem,4.4vw,3rem)]">{product.name}</h1>
          <p className="mt-2 text-[0.8125rem] uppercase tracking-[0.14em] text-muted">
            {product.categoryLabel}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <ProductRating rating={product.rating} size="sm" showValue />
            <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
              {product.reviews} verified reviews
            </span>
          </div>

          {/* Price + the saving that justifies it */}
          <div className="mt-7 rounded-md border border-gold/30 bg-sand/40 p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl text-dark">{formatPrice(price)}</span>
              <span className="text-[0.875rem] text-muted line-through">
                {formatPrice(product.fullBottle.price)}
              </span>
              <Badge tone="gold">Save {saving}%</Badge>
            </div>
            <p className="mt-2 text-[0.6875rem] leading-relaxed text-muted">
              {perMl} DT per ml · the {product.fullBottle.ml} ml bottle works out at {fullPerMl} DT
              per ml. Free delivery over 150 DT.
            </p>
          </div>

          <p className="mt-7 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
            {product.longDescription}
          </p>

          {/* Size */}
          <DecantSizePicker
            sizes={product.sizes}
            value={ml}
            onChange={setMl}
            layout="detail"
            showKicker
            className="mt-9"
          />

          {/* Quantity + CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} size="md" />
            <div className="text-[0.6875rem] leading-relaxed text-muted">
              <p>
                Total{' '}
                <span className="font-display text-base text-dark">{formatPrice(price * quantity)}</span>
              </p>
            </div>
          </div>

          {/* Desktop CTAs — cart first, then the chat that closes the sale */}
          <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
            <Button variant="primary" size="lg" onClick={handleAdd} className="flex-1" arrow>
              Add to cart
            </Button>
            <WhatsAppLink
              href={whatsappProductEnquiry(product, ml, price * quantity)}
              tone="whatsapp"
              size="lg"
              className="flex-1"
            >
              Order on WhatsApp
            </WhatsAppLink>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWish}
              aria-pressed={wished}
              className={wished ? 'border-noir text-noir' : undefined}
              iconLeft={
                <Heart className="size-4" fill={wished ? 'currentColor' : 'none'} aria-hidden="true" />
              }
            >
              {wished ? 'Saved' : 'Save'}
            </Button>
          </div>

          {/* Assurances */}
          <ul className="mt-8 flex flex-col gap-3 border-t border-dark/10 pt-6">
            {ASSURANCES.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-[0.8125rem] text-muted">
                <item.icon className="size-4 shrink-0 text-noir" aria-hidden="true" />
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Notes */}
      <div className="border-y border-dark/10 bg-sand/40 py-16 md:py-24">
        <div className="container-lux">
          <ProductNotes notes={product.notes} />
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 md:py-24" aria-labelledby="related-title">
          <div className="container-lux">
            <Reveal variant="up">
              <SectionHeading
                eyebrow="Complete the wardrobe"
                title={<span id="related-title">You may also love</span>}
                action={{ label: 'Shop all', to: '/perfumes' }}
              />
            </Reveal>
            <div className="mt-12">
              <ProductGrid products={related} animationKey={`related-${product.id}`} />
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-dark/10 bg-ivory/95 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm text-dark">{product.name}</p>
            <p className="text-[0.6875rem] text-muted">
              {ml} ml · {formatPrice(price * quantity)}
            </p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={justAdded ? 'added' : 'idle'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="shrink-0"
            >
              <Button variant={justAdded ? 'gold' : 'primary'} size="md" onClick={handleAdd}>
                {justAdded ? (
                  <>
                    <Check className="size-3.5" aria-hidden="true" />
                    Added
                  </>
                ) : (
                  `Add to cart — ${formatPrice(price * quantity)}`
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
          <button
            type="button"
            onClick={handleWish}
            aria-pressed={wished}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            className="flex size-11 shrink-0 items-center justify-center rounded-xs border border-dark/15 text-dark transition-colors active:scale-95"
          >
            <Heart className="size-4" fill={wished ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Keeps the sticky bar from covering the end of the page */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      {/* Desktop "added" confirmation */}
      <AnimatePresence>
        {justAdded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-8 right-8 z-50 hidden lg:block"
          >
            <ButtonLink to="/cart" variant="gold" size="lg" arrow>
              View your cart
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductDetails