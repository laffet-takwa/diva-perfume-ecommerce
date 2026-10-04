import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronRight, Mail, MapPin, Package, RefreshCw, Search, Truck } from 'lucide-react'
import { WhatsAppLink } from '@/components/ui/WhatsAppLink'
import { InstagramIcon } from '@/components/ui/InstagramIcon'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, validateField, validators } from '@/components/ui/Field'
import Reveal from '@/components/ui/Reveal'
import { useToast } from '@/context'
import { useSeo } from '@/hooks/useSeo'
import { useState } from 'react'
import { products } from '@/data/products'
import { whatsappEnquiry, WHATSAPP_DISPLAY, WHATSAPP_HOURS } from '@/lib/whatsapp'
import { INSTAGRAM_HANDLE, INSTAGRAM_LINK } from '@/lib/instagram'
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
    lede: 'Every order is confirmed in WhatsApp, and a small team reads every message.',
    icon: Mail,
    sections: [
      {
        q: 'How do I order?',
        a: 'Add decants to your cart and press "Checkout on WhatsApp". Your bag is written out for you — you send it, we confirm the batch and dispatch time, and you pay on delivery or by transfer.',
      },
      {
        q: 'What are your opening hours?',
        a: 'Every day, 9:00 – 22:00. We usually reply in under 15 minutes while the shop is open.',
      },
      {
        q: 'Do you send a photo of the bottle?',
        a: 'Yes. Ask before you pay and we will photograph the sealed source bottle with its batch code and expiry date.',
      },
    ],
  },
  {
    slug: 'shipping',
    title: 'Shipping',
    lede: 'Free delivery on orders over 150 DT, everywhere we deliver.',
    icon: Truck,
    sections: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery is 2 – 4 business days. Express delivery is next business day and costs 12 DT. Decants are poured to order, so an order placed before 2pm leaves the same day.',
      },
      {
        q: 'Do you ship perfume internationally?',
        a: 'Yes. Decants travel as a small spray rather than a full bottle, which usually means fewer restrictions — but some routes still add a handling day. We always show the delivery window before you pay.',
      },
      {
        q: 'Is shipping free?',
        a: 'It is free on standard delivery for orders over 150 DT. Below that, standard delivery is 5 DT.',
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns',
    lede: 'Fourteen days to change your mind, sealed or not.',
    icon: RefreshCw,
    sections: [
      {
        q: 'What is your return window?',
        a: 'Fourteen days from delivery. Unopened, sealed decants are refunded in full.',
      },
      {
        q: 'Can I return a decant I have used?',
        a: 'We cannot resell an opened spray, so we refund a used decant at 50% — unless it arrived damaged or wrong, which we always replace.',
      },
      {
        q: 'How do I start a return?',
        a: 'Message us on WhatsApp with your order number and the fragrance. We arrange the collection from you.',
      },
    ],
  },
  {
    slug: 'faq',
    title: 'Frequently asked',
    lede: 'The questions decant customers ask most often.',
    icon: Search,
    sections: [
      {
        q: 'Which size should I start with?',
        a: 'Start at 3 ml. It is roughly forty sprays, enough to judge a fragrance over a full week of work and weekend — and it is the cheapest volume we sell.',
      },
      {
        q: 'How long does a decant last?',
        a: 'An eau de parfum lasts 6 – 10 hours on skin depending on formula and skin type. Two sprays is the usual recommendation, so 5 ml is roughly a month of daily wear.',
      },
      {
        q: 'How do I know the decant is authentic?',
        a: 'Every decant is poured from a sealed bottle bought at full retail. We photograph the batch and the fill date before dispatch, and we will open the source bottle on a video call if you want to see it first.',
      },
      {
        q: 'Are your fragrances unisex?',
        a: `${spellCount(products.filter((p) => p.gender === 'unisex').length).replace(/^./, (c) => c.toUpperCase())} of our ${spellCount(products.length)} fragrances are composed without gender. They are labelled Unisex and are listed under /perfumes/unisex.`,
      },
      {
        q: 'Can I change my order after placing it?',
        a: 'Yes, until the decant is poured — usually a couple of hours. Message us on WhatsApp with your order number and the change you need.',
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
        a: 'On your confirmation page, in your account, and in the WhatsApp thread where you sent the order.',
      },
      {
        q: 'Where can I see the status?',
        a: 'We send the tracking link in the same WhatsApp chat as soon as the parcel leaves us, and again if the courier updates it.',
      },
      {
        q: 'My order is late. What now?',
        a: 'Message us with your order number. If the parcel is lost we reship immediately, at no cost to you.',
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
      <div className="border-b border-dark/10 bg-sand/40">
        <div className="container-lux py-14 md:py-20">
          <Reveal variant="up">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                <li>
                  <Link to="/" className="transition-colors hover:text-noir">
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
                    className="h-12 shrink-0 rounded-xs bg-noir px-6 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-noir-deep"
                  >
                    Send message
                  </button>
                </div>
                <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.6875rem] text-muted">
                  <span className="flex items-center gap-2">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    Decanted by hand — Tunis
                  </span>
                  <span className="flex items-center gap-2">
                    WhatsApp {WHATSAPP_DISPLAY} · {WHATSAPP_HOURS}
                  </span>
                  <a
                    href={INSTAGRAM_LINK}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/ig flex items-center gap-2 text-dark transition-colors hover:text-noir"
                  >
                    <InstagramIcon className="size-3.5" />
                    Instagram {INSTAGRAM_HANDLE}
                    <ArrowUpRight
                      className="size-3 transition-transform duration-300 group-hover/ig:-translate-y-0.5 group-hover/ig:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
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
                  ? 'border-noir bg-noir/[0.04] text-noir'
                  : 'border-dark/10 text-dark hover:border-noir/45'
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
              Message us and we will pick three from {products.length} fragrances — matched to your
              taste and your budget.
            </p>
            <WhatsAppLink
              href={whatsappEnquiry(
                'Hi DIVA! Can you recommend three fragrances for me? Here is what I usually like…',
              )}
              tone="whatsapp"
              size="sm"
              className="mt-4"
            >
              Ask for a recommendation
            </WhatsAppLink>
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
          <EmptyState title="No help topics yet." action={{ label: 'Explore all decants', to: '/perfumes' }} />
        ) : (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {TOPICS.map((topic, i) => (
              <Reveal key={topic.slug} as="li" variant="up" index={i}>
                <Link
                  to={`/help/${topic.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-md border border-dark/10 p-6 transition-colors hover:border-noir/45"
                >
                  <topic.icon className="size-5 text-noir" aria-hidden="true" />
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