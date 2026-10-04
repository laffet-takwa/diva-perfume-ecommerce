import ArtScene from '@/components/art/ArtScene'
import { BottleArt } from '@/components/art/BottleArt'
import Reveal from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { useSeo } from '@/hooks/useSeo'
import { BESTSELLERS, products } from '@/data/products'
import { spellCount } from '@/lib/utils'
import type { SceneVariant } from '@/components/art/ArtScene'

/* ==========================================================================
   About — the house story
   ========================================================================== */

interface Chapter {
  id: string
  index: string
  title: string
  body: string
  scene: SceneVariant
  pull?: string
  reversed?: boolean
}

const CHAPTERS: Chapter[] = [
  {
    id: 'story',
    index: '01',
    title: 'Our story',
    body: `DIVA STORE began in 2026 with a simple frustration: perfume had become a wall of sameness. Every new release engineered for launch, then forgotten. We wanted the opposite — a boutique where a fragrance stays on the shelf because it is still worth wearing, not because a marketing calendar says so. ${spellCount(products.length)} bottles, chosen one at a time from the houses we genuinely admire.`,
    scene: 'story',
    pull: 'A boutique, not a campaign.',
  },
  {
    id: 'philosophy',
    index: '02',
    title: 'Our philosophy',
    body: 'Perfume is architecture. There is a structure — top, heart, base — and if the structure is wrong, nothing else matters. We read it the same way: decide the character you are after, find the note that carries it, then leave everything else on the shelf. Restraint is the hardest part of the edit, and the reason this room stays quiet.',
    scene: 'philosophy',
    reversed: true,
    pull: 'Leave everything else on the shelf.',
  },
  {
    id: 'selection',
    index: '03',
    title: 'Our selection',
    body: 'Chanel, Dior, Gucci, YSL, Tom Ford and the rest of the great houses — plus the smaller ateliers worth knowing about. We test everything on skin, over days, not minutes. Roughly two thirds of what we are offered never makes it onto the shelf. What survives is chosen for longevity on skin and for character at three metres.',
    scene: 'atelier',
    pull: 'Two thirds of what we are offered never makes the shelf.',
  },
  {
    id: 'promise',
    index: '04',
    title: 'Our promise',
    body: 'Every bottle we sell is authentic, sourced through authorised distribution, and stored the way the house intended. No false scarcity, no borrowed luxury — just the real thing, described honestly, in our own words. If a fragrance does not earn its place in your wardrobe, we would rather know.',
    scene: 'promise',
    reversed: true,
    pull: 'The real thing, described honestly.',
  },
]

export function About() {
  useSeo({
    title: 'About DIVA STORE',
    description:
      'We believe every woman has a signature. Meet the boutique behind DIVA STORE — how we choose, what we refuse, and why every bottle is authentic.',
    canonicalPath: '/about',
  })

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-dark/10" aria-labelledby="about-title">
        <div className="grid lg:grid-cols-2">
          <div className="relative flex flex-col justify-center px-6 py-20 md:px-10 lg:py-32 lg:pl-[max(2.5rem,calc((100vw-88rem)/2+3.5rem))]">
            <Reveal variant="up">
              <div className="eyebrow eyebrow-rule mb-7">
                <span className="h-px w-8 bg-gold" aria-hidden="true" />
                <span className="text-burgundy/70">The house</span>
              </div>
            </Reveal>
            <Reveal variant="up" delay={0.08}>
              <h1
                id="about-title"
                className="display-title text-[clamp(2.1rem,5.6vw,3.9rem)]"
              >
                We believe every woman has a{' '}
                <span className="italic text-burgundy">signature.</span>
              </h1>
            </Reveal>
            <Reveal variant="up" delay={0.16}>
              <p className="mt-7 max-w-lg text-[1rem] leading-relaxed text-muted">
                Ours is: quiet, deliberate, and made to be recognised on skin rather than on a shelf.
                This is the story of how DIVA STORE came to be, and what we refuse to compromise.
              </p>
            </Reveal>
            <Reveal variant="up" delay={0.24}>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to="/perfumes" variant="primary" size="lg" arrow>
                  Explore the house
                </ButtonLink>
                <ButtonLink to="/collections" variant="outline" size="lg">
                  See collections
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="relative min-h-[24rem] overflow-hidden lg:min-h-full">
            <ArtScene variant="hero" grain={0.35} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-cream to-transparent lg:block" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BottleArt
                art={BESTSELLERS[0].art}
                className="h-auto w-[58%] drop-shadow-[0_40px_60px_rgba(23,19,21,0.16)]"
              />
            </div>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.5625rem] uppercase tracking-[0.28em] text-muted">
              Diva Store — Eau de Parfum
            </span>
          </div>
        </div>
      </section>

      {/* Chapters */}
      {CHAPTERS.map((chapter) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className="scroll-mt-28 border-b border-dark/10 py-20 md:py-28 last:border-0"
          aria-labelledby={`${chapter.id}-title`}
        >
          <div className="container-lux">
            <div
              className={[
                'grid items-center gap-12 lg:grid-cols-2 lg:gap-16',
                chapter.reversed ? 'lg:[&>*:first-child]:order-2' : '',
              ].join(' ')}
            >
              <Reveal variant={chapter.reversed ? 'revealUp' : 'reveal'} className="relative">
                <div className="aspect-[4/5] overflow-hidden rounded-md">
                  <ArtScene variant={chapter.scene} grain={0.35} className="h-full w-full" />
                </div>
                <span className="absolute -bottom-5 left-6 bg-cream px-4 py-2 font-display text-3xl text-gold">
                  {chapter.index}
                </span>
              </Reveal>

              <Reveal variant="up" delay={0.1}>
                <div className="eyebrow eyebrow-rule mb-5">
                  <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
                  <span className="text-burgundy/70">{chapter.title}</span>
                </div>
                <h2 id={`${chapter.id}-title`} className="display-title text-[clamp(1.7rem,3.8vw,2.6rem)]">
                  {chapter.pull ?? chapter.title}
                </h2>
                <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
                  {chapter.body}
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* Career's note + journal anchor */}
      <section className="border-b border-dark/10 bg-cream-deep/40 py-20 md:py-24" aria-labelledby="careers-title">
        <div className="container-lux grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
          <Reveal variant="up">
            <div className="eyebrow eyebrow-rule mb-5">
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              <span className="text-burgundy/70">Careers &amp; journal</span>
            </div>
            <h2 id="careers-title" className="display-title text-[clamp(1.7rem,3.8vw,2.6rem)]">
              We are always looking for hands that care about the details.
            </h2>
            <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
              The bench, the lab and the writing desk are all open. If you can tell the difference
              between a good iris and a flat one, we would like to hear from you.
            </p>
          </Reveal>

          <Reveal variant="up" delay={0.1}>
            <div id="journal" className="overflow-hidden rounded-md">
              <ArtScene variant="journal" grain={0.3} className="aspect-[4/3] w-full" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to="/about#story" variant="primary" size="md" arrow>
                Read our story
              </ButtonLink>
              <ButtonLink to="/perfumes" variant="ghost" size="md">
                Shop the house
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default About