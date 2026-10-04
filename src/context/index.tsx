import type { ReactNode } from 'react'
import { CartProvider } from './CartContext'
import { OrderProvider } from './OrderContext'
import { ToastProvider } from './ToastContext'
import { UIProvider } from './UIContext'
import { WishlistProvider } from './WishlistContext'

/** Single composition root so App stays declarative. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>
            <UIProvider>{children}</UIProvider>
          </OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  )
}

export { useCart, FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS } from './CartContext'
export { useOrder } from './OrderContext'
export { useToast } from './ToastContext'
export { useUI } from './UIContext'
export { useWishlist } from './WishlistContext'