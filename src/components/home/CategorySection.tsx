import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ArtScene from '@/components/art/ArtScene'
import type { SceneVariant } from '@/components/art/ArtScene'
import Reveal from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

/* ==========================================================================
   Category section — "Find Your Fragrance"
   Three editorial blocks, deliberately different in scale and placement.
   ========================================================================== */

interface CategoryBlock {
  label: string
  to: string
  line: string
  scene: SceneVariant
  count: string
}

const BLOCKS: CategoryBlock[] = [
  {
    label: 'Women',
    to: '/perfumes/women',
    line: 'Elegant. Feminine. Unforgettable.',
    scene: 'women',
    count: '11 fragrances',
  },
  {
    label: 'Men',
    to: '/perfumes/men',
    line: 'Bold. Refined. Magnetic.',
    scene: 'men',
    count: '8 fragrances',
  },
  {
    label: 'Unisex',
    to: '/perfumes/unisex',
    line: 'Beyond labels.',
    scene: 'unisex',
    count: '5 fragrances',
  },
]

export function CategorySection() {
  return (
    <section className="relative overflow-hidden bg-cream-deep/50 py-20 md:py-28" aria-labelledby="category-title">
      <div className="container-lux">
        <Reveal variant="up" className="max-w-2xl">
          <div className="eyebrow eyebrow-rule mb-5">
            <span className="font-display text-xs text-gold">02</span>
            <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            <span className="text-burgundy/70">Find Your Fragrance</span>
          </div>
          <h2 id="category-title" className="display-title text-[clamp(2rem,5vw,3.4rem)]">
            Three doors.
            <br />
            <span className="italic text-burgundy">One signature.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
            Fragrance does not recognise labels — but a starting point helps. Choose the room you are
            dressing for.
          </p>
        </Reveal>

        {/* Asymmetric editorial layout */}
        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-12 md:gap-6">
          {BLOCKS.map((block, i) => (
            <Reveal
              key={block.label}
              as="article"
              variant="up"
              index={i}
              className={cn(
                'group/cat relative',
                i === 0 && 'md:col-span-7',
                i === 1 && 'md:col-span-5 md:mt-16',
                i === 2 && 'md:col-span-12',
              )}
            >
              <Link
                to={block.to}
                className="relative block h-full overflow-hidden rounded-md bg-champagne/30 focus-visible:outline-offset-4"
              >
                <div
                  className={cn(
                    'relative overflow-hidden',
                    i === 0 && 'aspect-[4/3] md:aspect-[5/4]',
                    i === 1 && 'aspect-[4/3] md:aspect-[3/4]',
                    i === 2 && 'aspect-[16/9] md:aspect-[21/8]',
                  )}
                >
                  <div className="absolute inset-0">
                    <ArtScene
                      variant={block.scene}
                      grain={0.3}
                      className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cat:scale-[1.06]"
                    />
                  </div>

                  {/* Overlay deepens on hover */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-0 transition-colors duration-700',
                      block.scene === 'men'
                        ? 'bg-dark/25 group-hover/cat:bg-dark/45'
                        : 'bg-dark/10 group-hover/cat:bg-dark/30',
                    )}
                  />

                  {/* Copy */}
                  <div
                    className={cn(
                      'absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 md:p-8',
                      i === 2 && 'md:flex-row md:items-end md:justify-between md:gap-10',
                    )}
                  >
                    <div className="translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cat:-translate-y-1.5">
                      <span className="eyebrow text-white/70">{block.count}</span>
                      <h3
                        className={cn(
                          'mt-2 font-display text-white',
                          i === 2 ? 'text-[clamp(2rem,5vw,3.25rem)]' : 'text-[clamp(1.75rem,4vw,2.75rem)]',
                        )}
                      >
                        {block.label}
                      </h3>
                      <p className="mt-1.5 font-quote text-lg italic text-white/80">{block.line}</p>
                    </div>

                    {/* CTA appears on hover */}
                    <span
                      className="mt-4 inline-flex w-fit items-center gap-2 rounded-xs border border-white/40 px-4 py-2 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-500 group-hover/cat:opacity-100 md:mt-0 md:translate-y-2 md:group-hover/cat:translate-y-0"
                    >
                      Discover
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection