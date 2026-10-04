import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Heart, LogIn, Package, Truck, Undo2 } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Field, validateField, validators } from '@/components/ui/Field'
import Reveal from '@/components/ui/Reveal'
import { useCart, useOrder, useToast, useWishlist } from '@/context'
import { useSeo } from '@/hooks/useSeo'
import { formatDeliveryWindow, formatOrderDate, formatPrice } from '@/lib/utils'

/* ==========================================================================
   Account — a lightweight front desk for the MVP
   Sign-in is mocked; it exists so the header action is never a dead link.
   ========================================================================== */

export function Account() {
  useSeo({
    title: 'Your account',
    description: 'Track orders, manage your wishlist and saved details at DIVA STORE.',
    canonicalPath: '/account',
  })

  const { lastOrder } = useOrder()
  const { count: wishlistCount } = useWishlist()
  const { count: cartCount } = useCart()
  const { notify } = useToast()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = validateField(email, [validators.required, validators.email])
    setError(message)
    if (message) return
    setSent(true)
    notify('Sign-in link sent. Check your inbox.')
  }

  return (
    <div className="pt-16 lg:pt-20">
      <div className="border-b border-dark/10 bg-cream-deep/40">
        <div className="container-lux py-14 md:py-20">
          <Reveal variant="up">
            <div className="eyebrow eyebrow-rule mb-6">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              <span className="text-burgundy/70">Your Diva world</span>
            </div>
            <h1 className="display-title text-[clamp(2.1rem,5vw,3.2rem)]">Account</h1>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              One place for your orders, saved fragrances and delivery details.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container-lux grid gap-10 py-14 lg:grid-cols-[1fr_20rem] lg:gap-16 lg:py-20">
        <div className="min-w-0">
          {/* Sign in */}
          <Reveal variant="up">
            <div className="rounded-md border border-dark/10 p-6 md:p-8">
              <h2 className="flex items-center gap-2.5 font-display text-xl text-dark">
                <LogIn className="size-4 text-burgundy" aria-hidden="true" />
                Sign in
              </h2>
              <p className="mt-2 max-w-md text-[0.8125rem] text-muted">
                We will email you a secure link — no password to remember.
              </p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className="mt-6 flex items-center gap-3 rounded-xs border border-gold/40 bg-gold/8 px-4 py-4"
                >
                  <Check className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  <p className="text-[0.8125rem] text-dark">
                    Check {email} for your sign-in link.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end" noValidate>
                  <Field
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.slice(0, 60))
                      setError(undefined)
                    }}
                    error={error}
                    className="sm:max-w-xs"
                    placeholder="you@example.com"
                    required
                  />
                  <button
                    type="submit"
                    className="h-12 shrink-0 rounded-xs bg-burgundy px-6 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-burgundy-deep"
                  >
                    Send link
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Recent order */}
          <Reveal variant="up" delay={0.08} className="mt-8">
            <div className="rounded-md border border-dark/10 p-6 md:p-8">
              <h2 className="flex items-center gap-2.5 font-display text-xl text-dark">
                <Package className="size-4 text-burgundy" aria-hidden="true" />
                Recent order
              </h2>

              {lastOrder ? (
                <div className="mt-5 flex flex-col gap-4">
                  <dl className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                        Order
                      </dt>
                      <dd className="mt-1.5 font-mono text-[0.875rem] text-dark">{lastOrder.id}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                        Placed
                      </dt>
                      <dd className="mt-1.5 text-[0.875rem] text-dark">
                        {formatOrderDate(lastOrder.createdAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                        Total
                      </dt>
                      <dd className="mt-1.5 text-[0.875rem] text-dark">
                        {formatPrice(lastOrder.total)}
                      </dd>
                    </div>
                  </dl>
                  <p className="flex items-center gap-2.5 text-[0.8125rem] text-muted">
                    <Truck className="size-4 shrink-0 text-burgundy" aria-hidden="true" />
                    {lastOrder.shipping.label} — arriving {formatDeliveryWindow(lastOrder.etaDays)}
                  </p>
                  <ButtonLink to="/order-success" variant="ghost" size="sm" className="self-start px-0">
                    View order details
                  </ButtonLink>
                </div>
              ) : (
                <div className="mt-5">
                  <p className="text-[0.8125rem] text-muted">
                    You have not placed an order yet.
                  </p>
                  <ButtonLink to="/perfumes" variant="primary" size="sm" arrow className="mt-5">
                    Discover perfumes
                  </ButtonLink>
                </div>
              )}
            </div>
          </Reveal>

          {/* Perks */}
          <Reveal variant="up" delay={0.16} className="mt-8">
            <div className="rounded-md border border-dark/10 p-6 md:p-8">
              <h2 className="font-display text-xl text-dark">What membership includes</h2>
              <ul className="mt-5 flex flex-col gap-3.5">
                {[
                  'Early access to limited runs before public release',
                  'Private offers reserved for the Diva World',
                  'Free returns extended to 30 days',
                  'Fragrance notes recorded with every order',
                ].map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-[0.8125rem] text-muted">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-3 lg:sticky lg:top-28 lg:self-start">
          <SideLink
            to="/wishlist"
            icon={<Heart className="size-4" aria-hidden="true" />}
            label="Wishlist"
            count={wishlistCount}
          />
          <SideLink
            to="/cart"
            icon={<Undo2 className="size-4" aria-hidden="true" />}
            label="Your bag"
            count={cartCount}
          />
          <SideLink
            to="/collections"
            icon={<Package className="size-4" aria-hidden="true" />}
            label="Collections"
          />
          <p className="mt-4 text-[0.6875rem] leading-relaxed text-muted">
            Need help? Visit our{' '}
            <Link to="/help/faq" className="link-underline text-burgundy">
              FAQ
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  )
}

function SideLink({
  to,
  icon,
  label,
  count,
}: {
  to: string
  icon: React.ReactNode
  label: string
  count?: number
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xs border border-dark/10 px-5 py-4 transition-colors hover:border-burgundy/45"
    >
      <span className="text-burgundy">{icon}</span>
      <span className="flex-1 text-[0.8125rem] text-dark">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-burgundy text-[0.5625rem] text-cream">
          {count}
        </span>
      )}
    </Link>
  )
}

export default Account