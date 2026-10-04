import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn, isValidEmail, isValidPhone } from '@/lib/utils'

/* ==========================================================================
   Form primitives — the checkout and account forms share these.
   ========================================================================== */

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, id, className, ...rest },
  ref,
) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`
  const messageId = `${fieldId}-message`

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-[0.6875rem] uppercase tracking-[0.16em] text-dark">
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(
          'h-12 rounded-xs border bg-cream px-4 text-[0.875rem] text-dark transition-colors placeholder:text-muted/60 focus:outline-none',
          error ? 'border-burgundy' : 'border-dark/15 focus:border-burgundy',
        )}
        {...rest}
      />
      {(error || hint) && (
        <p id={messageId} className={cn('text-[0.6875rem]', error ? 'text-burgundy' : 'text-muted')}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
})

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextAreaField(
  { label, error, id, className, ...rest },
  ref,
) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-[0.6875rem] uppercase tracking-[0.16em] text-dark">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        rows={3}
        className={cn(
          'rounded-xs border bg-cream px-4 py-3 text-[0.875rem] text-dark transition-colors placeholder:text-muted/60 focus:outline-none',
          error ? 'border-burgundy' : 'border-dark/15 focus:border-burgundy',
        )}
        {...rest}
      />
      {error && <p className="text-[0.6875rem] text-burgundy">{error}</p>}
    </div>
  )
})

/* --------------------------------------------------------------------------
   Radio card — used for shipping and payment
   -------------------------------------------------------------------------- */

export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  detail,
  aside,
}: {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  title: ReactNode
  detail?: ReactNode
  aside?: ReactNode
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xs border p-4 transition-all duration-300',
        checked ? 'border-burgundy bg-burgundy/[0.03]' : 'border-dark/15 hover:border-burgundy/40',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
          checked ? 'border-burgundy' : 'border-dark/25',
        )}
      >
        {checked && <span className="size-2 rounded-full bg-burgundy" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.875rem] text-dark">{title}</span>
        {detail && <span className="mt-0.5 block text-[0.6875rem] text-muted">{detail}</span>}
      </span>
      {aside && <span className="shrink-0 font-display text-sm text-dark">{aside}</span>}
    </label>
  )
}

/* --------------------------------------------------------------------------
   Validation helpers shared by the checkout steps
   -------------------------------------------------------------------------- */

export const validators = {
  required: (value: string) => (value.trim().length > 0 ? undefined : 'This field is required'),
  email: (value: string) =>
    isValidEmail(value) ? undefined : 'Enter a valid email address',
  phone: (value: string) =>
    isValidPhone(value) ? undefined : 'Enter a valid phone number',
  postalCode: (value: string) =>
    value.trim().length >= 4 ? undefined : 'Enter a valid postal code',
  cardNumber: (value: string) =>
    value.replace(/\D/g, '').length >= 15 ? undefined : 'Enter a 16-digit card number',
  expiry: (value: string) =>
    /^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(value.trim()) ? undefined : 'Use MM/YY',
  cvv: (value: string) =>
    /^\d{3,4}$/.test(value.trim()) ? undefined : '3 or 4 digits',
}

export function validateField(
  value: string,
  rules: Array<(v: string) => string | undefined>,
): string | undefined {
  for (const rule of rules) {
    const result = rule(value)
    if (result) return result
  }
  return undefined
}