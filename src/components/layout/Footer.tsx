import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { FOOTER_COLUMNS, SOCIAL_LINKS } from '@/data/navigation'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { whatsappEnquiry, WHATSAPP_DISPLAY, WHATSAPP_HOURS, WHATSAPP_REPLY_TIME } from '@/lib/whatsapp'
import Logo from './Logo'
import { useUI } from '@/context'
import { isValidEmail, NEWSLETTER_STORAGE, readStorage, sanitizeText, writeStorage } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { Button } from '@/components/ui/Button'

/* ==========================================================================
   Footer
   Instagram and TikTok for discovery, WhatsApp for everything that matters —
   so the contact block is a live chat link, not a list of dead handles.
   ========================================================================== */

const SOCIAL_GLYPH: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3a5.4 5.4 0 0 0 4.2 4.1v2.7a8 8 0 0 1-4.2-1.3v6.1a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2 2.8V3h2.8Z" />
    </svg>
  ),
  WhatsApp: <WhatsAppIcon className="size-[1.15rem]" />,
}

export function Footer() {
  const { openSearch } = useUI()

  return (
    <footer className="border-t border-noir/10 bg-ivory">
      <Newsletter />

      <div className="container-lux pb-10 pt-16 md:pt-20">
        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-[26ch] font-quote text-lg italic leading-relaxed text-muted">
              Luxury Scents. Affordable Decants.
            </p>
            <p className="max-w-[36ch] text-[0.8125rem] leading-relaxed text-muted">
              A decants house for people who would rather wear a hundred great fragrances than
              own ten. Poured to order from sealed, full-price bottles.
            </p>
            <button
              type="button"
              onClick={openSearch}
              className="self-start text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-noir underline decoration-gold decoration-1 underline-offset-8 transition-colors hover:text-noir-deep"
            >
              Search the collection
            </button>

            {/* Live contact — the three channels the house actually runs */}
            <ul className="mt-2 flex flex-col gap-4 border-t border-noir/10 pt-6">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/social flex items-center gap-3 text-dark transition-colors hover:text-noir"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-noir/12 text-muted transition-colors duration-300 group-hover/social:border-gold/60 group-hover/social:text-noir">
                      {SOCIAL_GLYPH[social.label]}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.625rem] uppercase tracking-[0.22em] text-muted">
                        {social.label}
                      </span>
                      <span className="link-underline-static block truncate text-[0.875rem]">
                        {social.label === 'WhatsApp' ? WHATSAPP_DISPLAY : social.handle}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="ml-auto size-4 shrink-0 text-muted transition-transform duration-300 group-hover/social:-translate-y-0.5 group-hover/social:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {FOOTER_COLUMNS.map((column) => (
            <motion.nav key={column.title} variants={fadeUp} aria-label={column.title}>
              <h3 className="eyebrow mb-6 text-dark">{column.title}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      to={link.to}
                      className="link-underline text-[0.8125rem] text-muted transition-colors hover:text-noir"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </motion.div>

        {/* WhatsApp strip — the closing argument */}
        <div className="mt-14 flex flex-col gap-6 rounded-md border border-gold/30 bg-sand/50 p-7 md:flex-row md:items-center md:justify-between md:gap-10 md:p-8">
          <div>
            <p className="eyebrow mb-2 text-noir/70">Order on WhatsApp</p>
            <p className="font-display text-[1.375rem] text-dark">
              Send your cart, get it delivered.
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-gold" aria-hidden="true" />
                {WHATSAPP_HOURS}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5 text-gold" aria-hidden="true" />
                {WHATSAPP_REPLY_TIME}
              </span>
            </p>
          </div>
          <a
            href={whatsappEnquiry()}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-[3.25rem] shrink-0 items-center justify-center gap-2.5 rounded-md bg-whatsapp px-8 font-sans text-xs font-medium uppercase tracking-[0.16em] text-noir-deep transition-colors duration-300 hover:bg-[#1FBC5B] focus-visible:outline-offset-4"
          >
            <WhatsAppIcon className="size-4" />
            Chat with DIVA
          </a>
        </div>

        <div className="mt-14 border-t border-noir/10 pt-6">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted">
              © 2026 DIVA STORE — Decant House
            </p>
            <p className="font-quote text-base italic text-muted">Poured to order, never refilled.</p>
            <p className="text-[0.6875rem] text-muted">Free delivery over 150 DT · 14-day returns</p>
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
    <section className="border-b border-noir/10 bg-sand/40" aria-labelledby="newsletter-title">
      <div className="container-lux grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <div className="eyebrow eyebrow-rule mb-4">
            <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            <span className="text-noir/70">The Diva List</span>
          </div>
          <h2 id="newsletter-title" className="display-title text-[clamp(1.75rem,3.6vw,2.6rem)]">
            New decants, first.
          </h2>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">
            One message a month: the fragrances we have just poured, and the ones worth trying
            before anyone else does.
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
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-noir text-ivory">
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-[0.9375rem] leading-snug text-dark">
              You are on the list. The next pour lands in your inbox first.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="w-full" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Your email address
            </label>
            <div className="flex items-center gap-3 border-b border-noir/25 pb-3 transition-colors focus-within:border-noir">
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
