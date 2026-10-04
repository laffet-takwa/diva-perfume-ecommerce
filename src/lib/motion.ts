import type { Transition, Variants } from 'framer-motion'

/* ==========================================================================
   DIVA STORE — Reusable motion primitives
   Every section on the site composes from these instead of hand-rolling
   inline transition objects.
   ========================================================================== */

export const EASE_LUX = [0.22, 1, 0.36, 1] as const
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const

export const DUR = {
  micro: 0.25,
  base: 0.45,
  slow: 0.7,
  reveal: 0.9,
} as const

const spring: Transition = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }
const softSpring: Transition = { type: 'spring', stiffness: 180, damping: 26 }

/** Enter the viewport from below — the workhorse for section reveals. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE_LUX },
  },
}

/** Softer variant with more travel, for large editorial blocks. */
export const fadeUpDeep: Variants = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.reveal, ease: EASE_LUX },
  },
}

/** Pure opacity — for images and overlays that should not move. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.slow, ease: EASE_LUX } },
}

/** Gentle scale from 95% — for bottles and single focal objects. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DUR.slow, ease: EASE_LUX },
  },
}

/** Slides in from the left — hero copy and drawer content. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.slow, ease: EASE_LUX } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.slow, ease: EASE_LUX } },
}

/** Curtain reveal — the editorial "image reveal" effect. */
export const imageReveal: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.4 },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    transition: { duration: 1.1, ease: EASE_LUX },
  },
}

export const imageRevealAlt: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    transition: { duration: 1.1, ease: EASE_LUX },
  },
}

/* --------------------------------------------------------------------------
   Container helpers — parent sets orchestration, children declare intent
   -------------------------------------------------------------------------- */

export const staggerContainer = (stagger = 0.09, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

export const staggerFast: Variants = staggerContainer(0.055)
export const staggerMedium: Variants = staggerContainer(0.09)
export const staggerSlow: Variants = staggerContainer(0.14)

/* --------------------------------------------------------------------------
   Interaction helpers
   -------------------------------------------------------------------------- */

export const hoverLift: Transition = { duration: DUR.base, ease: EASE_LUX }
export const tapScale: Transition = { duration: DUR.micro, ease: EASE_INOUT }

export const collapse: Variants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: DUR.base, ease: EASE_INOUT } },
  expanded: { height: 'auto', opacity: 1, transition: { duration: DUR.base, ease: EASE_INOUT } },
}

/* --------------------------------------------------------------------------
   Shared viewports — keeps "when does this count as visible?" consistent
   -------------------------------------------------------------------------- */

export const viewportOnce = { once: true, amount: 0.2 } as const
export const viewportEarly = { once: true, amount: 0.05 } as const

export { spring, softSpring }