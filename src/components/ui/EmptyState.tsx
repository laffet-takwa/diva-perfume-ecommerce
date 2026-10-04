import type { ReactNode } from 'react'
import { ButtonLink } from './Button'
import { cn } from '@/lib/utils'

/* ==========================================================================
   EmptyState — shared by empty results, empty cart, empty wishlist,
   missing product and failed loads.
   ========================================================================== */

export interface EmptyStateProps {
  eyebrow?: string
  title: string
  description?: ReactNode
  action?: { label: string; to: string }
  secondaryAction?: { label: string; to: string }
  icon?: ReactNode
  className?: string
  compact?: boolean
}

export function EmptyState({
  eyebrow = 'Nothing here',
  title,
  description,
  action,
  secondaryAction,
  icon,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-14' : 'py-24 md:py-32',
        className,
      )}
    >
      {icon && (
        <span className="mb-7 flex size-16 items-center justify-center rounded-full border border-gold/40 text-burgundy/70">
          {icon}
        </span>
      )}
      <div className="eyebrow eyebrow-rule mb-4">
        <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
        <span className="text-burgundy/70">{eyebrow}</span>
      </div>
      <h3 className="display-title max-w-md text-[clamp(1.5rem,3.2vw,2.1rem)] text-dark">{title}</h3>
      {description && (
        <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          {action && (
            <ButtonLink to={action.to} variant="primary" size="md" arrow>
              {action.label}
            </ButtonLink>
          )}
          {secondaryAction && (
            <ButtonLink to={secondaryAction.to} variant="ghost" size="md">
              {secondaryAction.label}
            </ButtonLink>
          )}
        </div>
      )}
    </div>
  )
}

export default EmptyState