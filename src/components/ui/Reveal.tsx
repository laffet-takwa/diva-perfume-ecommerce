import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  fadeIn,
  fadeUp,
  fadeUpDeep,
  imageReveal,
  imageRevealAlt,
  scaleIn,
  slideInLeft,
  slideInRight,
} from '@/lib/motion'

/* ==========================================================================
   Reveal — the standard scroll-triggered entrance wrapper.
   Sections compose these instead of repeating whileInView props everywhere.
   ========================================================================== */

const VARIANT_MAP: Record<string, Variants> = {
  up: fadeUp,
  deep: fadeUpDeep,
  fade: fadeIn,
  scale: scaleIn,
  reveal: imageReveal,
  revealUp: imageRevealAlt,
  left: slideInLeft,
  right: slideInRight,
}

const TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  article: motion.article,
  header: motion.header,
  figure: motion.figure,
} as const

export type RevealVariant = keyof typeof VARIANT_MAP
export type RevealTag = keyof typeof TAGS

export interface RevealProps {
  children: ReactNode
  /** Stagger index — each step adds 90ms. */
  index?: number
  /** Explicit delay in seconds; used when `index` is not meaningful. */
  delay?: number
  variant?: RevealVariant
  className?: string
  as?: RevealTag
  /** Replay the animation when scrolled back into view. */
  repeat?: boolean
}

export default function Reveal({
  children,
  index,
  delay,
  variant = 'up',
  className,
  as = 'div',
  repeat = false,
}: RevealProps) {
  const seconds = delay ?? (index !== undefined ? index * 0.09 : 0)
  const MotionTag = TAGS[as]

  const variants = useMemo<Variants>(() => {
    const base = VARIANT_MAP[variant] ?? fadeUp
    const visible = base.visible as { transition?: Record<string, unknown> }
    return {
      hidden: base.hidden,
      visible: {
        ...visible,
        transition: { ...(visible.transition ?? {}), delay: seconds },
      },
    }
  }, [variant, seconds])

  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount: 0.2, margin: '0px 0px -60px 0px' }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}