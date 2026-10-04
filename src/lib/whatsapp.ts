/* ==========================================================================
   DIVA STORE — WhatsApp
   DIVA sells through WhatsApp: every order is confirmed in a chat, which is
   how decant houses actually trade. This module owns the store number and
   builds every deep link, so no screen ever hand-rolls a wa.me URL.
   ========================================================================== */

import type { CartLine, CustomerDetails, Product } from '@/types'
import { formatPrice } from './utils'

/* --------------------------------------------------------------------------
   The store
   -------------------------------------------------------------------------- */

/** Digits only, no `+`, no spaces — the format wa.me expects. */
export const WHATSAPP_NUMBER = '21620000000'

/** How the number is written for humans. */
export const WHATSAPP_DISPLAY = '+216 20 000 000'

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`

/** Opening hours, shown next to the contact details. */
export const WHATSAPP_HOURS = 'Daily · 9:00 — 22:00'

/** Typical first response, used as reassurance next to the CTA. */
export const WHATSAPP_REPLY_TIME = 'Replies in under 15 minutes'

/* --------------------------------------------------------------------------
   Link builders
   -------------------------------------------------------------------------- */

function waLink(message: string): string {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`
}

/** Generic opener used by the header, the footer and the floating button. */
export function whatsappEnquiry(message = 'Hi DIVA! I would like to ask about a perfume decant.'): string {
  return waLink(message)
}

/** "Order this" straight from a product page — carries the variant already chosen. */
export function whatsappProductEnquiry(product: Product, ml: number, price: number): string {
  return waLink(
    [
      `Hi DIVA! I'd like to order a decant.`,
      ``,
      `• ${product.name} — ${product.brand}`,
      `• Size: ${ml} ml`,
      `• Price: ${formatPrice(price)}`,
      ``,
      `Is it in stock?`,
    ].join('\n'),
  )
}

/**
 * The checkout. Builds the whole order as a single pre-filled message so the
 * customer never types a line list, and the shop can read it at a glance.
 */
export function whatsappCheckout({
  lines,
  subtotal,
  shipping,
  total,
  customer,
}: {
  lines: CartLine[]
  subtotal: number
  shipping: number
  total: number
  /** Omitted when checking out straight from the bag, before any details form */
  customer?: CustomerDetails
}): string {
  const rows = lines.map(
    (line) =>
      `• ${line.name} (${line.brand}) — ${line.ml} ml × ${line.quantity} = ${formatPrice(
        line.unitPrice * line.quantity,
      )}`,
  )

  const saved = lines.reduce((sum, line) => {
    const fullBottleTotal = line.fullBottlePrice * line.quantity
    return sum + Math.max(fullBottleTotal - line.unitPrice * line.quantity, 0)
  }, 0)

  const sections = [
    'Hi DIVA! I would like to place an order 🖤',
    '',
    'MY ORDER',
    ...rows,
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    `Delivery: ${shipping === 0 ? 'Free' : formatPrice(shipping)}`,
    `Total: ${formatPrice(total)}`,
    ...(saved > 0 ? [`Saved vs. full bottles: ${formatPrice(saved)}`] : []),
  ]

  if (customer && customer.firstName) {
    sections.push(
      '',
      'DELIVER TO',
      `${customer.firstName} ${customer.lastName}`.trim(),
      customer.phone,
      customer.address,
      `${customer.postalCode} ${customer.city}`.trim(),
      ...(customer.notes ? [`Notes: ${customer.notes}`] : []),
    )
  }

  sections.push('', 'Payment: cash on delivery or bank transfer — whichever you prefer.')

  return waLink(sections.join('\n'))
}

/** The "our decants are authentic" answer, as a shareable statement. */
export function whatsappAuthenticity(): string {
  return waLink(
    'Hi DIVA! Can you tell me how you make sure the decants are 100% authentic?',
  )
}
