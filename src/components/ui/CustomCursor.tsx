import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsDesktop, useIsTouch } from '@/hooks/useMediaQuery'

/* ==========================================================================
   CustomCursor — desktop, non-touch only.
   A small gold ring that grows over interactive elements and fills over media.
   ========================================================================== */

export function CustomCursor() {
  const isDesktop = useIsDesktop()
  const isTouch = useIsTouch()
  const enabled = isDesktop && !isTouch

  const ringX = useMotionValue(-100)
  const ringY = useMotionValue(-100)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const ringXSpring = useSpring(ringX, { stiffness: 380, damping: 32, mass: 0.6 })
  const ringYSpring = useSpring(ringY, { stiffness: 380, damping: 32, mass: 0.6 })
  const dotXSpring = useSpring(dotX, { stiffness: 900, damping: 40, mass: 0.3 })
  const dotYSpring = useSpring(dotY, { stiffness: 900, damping: 40, mass: 0.3 })

  const [state, setState] = useState<'link' | 'media' | 'idle'>('idle')
  const [visible, setVisible] = useState(false)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('has-custom-cursor')
      return
    }
    document.body.classList.add('has-custom-cursor')
    return () => document.body.classList.remove('has-custom-cursor')
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      ringX.set(e.clientX)
      ringY.set(e.clientY)
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      if (!visible) setVisible(true)

      const target = e.target as HTMLElement | null
      const interactive = target?.closest('a, button, [role="button"], input, select, textarea, label')
      const media = target?.closest('[data-cursor="media"], img, [role="tab"]')
      setState(media ? 'media' : interactive ? 'link' : 'idle')

      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        frame.current = null
      })
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [enabled, ringX, ringY, dotX, dotY, visible])

  if (!enabled) return null

  const size = state === 'media' ? 64 : state === 'link' ? 40 : 22

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] hidden lg:block">
      <motion.div
        className="absolute rounded-full border border-burgundy/70 mix-blend-multiply"
        style={{ x: ringXSpring, y: ringYSpring, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor:
            state === 'media' ? 'rgba(74,23,40,0.10)' : 'rgba(74,23,40,0)',
          transition: { width: { duration: 0.28 }, height: { duration: 0.28 }, opacity: { duration: 0.2 } },
        }}
      />
      <motion.div
        className="absolute size-1 rounded-full bg-burgundy/80"
        style={{ x: dotXSpring, y: dotYSpring, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible && state === 'idle' ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}

export default CustomCursor