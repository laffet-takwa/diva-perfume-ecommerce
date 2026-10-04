import { motion } from 'framer-motion'
import { BadgeCheck, Truck, Wallet } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'
import { WhatsAppLink } from '@/components/ui/WhatsAppLink'
import { whatsappAuthenticity, whatsappEnquiry } from '@/lib/whatsapp'
import { staggerMedium, fadeUp } from '@/lib/motion'

/* ==========================================================================
   Why DIVA
   Three promises, answered rather than asserted — each one links to the chat
   where a customer can actually get that promise confirmed.
   ========================================================================== */

const PROMISES = [
  {
    icon: BadgeCheck,
    title: '100% Authentic',
    headline: 'Decanted from sealed, full-price bottles.',
    body: 'Every flacon is poured from a genuine bottle bought at full retail — never a refill, never a reproduction. We show you the bottle, the batch and the fill date before it ships.',
    proof: 'Batch photo sent before dispatch',
    href: whatsappAuthenticity(),
    cta: 'Ask us for proof',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    headline: 'Ordered today, in your hands tomorrow.',
    body: 'Decants are poured to order, so there is no warehouse wait. Orders placed before 2pm leave the same day, and you get the tracking link in the chat the moment they do.',
    proof: 'Dispatch within 24 hours',
    href: whatsappEnquiry('Hi DIVA! How fast will my order arrive?'),
    cta: 'Check my area',
  },
  {
    icon: Wallet,
    title: 'Best Price',
    headline: 'Up to 97% less than the bottle.',
    body: 'You pay for the millilitres you use, not the shelf space you do not. A 5 ml of a 1 450 DT bottle costs 55 DT here — and it is the same juice, in the same proportions, filled to the same volume.',
    proof: 'Price shown per volume, always',
    href: whatsappEnquiry('Hi DIVA! Can you match this price?'),
    cta: 'Price match?',
  },
]

export function WhyDiva() {
  return (
    <section className="relative bg-noir py-20 text-ivory md:py-28" aria-labelledby="why-title">
      {/* Gold hairline frame + a single pool of light */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(185,154,82,0.16),transparent_62%)]"
      />

      <div className="container-lux relative">
        <Reveal variant="up" className="max-w-2xl">
          <div className="eyebrow eyebrow-rule mb-5">
            <span className="font-display text-xs text-gold">03</span>
            <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            <span className="text-gold/80">Why DIVA</span>
          </div>
          <h2 id="why-title" className="display-title text-[clamp(2rem,5vw,3.4rem)] text-ivory">
            Everything you were promised.
            <br />
            <span className="italic text-gold">Nothing you have to trust blindly.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-ivory/65">
            Anyone can call a decant authentic. We prove it on request, before your order ships.
          </p>
        </Reveal>

        <motion.ul
          variants={staggerMedium}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-px overflow-hidden rounded-md bg-gold/25 md:grid-cols-3 lg:mt-20"
        >
          {PROMISES.map((promise) => (
            <motion.li
              key={promise.title}
              variants={fadeUp}
              className="group/promise flex flex-col bg-noir-deep p-7 transition-colors duration-500 hover:bg-noir-soft md:p-9"
            >
              <span className="flex size-14 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-500 group-hover/promise:border-gold group-hover/promise:bg-gold group-hover/promise:text-noir-deep">
                <promise.icon className="size-6" aria-hidden="true" />
              </span>

              <h3 className="mt-7 font-display text-[1.5rem] text-ivory">{promise.title}</h3>
              <p className="mt-2 font-quote text-lg italic leading-snug text-gold/90">
                {promise.headline}
              </p>
              <p className="mt-4 text-[0.875rem] leading-relaxed text-ivory/60">{promise.body}</p>

              <p className="mt-6 flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.2em] text-ivory/45">
                <span aria-hidden="true" className="h-px w-5 bg-gold/50" />
                {promise.proof}
              </p>

              <WhatsAppLink
                href={promise.href}
                tone="gold"
                size="sm"
                className="mt-7 self-start"
              >
                {promise.cta}
              </WhatsAppLink>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

export default WhyDiva
