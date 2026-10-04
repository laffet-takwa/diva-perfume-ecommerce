import { motion } from 'framer-motion'
import type { PerfumeNotes } from '@/types'
import { EASE_LUX, staggerContainer } from '@/lib/motion'

/* ==========================================================================
   ProductNotes — "The Scent"
   Three tiers rendered as concentric rings: top (outer, fleeting),
   heart (middle, the character), base (inner, the lasting trail).
   ========================================================================== */

interface Tier {
  key: 'top' | 'heart' | 'base'
  label: string
  caption: string
  radius: number
  dot: string
  ring: string
}

const TIERS: Tier[] = [
  {
    key: 'top',
    label: 'Top Notes',
    caption: 'The first impression · 0–15 min',
    radius: 148,
    dot: 'bg-gold',
    ring: 'border-gold/45',
  },
  {
    key: 'heart',
    label: 'Heart Notes',
    caption: 'The character · 15 min – 3 h',
    radius: 104,
    dot: 'bg-burgundy',
    ring: 'border-burgundy/35',
  },
  {
    key: 'base',
    label: 'Base Notes',
    caption: 'The memory · 3 h and beyond',
    radius: 58,
    dot: 'bg-rose',
    ring: 'border-rose/50',
  },
]

export interface ProductNotesProps {
  notes: PerfumeNotes
  className?: string
}

export function ProductNotes({ notes, className }: ProductNotesProps) {
  return (
    <section className={className} aria-labelledby="scent-title">
      <div className="eyebrow eyebrow-rule mb-4">
        <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
        <span className="text-burgundy/70">The Scent</span>
      </div>
      <h2 id="scent-title" className="display-title text-[clamp(1.6rem,3.4vw,2.4rem)]">
        How it unfolds
      </h2>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-center lg:gap-16">
        {/* Concentric map */}
        <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
          <div
            aria-hidden="true"
            className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_72%)]"
          />

          {TIERS.map((tier, i) => {
            const size = (tier.radius * 2) / 300 // percentage of the 300-unit square
            const dots = notes[tier.key]

            return (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, scale: 0.82 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.14, duration: 0.8, ease: EASE_LUX }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{
                  width: `${size * 100}%`,
                  height: `${size * 100}%`,
                  borderColor: tier.key === 'top' ? 'rgba(201,164,92,0.45)' : tier.key === 'heart' ? 'rgba(74,23,40,0.32)' : 'rgba(201,143,159,0.5)',
                }}
              >
                {/* Tier label */}
                <span
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-cream px-2 font-sans text-[0.5rem] uppercase tracking-[0.22em] text-muted"
                >
                  {tier.label}
                </span>

                {/* Notes sit on the ring */}
                {dots.map((note, d) => {
                  const angle = (d / Math.max(dots.length, 1)) * Math.PI * 2 - Math.PI / 2
                  return (
                    <motion.span
                      key={note}
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ delay: 0.25 + i * 0.14 + d * 0.09, duration: 0.5 }}
                      className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        background: tier.key === 'top' ? '#C9A45C' : tier.key === 'heart' ? '#4A1728' : '#C98F9F',
                        boxShadow: '0 0 0 4px rgba(247,241,234,0.85)',
                        transform: `translate(-50%, -50%) translate(${Math.cos(angle) * tier.radius * 0.92}px, ${Math.sin(angle) * tier.radius * 0.92}px)`,
                      }}
                    >
                      <span className="sr-only">{note}</span>
                    </motion.span>
                  )
                })}
              </motion.div>
            )
          })}

          <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy" aria-hidden="true" />
        </div>

        {/* Linear breakdown — the accessible, readable version */}
        <motion.ul
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-7"
        >
          {TIERS.map((tier) => (
            <motion.li
              key={tier.key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_LUX } },
              }}
              className="border-b border-dark/10 pb-6 last:border-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="eyebrow text-dark">{tier.label}</h3>
                <span className="text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                  {tier.caption}
                </span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {notes[tier.key].map((note) => (
                  <li
                    key={note}
                    className="rounded-xs border border-dark/12 px-3 py-1.5 text-[0.8125rem] text-dark"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

export default ProductNotes