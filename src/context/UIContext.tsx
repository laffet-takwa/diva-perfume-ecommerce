import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/* ==========================================================================
   UI shell state — fullscreen search and the mobile menu. Both are
   app-level surfaces, so they live above the router.
   ========================================================================== */

interface UIContextValue {
  isSearchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
  isMenuOpen: boolean
  openMenu: () => void
  closeMenu: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [isMenuOpen, setMenuOpen] = useState(false)
  const lastPath = useRef<string | null>(null)

  const openSearch = useCallback(() => {
    setMenuOpen(false)
    setSearchOpen(true)
  }, [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const toggleSearch = useCallback(() => setSearchOpen((v) => !v), [])

  const openMenu = useCallback(() => {
    setSearchOpen(false)
    setMenuOpen(true)
  }, [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Any route change should leave no overlay open. Adjusting during render
  // (rather than in an effect) avoids a frame where a stale overlay is mounted.
  const location = useLocation()
  if (lastPath.current !== location.pathname) {
    lastPath.current = location.pathname
    if (isMenuOpen) setMenuOpen(false)
    if (isSearchOpen) setSearchOpen(false)
  }

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const value = useMemo(
    () => ({
      isSearchOpen,
      openSearch,
      closeSearch,
      toggleSearch,
      isMenuOpen,
      openMenu,
      closeMenu,
    }),
    [isSearchOpen, openSearch, closeSearch, toggleSearch, isMenuOpen, openMenu, closeMenu],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>')
  return ctx
}