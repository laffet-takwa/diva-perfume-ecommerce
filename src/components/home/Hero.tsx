import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, Sparkles, Star, Truck } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Flacon } from '@/components/product/Flacon'
import { ArtScene } from '@/components/art/ArtScene'
import {
  BESTSELLERS,
  ENTRY_DECANT,
  ENTRY_PRICE,
  HERO_DECANT,
  MEDIAN_DECANT,
  savingsPercent,
} from '@/data/products'
import { EASE_LUX } from '@/lib/motion'
import { formatPrice } from '@/lib/utils'

/* ==========================================================================
   Hero
   The promise is the price: a real bottle's worth of fragrance, decanted, at a
   price you can try. Bottle cluster on the left, the promise on the right.
   Fade ground → bottles → copy → CTAs → social proof strip.
   ========================================================================== */

/** Three best-loved fragrances, used as the hero bottle cluster. */
const CLUSTER = BESTSELLERS.slice(0, 3)

const ASSURANCES = [
  { icon: Sparkles, label: '100% authentic' },
  { icon: Truck, label: 'Delivered in 24h' },
  { icon: Star, label: '4.9 from 12k reviews' },
]

const copyStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.28 } },
}

const riseItem = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_LUX } },
}

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-ivory pt-28 lg:pt-32"
      aria-labelledby="hero-title"
    >
      {/* Backdrop: a warm light pool behind the bottles, falling off to paper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1 }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 left-0 w-full lg:w-[56%] lg:[mask-image:linear-gradient(to_right,black_60%,transparent)]">
          <ArtScene variant="hero" className="h-full w-full" grain={0.28} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(270deg,var(--color-ivory)_0%,var(--color-ivory)_34%,rgba(250,247,241,0.74)_54%,rgba(250,247,241,0.2)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ivory to-transparent" />
      </motion.div>

      <div className="container-lux relative grid min-h-[calc(100svh-8rem)] items-center gap-12 pb-24 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-12 lg:gap-12 lg:pb-28 xl:gap-16">
        {/* Bottle cluster — below the copy on mobile */}
        <div className="relative order-2 lg:order-1 lg:col-span-5">
          <BottleCluster reduceMotion={Boolean(reduceMotion)} />
        </div>

        {/* The promise */}
        <motion.div
          variants={copyStagger}
          initial="hidden"
          animate="visible"
          className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7"
        >
          <motion.div variants={riseItem} className="eyebrow eyebrow-rule mb-6">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <span className="text-noir/70">Perfume decants · 3 / 5 / 10 ml</span>
          </motion.div>

          <motion.h1
            id="hero-title"
            variants={riseItem}
            className="display-title text-[clamp(2.4rem,6.2vw,4.6rem)] text-dark"
          >
            Luxury Scents,
            <br />
            <span className="italic text-noir">Affordable Decants.</span>
          </motion.h1>

          <motion.p
            variants={riseItem}
            className="mt-7 max-w-md text-[1rem] leading-relaxed text-muted md:text-[1.0625rem]"
          >
            Chanel, Dior, Tom Ford, Le Labo and 20 more houses — decanted into travel sprays
            from <span className="text-noir">{formatPrice(ENTRY_DECANT)}</span>. The real thing,
            a fraction of the price.
          </motion.p>

          <motion.div
            variants={riseItem}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <ButtonLink to="/perfumes" variant="primary" size="lg" arrow block className="sm:w-auto">
              Shop Now
            </ButtonLink>
            <ButtonLink
              to={`/perfumes?size=${HERO_DECANT}`}
              variant="outline"
              size="lg"
              block
              className="sm:w-auto"
            >
              Start with {HERO_DECANT} ml — {formatPrice(ENTRY_PRICE[HERO_DECANT])}
            </ButtonLink>
          </motion.div>

          <motion.ul
            variants={riseItem}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-noir/10 pt-6"
          >
            {ASSURANCES.map((item, i) => (
              <li key={item.label} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="mr-4 hidden h-3 w-px bg-gold/50 sm:block" />
                )}
                <item.icon className="size-3.5 text-gold" aria-hidden="true" />
                <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                  {item.label}
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Fine particles — barely there, never confetti */}
      <Particles />

      {/* Scroll marker */}
      <motion.a
        href="#shop-by-size"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-noir md:flex"
      >
        <span className="eyebrow text-[0.5625rem]">Shop by size</span>
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
   BottleCluster — three decants, the middle one lifted
   -------------------------------------------------------------------------- */

function BottleCluster({ reduceMotion }: { reduceMotion: boolean }) {
  if (CLUSTER.length === 0) return null

  return (
    <div className="relative mx-auto aspect-[1/1] w-full max-w-[26rem] sm:max-w-[30rem]">
      {/* Gold plinth */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[12%] bottom-[9%] h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-[16%] bottom-[10%] h-24 rounded-[50%] bg-noir/[0.07] blur-2xl"
      />

      {CLUSTER.map((product, i) => {
        const centre = i === Math.floor(CLUSTER.length / 2)
        const offsets = [
          'left-0 bottom-[10%] w-[46%] -rotate-[4deg]',
          'left-[27%] bottom-[20%] w-[52%] rotate-0 z-10',
          'right-0 bottom-[8%] w-[44%] rotate-[4deg]',
        ]
        const price = product.sizes[1].price

        return (
          <motion.div
            key={product.id}
            className={`absolute ${offsets[i] ?? offsets[1]}`}
            initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 + i * 0.16, ease: EASE_LUX }}
          >
            <motion.div
              animate={reduceMotion || !centre ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Link
                to={`/product/${product.slug}`}
                className="group/bottle block focus-visible:outline-offset-4"
                aria-label={`${product.name} by ${product.brand} — ${formatPrice(price)}`}
              >
                <span className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-sm bg-gradient-to-b from-sand/80 to-taupe/60 shadow-[0_22px_50px_-28px_rgba(12,12,14,0.55)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/bottle:-translate-y-1.5">
                  <Flacon
                    art={product.art}
                    photo={product.photo}
                    photoTone={product.photoTone}
                    photoAlt={`${product.name} by ${product.brand}`}
                    sizeMl={product.sizes[1].ml}
                    className="h-[112%] w-[112%] object-contain p-3 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/bottle:scale-[1.05]"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-ivory/90 px-2.5 py-1.5 backdrop-blur-sm">
                    <span className="truncate text-[0.5rem] uppercase tracking-[0.18em] text-muted">
                      {product.brand}
                    </span>
                    <span className="shrink-0 font-display text-[0.6875rem] text-noir">
                      {formatPrice(price)}
                    </span>
                  </span>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        )
      })}

      {/* Saving chip — the single strongest argument on the page */}
      {CLUSTER[1] && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: EASE_LUX }}
          className="absolute -right-2 top-2 z-20 rounded-sm border border-gold/40 bg-ivory/95 px-4 py-3 shadow-float backdrop-blur-md sm:right-2"
        >
          <span className="block text-[0.5rem] uppercase tracking-[0.26em] text-muted">
            {MEDIAN_DECANT} DT buys
          </span>
          <span className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-2xl text-noir">
              {savingsPercent(CLUSTER[1], HERO_DECANT)}%
            </span>
            <span className="text-[0.625rem] uppercase tracking-[0.14em] text-muted">less</span>
          </span>
          <span className="mt-1 block max-w-[20ch] text-[0.625rem] leading-snug text-muted">
            than the {CLUSTER[1].fullBottle.ml} ml bottle at {formatPrice(CLUSTER[1].fullBottle.price)}
          </span>
        </motion.div>
      )}
    </div>
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
