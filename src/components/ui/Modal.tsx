import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useScrollLock } from '@/hooks/useScrollLock'
import { cn } from '@/lib/utils'

/* ==========================================================================
   Modal — centered, scale + opacity. Used by the search overlay.
   ========================================================================== */

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  labelId?: string
  /** Render edge-to-edge (no inset padding) for fullscreen experiences */
  fullscreen?: boolean
  hideClose?: boolean
}

export function Modal({
  open,
  onClose,
  children,
  className,
  labelId,
  fullscreen = false,
  hideClose = false,
}: ModalProps) {
  useScrollLock(open)
  const panelRef = useRef<HTMLDivElement>(null)

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
        <motion.div
          className={cn('fixed inset-0 z-[110]', fullscreen ? '' : 'flex items-center justify-center p-4')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-dark/55 backdrop-blur-md"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative w-full overflow-hidden bg-cream shadow-panel outline-none',
              fullscreen ? 'h-full' : 'max-w-lg rounded-md',
              className,
            )}
          >
            {children}
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-5 top-5 z-10 rounded-xs p-2 text-muted transition-colors hover:text-dark"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal