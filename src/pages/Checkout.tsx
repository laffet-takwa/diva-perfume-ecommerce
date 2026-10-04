import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Lock, Wallet } from 'lucide-react'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import OrderSummary from '@/components/checkout/OrderSummary'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ChoiceCard, Field, TextAreaField, validateField, validators } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS, useCart, useOrder, useToast } from '@/context'
import { useSeo } from '@/hooks/useSeo'
import type { CustomerDetails, Order, PaymentMethod } from '@/types'
import { formatPrice, sanitizeText } from '@/lib/utils'

/* ==========================================================================
   Checkout — 1 Information · 2 Shipping · 3 Payment
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
    description: 'Secure checkout at DIVA STORE. Card or cash on delivery.',
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
  const [payment, setPayment] = useState<PaymentMethod>('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState<{ number?: string; expiry?: string; cvv?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const shipping = useMemo(
    () => SHIPPING_METHODS.find((m) => m.id === shippingId) ?? SHIPPING_METHODS[0],
    [shippingId],
  )
  const shippingPrice = subtotal >= FREE_SHIPPING_THRESHOLD && shipping.id === 'standard' ? 0 : shipping.price
  const total = subtotal + shippingPrice

  if (lines.length === 0) {
    return (
      <div className="pt-16 lg:pt-20">
        <EmptyState
          eyebrow="Empty"
          title="There is nothing to check out."
          description="Your bag is empty. Choose a fragrance and come back — we will keep it reserved."
          action={{ label: 'Discover perfumes', to: '/perfumes' }}
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

  const validatePayment = (): boolean => {
    if (payment === 'cod') {
      setCardErrors({})
      return true
    }
    const next = {
      number: validateField(card.number, [validators.required, validators.cardNumber]),
      expiry: validateField(card.expiry, [validators.required, validators.expiry]),
      cvv: validateField(card.cvv, [validators.required, validators.cvv]),
    }
    setCardErrors(next)
    const valid = !next.number && !next.expiry && !next.cvv
    if (!valid) notify('Please check your card details.', 'error')
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
    }, 700)
  }

  return (
    <div className="pt-16 lg:pt-20">
      <div className="container-lux py-12 md:py-16">
        <div className="flex flex-col gap-8 border-b border-dark/10 pb-8">
          <div>
            <h1 className="display-title text-[clamp(2rem,4.6vw,3rem)]">Checkout</h1>
            <p className="mt-3 text-[0.875rem] text-muted">
              {count} item{count > 1 ? 's' : ''} · {formatPrice(total)} total
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
                    We only use this to deliver your order and, if you opt in, to write about new
                    fragrances.
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
                      hint="For delivery updates only"
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
                        Continue to shipping
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
                    Shipping method
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

                  <div className="mt-8 rounded-xs border border-dark/12 bg-cream-deep/40 p-5">
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
                      className="mt-4 text-[0.625rem] uppercase tracking-[0.16em] text-burgundy"
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
                    <Lock className="size-3.5 text-burgundy" aria-hidden="true" />
                    This is a demonstration checkout. No card is charged.
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    <ChoiceCard
                      name="payment"
                      value="card"
                      checked={payment === 'card'}
                      onChange={() => setPayment('card')}
                      title={
                        <span className="flex items-center gap-2">
                          <CreditCard className="size-4 text-burgundy" aria-hidden="true" />
                          Credit card
                        </span>
                      }
                      detail="Visa · Mastercard · e-Dinar"
                    />
                    <ChoiceCard
                      name="payment"
                      value="cod"
                      checked={payment === 'cod'}
                      onChange={() => setPayment('cod')}
                      title={
                        <span className="flex items-center gap-2">
                          <Wallet className="size-4 text-burgundy" aria-hidden="true" />
                          Cash on delivery
                        </span>
                      }
                      detail="Pay the courier when your parcel arrives"
                    />
                  </div>

                  <AnimatePresence initial={false}>
                    {payment === 'card' && (
                      <motion.form
                        key="card-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (validatePayment()) placeOrderNow()
                        }}
                        className="grid gap-5 overflow-hidden pt-6 sm:grid-cols-2"
                        noValidate
                      >
                        <Field
                          label="Card number"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="4242 4242 4242 4242"
                          value={card.number}
                          onChange={(e) => {
                            setCard((c) => ({ ...c, number: sanitizeText(e.target.value, 24) }))
                            setCardErrors((c) => ({ ...c, number: undefined }))
                          }}
                          error={cardErrors.number}
                          className="sm:col-span-2"
                          required
                        />
                        <Field
                          label="Expiry"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="09/28"
                          value={card.expiry}
                          onChange={(e) => {
                            setCard((c) => ({ ...c, expiry: sanitizeText(e.target.value, 5) }))
                            setCardErrors((c) => ({ ...c, expiry: undefined }))
                          }}
                          error={cardErrors.expiry}
                          required
                        />
                        <Field
                          label="CVV"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder="123"
                          value={card.cvv}
                          onChange={(e) => {
                            setCard((c) => ({ ...c, cvv: sanitizeText(e.target.value, 4) }))
                            setCardErrors((c) => ({ ...c, cvv: undefined }))
                          }}
                          error={cardErrors.cvv}
                          required
                        />

                        <div className="sm:col-span-2">
                          <div className="flex flex-wrap gap-3">
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
                              type="submit"
                              variant="primary"
                              size="lg"
                              arrow
                              disabled={submitting}
                            >
                              {submitting
                                ? 'Placing order…'
                                : `Pay ${formatPrice(total)}`}
                            </Button>
                          </div>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {payment === 'cod' && (
                    <div className="mt-6">
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={() => setStep(2)}
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
                          {submitting ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>

            <div className="mt-12 border-t border-dark/10 pt-8">
              <ButtonLink to="/cart" variant="ghost" size="sm">
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Return to your bag
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