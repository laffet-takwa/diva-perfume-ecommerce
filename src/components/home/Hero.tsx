import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Flacon } from '@/components/product/Flacon'
import { ArtScene } from '@/components/art/ArtScene'
import PhotoFrame from '@/components/art/PhotoFrame'
import { BESTSELLERS } from '@/data/products'
import { EASE_LUX } from '@/lib/motion'
import { formatPrice } from '@/lib/utils'

/* ==========================================================================
   Hero
   Campaign portrait on the left, house copy on the right.
   Fade ground → portrait reveal → rise copy → buttons → fine particles.
   ========================================================================== */

const CAMPAIGN_IMAGE = {
  src: '/images/campaign/la-diva-portrait.jpg',
  alt: 'A woman in a blush satin evening gown seated on a ivory sofa in the DIVA STORE boutique.',
}

const ASSURANCES = ['Free shipping over 150 DT', '14-day returns', 'Independent boutique']

const copyStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
}

const riseItem = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_LUX } },
}

export function Hero() {
  const reduceMotion = useReducedMotion()
  const spotlight = BESTSELLERS[0]

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-ivory pt-28 lg:pt-32"
      aria-labelledby="hero-title"
    >
      {/* Backdrop: soft light pool behind the copy, fading away from the portrait */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1 }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] lg:[mask-image:linear-gradient(to_right,transparent,black_10rem)]">
          <ArtScene variant="hero" className="h-full w-full" grain={0.3} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-ivory)_0%,var(--color-ivory)_32%,rgba(247,241,234,0.72)_52%,rgba(247,241,234,0.25)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ivory to-transparent" />
      </motion.div>

      <div className="container-lux relative grid min-h-[calc(100svh-8rem)] items-center gap-12 pb-24 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-12 lg:gap-12 lg:pb-28 xl:gap-16">
        {/* Campaign portrait — left on desktop, below the promise on mobile. */}
        <div className="relative order-2 mt-2 lg:order-1 lg:col-span-5 lg:mt-0">
          <PhotoFrame
            src={CAMPAIGN_IMAGE.src}
            alt={CAMPAIGN_IMAGE.alt}
            frame="tall"
            priority
            focus="50% 12%"
            parallax={reduceMotion ? 0 : 3}
            feather="left"
            className="w-full sm:max-w-[26rem] lg:aspect-auto lg:h-[64vh] lg:max-w-none"
          />

          {/* Floating flacon chip — commerce intent without stealing the frame */}
          {spotlight && (
            <Link
              to={`/product/${spotlight.slug}`}
              className="group absolute -bottom-5 left-4 hidden items-center gap-3 rounded-md border border-dark/10 bg-ivory/92 px-4 py-3 shadow-float backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 sm:flex lg:-right-6 lg:bottom-8 lg:left-auto"
            >
              <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-taupe/40">
                <Flacon
                  art={spotlight.art}
                  photo={spotlight.photo}
                  photoTone={spotlight.photoTone}
                  photoAlt={spotlight.name}
                  sizeMl={50}
                  bare
                  className="h-[130%] w-[130%] object-contain"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.5rem] uppercase tracking-[0.28em] text-muted">
                  Signature scent
                </span>
                <span className="mt-0.5 block truncate font-display text-[0.9375rem] text-dark">
                  {spotlight.name}
                </span>
                <span className="mt-0.5 block text-[0.6875rem] text-muted">
                  {formatPrice(spotlight.price)}
                </span>
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-noir transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>

        {/* House copy — right on desktop, first on mobile */}
        <motion.div
          variants={copyStagger}
          initial="hidden"
          animate="visible"
          className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7"
        >
          <motion.div variants={riseItem} className="eyebrow eyebrow-rule mb-6">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <span className="text-noir/80">Diva Store — Est. 2026</span>
          </motion.div>

          <motion.p variants={riseItem} className="eyebrow mb-4 text-dark/60">
            Discover your signature
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={riseItem}
            className="display-title text-[clamp(2.5rem,6.4vw,4.75rem)] text-dark"
          >
            Your Scent.
            <br />
            <span className="italic text-noir">Your Story.</span>
          </motion.h1>

          <motion.p
            variants={riseItem}
            className="mt-7 max-w-md text-[1rem] leading-relaxed text-muted md:text-[1.0625rem]"
          >
            Des fragrances pensées pour révéler votre personnalité. Curated from the great
            houses, chosen to be remembered.
          </motion.p>

          <motion.div
            variants={riseItem}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <ButtonLink to="/perfumes" variant="primary" size="lg" arrow block className="sm:w-auto">
              Shop perfumes
            </ButtonLink>
            <ButtonLink to="/collections" variant="outline" size="lg" block className="sm:w-auto">
              Explore collection
            </ButtonLink>
          </motion.div>

          <motion.ul
            variants={riseItem}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-dark/10 pt-6"
          >
            {ASSURANCES.map((item, i) => (
              <li key={item} className="flex items-center gap-6">
                {i > 0 && <span aria-hidden="true" className="hidden h-3 w-px bg-gold/50 sm:block" />}
                <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted">{item}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Fine particles — barely there, never confetti */}
      <Particles />

      {/* Scroll marker */}
      <motion.a
        href="#the-diva-edit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-noir md:flex"
      >
        <span className="eyebrow text-[0.5625rem]">Scroll to discover</span>
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="size-3.5" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  )
}

/* --------------------------------------------------------------------------
   Particles — three slow drifting specks of gold
   -------------------------------------------------------------------------- */

function Particles() {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  const specks = [
    { left: '18%', top: '28%', size: 3, delay: 0, duration: 14 },
    { left: '72%', top: '20%', size: 2, delay: 1.8, duration: 17 },
    { left: '86%', top: '62%', size: 2.5, delay: 3.1, duration: 15 },
    { left: '42%', top: '72%', size: 2, delay: 0.9, duration: 19 },
  ]

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {specks.map((speck, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold/50 blur-[0.5px]"
          style={{ left: speck.left, top: speck.top, width: speck.size, height: speck.size }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.2, 0.45, 0], y: [0, -26, 8, -14, 0] }}
          transition={{ duration: speck.duration, delay: speck.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default Hero
