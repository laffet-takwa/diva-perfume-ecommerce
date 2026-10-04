import { Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/context'
import { cn, formatPrice } from '@/lib/utils'

/* ==========================================================================
   CartSummary — totals + the free-shipping progress meter.
   ========================================================================== */

export interface CartSummaryProps {
  /** Show the checkout CTA (drawer + cart page) vs a read-only block (checkout) */
  showShipping?: boolean
  tone?: 'light' | 'dark'
  className?: string
  children?: React.ReactNode
}

export function CartSummary({ showShipping = true, tone = 'light', className, children }: CartSummaryProps) {
  const { subtotal, shipping, freeShippingRemaining, freeShippingProgress, qualifiesForFreeShipping, count } =
    useCart()
  const total = subtotal + shipping
  const dark = tone === 'dark'

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {showShipping && count > 0 && (
        <div>
          <div className="flex items-center gap-2.5">
            <Truck className={cn('size-4 shrink-0', dark ? 'text-gold' : 'text-burgundy')} aria-hidden="true" />
            <p className={cn('text-[0.8125rem]', dark ? 'text-white/80' : 'text-dark')}>
              {qualifiesForFreeShipping ? (
                <span className="text-gold">Free shipping unlocked.</span>
              ) : (
                <>
                  You&rsquo;re{' '}
                  <span className={dark ? 'text-gold' : 'text-burgundy'}>
                    {formatPrice(freeShippingRemaining)}
                  </span>{' '}
                  away from free shipping.
                </>
              )}
            </p>
          </div>

          <div
            className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-dark/10"
            role="progressbar"
            aria-valuenow={Math.round(freeShippingProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress towards free shipping"
          >
            <motion.div
              className={cn('h-full rounded-full', qualifiesForFreeShipping ? 'bg-gold' : 'bg-burgundy')}
              initial={{ width: 0 }}
              animate={{ width: `${freeShippingProgress * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}

      <dl className={cn('flex flex-col gap-2.5 text-[0.8125rem]', dark ? 'text-white/70' : 'text-muted')}>
        <Row label={`Subtotal (${count} item${count > 1 ? 's' : ''})`} value={formatPrice(subtotal)} dark={dark} />
        <Row
          label="Shipping"
          value={shipping === 0 ? 'Free' : formatPrice(shipping)}
          dark={dark}
          mutedValue={shipping === 0}
        />
      </dl>

      <div className={cn('h-px w-full', dark ? 'bg-white/15' : 'bg-dark/12')} />

      <div className="flex items-baseline justify-between">
        <span className={cn('eyebrow', dark ? 'text-white/80' : 'text-dark')}>Total</span>
        <span className={cn('font-display text-xl', dark ? 'text-white' : 'text-dark')}>
          {formatPrice(total)}
        </span>
      </div>

      {children}
    </div>
  )
}

function Row({
  label,
  value,
  dark,
  mutedValue = false,
}: {
  label: string
  value: string
  dark: boolean
  mutedValue?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt>{label}</dt>
      <dd className={mutedValue && !dark ? 'text-gold' : dark ? 'text-white' : 'text-dark'}>
        {value}
      </dd>
    </div>
  )
}

export default CartSummary