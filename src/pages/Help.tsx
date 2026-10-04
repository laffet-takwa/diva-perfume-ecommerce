import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Mail, MapPin, Package, RefreshCw, Search, Truck } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, validateField, validators } from '@/components/ui/Field'
import Reveal from '@/components/ui/Reveal'
import { useToast } from '@/context'
import { useSeo } from '@/hooks/useSeo'
import { useState } from 'react'
import { products } from '@/data/products'
import { spellCount } from '@/lib/utils'

/* ==========================================================================
   Help — /help/:topic
   One page, several topics, so the footer links never dead-end.
   ========================================================================== */

interface Topic {
  slug: string
  title: string
  lede: string
  icon: typeof Truck
  sections: { q: string; a: string }[]
}

const TOPICS: Topic[] = [
  {
    slug: 'contact',
    title: 'Contact',
    lede: 'A small team reads every message. We answer within one business day.',
    icon: Mail,
    sections: [
      {
        q: 'Where do I write?',
        a: 'Use the form below or email hello@divastore.example. For order questions, include your order number so we can find you faster.',
      },
      {
        q: 'What are your opening hours?',
        a: 'Monday to Friday, 9:00 – 18:00 CET. Messages sent outside those hours are answered the next morning.',
      },
    ],
  },
  {
    slug: 'shipping',
    title: 'Shipping',
    lede: 'Free delivery on orders over 150 DT, everywhere we ship.',
    icon: Truck,
    sections: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery is 3 – 5 business days. Express delivery is 1 – 2 business days and costs 15 DT.',
      },
      {
        q: 'Do you ship perfume internationally?',
        a: 'Yes. Fragrance is classified as a flammable liquid, so some routes add a handling day. We will always show the final delivery window before you pay.',
      },
      {
        q: 'Is shipping free?',
        a: 'It is free on standard delivery for orders over 150 DT. Below that, standard shipping is 7 DT.',
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns',
    lede: 'Fourteen days to decide, opened or unopened.',
    icon: RefreshCw,
    sections: [
      {
        q: 'What is your return window?',
        a: 'Fourteen days from delivery for standard orders, extended to thirty days for Diva World members.',
      },
      {
        q: 'Can I return an opened flacon?',
        a: 'We cannot resell opened fragrance, so we refund it at 50%. Unopened, sealed bottles are refunded in full.',
      },
      {
        q: 'How do I start a return?',
        a: 'Contact us with your order number and the product name. We will send a prepaid label or arrange a collection.',
      },
    ],
  },
  {
    slug: 'faq',
    title: 'Frequently asked',
    lede: 'The questions our clients ask most often.',
    icon: Search,
    sections: [
      {
        q: 'How do I choose a fragrance I have never smelled?',
        a: 'Start with the scent finder. Three questions about mood, notes and occasion narrow the shelf to three fragrances that share a structure.',
      },
      {
        q: 'How long does a bottle last?',
        a: 'Eau de parfum lasts 6 – 10 hours on skin depending on formula and skin type. Two sprays is the usual recommendation.',
      },
      {
        q: 'Are your fragrances unisex?',
        a: `${spellCount(products.filter((p) => p.gender === 'unisex').length).replace(/^./, (c) => c.toUpperCase())} of our ${spellCount(products.length)} fragrances are composed without gender. They are labelled Unisex and are listed under /perfumes/unisex.`,
      },
      {
        q: 'Can I change my order after placing it?',
        a: 'Yes, within one hour of ordering. Contact us with your order number and the change you need.',
      },
    ],
  },
  {
    slug: 'track-order',
    title: 'Track order',
    lede: 'Your order number looks like DV-4K7P2Q.',
    icon: Package,
    sections: [
      {
        q: 'Where do I find my order number?',
        a: 'On your confirmation page, and in your account. It always starts with DV- followed by eight characters.',
      },
      {
        q: 'Where can I see the status?',
        a: 'Your account shows the current status and the estimated delivery window. We also email you at every stage.',
      },
      {
        q: 'My order is late. What now?',
        a: 'Contact us with your order number. If the parcel is lost we will reship immediately, at no cost to you.',
      },
    ],
  },
]

export function Help() {
  const { topic: topicParam } = useParams()
  const topic = TOPICS.find((t) => t.slug === topicParam) ?? TOPICS[0]
  const { notify } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()

  useSeo({
    title: topic.title,
    description: topic.lede,
    canonicalPath: `/help/${topic.slug}`,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = validateField(email, [validators.required, validators.email])
    setError(message)
    if (message) return
    notify('Thank you — we will reply within one business day.')
    setEmail('')
  }

  return (
    <div className="pt-16 lg:pt-20">
      <div className="border-b border-dark/10 bg-cream-deep/40">
        <div className="container-lux py-14 md:py-20">
          <Reveal variant="up">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                <li>
                  <Link to="/" className="transition-colors hover:text-burgundy">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="size-3" />
                </li>
                <li className="text-dark">{topic.title}</li>
              </ol>
            </nav>
            <h1 className="display-title text-[clamp(2.1rem,5vw,3.2rem)]">{topic.title}</h1>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted">{topic.lede}</p>
          </Reveal>
        </div>
      </div>

      <div className="container-lux grid gap-10 py-14 lg:grid-cols-[1fr_20rem] lg:gap-16 lg:py-20">
        <div className="min-w-0">
          {topic.sections.map((section, i) => (
            <Reveal key={section.q} variant="up" index={i} className="border-b border-dark/10 pb-8 pt-8 first:pt-0">
              <h2 className="font-display text-xl text-dark">{section.q}</h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">{section.a}</p>
            </Reveal>
          ))}

          {topic.slug === 'contact' && (
            <Reveal variant="up" className="mt-10">
              <form onSubmit={submit} className="rounded-md border border-dark/10 p-6 md:p-8" noValidate>
                <h2 className="font-display text-xl text-dark">Send us a message</h2>
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
                  <Field
                    label="Your email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.slice(0, 60))
                      setError(undefined)
                    }}
                    error={error}
                    className="sm:max-w-xs"
                    required
                  />
                  <button
                    type="submit"
                    className="h-12 shrink-0 rounded-xs bg-burgundy px-6 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-burgundy-deep"
                  >
                    Send message
                  </button>
                </div>
                <p className="mt-4 flex items-center gap-2 text-[0.6875rem] text-muted">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  Atelier visits by appointment — Tunis.
                </p>
              </form>
            </Reveal>
          )}
        </div>

        <aside className="flex flex-col gap-3 lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-1 text-dark">All topics</p>
          {TOPICS.map((entry) => (
            <Link
              key={entry.slug}
              to={`/help/${entry.slug}`}
              aria-current={entry.slug === topic.slug ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xs border px-4 py-3 text-[0.8125rem] transition-colors ${
                entry.slug === topic.slug
                  ? 'border-burgundy bg-burgundy/[0.04] text-burgundy'
                  : 'border-dark/10 text-dark hover:border-burgundy/45'
              }`}
            >
              <entry.icon className="size-4 shrink-0" aria-hidden="true" />
              {entry.title}
            </Link>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mt-4 rounded-md border border-gold/35 bg-gold/8 p-5"
          >
            <p className="font-display text-base text-dark">Still deciding?</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
              Three questions, three signatures from {products.length} fragrances.
            </p>
            <ButtonLink to="/#finder" variant="ghost" size="sm" arrow className="mt-4 px-0">
              Find my signature
            </ButtonLink>
          </motion.div>
        </aside>
      </div>
    </div>
  )
}

export function HelpIndex() {
  useSeo({
    title: 'Help centre',
    description: 'Shipping, returns, order tracking and contact for DIVA STORE.',
    canonicalPath: '/help',
  })

  return (
    <div className="pt-16 lg:pt-20">
      <div className="container-lux py-16 md:py-24">
        <Reveal variant="up" className="max-w-xl">
          <h1 className="display-title text-[clamp(2.1rem,5vw,3.2rem)]">Help centre</h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
            Everything about delivery, returns and reaching us.
          </p>
        </Reveal>

        {TOPICS.length === 0 ? (
          <EmptyState title="No help topics yet." action={{ label: 'Explore perfumes', to: '/perfumes' }} />
        ) : (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {TOPICS.map((topic, i) => (
              <Reveal key={topic.slug} as="li" variant="up" index={i}>
                <Link
                  to={`/help/${topic.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-md border border-dark/10 p-6 transition-colors hover:border-burgundy/45"
                >
                  <topic.icon className="size-5 text-burgundy" aria-hidden="true" />
                  <span className="font-display text-lg text-dark">{topic.title}</span>
                  <span className="text-[0.8125rem] leading-relaxed text-muted">{topic.lede}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Help