import { motion, useReducedMotion } from 'framer-motion'
import { ButtonLink } from '@/components/ui/Button'
import { BottleArt } from '@/components/art/BottleArt'
import Reveal from '@/components/ui/Reveal'
import { BESTSELLERS, products } from '@/data/products'
import { spellCount } from '@/lib/utils'

/* ==========================================================================
   Promotional banner — deep burgundy, light pool behind a large flacon
   ========================================================================== */

export function PromoBanner() {
  const reduceMotion = useReducedMotion()
  const hero = BESTSELLERS.find((p) => p.badge === 'EXCLUSIVE') ?? BESTSELLERS[0]

  return (
    <section className="relative overflow-hidden bg-burgundy" aria-labelledby="promo-title">
      {/* Light source behind the product */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/12 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(201,164,92,0.20),transparent_58%)]" />
        <div className="absolute inset-0 grain-layer opacity-25 mix-blend-overlay" />
      </div>

      <div className="container-lux relative grid items-center gap-12 py-20 md:py-24 lg:grid-cols-2 lg:py-28">
        <div className="relative z-10 flex flex-col items-start gap-7">
          <Reveal variant="up">
            <div className="eyebrow eyebrow-rule">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              <span className="text-cream/70">Limited run</span>
            </div>
          </Reveal>

          <Reveal variant="up" delay={0.08}>
            <h2
              id="promo-title"
              className="display-title text-[clamp(2rem,5vw,3.6rem)] text-white"
            >
              Your next signature
              <br />
              <span className="italic text-gold">is waiting.</span>
            </h2>
          </Reveal>

          <Reveal variant="up" delay={0.16}>
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-white/65">
              {spellCount(products.length).replace(/^./, (c) => c.toUpperCase())} fragrances, one point of view. Free shipping over 150 DT, easy returns within fourteen days.
            </p>
          </Reveal>

          <Reveal variant="up" delay={0.24}>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/perfumes" variant="gold" size="lg" arrow>
                Shop now
              </ButtonLink>
              <ButtonLink
                to="/collections"
                variant="ghost"
                size="lg"
                className="border border-white/25 text-white hover:bg-white/10"
              >
                Explore collections
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        {hero && (
          <Reveal variant="scale" delay={0.1} className="relative z-10 mx-auto w-full max-w-sm lg:max-w-none">
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BottleArt
                art={hero.art}
                className="h-auto w-full drop-shadow-[0_50px_70px_rgba(0,0,0,0.45)]"
              />
            </motion.div>
            <p className="mt-6 text-center font-sans text-[0.625rem] uppercase tracking-[0.28em] text-white/50">
              {hero.name} · Eau de Parfum
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

export default PromoBanner