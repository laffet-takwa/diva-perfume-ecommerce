import { motion } from 'framer-motion'
import ArtScene from '@/components/art/ArtScene'
import Reveal from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { products } from '@/data/products'
import { imageReveal, imageRevealAlt } from '@/lib/motion'

/* ==========================================================================
   Editorial composition — "The Art of Perfume"
   Deliberately not a two-column image + text block: numbered, offset,
   vertical caption, layered secondary frame.
   ========================================================================== */

export function EditorialSection() {
  return (
    <section className="relative overflow-hidden bg-ivory py-20 md:py-28 lg:py-32" aria-labelledby="editorial-title">
      <div className="container-lux">
        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Index + vertical caption, desktop only */}
          <Reveal variant="fade" className="hidden lg:col-span-1 lg:flex lg:flex-col lg:items-center lg:gap-8">
            <span className="vertical-text font-sans text-[0.5625rem] uppercase tracking-[0.42em] text-muted">
              The Diva Journal
            </span>
            <span className="h-24 w-px bg-gradient-to-b from-gold/70 to-transparent" aria-hidden="true" />
            <span className="font-display text-4xl text-gold">01</span>
          </Reveal>

          {/* Layered imagery */}
          <div className="relative lg:col-span-6">
            <motion.div
              variants={imageReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="relative aspect-[4/5] overflow-hidden rounded-md"
            >
              <ArtScene variant="editorial" grain={0.4} className="h-full w-full" />
            </motion.div>

            {/* Secondary frame, offset */}
            <motion.div
              variants={imageRevealAlt}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.18 }}
              className="absolute -bottom-10 -right-4 hidden aspect-square w-44 overflow-hidden rounded-md border-[6px] border-ivory shadow-float sm:block lg:-right-10 lg:w-52"
            >
              <ArtScene variant="ritual" grain={0.5} className="h-full w-full" />
            </motion.div>

            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-xs bg-ivory/85 px-3 py-1.5 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
              <span className="text-[0.5625rem] uppercase tracking-[0.22em] text-dark">Since 2026</span>
            </div>
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center lg:col-span-5 lg:pl-8">
            <Reveal variant="up">
              <div className="eyebrow eyebrow-rule mb-6">
                <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
                <span className="text-noir/70">The Art of Perfume</span>
              </div>
            </Reveal>

            <Reveal variant="up" delay={0.08}>
              <h2 id="editorial-title" className="display-title text-[clamp(1.9rem,3.8vw,2.9rem)]">
                Perfume is more
                <br />
                than a scent.
                <br />
                <span className="italic text-noir">It is a memory,</span>
                <br />
                a mood and a signature.
              </h2>
            </Reveal>

            <Reveal variant="up" delay={0.16}>
              <p className="mt-7 max-w-md text-[0.9375rem] leading-relaxed text-muted">
                We test every fragrance on skin, over days rather than minutes, and we refuse the
                flattering swatch. Nothing is rushed. Nothing is anonymous. Every bottle here carries
                the name of the perfumer who built it.
              </p>
            </Reveal>

            <Reveal variant="up" delay={0.24}>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-dark/10 pt-7">
                {[
                  { value: String(products.length).padStart(2, '0'), label: 'Fragrances on the shelf' },
                  { value: '12', label: 'Houses we carry' },
                  { value: '4.7', label: 'Average rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-2xl text-dark">{stat.value}</span>
                      <span className="mt-1 block text-[0.625rem] uppercase leading-relaxed tracking-[0.16em] text-muted">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal variant="up" delay={0.32} className="mt-10">
              <ButtonLink to="/about" variant="primary" size="lg" arrow>
                Discover our story
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditorialSection