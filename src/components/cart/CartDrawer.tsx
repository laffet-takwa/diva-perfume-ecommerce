import { AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { ButtonLink } from '@/components/ui/Button'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { useCart, useToast } from '@/context'

/* ==========================================================================
   CartDrawer — slides in from the right when an item is added.
   ========================================================================== */

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, lines, removeFromCart, count } = useCart()
  const { notify } = useToast()

  const handleRemove = (key: string, name: string) => {
    removeFromCart(key)
    notify(`${name} removed from your bag.`, 'info')
  }

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      title="Your bag"
      labelId="cart-drawer-title"
      footer={
        lines.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <ButtonLink to="/checkout" onClick={closeDrawer} variant="primary" size="lg" block arrow>
              Checkout
            </ButtonLink>
            <ButtonLink to="/cart" onClick={closeDrawer} variant="ghost" size="md" block>
              View bag{count > 0 ? ` (${count})` : ''}
            </ButtonLink>
            <p className="mt-2 text-center text-[0.625rem] uppercase tracking-[0.18em] text-muted">
              Secure payment · Free returns within 14 days
            </p>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <span className="mb-6 flex size-16 items-center justify-center rounded-full border border-gold/40 text-noir/60">
            <ShoppingBag className="size-6" aria-hidden="true" />
          </span>
          <p className="eyebrow mb-3 text-muted">Empty</p>
          <h3 className="font-display text-2xl text-dark">Your bag is empty.</h3>
          <p className="mt-3 max-w-[28ch] text-[0.8125rem] leading-relaxed text-muted">
            Your fragrance wishlist is waiting. Start with the Diva Edit.
          </p>
          <ButtonLink
            to="/perfumes"
            onClick={closeDrawer}
            variant="primary"
            size="md"
            arrow
            className="mt-8"
          >
            Explore perfumes
          </ButtonLink>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-5 px-6 py-6">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <CartItem
                  key={line.key}
                  line={line}
                  onRemove={() => handleRemove(line.key, line.name)}
                />
              ))}
            </AnimatePresence>
          </ul>

          <div className="px-6 pb-6">
            <div className="gold-hairline mb-6" />
            <CartSummary />
          </div>
        </>
      )}

      {lines.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <ButtonLink to="/checkout" onClick={closeDrawer} variant="primary" size="lg" block arrow>
            Checkout
          </ButtonLink>
          <ButtonLink to="/cart" onClick={closeDrawer} variant="ghost" size="md" block>
            View bag{count > 0 ? ` (${count})` : ''}
          </ButtonLink>
          <p className="mt-2 text-center text-[0.625rem] uppercase tracking-[0.18em] text-muted">
            Secure payment · Free returns within 14 days
          </p>
        </div>
      )}
    </Drawer>
  )
}

export default CartDrawer