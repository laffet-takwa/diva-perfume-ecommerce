import { Link } from 'react-router-dom'
import { Flacon } from '@/components/product/Flacon'
import { CartSummary } from '@/components/cart/CartSummary'
import type { ShippingMethod } from '@/types'
import { formatPrice } from '@/lib/utils'

/* ==========================================================================
   OrderSummary — the persistent right-hand rail of the checkout
   ========================================================================== */

export interface OrderSummaryProps {
  lines: import('@/types').CartLine[]
  shipping: ShippingMethod
  onEditShipping?: () => void
  className?: string
}

export function OrderSummary({ lines, shipping, onEditShipping, className }: OrderSummaryProps) {
  return (
    <aside className={className} aria-label="Order summary">
      <div className="rounded-md border border-dark/10 bg-cream-deep/30 p-6 md:p-7">
        <h2 className="eyebrow mb-6 text-dark">Order summary</h2>

        <ul className="flex flex-col gap-4">
          {lines.map((line) => (
            <li key={line.key} className="flex items-center gap-3.5">
              <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-champagne/40">
                <Flacon
                  art={line.image}
                  photo={line.photo}
                  photoTone={line.photoTone}
                  photoAlt={line.name}
                  sizeMl={line.ml}
                  bare
                  className="h-[130%] w-[130%] object-contain"
                />
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-dark text-[0.5625rem] text-cream">
                  {line.quantity}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <Link
                  to={`/product/${line.slug}`}
                  className="block truncate font-display text-[0.875rem] text-dark hover:text-burgundy"
                >
                  {line.name}
                </Link>
                <span className="text-[0.6875rem] text-muted">{line.ml}ml</span>
              </span>
              <span className="shrink-0 text-[0.8125rem] text-dark">
                {formatPrice(line.unitPrice * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="my-6 h-px w-full bg-dark/10" />

        <CartSummary showShipping={false}>
          <div className="mt-5 flex items-baseline justify-between gap-4">
            <span className="text-[0.8125rem] text-muted">
              {shipping.label} · {shipping.detail}
            </span>
            <button
              type="button"
              onClick={onEditShipping}
              className="shrink-0 text-[0.625rem] uppercase tracking-[0.16em] text-burgundy"
            >
              Change
            </button>
          </div>
          <p className="mt-3 text-[0.6875rem] text-muted">
            Shipping cost is applied at the final step.
          </p>
        </CartSummary>
      </div>

      <p className="mt-5 text-center text-[0.625rem] uppercase tracking-[0.16em] text-muted lg:text-left">
        Secure payment · Free returns within 14 days
      </p>
    </aside>
  )
}

export default OrderSummary