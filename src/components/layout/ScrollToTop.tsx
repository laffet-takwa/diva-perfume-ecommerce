import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* ==========================================================================
   ScrollToTop
   New route → top of page, unless the URL carries a hash we should reveal.
   ========================================================================== */

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        // Let the target section mount before scrolling to it.
        window.requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export default ScrollToTop