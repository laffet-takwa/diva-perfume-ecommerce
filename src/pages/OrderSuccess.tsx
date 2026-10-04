import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Package, Sparkles, Truck } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Flacon } from '@/components/product/Flacon'
import { EmptyState } from '@/components/ui/EmptyState'
import { useOrder } from '@/context'
import { useSeo } from '@/hooks/useSeo'
import { formatDeliveryWindow, formatOrderDate, formatPrice } from '@/lib/utils'

/* ==========================================================================
   Order confirmation — /order-success
   ========================================================================== */

export function OrderSuccess() {
  useSeo({
    title: 'Thank you, Diva',
    description: 'Your DIVA STORE order is confirmed.',
    canonicalPath: '/order-success',
  })

  const { lastOrder } = useOrder()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  if (!lastOrder) {
    return (
      <div className="pt-16 lg:pt-20">
        <EmptyState
          eyebrow="No order"
          title="There is no recent order to show."
          description="Once you place an order, your confirmation will appear here with the details and delivery window."
          action={{ label: 'Shop all decants', to: '/perfumes' }}
        />
      </div>
    )
  }

  const eta = formatDeliveryWindow(lastOrder.etaDays)

  return (
    <div className="pt-16 lg:pt-20">
      <section className="relative overflow-hidden border-b border-dark/10 bg-sand/40">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 size-[40rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gold/12 blur-[90px]" />
        </div>

        <div className="container-lux relative flex flex-col items-center py-20 text-center md:py-28">
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }}
            className="flex size-16 items-center justify-center rounded-full bg-noir text-ivory"
          >
            <Check className="size-7" aria-hidden="true" />
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <p className="eyebrow text-noir/70">Order confirmed</p>
            <h1 className="mt-4 display-title text-[clamp(2.25rem,6vw,4rem)]">Thank you, Diva.</h1>
            <p className="mx-auto mt-5 max-w-lg font-quote text-xl italic leading-relaxed text-muted">
              Your fragrance journey has officially begun.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          >
            <Stat label="Order number" value={lastOrder.id} mono />
            <Stat label="Estimated delivery" value={eta} />
            <Stat label="Placed" value={formatOrderDate(lastOrder.createdAt)} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink to="/perfumes" variant="primary" size="lg" arrow>
              Continue shopping
            </ButtonLink>
            <ButtonLink to="/" variant="ghost" size="lg">
              Back to home
            </ButtonLink>
          </motion.div>
        </div>
      </section>

      {/* Order detail */}
      <div className="container-lux grid gap-10 py-16 md:py-20 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
            <h2 className="eyebrow mb-6 text-dark">Your decants</h2>
          <ul className="flex flex-col gap-5">
            {lastOrder.items.map((line) => (
              <li key={line.key} className="flex items-center gap-4 border-b border-dark/10 pb-5 last:border-0">
                <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-taupe/40">
                  <Flacon
                    art={line.image}
                    photo={line.photo}
                    photoTone={line.photoTone}
                    photoAlt={line.name}
                    sizeMl={line.ml}
                    bare
                    className="h-[128%] w-[128%] object-contain"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${line.slug}`}
                    className="block truncate font-display text-base text-dark hover:text-noir"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                    {line.ml} ml · Qty {line.quantity}
                  </p>
                </div>
                <span className="shrink-0 font-display text-sm text-dark">
                  {formatPrice(line.unitPrice * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-3 rounded-xs border border-gold/35 bg-gold/8 px-5 py-4">
            <Sparkles className="size-4 shrink-0 text-gold" aria-hidden="true" />
            <p className="text-[0.8125rem] text-dark">
              A note on wear: apply to pulse points and let the fragrance settle for ten minutes
              before deciding.
            </p>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-md border border-dark/10 p-6">
            <h2 className="eyebrow mb-5 text-dark">Delivery</h2>
            <ul className="flex flex-col gap-4 text-[0.8125rem] text-muted">
              <li className="flex gap-3">
                <Truck className="size-4 shrink-0 text-noir" aria-hidden="true" />
                <span>
                  {lastOrder.shipping.label} — {lastOrder.shipping.detail}
                  <br />
                  {eta}
                </span>
              </li>
              <li className="flex gap-3">
                <Package className="size-4 shrink-0 text-noir" aria-hidden="true" />
                <address className="not-italic leading-relaxed">
                  {lastOrder.customer.firstName} {lastOrder.customer.lastName}
                  <br />
                  {lastOrder.customer.address}
                  <br />
                  {lastOrder.customer.postalCode} {lastOrder.customer.city}
                </address>
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-dark/10 p-6">
            <h2 className="eyebrow mb-5 text-dark">Payment</h2>
            <p className="text-[0.8125rem] text-muted">
              {lastOrder.payment === 'transfer' ? 'Bank transfer' : 'Cash on delivery'}
            </p>
            <dl className="mt-5 flex flex-col gap-2 border-t border-dark/10 pt-5 text-[0.8125rem]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-dark">{formatPrice(lastOrder.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="text-dark">
                  {lastOrder.shippingPrice === 0 ? 'Free' : formatPrice(lastOrder.shippingPrice)}
                </dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-dark/10 pt-3">
                <dt className="font-display text-dark">Total</dt>
                <dd className="font-display text-dark">{formatPrice(lastOrder.total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted">{label}</p>
      <p className={`mt-1.5 text-[0.9375rem] text-dark ${mono ? 'font-mono tracking-wide' : ''}`}>
        {value}
      </p>
    </div>
  )
}

export default OrderSuccess