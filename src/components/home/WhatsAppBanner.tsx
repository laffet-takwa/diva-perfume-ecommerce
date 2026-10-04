import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppLink } from '@/components/ui/WhatsAppLink'
import { Flacon } from '@/components/product/Flacon'
import Reveal from '@/components/ui/Reveal'
import { BESTSELLERS, HERO_DECANT, products } from '@/data/products'
import { FREE_SHIPPING_COPY } from '@/data/navigation'
import { whatsappEnquiry, WHATSAPP_DISPLAY, WHATSAPP_HOURS, WHATSAPP_REPLY_TIME } from '@/lib/whatsapp'
import { spellCount } from '@/lib/utils'

/* ==========================================================================
   WhatsAppBanner — the ordering promise, made concrete.
   A decant shop closes in a chat: the customer sends the order, we confirm the
   batch and the dispatch time. This is the section that explains that.
   ========================================================================== */

const STEPS = [
  'Pick your fragrance and size',
  'Send the order in one tap',
  'We confirm the batch and dispatch time',
  'Delivered, with a tracking link',
]

export function WhatsAppBanner() {
  const reduceMotion = useReducedMotion()
  const hero = BESTSELLERS[0]

  return (
    <section className="relative overflow-hidden bg-noir" aria-labelledby="wa-title">
      {/* Light source behind the bottle */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/12 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(185,154,82,0.2),transparent_58%)]" />
        <div className="absolute inset-0 grain-layer opacity-25 mix-blend-overlay" />
      </div>

      <div className="container-lux relative grid items-center gap-14 py-20 md:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="relative z-10 flex flex-col items-start gap-7">
          <Reveal variant="up">
            <div className="eyebrow eyebrow-rule">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              <span className="text-ivory/70">Order on WhatsApp</span>
            </div>
          </Reveal>

          <Reveal variant="up" delay={0.08}>
            <h2 id="wa-title" className="display-title text-[clamp(2rem,5vw,3.4rem)] text-white">
              Checkout is a chat,
              <br />
              <span className="italic text-gold">not a form.</span>
            </h2>
          </Reveal>

          <Reveal variant="up" delay={0.16}>
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-white/65">
              No card forms, no failed payments. Your cart becomes a message, we confirm the batch,
              and you pay cash on delivery or by transfer.
            </p>
          </Reveal>

          <Reveal variant="up" delay={0.2}>
            <ol className="flex flex-col gap-3">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-3 text-[0.875rem] text-white/75">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-gold/40 text-[0.625rem] text-gold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal variant="up" delay={0.24}>
            <div className="flex flex-wrap gap-3">
              <WhatsAppLink href={whatsappEnquiry()} tone="whatsapp" size="lg">
                Start my order
              </WhatsAppLink>
              <ButtonLink to="/perfumes" variant="ghost" size="lg">
                Browse first
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal variant="up" delay={0.28}>
            <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 pt-6 text-left">
              <div>
                <dt className="text-[0.5625rem] uppercase tracking-[0.2em] text-white/45">Chat</dt>
                <dd className="mt-1 text-[0.8125rem] text-white/80">{WHATSAPP_DISPLAY}</dd>
              </div>
              <div>
                <dt className="text-[0.5625rem] uppercase tracking-[0.2em] text-white/45">Hours</dt>
                <dd className="mt-1 text-[0.8125rem] text-white/80">{WHATSAPP_HOURS}</dd>
              </div>
              <div>
                <dt className="text-[0.5625rem] uppercase tracking-[0.2em] text-white/45">Response</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-[0.8125rem] text-white/80">
                  <Check className="size-3.5 text-gold" aria-hidden="true" />
                  {WHATSAPP_REPLY_TIME}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {hero && (
          <Reveal variant="scale" delay={0.1} className="relative z-10 mx-auto w-full max-w-sm lg:max-w-none">
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Flacon
                art={hero.art}
                photo={hero.photo}
                photoTone={hero.photoTone}
                photoAlt={hero.name}
                sizeMl={HERO_DECANT}
                bare
                className="mx-auto h-auto w-[78%] drop-shadow-[0_50px_70px_rgba(0,0,0,0.55)]"
              />
            </motion.div>
            <p className="mt-6 text-center font-sans text-[0.625rem] uppercase tracking-[0.28em] text-white/50">
              {spellCount(products.length)} fragrances · decanted to order ·{' '}
              {FREE_SHIPPING_COPY}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

export default WhatsAppBanner
