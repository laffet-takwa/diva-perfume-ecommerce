import { cn } from '@/lib/utils'

/* ==========================================================================
   InstagramIcon — the brand glyph, drawn to match the lucide line icons used
   across the storefront. lucide ships no brand marks, so the path is inlined
   here and this is the only place Instagram's mark is drawn.
   ========================================================================== */

export interface InstagramIconProps {
  className?: string
}

export function InstagramIcon({ className }: InstagramIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default InstagramIcon