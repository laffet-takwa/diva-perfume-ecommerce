import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartLine } from '@/types'
import { useCart } from '@/context'
import { Flacon } from '@/components/product/Flacon'
import { Link } from 'react-router-dom'
import { cn, formatPrice } from '@/lib/utils'

/* ==========================================================================
   CartItem — used by both the drawer and the full cart page.
   ========================================================================== */

export interface CartItemProps {
  line: CartLine
  onRemove?: () => void
  /** Compact mode trims the quantity stepper down to a single column */
  layout?: 'row' | 'stacked'
  className?: string
}

export function CartItem({ line, onRemove, layout = 'row', className }: CartItemProps) {
  const { updateQuantity } = useCart()
  const stacked = layout === 'stacked'

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex gap-4', stacked ? 'flex-col' : 'items-center', className)}
    >
      <Link
        to={`/product/${line.slug}`}
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden rounded-sm bg-champagne/35',
          stacked ? 'aspect-[4/3] w-full' : 'size-24',
        )}
      >
        <Flacon
          art={line.image}
          photo={line.photo}
          photoTone={line.photoTone}
          photoAlt={line.name}
          sizeMl={line.ml}
          bare
          className="h-[128%] w-[128%] object-contain"
        />
      </Link>

      <div className={cn('flex min-w-0 flex-1 flex-col', stacked ? 'gap-3' : 'gap-2')}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted">{line.brand}</p>
            <h3 className="mt-1 truncate font-display text-[0.9375rem] text-dark">{line.name}</h3>
            <p className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
              {line.ml}ml Eau de Parfum
            </p>
          </div>
          <p className="shrink-0 font-display text-sm text-dark">
            {formatPrice(line.unitPrice * line.quantity)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <QuantityStepper
            value={line.quantity}
            onChange={(quantity) => updateQuantity(line.key, quantity)}
            label={`Quantity for ${line.name}`}
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${line.name} from bag`}
            className="inline-flex items-center gap-1.5 text-[0.625rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-burgundy"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </motion.li>
  )
}

/* --------------------------------------------------------------------------
   Quantity stepper — shared by the cart, the PDP and the wishlist quick add.
   -------------------------------------------------------------------------- */

export interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  size?: 'sm' | 'md'
  tone?: 'light' | 'dark'
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  label = 'Quantity',
  size = 'sm',
  tone = 'light',
  className,
}: QuantityStepperProps) {
  const dim = tone === 'dark' ? 'text-white/60' : 'text-muted'
  const box = tone === 'dark' ? 'border-white/20' : 'border-dark/15'
  const btn =
    size === 'sm'
      ? 'size-8'
      : 'size-11'

  return (
    <div
      className={cn('inline-flex items-center rounded-xs border', box, className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(value - 1, min))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(btn, 'grid place-items-center transition-colors disabled:opacity-30', dim)}
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={cn(
          'min-w-8 text-center font-display',
          size === 'sm' ? 'text-sm' : 'text-base',
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(value + 1, max))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(btn, 'grid place-items-center transition-colors disabled:opacity-30', dim)}
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default CartItem