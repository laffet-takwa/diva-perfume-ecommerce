import { useEffect } from 'react'

let lockCount = 0
let savedOverflow = ''
let savedPaddingRight = ''

/**
 * Locks page scroll while an overlay is open, compensating for the scrollbar
 * so the layout does not jump. Reference-counted so nested overlays behave.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return

    if (lockCount === 0) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      savedOverflow = document.body.style.overflow
      savedPaddingRight = document.body.style.paddingRight
      document.body.style.overflow = 'hidden'
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    }
    lockCount += 1

    return () => {
      lockCount -= 1
      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow
        document.body.style.paddingRight = savedPaddingRight
      }
    }
  }, [active])
}