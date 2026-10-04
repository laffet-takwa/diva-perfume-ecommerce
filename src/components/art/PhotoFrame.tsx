import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

/* ==========================================================================
   PhotoFrame — the campaign-photography primitive.

   Every photograph in the house art direction is treated the same way:
   a hairline gold frame, a film grain pass, a warm light wash that ties the
   image back to the ivory palette, and an entrance reveal with an optional
   slow parallax drift while the page scrolls.
   ========================================================================== */

export interface PhotoFrameProps {
  src: string
  /** Meaningful alternative text. The photograph is content, not decoration. */
  alt: string
  /** Aspect box — the campaign art is shot portrait */
  frame?: 'portrait' | 'tall' | 'square' | 'landscape'
  className?: string
  /** Above-the-fold images should not lazy-load */
  priority?: boolean
  /**
   * Focal point as an `object-position` value. The crop is taken away from this
   * point, so a face placed near the top edge of the source should use a
   * top-biased value such as `50% 14%`. Defaults to a centred crop.
   */
  focus?: string
  /**
   * Slow vertical drift on scroll, in percent of the frame height. Keep it
   * small: each percent can nudge a top-anchored crop further off the subject.
   */
  parallax?: number
  /** Fades the top-left into the page ivory so the photo has no hard edge */
  feather?: 'none' | 'left' | 'bottom'
  /** Seconds before the entrance animation begins */
  delay?: number
}

const FRAMES = {
  portrait: 'aspect-[3/4]',
  tall: 'aspect-[4/5]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
} as const

const FEATHERS = {
  none: '',
  left: 'bg-[linear-gradient(90deg,var(--color-ivory)_0%,rgba(247,241,234,0.35)_18%,transparent_46%)]',
  bottom: 'bg-[linear-gradient(0deg,var(--color-ivory)_0%,transparent_38%)]',
} as const

export function PhotoFrame({
  src,
  alt,
  frame = 'tall',
  className,
  priority = false,
  focus = '50% 50%',
  parallax = 0,
  feather = 'none',
  delay = 0,
}: PhotoFrameProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [parallax / 2, -parallax / 2])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 1.04, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(
        'group/photo relative overflow-hidden rounded-md bg-sand/50 shadow-float ring-1 ring-gold/25',
        FRAMES[frame],
        className,
      )}
    >
      {/* `focus` is the frame's focal point. Cropping happens away from it, so
          `50% 14%` keeps a subject's face in shot whatever the panel ratio is.
          No resting zoom: a resting scale would eat the focal area. */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          draggable={false}
          style={{ objectPosition: focus, ...(reduceMotion ? {} : { y: drift }) }}
          className="size-full object-cover will-change-transform"
        />
      </div>

      {/* Warm wash + grain tie the photograph into the ivory palette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.16),rgba(232,216,195,0.22))] mix-blend-soft-light"
      />
      <div aria-hidden="true" className="grain-layer opacity-[0.18] mix-blend-overlay" />

      {feather !== 'none' && (
        <div aria-hidden="true" className={cn('absolute inset-0', FEATHERS[feather])} />
      )}

      {/* Hairline frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-xs border border-white/25" />
    </motion.div>
  )
}

export default PhotoFrame
