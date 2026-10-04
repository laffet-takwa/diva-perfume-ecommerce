import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ==========================================================================
   CheckoutSteps — 1 Information · 2 Shipping · 3 Payment
   ========================================================================== */

export const CHECKOUT_STEPS = [
  { id: 1, label: 'Information' },
  { id: 2, label: 'Shipping' },
  { id: 3, label: 'Payment' },
] as const

export function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Checkout progress">
      {CHECKOUT_STEPS.map((step, i) => {
        const state = step.id < current ? 'done' : step.id === current ? 'active' : 'todo'
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <motion.span
              initial={false}
              animate={{
                backgroundColor:
                  state === 'todo' ? 'rgba(23,19,21,0.05)' : 'rgba(74,23,40,1)',
              }}
              transition={{ duration: 0.35 }}
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-medium',
                state === 'todo' ? 'text-muted' : 'text-cream',
              )}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              {state === 'done' ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                step.id
              )}
            </motion.span>
            <span
              className={cn(
                'hidden text-[0.6875rem] uppercase tracking-[0.16em] sm:block',
                state === 'todo' ? 'text-muted' : 'text-dark',
              )}
            >
              {step.label}
            </span>
            {i < CHECKOUT_STEPS.length - 1 && (
              <span className="h-px flex-1 bg-dark/12" aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default CheckoutSteps