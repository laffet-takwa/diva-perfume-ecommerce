export interface LogoProps {
  className?: string
  /** The header swaps the wordmark's tracking once it becomes solid */
  tone?: 'light' | 'dark'
  markOnly?: boolean
}

/**
 * Wordmark. The "DIVA" is drawn with tighter tracking than "STORE" so the lockup
 * reads as a house signature rather than a generic logo.
 */
export function Logo({ className, tone = 'dark', markOnly = false }: LogoProps) {
  const color = tone === 'light' ? 'text-white' : 'text-dark'

  return (
    <span className={['inline-flex items-baseline gap-[0.5em] leading-none', color, className].join(' ')}>
      <span className="font-display text-[1.0625rem] font-medium tracking-[0.34em] sm:text-xl">
        DIVA
      </span>
      {!markOnly && (
        <span className="font-sans text-[0.5625rem] font-normal uppercase tracking-[0.42em] opacity-70">
          Store
        </span>
      )}
    </span>
  )
}

export default Logo