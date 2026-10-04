import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ==========================================================================
   Rating — a measured star row plus an accessible numeric value.
   ========================================================================== */

export interface ProductRatingProps {
  rating: number
  reviews?: number
  size?: 'xs' | 'sm' | 'md'
  showValue?: boolean
  className?: string
  /** Muted variant for dark backgrounds */
  tone?: 'light' | 'dark'
}

const SIZES = {
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
}

export function ProductRating({
  rating,
  reviews,
  size = 'sm',
  showValue = false,
  className,
  tone = 'light',
}: ProductRatingProps) {
  const rounded = Math.round(rating * 2) / 2
  const label = reviews
    ? `Rated ${rating} out of 5 from ${reviews} reviews`
    : `Rated ${rating} out of 5`

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex items-center gap-[2px]" role="img" aria-label={label}>
        {[1, 2, 3, 4, 5].map((index) => {
          const filled = rounded >= index
          const half = !filled && rounded >= index - 0.5
          return (
            <span key={index} className="relative inline-flex">
              <Star
                className={cn(
                  SIZES[size],
                  tone === 'dark' ? 'text-white/25' : 'text-dark/15',
                )}
                aria-hidden="true"
              />
              {(filled || half) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: half ? '50%' : '100%' }}>
                  <Star
                    className={cn(SIZES[size], tone === 'dark' ? 'text-gold' : 'text-gold')}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                </span>
              )}
            </span>
          )
        })}
      </span>
      {showValue && (
        <span
          className={cn(
            'font-display text-sm',
            tone === 'dark' ? 'text-white/85' : 'text-dark',
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
      {reviews !== undefined && (
        <span className={cn('text-[0.6875rem]', tone === 'dark' ? 'text-white/55' : 'text-muted')}>
          ({reviews})
        </span>
      )}
    </div>
  )
}

export default ProductRating