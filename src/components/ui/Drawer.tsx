import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useScrollLock } from '@/hooks/useScrollLock'
import { cn } from '@/lib/utils'

/* ==========================================================================
   Drawer — used by the cart, the mobile menu and the mobile filter panel.
   ================================================================== */

export type DrawerSide = 'right' | 'left'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  side?: DrawerSide
  children: ReactNode
  footer?: ReactNode
  className?: string
  /** Hide the default title block (custom headers) */
  bareHeader?: boolean
  labelId?: string
}

const VARIANTS = {
  right: { closed: { x: '100%' }, open: { x: 0 } },
  left: { closed: { x: '-100%' }, open: { x: 0 } },
}

export function Drawer({
  open,
  onClose,
  title,
  side = 'right',
  children,
  footer,
  className,
  bareHeader = false,
  labelId = 'drawer-title',
}: DrawerProps) {
  useScrollLock(open)
  const panelRef = useRef<HTMLDivElement>(null)

  // Move focus into the panel, and restore it on close.
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const id = window.setTimeout(() => panelRef.current?.focus(), 60)
    return () => {
      window.clearTimeout(id)
      previous?.focus?.()
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]" role="presentation">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 h-full w-full cursor-default bg-dark/45 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            tabIndex={-1}
            initial={VARIANTS[side].closed}
            animate={VARIANTS[side].open}
            exit={VARIANTS[side].closed}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute inset-y-0 flex w-full max-w-[26rem] flex-col bg-ivory shadow-panel outline-none',
              side === 'right' ? 'right-0' : 'left-0',
              className,
            )}
          >
            {!bareHeader && (
              <div className="flex items-center justify-between border-b border-dark/10 px-6 py-5">
                <h2 id={labelId} className="eyebrow text-dark">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={`Close ${title.toLowerCase()}`}
                  className="-mr-2 rounded-xs p-2 text-muted transition-colors hover:text-dark"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

            {footer && (
              <div className="border-t border-dark/10 bg-ivory px-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] pt-5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Drawer