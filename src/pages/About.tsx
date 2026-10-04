import ArtScene from '@/components/art/ArtScene'
import { BottleArt } from '@/components/art/BottleArt'
import Reveal from '@/components/ui/Reveal'
import { ButtonLink, buttonStyles } from '@/components/ui/Button'
import { InstagramIcon } from '@/components/ui/InstagramIcon'
import { useSeo } from '@/hooks/useSeo'
import { BESTSELLERS, products } from '@/data/products'
import { PROJECT_DEMO } from '@/data/navigation'
import { spellCount } from '@/lib/utils'
import {
  INSTAGRAM_FORMER_HANDLES,
  INSTAGRAM_HANDLE,
  INSTAGRAM_JOINED,
  INSTAGRAM_LINK,
  INSTAGRAM_LOCATION,
} from '@/lib/instagram'
import type { SceneVariant } from '@/components/art/ArtScene'
import { ArrowUpRight } from 'lucide-react'

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
    body: `DIVA STORE started in August 2023, in Tunis, with a frustration most perfume people share: the good bottles are the expensive ones, and the expensive ones are the ones you can only afford once. We built the opposite. Everything here is poured from a sealed, full-price bottle into a 3, 5 or 10 ml spray. ${spellCount(products.length)} fragrances, one point of view — and a ticket that does not require a special occasion.`,
    scene: 'story',
    pull: 'A boutique, not a locked door.',
  },
  {
    id: 'philosophy',
    index: '02',
    title: 'How we decant',
    body: 'Every flacon is filled from a bottle bought at full retail, opened in front of you on request, and decanted into a factory-sealed atomiser by hand. We photograph the batch and the fill date before it ships. If you want to see the source bottle first, ask on WhatsApp — we will send it before you pay anything.',
    scene: 'philosophy',
    reversed: true,
    pull: 'Opened in front of you, on request.',
  },
  {
    id: 'selection',
    index: '03',
    title: 'The shelf',
    body: 'Chanel, Dior, Gucci, YSL, Tom Ford and the smaller ateliers worth knowing about. We let a fragrance sit on skin for days, not minutes, and only decant what performs. Roughly two thirds of what we are offered never gets poured. What survives is chosen for longevity and for character at three metres.',
    scene: 'atelier',
    pull: 'Two thirds of what we are offered never gets poured.',
  },
  {
    id: 'promise',
    index: '04',
    title: 'What it costs',
    body: 'A 100 ml bottle at 690 DT works out at 6.9 DT per millilitre. Our 10 ml decant of the same fragrance is 207 DT — 3 DT per millilitre. That is the whole trick: you pay for what you wear, not for shelf space you do not use. No false scarcity, no borrowed luxury.',
    scene: 'promise',
    reversed: true,
    pull: 'You pay for what you wear.',
  },
]

/** Instagram's own "About this profile", restated in the house's words. */
const PROFILE_FACTS: { label: string; value: string }[] = [
  { label: 'Username', value: INSTAGRAM_HANDLE },
  { label: 'Joined', value: INSTAGRAM_JOINED },
  { label: 'Account location', value: INSTAGRAM_LOCATION },
  {
    label: 'Former usernames',
    value: INSTAGRAM_FORMER_HANDLES.length
      ? INSTAGRAM_FORMER_HANDLES.join(', ')
      : `None — ${INSTAGRAM_HANDLE.replace('@', '')} is the original name`,
  },
]

export function About() {
  useSeo({
    title: 'About DIVA STORE',
    description:
      'DIVA STORE decants Chanel, Dior, Gucci, YSL and Tom Ford into 3, 5 and 10 ml sprays. How we decant, how we prove it is authentic, and why it costs less.',
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
                <span className="text-noir/70">The house</span>
              </div>
            </Reveal>
            <Reveal variant="up" delay={0.08}>
              <h1
                id="about-title"
                className="display-title text-[clamp(2.1rem,5.6vw,3.9rem)]"
              >
                Luxury should not be a{' '}
                <span className="italic text-noir">locked door.</span>
              </h1>
            </Reveal>
            <Reveal variant="up" delay={0.16}>
              <p className="mt-7 max-w-lg text-[1rem] leading-relaxed text-muted">
                We pour the great houses into 3, 5 and 10 ml sprays so you can wear a hundred of
                them instead of owning ten. This is how DIVA STORE came to be, and what we refuse
                to compromise.
              </p>
            </Reveal>
            <Reveal variant="up" delay={0.24}>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to="/perfumes" variant="primary" size="lg" arrow>
                  Shop all decants
                </ButtonLink>
                <ButtonLink to="/collections" variant="outline" size="lg">
                  See collections
                </ButtonLink>
                <a
                  href={PROJECT_DEMO.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonStyles({ variant: 'outline', size: 'lg' })}
                >
                  {PROJECT_DEMO.label}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>

          <div className="relative min-h-[24rem] overflow-hidden lg:min-h-full">
            <ArtScene variant="hero" grain={0.35} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-ivory to-transparent lg:block" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BottleArt
                art={BESTSELLERS[0].art}
                className="h-auto w-[58%] drop-shadow-[0_40px_60px_rgba(12,12,14,0.16)]"
              />
            </div>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.5625rem] uppercase tracking-[0.28em] text-muted">
              DIVA STORE — decants poured to order
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
                <span className="absolute -bottom-5 left-6 bg-ivory px-4 py-2 font-display text-3xl text-gold">
                  {chapter.index}
                </span>
              </Reveal>

              <Reveal variant="up" delay={0.1}>
                <div className="eyebrow eyebrow-rule mb-5">
                  <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
                  <span className="text-noir/70">{chapter.title}</span>
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

      {/* The profile card — Instagram's "About this profile", in the open */}
      <section
        id="profile"
        className="scroll-mt-28 border-b border-dark/10 py-20 md:py-28"
        aria-labelledby="profile-title"
      >
        <div className="container-lux grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal variant="up">
            <div className="eyebrow eyebrow-rule mb-5">
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              <span className="text-noir/70">The profile</span>
            </div>
            <h2 id="profile-title" className="display-title text-[clamp(1.7rem,3.8vw,2.6rem)]">
              One account, no anonymous shelf.
            </h2>
            <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
              The feed is our shop window: every pour is posted the day it is decanted, with the
              batch photo and the fill date on it. Instagram publishes our joining date and
              account location on the profile itself, so you can check who you are ordering from
              before you spend a dinar.
            </p>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-8 inline-flex h-[3.25rem] items-center gap-2.5 rounded-md bg-noir px-8 text-xs font-medium uppercase tracking-[0.16em] text-ivory transition-colors duration-300 hover:bg-noir-deep"
            >
              <InstagramIcon className="size-4" />
              {INSTAGRAM_HANDLE}
            </a>
          </Reveal>

          <Reveal variant="up" delay={0.1}>
            <div className="rounded-md border border-gold/30 bg-sand/40 p-7 md:p-8">
              <p className="eyebrow mb-6 text-noir/70">About this profile</p>
              <dl className="flex flex-col">
                {PROFILE_FACTS.map((fact, index) => (
                  <div
                    key={fact.label}
                    className={[
                      'flex flex-col gap-1 border-t border-noir/10 py-4 sm:flex-row sm:items-baseline sm:gap-6',
                      index === 0 ? 'border-t-0 pt-0' : '',
                    ].join(' ')}
                  >
                    <dt className="text-[0.625rem] uppercase tracking-[0.22em] text-muted sm:w-44 sm:shrink-0">
                      {fact.label}
                    </dt>
                    <dd className="text-[0.9375rem] text-dark">
                      {fact.label === 'Username' ? (
                        <a
                          href={INSTAGRAM_LINK}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="link-underline"
                        >
                          {fact.value}
                        </a>
                      ) : (
                        fact.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing note */}
      <section className="border-b border-dark/10 bg-sand/40 py-20 md:py-24" aria-labelledby="careers-title">
        <div className="container-lux grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
          <Reveal variant="up">
            <div className="eyebrow eyebrow-rule mb-5">
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              <span className="text-noir/70">Talk to us</span>
            </div>
            <h2 id="careers-title" className="display-title text-[clamp(1.7rem,3.8vw,2.6rem)]">
              Ask before you buy. We would rather you did.
            </h2>
            <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
              Not sure which house you like, or whether a 3 ml is worth it? Message us. There is
              no script and no minimum order — we would rather answer one question than sell one
              bottle you regret.
            </p>
          </Reveal>

          <Reveal variant="up" delay={0.1}>
            <div id="journal" className="overflow-hidden rounded-md">
              <ArtScene variant="journal" grain={0.3} className="aspect-[4/3] w-full" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to="/perfumes?size=3" variant="primary" size="md" arrow>
                Start with 3 ml
              </ButtonLink>
              <ButtonLink to="/help/contact" variant="ghost" size="md">
                Contact us
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default About