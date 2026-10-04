import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Banknote, Landmark, MessageCircle } from 'lucide-react'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import OrderSummary from '@/components/checkout/OrderSummary'
import { Button, ButtonLink } from '@/components/ui/Button'
import { WhatsAppLink } from '@/components/ui/WhatsAppLink'
import { ChoiceCard, Field, TextAreaField, validateField, validators } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS, useCart, useOrder, useToast } from '@/context'
import { useSeo } from '@/hooks/useSeo'
import type { CustomerDetails, Order, PaymentMethod } from '@/types'
import { whatsappCheckout, WHATSAPP_DISPLAY } from '@/lib/whatsapp'
import { formatPrice, sanitizeText } from '@/lib/utils'

/* ==========================================================================
   Checkout — 1 Information · 2 Shipping · 3 Confirm
   There is no card form: a decant order is confirmed in WhatsApp and paid on
   delivery or by bank transfer. The customer's details are carried into the
   message, so nothing has to be typed twice.
   ========================================================================== */

type Errors = Partial<Record<keyof CustomerDetails, string>>

const EMPTY_CUSTOMER: CustomerDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: '',
}

const PAYMENT_METHODS: {
  value: PaymentMethod
  label: string
  detail: string
}[] = [
  { value: 'cod', label: 'Cash on delivery', detail: 'Pay the courier when the parcel arrives' },
  { value: 'transfer', label: 'Bank transfer', detail: 'We send you the RIB once the order is confirmed' },
]

function createOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6)
  const rand = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, '0')
  return `DV-${stamp}${rand}`
}

export function Checkout() {
  useSeo({
    title: 'Checkout',
    description: 'Confirm your DIVA decants and send the order on WhatsApp. Cash on delivery or bank transfer.',
    canonicalPath: '/checkout',
  })

  const navigate = useNavigate()
  const { lines, count, subtotal, clearCart } = useCart()
  const { placeOrder } = useOrder()
  const { notify } = useToast()

  const [step, setStep] = useState(1)
  const [customer, setCustomer] = useState<CustomerDetails>(EMPTY_CUSTOMER)
  const [errors, setErrors] = useState<Errors>({})
  const [shippingId, setShippingId] = useState<string>(SHIPPING_METHODS[0].id)
  const [payment, setPayment] = useState<PaymentMethod>('cod')
  const [submitting, setSubmitting] = useState(false)

  const shipping = useMemo(
    () => SHIPPING_METHODS.find((m) => m.id === shippingId) ?? SHIPPING_METHODS[0],
    [shippingId],
  )
  const shippingPrice =
    subtotal >= FREE_SHIPPING_THRESHOLD && shipping.id === 'standard' ? 0 : shipping.price
  const total = subtotal + shippingPrice

  const orderHref = whatsappCheckout({
    lines,
    subtotal,
    shipping: shippingPrice,
    total,
    customer,
  })

  if (lines.length === 0) {
    return (
      <div className="pt-16 lg:pt-20">
        <EmptyState
          eyebrow="Empty"
          title="There is nothing to check out."
          description="Your cart is empty. Choose a decant and come back — we will keep it reserved while you decide."
          action={{ label: 'Shop all decants', to: '/perfumes' }}
        />
      </div>
    )
  }

  const update = (key: keyof CustomerDetails, value: string) => {
    const clean = sanitizeText(value, 120)
    setCustomer((prev) => ({ ...prev, [key]: clean }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validateInformation = (): boolean => {
    const next: Errors = {
      firstName: validateField(customer.firstName, [validators.required]),
      lastName: validateField(customer.lastName, [validators.required]),
      email: validateField(customer.email, [validators.required, validators.email]),
      phone: validateField(customer.phone, [validators.required, validators.phone]),
      address: validateField(customer.address, [validators.required]),
      city: validateField(customer.city, [validators.required]),
      postalCode: validateField(customer.postalCode, [validators.required, validators.postalCode]),
    }
    setErrors(next)
    const valid = Object.values(next).every((value) => !value)
    if (!valid) notify('Please check the highlighted fields.', 'error')
    return valid
  }

  const placeOrderNow = () => {
    setSubmitting(true)
    const order: Order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      items: lines,
      customer,
      payment,
      shipping: { ...shipping, price: shippingPrice },
      subtotal,
      shippingPrice,
      total,
      etaDays: shipping.etaDays,
    }
    // Small delay so the confirmation state reads as a real submission.
    window.setTimeout(() => {
      placeOrder(order)
      clearCart()
      setSubmitting(false)
      navigate('/order-success')
    }, 500)
  }

  return (
    <div className="pt-16 lg:pt-20">
      <div className="container-lux py-12 md:py-16">
        <div className="flex flex-col gap-8 border-b border-noir/10 pb-8">
          <div>
            <h1 className="display-title text-[clamp(2rem,4.6vw,3rem)]">Checkout</h1>
            <p className="mt-3 text-[0.875rem] text-muted">
              {count} decant{count > 1 ? 's' : ''} · {formatPrice(total)} total
            </p>
          </div>
          <CheckoutSteps current={step} />
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {/* ---------------------------------------------------- 1 */}
              {step === 1 && (
                <motion.section
                  key="information"
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  aria-labelledby="step-information"
                >
                  <h2 id="step-information" className="display-title text-2xl">
                    Your information
                  </h2>
                  <p className="mt-2 text-[0.8125rem] text-muted">
                    We only use this to deliver your order and to confirm it with you on WhatsApp.
                  </p>

                  <form
                    className="mt-8 grid gap-5 sm:grid-cols-2"
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (validateInformation()) setStep(2)
                    }}
                  >
                    <Field
                      label="First name"
                      value={customer.firstName}
                      onChange={(e) => update('firstName', e.target.value)}
                      error={errors.firstName}
                      autoComplete="given-name"
                      required
                    />
                    <Field
                      label="Last name"
                      value={customer.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                      error={errors.lastName}
                      autoComplete="family-name"
                      required
                    />
                    <Field
                      label="Email"
                      type="email"
                      value={customer.email}
                      onChange={(e) => update('email', e.target.value)}
                      error={errors.email}
                      autoComplete="email"
                      required
                    />
                    <Field
                      label="Phone"
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      error={errors.phone}
                      autoComplete="tel"
                      hint="We confirm the order on this number"
                      required
                    />
                    <Field
                      label="Address"
                      value={customer.address}
                      onChange={(e) => update('address', e.target.value)}
                      error={errors.address}
                      autoComplete="street-address"
                      className="sm:col-span-2"
                      required
                    />
                    <Field
                      label="City"
                      value={customer.city}
                      onChange={(e) => update('city', e.target.value)}
                      error={errors.city}
                      autoComplete="address-level2"
                      required
                    />
                    <Field
                      label="Postal code"
                      value={customer.postalCode}
                      onChange={(e) => update('postalCode', e.target.value)}
                      error={errors.postalCode}
                      autoComplete="postal-code"
                      required
                    />
                    <TextAreaField
                      label="Delivery notes (optional)"
                      value={customer.notes}
                      onChange={(e) => update('notes', e.target.value)}
                      className="sm:col-span-2"
                      placeholder="Gate code, preferred time, gift note…"
                    />

                    <div className="sm:col-span-2">
                      <Button type="submit" variant="primary" size="lg" arrow>
                        Continue to delivery
                      </Button>
                    </div>
                  </form>
                </motion.section>
              )}

              {/* ---------------------------------------------------- 2 */}
              {step === 2 && (
                <motion.section
                  key="shipping"
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  aria-labelledby="step-shipping"
                >
                  <h2 id="step-shipping" className="display-title text-2xl">
                    Delivery
                  </h2>

                  <div className="mt-8 flex flex-col gap-3">
                    {SHIPPING_METHODS.map((method) => {
                      const free = subtotal >= FREE_SHIPPING_THRESHOLD && method.id === 'standard'
                      return (
                        <ChoiceCard
                          key={method.id}
                          name="shipping"
                          value={method.id}
                          checked={shippingId === method.id}
                          onChange={setShippingId}
                          title={method.label}
                          detail={method.detail}
                          aside={free ? 'Free' : formatPrice(method.price)}
                        />
                      )
                    })}
                  </div>

                  <div className="mt-8 rounded-xs border border-noir/12 bg-sand/40 p-5">
                    <h3 className="eyebrow mb-3 text-dark">Delivering to</h3>
                    <address className="not-italic text-[0.8125rem] leading-relaxed text-muted">
                      {customer.firstName} {customer.lastName}
                      <br />
                      {customer.address}
                      <br />
                      {customer.postalCode} {customer.city}
                    </address>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="mt-4 text-[0.625rem] uppercase tracking-[0.16em] text-noir"
                    >
                      Edit information
                    </button>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button variant="ghost" size="lg" onClick={() => setStep(1)}>
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Back
                    </Button>
                    <Button variant="primary" size="lg" onClick={() => setStep(3)} arrow>
                      Continue to payment
                    </Button>
                  </div>
                </motion.section>
              )}

              {/* ---------------------------------------------------- 3 */}
              {step === 3 && (
                <motion.section
                  key="payment"
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  aria-labelledby="step-payment"
                >
                  <h2 id="step-payment" className="display-title text-2xl">
                    Payment
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-[0.8125rem] text-muted">
                    <MessageCircle className="size-3.5 text-whatsapp" aria-hidden="true" />
                    No card details here. We confirm the order on WhatsApp and you pay on delivery
                    or by transfer.
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    {PAYMENT_METHODS.map((method) => (
                      <ChoiceCard
                        key={method.value}
                        name="payment"
                        value={method.value}
                        checked={payment === method.value}
                        onChange={() => setPayment(method.value)}
                        title={
                          <span className="flex items-center gap-2">
                            {method.value === 'cod' ? (
                              <Banknote className="size-4 text-noir" aria-hidden="true" />
                            ) : (
                              <Landmark className="size-4 text-noir" aria-hidden="true" />
                            )}
                            {method.label}
                          </span>
                        }
                        detail={method.detail}
                      />
                    ))}
                  </div>

                  <div className="mt-8 rounded-md border border-gold/30 bg-sand/40 p-5">
                    <p className="text-[0.8125rem] leading-relaxed text-muted">
                      Send the order to <span className="text-noir">{WHATSAPP_DISPLAY}</span>. Your
                      decants, the total and the delivery address are already written out — you only
                      press send, and we confirm the batch within 15 minutes.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => {
                        setStep(2)
                        setSubmitting(false)
                      }}
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      arrow
                      disabled={submitting}
                      onClick={placeOrderNow}
                    >
                      {submitting ? 'Sending…' : `Confirm order · ${formatPrice(total)}`}
                    </Button>
                    <WhatsAppLink
                      href={orderHref}
                      tone="whatsapp"
                      size="lg"
                      onClick={placeOrderNow}
                    >
                      Send on WhatsApp
                    </WhatsAppLink>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            <div className="mt-12 border-t border-noir/10 pt-8">
              <ButtonLink to="/cart" variant="ghost" size="sm">
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Return to your cart
              </ButtonLink>
            </div>
          </div>

          <OrderSummary
            lines={lines}
            shipping={{ ...shipping, price: shippingPrice }}
            onEditShipping={() => setStep(2)}
            className="lg:sticky lg:top-28 lg:self-start"
          />
        </div>
      </div>
    </div>
  )
}

export default Checkout
