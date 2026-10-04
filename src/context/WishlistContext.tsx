import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { productById } from '@/data/products'
import { readStorage, writeStorage } from '@/lib/utils'

/* ==========================================================================
   Wishlist — stored as product ids so the catalogue stays the single source
   of truth for pricing and artwork.
   ========================================================================== */

const STORAGE_KEY = 'diva.wishlist.v1'

interface WishlistContextValue {
  ids: string[]
  count: number
  isInWishlist: (id: string) => boolean
  addToWishlist: (id: string) => void
  removeFromWishlist: (id: string) => void
  toggleWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEY, []).filter((id) => productById.has(id)),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEY, ids)
  }, [ids])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      setIds(readStorage<string[]>(STORAGE_KEY, []).filter((id) => productById.has(id)))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isInWishlist = useCallback((id: string) => ids.includes(id), [ids])

  const addToWishlist = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const removeFromWishlist = useCallback((id: string) => {
    setIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const toggleWishlist = useCallback(
    (id: string) => {
      const willBeAdded = !ids.includes(id)
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
      return willBeAdded
    },
    [ids],
  )

  const clearWishlist = useCallback(() => setIds([]), [])

  const value = useMemo(
    () => ({ ids, count: ids.length, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist }),
    [ids, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}