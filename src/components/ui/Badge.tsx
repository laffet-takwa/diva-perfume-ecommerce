import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { ProductBadge } from '@/types'

/* ==========================================================================
   Badge — minimal editorial label. Gold hairline on tinted paper.
   ========================================================================== */

const TONES: Record<ProductBadge | 'gold' | 'neutral', string> = {
  NEW: 'bg-gold/15 text-[#8A6E33] border-gold/45',
  BESTSELLER: 'bg-burgundy/8 text-burgundy border-burgundy/30',
  LIMITED: 'bg-rose/18 text-[#7A3A50] border-rose/50',
  EXCLUSIVE: 'bg-dark/6 text-dark border-dark/20',
  gold: 'bg-gold/15 text-[#8A6E33] border-gold/45',
  neutral: 'bg-cream text-muted border-dark/12',
}

export interface BadgeProps {
  children: ReactNode
  tone?: ProductBadge | 'gold' | 'neutral'
  className?: string
  size?: 'sm' | 'md'
}

export function Badge({ children, tone = 'neutral', className, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xs border font-sans font-medium uppercase tracking-[0.2em]',
        size === 'sm' ? 'px-2 py-[3px] text-[0.5625rem]' : 'px-2.5 py-1 text-[0.625rem]',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge