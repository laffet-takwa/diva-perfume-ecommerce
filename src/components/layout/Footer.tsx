import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FOOTER_COLUMNS, SOCIAL_LINKS } from '@/data/navigation'
import Logo from './Logo'
import { useUI } from '@/context'
import { isValidEmail, NEWSLETTER_STORAGE, readStorage, sanitizeText, writeStorage } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { Button } from '@/components/ui/Button'

/* ==========================================================================
   Footer
   ========================================================================== */

export function Footer() {
  const { openSearch } = useUI()

  return (
    <footer className="border-t border-dark/10 bg-cream">
      <Newsletter />

      <div className="container-lux pb-10 pt-16 md:pt-20">
        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)_0.9fr] lg:gap-8"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-[26ch] font-quote text-lg italic leading-relaxed text-muted">
              Your Scent. Your Story. Your Diva.
            </p>
            <p className="max-w-[34ch] text-[0.8125rem] leading-relaxed text-muted">
              A perfume boutique bringing together the great houses, chosen one bottle at a time.
            </p>
            <button
              type="button"
              onClick={openSearch}
              className="self-start text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-burgundy underline decoration-gold decoration-1 underline-offset-8 transition-colors hover:text-burgundy-deep"
            >
              Search the collection
            </button>
          </motion.div>

          {FOOTER_COLUMNS.map((column) => (
            <motion.nav key={column.title} variants={fadeUp} aria-label={column.title}>
              <h3 className="eyebrow mb-6 text-dark">{column.title}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      to={link.to}
                      className="link-underline text-[0.8125rem] text-muted transition-colors hover:text-burgundy"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          <motion.div variants={fadeUp}>
            <h3 className="eyebrow mb-6 text-dark">Follow</h3>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline text-[0.8125rem] text-muted transition-colors hover:text-burgundy"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-14 border-t border-dark/10 pt-6">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted">© 2026 Diva Store</p>
            <p className="font-quote text-base italic text-muted">Crafted with elegance.</p>
            <p className="text-[0.6875rem] text-muted">Free shipping over 150 DT · 14-day returns</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* --------------------------------------------------------------------------
   Newsletter — one field, one button, inline confirmation
   -------------------------------------------------------------------------- */

function Newsletter() {
  const [email, setEmail] = useState(() => readStorage<string>(NEWSLETTER_STORAGE, ''))
  const [subscribed, setSubscribed] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email)) return
    writeStorage(NEWSLETTER_STORAGE, email)
    setSubscribed(true)
  }

  return (
    <section className="border-b border-dark/10 bg-cream-deep/40" aria-labelledby="newsletter-title">
      <div className="container-lux grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <div className="eyebrow eyebrow-rule mb-4">
            <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            <span className="text-burgundy/70">The Diva World</span>
          </div>
          <h2 id="newsletter-title" className="display-title text-[clamp(1.75rem,3.6vw,2.6rem)]">
            Join the Diva World
          </h2>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">
            Be the first to discover new fragrances, exclusive collections and private offers.
          </p>
        </div>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="status"
            className="flex items-center gap-4 border-b border-gold/60 pb-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-burgundy text-cream">
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-[0.9375rem] leading-snug text-dark">
              Welcome to the Diva World. Your private offers are on their way.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="w-full" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Your email address
            </label>
            <div className="flex items-center gap-3 border-b border-dark/25 pb-3 transition-colors focus-within:border-burgundy">
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(sanitizeText(e.target.value, 60))
                  setSubscribed(false)
                }}
                placeholder="Your email address"
                aria-invalid={email.length > 0 && !isValidEmail(email)}
                className="w-full min-w-0 bg-transparent py-1 text-[0.9375rem] text-dark placeholder:text-muted/75 focus:outline-none"
              />
              <Button type="submit" size="sm" className="shrink-0" disabled={!isValidEmail(email)}>
                Join
              </Button>
            </div>
            <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted">
              By joining you accept our privacy policy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

export default Footer