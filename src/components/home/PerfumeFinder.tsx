import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import type { Occasion, Product, ScentMood } from '@/types'
import { products } from '@/data/products'
import { Flacon } from '@/components/product/Flacon'
import ProductRating from '@/components/product/ProductRating'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EASE_LUX } from '@/lib/motion'
import { formatPrice } from '@/lib/utils'

/* ==========================================================================
   Perfume Finder — three questions, three recommendations.
   Scoring is deliberately explainable: mood + notes + occasion weight.
   ========================================================================== */

const MOODS: { value: ScentMood; blurb: string }[] = [
  { value: 'Romantic', blurb: 'Soft, close, impossible to forget' },
  { value: 'Confident', blurb: 'Structured and self-assured' },
  { value: 'Fresh', blurb: 'Bright, clean, weightless' },
  { value: 'Mysterious', blurb: 'Resinous, dark, intriguing' },
  { value: 'Elegant', blurb: 'Restrained, couture, precise' },
  { value: 'Energetic', blurb: 'Lively, sparkling, daytime' },
]

const NOTE_OPTIONS = [
  'Vanilla',
  'Rose',
  'Oud',
  'Citrus',
  'Musk',
  'Jasmine',
  'Amber',
  'Woody',
] as const

const OCCASIONS: { value: Occasion; blurb: string }[] = [
  { value: 'Everyday', blurb: 'The scent you never take off' },
  { value: 'Office', blurb: 'Present, never distracting' },
  { value: 'Date Night', blurb: 'Warm, close, memorable' },
  { value: 'Evening', blurb: 'After dark, nothing loud' },
  { value: 'Special Occasion', blurb: 'The one they remember' },
]

const MOOD_TO_TAGS: Record<ScentMood, string[]> = {
  Romantic: ['Rose', 'Jasmine', 'Vanilla'],
  Confident: ['Oud', 'Amber', 'Woody'],
  Fresh: ['Citrus', 'Musk'],
  Mysterious: ['Oud', 'Amber', 'Woody'],
  Elegant: ['Musk', 'Rose', 'Jasmine'],
  Energetic: ['Citrus', 'Jasmine'],
}

const OCCASION_TO_TAGS: Record<Occasion, string[]> = {
  Everyday: ['Musk', 'Citrus', 'Vanilla'],
  Office: ['Musk', 'Citrus', 'Jasmine'],
  'Date Night': ['Rose', 'Oud', 'Vanilla', 'Amber'],
  Evening: ['Oud', 'Amber', 'Woody', 'Vanilla'],
  'Special Occasion': ['Oud', 'Amber', 'Rose', 'Vanilla'],
}

interface Answer {
  mood: ScentMood | null
  notes: string[]
  occasion: Occasion | null
}

const EMPTY: Answer = { mood: null, notes: [], occasion: null }

const STEP_COPY = [
  { eyebrow: 'Question 01', title: "What's your scent mood?" },
  { eyebrow: 'Question 02', title: 'Which notes attract you?' },
  { eyebrow: 'Question 03', title: 'When will you wear it?' },
]

export function PerfumeFinder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answer>(EMPTY)

  const matches = useMemo(() => score(answers), [answers])
  const complete = answers.mood !== null && answers.occasion !== null

  const select = useCallback(
    (patch: Partial<Answer>, advance = true) => {
      setAnswers((prev) => ({ ...prev, ...patch }))
      // Notes is multi-select, so it advances only via its own Continue button.
      if (advance && step < 2) {
        window.setTimeout(() => setStep((s) => Math.min(s + 1, 2)), 260)
      }
    },
    [step],
  )

  const goBack = () => setStep((s) => Math.max(s - 1, 0))
  const reset = () => {
    setAnswers(EMPTY)
    setStep(0)
  }

  const toggleNote = (note: string) => {
    const next = answers.notes.includes(note)
      ? answers.notes.filter((n) => n !== note)
      : [...answers.notes, note]
    select({ notes: next }, false)
  }

  return (
    <section id="finder" className="relative py-20 md:py-28 lg:py-32" aria-labelledby="finder-title">
      <div className="container-lux">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Prompt side */}
          <div className="flex flex-col">
            <div className="eyebrow eyebrow-rule mb-5">
              <span className="font-display text-xs text-gold">03</span>
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              <span className="text-burgundy/70">The Scent Finder</span>
            </div>

            <h2 id="finder-title" className="display-title text-[clamp(1.9rem,4.4vw,3rem)]">
              What&rsquo;s your scent mood?
            </h2>

            <div className="mt-6 flex items-center gap-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-px w-10 transition-colors duration-500 ${
                    i <= step ? 'bg-burgundy' : 'bg-dark/15'
                  }`}
                />
              ))}
              <span className="ml-2 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-muted">
                {complete ? 'Your match' : `Step ${step + 1} of 3`}
              </span>
            </div>

            <div className="mt-8 min-h-[8.5rem]">
              <AnimatePresence mode="wait">
                {!complete ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 34 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -34 }}
                    transition={{ duration: 0.42, ease: EASE_LUX }}
                  >
                    <p className="eyebrow mb-2 text-gold">{STEP_COPY[step].eyebrow}</p>
                    <h3 className="font-display text-2xl text-dark">{STEP_COPY[step].title}</h3>
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={step === 0}
                      className="mt-6 inline-flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.2em] text-muted transition-colors hover:text-burgundy disabled:pointer-events-none disabled:opacity-0"
                    >
                      <ArrowLeft className="size-3.5" aria-hidden="true" />
                      Previous
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.42, ease: EASE_LUX }}
                  >
                    <p className="eyebrow mb-2 text-gold">Your Diva match</p>
                    <h3 className="font-display text-2xl text-dark">
                      {answers.mood} · {answers.notes.length > 0 ? answers.notes.join(', ') : 'open notes'}
                    </h3>
                    <p className="mt-2 text-[0.8125rem] text-muted">For {answers.occasion?.toLowerCase()}.</p>
                    <Button variant="ghost" size="sm" onClick={reset} className="mt-6 px-0">
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                      Start again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Options / results side */}
          <div className="relative min-h-[28rem] overflow-hidden rounded-md border border-dark/10 bg-cream p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {!complete ? (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.42, ease: EASE_LUX }}
                  className="flex h-full flex-col"
                >
                  {step === 0 && (
                    <OptionsGrid
                      items={MOODS.map((m) => ({ value: m.value, label: m.value, blurb: m.blurb }))}
                      selected={answers.mood ? [answers.mood] : []}
                      onSelect={(v) => select({ mood: v as ScentMood })}
                    />
                  )}

                  {step === 1 && (
                    <>
                      <div className="flex flex-wrap gap-2.5">
                        {NOTE_OPTIONS.map((note) => {
                          const active = answers.notes.includes(note)
                          return (
                            <button
                              key={note}
                              type="button"
                              onClick={() => toggleNote(note)}
                              aria-pressed={active}
                              className={`rounded-xs border px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-all duration-300 ${
                                active
                                  ? 'border-burgundy bg-burgundy text-cream'
                                  : 'border-dark/15 text-dark hover:border-burgundy/50 hover:text-burgundy'
                              }`}
                            >
                              {note}
                            </button>
                          )
                        })}
                      </div>
                      <Button
                        onClick={() => setStep(2)}
                        disabled={answers.notes.length === 0}
                        className="mt-auto self-start"
                      >
                        Continue
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Button>
                    </>
                  )}

                  {step === 2 && (
                    <OptionsGrid
                      items={OCCASIONS.map((o) => ({ value: o.value, label: o.value, blurb: o.blurb }))}
                      selected={answers.occasion ? [answers.occasion] : []}
                      onSelect={(v) => select({ occasion: v as Occasion })}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.ul
                  key="results"
                  initial="hidden"
                  animate="visible"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }}
                  className="flex flex-col gap-7"
                  aria-live="polite"
                >
                  {matches.map((product, i) => (
                    <motion.li
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_LUX } },
                      }}
                      className="flex items-center gap-5 border-b border-dark/8 pb-7 last:border-0 last:pb-0"
                    >
                      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-champagne/35 sm:size-24">
                        <Flacon
                          art={product.art}
                          photo={product.photo}
                          photoTone={product.photoTone}
                          photoAlt={product.name}
                          bare
                          className="h-[125%] w-[125%] object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="flex size-5 items-center justify-center rounded-full bg-gold text-[0.5625rem] font-medium text-dark">
                            {i + 1}
                          </span>
                          <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                            {product.categoryLabel}
                          </span>
                        </div>
                        <h4 className="mt-1.5 font-display text-lg text-dark">{product.name}</h4>
                        <p className="mt-1 line-clamp-1 text-[0.8125rem] text-muted">
                          {product.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <ProductRating rating={product.rating} size="xs" />
                          <span className="font-display text-sm text-dark">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                      <ButtonLink
                        to={`/product/${product.slug}`}
                        variant="ghost"
                        size="sm"
                        className="shrink-0 max-sm:hidden"
                      >
                        View
                      </ButtonLink>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   Option grid
   -------------------------------------------------------------------------- */

interface Option {
  value: string
  label: string
  blurb: string
}

function OptionsGrid({
  items,
  selected,
  onSelect,
}: {
  items: Option[]
  selected: string[]
  onSelect: (value: string) => void
}) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {items.map((option, i) => {
        const active = selected.includes(option.value)
        return (
          <motion.li
            key={option.value}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.045, duration: 0.4, ease: EASE_LUX }}
          >
            <button
              type="button"
              onClick={() => onSelect(option.value)}
              aria-pressed={active}
              className={`group flex h-full w-full flex-col gap-1 rounded-xs border p-4 text-left transition-all duration-300 ${
                active
                  ? 'border-burgundy bg-burgundy text-cream'
                  : 'border-dark/12 hover:border-burgundy/50 hover:bg-burgundy/[0.03]'
              }`}
            >
              <span className="flex items-center gap-2 font-display text-base">
                {active && <Sparkles className="size-3.5 text-gold" aria-hidden="true" />}
                {option.label}
              </span>
              <span
                className={`text-[0.6875rem] leading-relaxed ${active ? 'text-cream/70' : 'text-muted'}`}
              >
                {option.blurb}
              </span>
            </button>
          </motion.li>
        )
      })}
    </ul>
  )
}

/* --------------------------------------------------------------------------
   Scoring
   -------------------------------------------------------------------------- */

function score(answers: Answer): Product[] {
  const { mood, notes, occasion } = answers
  const wanted = new Set<string>([
    ...(mood ? MOOD_TO_TAGS[mood] : []),
    ...notes,
    ...(occasion ? OCCASION_TO_TAGS[occasion] : []),
  ])

  return [...products]
    .map((product) => {
      const moodHits = mood ? product.moods.filter((m) => m === mood).length : 0
      const noteHits = [...wanted].filter((tag) => product.noteTags.includes(tag)).length
      // Mood match dominates, notes refine, house popularity breaks ties.
      return { product, value: moodHits * 6 + noteHits * 2 + product.popularity / 40 }
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((entry) => entry.product)
}

export default PerfumeFinder