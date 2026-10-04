import { useCallback, useSyncExternalStore } from 'react'

/**
 * SSR-safe media query hook used for the responsive behaviour switches.
 * `useSyncExternalStore` subscribes straight to the MediaQueryList, so the
 * value stays correct across query changes without a re-subscribe effect.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined') return () => undefined
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onStoreChange)
      return () => mql.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(
    () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
    [query],
  )

  // Server snapshot is always "no match": the first client render then
  // reconciles before paint, avoiding a hydration mismatch.
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)')
