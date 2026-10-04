import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info, X } from 'lucide-react'
import { fadeIn } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ==========================================================================
   Toast notifications
   Every state-changing action in the store confirms itself here.
   ========================================================================== */

export type ToastTone = 'success' | 'info' | 'error'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TONE_STYLES: Record<ToastTone, { icon: typeof Check; accent: string }> = {
  success: { icon: Check, accent: 'bg-gold' },
  info: { icon: Info, accent: 'bg-noir' },
  error: { icon: X, accent: 'bg-noir' },
}

const DURATION = 2800

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      counter.current += 1
      const id = counter.current
      // Keep at most three on screen; older ones fall off.
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }])
      window.setTimeout(() => dismiss(id), DURATION)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] flex flex-col items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+6.5rem)] sm:items-end sm:pb-8 sm:pr-8"
        role="region"
        aria-label="Notifications"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const { icon: Icon, accent } = TONE_STYLES[toast.tone]
            return (
              <motion.div
                key={toast.id}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
                layout
                className={cn(
                  'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xs border border-dark/10 bg-ivory/95 py-3 pl-3 pr-2.5 backdrop-blur-md',
                  'shadow-[0_18px_44px_-20px_rgba(12,12,14,0.5)]',
                )}
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-ivory',
                    accent,
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <p className="flex-1 text-[0.8125rem] leading-snug text-dark">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="rounded-xs p-1 text-muted transition-colors hover:text-dark"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}