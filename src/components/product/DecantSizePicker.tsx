import { DECANT_SIZE_COPY } from '@/data/products'
import type { DecantSize, ProductSize } from '@/types'
import { cn, formatPrice } from '@/lib/utils'

/* ==========================================================================
   DecantSizePicker — the 3 / 5 / 10 ml selector.
   One component drives both the card and the product page so a customer always
   sees the same volume names, the same order and the same prices. Choosing a
   volume is the single most important decision on a decant store, so it is
   always visible rather than hidden behind a dropdown.
   ========================================================================== */

export interface DecantSizePickerProps {
  sizes: ProductSize[]
  value: DecantSize
  onChange: (ml: DecantSize) => void
  /** `card` is a compact segmented row, `detail` is a row of priced tiles */
  layout?: 'card' | 'detail'
  /** Renders the volume kicker ("The signature") — detail layout only */
  showKicker?: boolean
  label?: string
  className?: string
}

export function DecantSizePicker({
  sizes,
  value,
  onChange,
  layout = 'card',
  showKicker = false,
  label = 'Decant size',
  className,
}: DecantSizePickerProps) {
  if (layout === 'detail') {
    return (
      <fieldset className={className}>
        <legend className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-dark">
          {label}
        </legend>
        <div className="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3">
          {sizes.map((size) => {
            const selected = size.ml === value
            const copy = DECANT_SIZE_COPY[size.ml]
            return (
              <button
                key={size.ml}
                type="button"
                onClick={() => onChange(size.ml)}
                aria-pressed={selected}
                className={cn(
                  'group/size relative flex flex-col items-start gap-1 rounded-sm border px-3 py-3 text-left transition-all duration-300 sm:px-4',
                  selected
                    ? 'border-noir bg-noir/[0.04] shadow-[0_10px_24px_-18px_rgba(14,14,16,0.6)]'
                    : 'border-noir/12 hover:border-noir/40',
                )}
              >
                <span
                  className={cn(
                    'font-display text-[0.9375rem]',
                    selected ? 'text-noir' : 'text-ink',
                  )}
                >
                  {size.ml} ml
                </span>
                <span className="text-[0.75rem] font-medium text-noir">{formatPrice(size.price)}</span>
                {showKicker && (
                  <span className="mt-0.5 text-[0.5625rem] uppercase tracking-[0.18em] text-muted">
                    {copy?.sprays}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-3 bottom-0 h-px origin-left bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    selected ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted">
          {DECANT_SIZE_COPY[value].blurb}
        </p>
      </fieldset>
    )
  }

  return (
    <fieldset className={className}>
      <legend className="sr-only">{label}</legend>
      <div
        className="inline-flex items-stretch overflow-hidden rounded-xs border border-noir/12"
        role="group"
        aria-label={label}
      >
        {sizes.map((size) => {
          const selected = size.ml === value
          return (
            <button
              key={size.ml}
              type="button"
              onClick={() => onChange(size.ml)}
              aria-pressed={selected}
              className={cn(
                'relative px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300',
                selected ? 'bg-noir text-ivory' : 'bg-transparent text-muted hover:text-noir',
              )}
            >
              {size.ml} ml
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default DecantSizePicker
