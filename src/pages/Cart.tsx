import { AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, ShoppingBag } from 'lucide-react'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import Reveal from '@/components/ui/Reveal'
import { useCart, useToast } from '@/context'
import { useSeo } from '@/hooks/useSeo'

/* ==========================================================================
   Cart — /cart
   ========================================================================== */

export function Cart() {
  useSeo({
    title: 'Your bag',
    description: 'Review your DIVA STORE fragrances before checkout.',
    canonicalPath: '/cart',
  })

  const { lines, removeFromCart, clearCart } = useCart()
  const { notify } = useToast()

  if (lines.length === 0) {
    return (
      <div className="pt-16 lg:pt-20">
        <EmptyState
          icon={<ShoppingBag className="size-6" aria-hidden="true" />}
          eyebrow="Empty"
          title="Your bag is empty."
          description="Nothing has been added yet. Start with the Diva Edit — four signatures we never stop recommending."
          action={{ label: 'Discover perfumes', to: '/perfumes' }}
          secondaryAction={{ label: 'View wishlist', to: '/wishlist' }}
        />
      </div>
    )
  }

  return (
    <div className="pt-16 lg:pt-20">
      <div className="border-b border-dark/10 bg-sand/40">
        <div className="container-lux py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
              <li>
                <Link to="/" className="transition-colors hover:text-noir">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3" />
              </li>
              <li className="text-dark">Your bag</li>
            </ol>
          </nav>
          <h1 className="display-title text-[clamp(2.1rem,5vw,3.2rem)]">Your bag</h1>
          <p className="mt-3 text-[0.875rem] text-muted">
            {lines.length} product{lines.length > 1 ? 's' : ''} reserved for 60 minutes.
          </p>
        </div>
      </div>

      <div className="container-lux grid gap-10 py-12 lg:grid-cols-[1fr_22rem] lg:gap-16 lg:py-16">
        <Reveal variant="up">
          <ul className="flex flex-col gap-6">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <CartItem
                  key={line.key}
                  line={line}
                  layout="stacked"
                  className="border-b border-dark/10 pb-6 last:border-0 last:pb-0"
                  onRemove={() => {
                    removeFromCart(line.key)
                    notify(`${line.name} removed from your bag.`, 'info')
                  }}
                />
              ))}
            </AnimatePresence>
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-dark/10 pt-8">
            <ButtonLink to="/perfumes" variant="ghost" size="md">
              ← Continue shopping
            </ButtonLink>
            <button
              type="button"
              onClick={() => {
                clearCart()
                notify('Your bag has been emptied.', 'info')
              }}
              className="text-[0.625rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-noir"
            >
              Empty bag
            </button>
          </div>
        </Reveal>

        <Reveal variant="up" delay={0.08}>
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-md border border-dark/10 bg-ivory p-6 md:p-7">
              <h2 className="eyebrow mb-6 text-dark">Summary</h2>
              <CartSummary>
                <ButtonLink to="/checkout" variant="primary" size="lg" block arrow className="mt-6">
                  Checkout
                </ButtonLink>
                <p className="mt-4 text-center text-[0.625rem] uppercase tracking-[0.16em] text-muted">
                  Card or cash on delivery
                </p>
              </CartSummary>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  )
}

export default Cart