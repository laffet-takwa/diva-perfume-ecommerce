import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Order } from '@/types'
import { readStorage, writeStorage } from '@/lib/utils'

/* ==========================================================================
   Orders — the checkout writes the last placed order here so the confirmation
   page can render it, including after a page reload.
   ========================================================================== */

const STORAGE_KEY = 'diva.order.v1'

interface OrderContextValue {
  lastOrder: Order | null
  placeOrder: (order: Order) => void
  clearOrder: () => void
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lastOrder, setLastOrder] = useState<Order | null>(() =>
    readStorage<Order | null>(STORAGE_KEY, null),
  )

  const placeOrder = useCallback((order: Order) => {
    setLastOrder(order)
    writeStorage(STORAGE_KEY, order)
  }, [])

  const clearOrder = useCallback(() => {
    setLastOrder(null)
    writeStorage(STORAGE_KEY, null)
  }, [])

  const value = useMemo(() => ({ lastOrder, placeOrder, clearOrder }), [lastOrder, placeOrder, clearOrder])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used inside <OrderProvider>')
  return ctx
}