import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ButtonLink } from './Button'
import { cn } from '@/lib/utils'

/* ==========================================================================
   SectionHeading — the editorial header used by every home section.
   Keeps eyebrow / title / copy / link alignment consistent.
   ========================================================================== */

export interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  action?: { label: string; to: string }
  /** "01 / 04" style index shown beside the eyebrow */
  index?: string
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  action,
  index,
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const isDark = tone === 'dark'
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center' : 'items-start',
        action && 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center')}>
        {(eyebrow || index) && (
          <div className="eyebrow eyebrow-rule">
            {index && (
              <span className={cn('font-display text-xs tracking-normal', isDark ? 'text-gold' : 'text-gold')}>
                {index}
              </span>
            )}
            <span
              className={cn('h-px w-6', isDark ? 'bg-gold/50' : 'bg-gold/60')}
              aria-hidden="true"
            />
            {eyebrow && <span className={isDark ? 'text-white/70' : 'text-noir/70'}>{eyebrow}</span>}
          </div>
        )}

        <h2
          className={cn(
            'display-title text-[clamp(1.85rem,4.4vw,3.1rem)]',
            isDark ? 'text-white' : 'text-dark',
          )}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className={cn(
              'max-w-xl text-[0.9375rem] leading-relaxed',
              isDark ? 'text-white/60' : 'text-muted',
              align === 'center' && 'mx-auto',
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.3 }}>
          <ButtonLink
            to={action.to}
            variant="ghost"
            size="sm"
            arrow
            className={cn('px-0', isDark ? 'text-white hover:bg-transparent' : 'text-noir')}
          >
            {action.label}
          </ButtonLink>
        </motion.div>
      )}
    </div>
  )
}

export default SectionHeading