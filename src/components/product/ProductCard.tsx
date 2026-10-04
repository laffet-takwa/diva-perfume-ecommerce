import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import type { DecantSize, Product } from '@/types'
import { useCart, useToast, useWishlist } from '@/context'
import { Badge } from '@/components/ui/Badge'
import { Flacon } from '@/components/product/Flacon'
import { DecantSizePicker } from '@/components/product/DecantSizePicker'
import { ProductRating } from './ProductRating'
import { getPriceForSize, HERO_DECANT, savingsPercent } from '@/data/products'
import { cn, formatPrice } from '@/lib/utils'

/* ==========================================================================
   ProductCard
   The card is a mini product page: pick a volume, see that volume's price and
   what it saves against the full bottle, add it. Hover lifts the plate and
   reveals the bottle swap; nothing important is hidden behind the hover.
   ========================================================================== */

export interface ProductCardProps {
  product: Product
  /** Cards in dense contexts (drawers, carousels) drop the hover extras. */
  compact?: boolean
  /** Force a volume, e.g. when a shelf is scoped to 10 ml */
  ml?: DecantSize
  className?: string
}

function ProductCardBase({ product, compact = false, ml, className }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { notify } = useToast()
  const wished = isInWishlist(product.id)

  const [selected, setSelected] = useState<DecantSize>(ml ?? HERO_DECANT)

  const price = getPriceForSize(product, selected)
  const saving = savingsPercent(product, selected)

  const handleAdd = () => {
    addToCart(product.id, selected, 1)
    notify(`${product.name} · ${selected} ml added to your cart.`)
  }

  const handleWish = () => {
    const added = toggleWishlist(product.id)
    notify(
      added ? `${product.name} added to wishlist.` : `${product.name} removed from wishlist.`,
      'info',
    )
  }

  return (
    <motion.article
      className={cn('group/card relative flex flex-col', className)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-md bg-sand/70"
        aria-label={`${product.name} by ${product.brand}`}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Flacon
            art={product.art}
            photo={product.photo}
            photoAlt={`${product.name} by ${product.brand}`}
            photoTone={product.photoTone}
            title={`${product.name} — ${product.categoryLabel}`}
            className="absolute inset-0 size-full scale-[0.86] object-contain p-6 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[0.94]"
          />

          {/* Paper wash on hover — deepens without going muddy */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-noir/0 transition-colors duration-500 group-hover/card:bg-noir/[0.04]"
          />

          {product.badge && !compact && (
            <div className="absolute left-3 top-3">
              <Badge tone={product.badge}>{product.badge}</Badge>
            </div>
          )}

          {/* The saving is the reason the card exists — it never hides */}
          {!compact && (
            <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
              <span className="rounded-full bg-noir px-2.5 py-1 font-sans text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-ivory">
                Save {saving}%
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleWish()
                }}
                aria-pressed={wished}
                aria-label={
                  wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
                }
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border bg-ivory/85 backdrop-blur-sm transition-all duration-300 hover:bg-ivory',
                  wished ? 'border-noir/40 text-noir' : 'border-noir/10 text-muted hover:text-noir',
                )}
              >
                <Heart
                  className={cn('size-4 transition-transform', wished && 'scale-110')}
                  fill={wished ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="shrink-0 text-[0.5625rem] font-medium uppercase tracking-[0.28em] text-muted">
            {product.brand}
          </span>
          <ProductRating rating={product.rating} size="xs" className="shrink-0" />
        </div>

        <h3 className="font-display text-[0.9375rem] leading-snug text-dark">
          <Link to={`/product/${product.slug}`} className="link-underline">
            {product.name}
          </Link>
        </h3>

        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-muted/85">
          {product.categoryLabel}
        </p>

        <div className="mt-3">
          <DecantSizePicker sizes={product.sizes} value={selected} onChange={setSelected} />
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-dark">{formatPrice(price)}</span>
            <span className="text-[0.6875rem] text-muted line-through">
              {formatPrice(product.fullBottle.price)}
            </span>
            <span className="ml-auto shrink-0 text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
              vs {product.fullBottle.ml} ml
            </span>
          </div>

          {!compact && (
            <button
              type="button"
              onClick={handleAdd}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xs bg-noir text-[0.625rem] font-medium uppercase tracking-[0.2em] text-ivory transition-colors duration-300 hover:bg-noir-deep"
            >
              <ShoppingBag className="size-3.5" aria-hidden="true" />
              Add to cart
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export const ProductCard = memo(ProductCardBase)
export default ProductCard
