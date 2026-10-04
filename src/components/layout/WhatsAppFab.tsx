import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useCart } from '@/context'
import { whatsappEnquiry } from '@/lib/whatsapp'
import { EASE_LUX } from '@/lib/motion'

/* ==========================================================================
   WhatsAppFab — the persistent "order on WhatsApp" handle.
   Hidden until the customer has shown intent (scrolled past the hero or added
   something to the cart) so it never competes with the hero CTA, and hidden
   entirely while the cart drawer is open.
   ========================================================================== */

export function WhatsAppFab() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const { isDrawerOpen, count } = useCart()
  const [visible, setVisible] = useState(false)

  const onHome = location.pathname === '/'

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        setVisible(window.scrollY > (onHome ? 520 : 220))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [onHome])

  // Adding to the cart is the strongest intent signal there is.
  const shown = visible && !isDrawerOpen && count === 0

  return (
    <AnimatePresence>
      {shown && (
        <motion.a
          href={whatsappEnquiry()}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Order on WhatsApp"
          initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.4, ease: EASE_LUX }}
          className="group fixed bottom-24 right-5 z-40 flex items-center gap-3 lg:bottom-8 lg:right-8"
        >
          <span className="hidden font-sans text-[0.5625rem] font-medium uppercase tracking-[0.22em] text-noir opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block">
            Order on WhatsApp
          </span>
          <span className="relative flex size-14 items-center justify-center rounded-full border border-gold/50 bg-ivory text-whatsapp shadow-[0_18px_40px_-18px_rgba(14,14,16,0.55)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-active:scale-95">
            <WhatsAppIcon className="size-7" />
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full border border-gold/40 motion-safe:animate-[diva-pulse_3.2s_ease-in-out_infinite]"
            />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}

export default WhatsAppFab
