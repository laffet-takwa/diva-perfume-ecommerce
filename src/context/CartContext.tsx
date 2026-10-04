import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { CartLine, DecantSize, ShippingMethod } from '@/types'
import { getPriceForSize, getProductById, HERO_DECANT, DECANT_SIZES } from '@/data/products'
import { productLineKey, readStorage, writeStorage } from '@/lib/utils'

/* ==========================================================================
   Cart state
   One line per product + volume. Persisted to localStorage.
   ========================================================================== */

/* v2 — the decant model added `fullBottlePrice` to every line, so a stored bag
   from the full-bottle era is dropped rather than mis-priced. */
const STORAGE_KEY = 'diva.cart.v2'

/** Decants are light, so free delivery after three or so. */
export const FREE_SHIPPING_THRESHOLD = 150

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    label: 'Standard delivery',
    detail: '2 – 4 business days',
    price: 5,
    etaDays: [2, 4],
  },
  {
    id: 'express',
    label: 'Express delivery',
    detail: 'Next business day',
    price: 12,
    etaDays: [1, 1],
  },
]

interface CartState {
  lines: CartLine[]
}

type CartAction =
  | { type: 'add'; line: CartLine }
  | { type: 'remove'; key: string }
  | { type: 'quantity'; key: string; quantity: number }
  | { type: 'replace'; lines: CartLine[] }
  | { type: 'clear' }

function isValidLine(line: CartLine): boolean {
  if (typeof line?.productId !== 'string') return false
  const product = getProductById(line.productId)
  if (!product) return false
  // Price and reference price are re-derived from the catalogue, never trusted.
  return (
    DECANT_SIZES.includes(line.ml as DecantSize) &&
    line.unitPrice === getPriceForSize(product, line.ml) &&
    line.fullBottlePrice === product.fullBottle.price
  )
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.lines.find((l) => l.key === action.line.key)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === action.line.key
              ? { ...l, quantity: Math.min(l.quantity + action.line.quantity, 20) }
              : l,
          ),
        }
      }
      return { lines: [...state.lines, action.line] }
    }
    case 'remove':
      return { lines: state.lines.filter((l) => l.key !== action.key) }
    case 'quantity':
      return {
        lines: state.lines.map((l) =>
          l.key === action.key
            ? { ...l, quantity: Math.min(Math.max(action.quantity, 0), 20) }
            : l,
        ),
      }
    case 'replace':
      return { lines: action.lines }
    case 'clear':
      return { lines: [] }
    default:
      return state
  }
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  /** What the same decants would cost inside the full bottles */
  fullBottleTotal: number
  /** Difference between the two — the number every surface wants to show */
  savings: number
  shipping: number
  freeShippingRemaining: number
  freeShippingProgress: number
  qualifiesForFreeShipping: boolean
  isDrawerOpen: boolean
  addToCart: (productId: string, ml?: number, quantity?: number) => void
  removeFromCart: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    lines: readStorage<CartLine[]>(STORAGE_KEY, []).filter(isValidLine),
  }))
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    writeStorage(STORAGE_KEY, state.lines)
  }, [state.lines])

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      dispatch({ type: 'replace', lines: readStorage<CartLine[]>(STORAGE_KEY, []).filter(isValidLine) })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addToCart = useCallback((productId: string, ml = HERO_DECANT, quantity = 1) => {
    const product = getProductById(productId)
    if (!product) return
    dispatch({
      type: 'add',
      line: {
        key: productLineKey(product.id, ml),
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.art,
        photo: product.photo,
        photoTone: product.photoTone,
        ml,
        unitPrice: getPriceForSize(product, ml),
        fullBottlePrice: product.fullBottle.price,
        quantity: Math.min(Math.max(quantity, 1), 20),
      },
    })
    setDrawerOpen(true)
  }, [])

  const removeFromCart = useCallback((key: string) => dispatch({ type: 'remove', key }), [])

  const updateQuantity = useCallback(
    (key: string, quantity: number) => dispatch({ type: 'quantity', key, quantity }),
    [],
  )

  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((sum, l) => sum + l.quantity, 0)
    const subtotal = state.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
    const fullBottleTotal = state.lines.reduce(
      (sum, l) => sum + l.fullBottlePrice * l.quantity,
      0,
    )
    const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)
    return {
      lines: state.lines,
      count,
      subtotal,
      fullBottleTotal,
      savings: Math.max(fullBottleTotal - subtotal, 0),
      shipping: subtotal > 0 ? SHIPPING_METHODS[0].price : 0,
      freeShippingRemaining: remaining,
      freeShippingProgress: Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1),
      qualifiesForFreeShipping: subtotal >= FREE_SHIPPING_THRESHOLD,
      isDrawerOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
    }
  }, [state.lines, isDrawerOpen, addToCart, removeFromCart, updateQuantity, clearCart, openDrawer, closeDrawer])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}