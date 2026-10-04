import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Plus } from 'lucide-react'
import type { Product } from '@/types'
import { useCart, useToast, useWishlist } from '@/context'
import { Badge } from '@/components/ui/Badge'
import { Flacon } from '@/components/product/Flacon'
import { ProductRating } from './ProductRating'
import { cn, formatPrice } from '@/lib/utils'

/* ==========================================================================
   ProductCard
   Hover: image scale, bottle swap, Quick Add reveal, 4px lift.
   ========================================================================== */

export interface ProductCardProps {
  product: Product
  /** Cards in dense contexts (drawers, carousels) drop the hover extras. */
  compact?: boolean
  className?: string
}

function ProductCardBase({ product, compact = false, className }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { notify } = useToast()
  const wished = isInWishlist(product.id)

  const handleAdd = () => {
    addToCart(product.id, 50, 1)
    notify(`${product.name} added to your bag.`)
  }

  const handleWish = () => {
    const added = toggleWishlist(product.id)
    notify(added ? `${product.name} added to wishlist.` : `${product.name} removed from wishlist.`, 'info')
  }

  return (
    <motion.article
      className={cn('group/card relative flex flex-col', className)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-md bg-champagne/35"
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
            className="absolute inset-0 bg-burgundy/0 transition-colors duration-500 group-hover/card:bg-burgundy/[0.04]"
          />

          {product.badge && !compact && (
            <div className="absolute left-3 top-3">
              <Badge tone={product.badge}>{product.badge}</Badge>
            </div>
          )}

          {!compact && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handleWish()
              }}
              aria-pressed={wished}
              aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              className={cn(
                'absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border transition-all duration-300',
                'bg-cream/85 backdrop-blur-sm hover:bg-cream',
                wished ? 'border-burgundy/40 text-burgundy' : 'border-dark/12 text-muted hover:text-burgundy',
              )}
            >
              <Heart
                className={cn('size-4 transition-transform', wished && 'scale-110')}
                fill={wished ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
            </button>
          )}

          {/* Quick Add */}
          {!compact && (
            <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:pointer-events-auto group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleAdd()
                }}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xs bg-cream/95 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-dark backdrop-blur-sm transition-colors hover:bg-burgundy hover:text-cream"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                Quick add · 50ml
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

        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-muted/85">{product.categoryLabel}</p>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="font-display text-sm text-dark">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[0.6875rem] text-muted line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export const ProductCard = memo(ProductCardBase)
export default ProductCard