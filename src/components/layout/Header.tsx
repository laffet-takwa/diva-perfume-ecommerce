import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { NAV_ITEMS, FREE_SHIPPING_COPY } from '@/data/navigation'
import { useCart, useUI, useWishlist } from '@/context'
import Logo from './Logo'
import { cn } from '@/lib/utils'

/* ==========================================================================
   Header
   Transparent over the home hero, then solid ivory with a blur + hairline.
   ========================================================================== */

export function Header() {
  const location = useLocation()
  const { openSearch, openMenu } = useUI()
  const { count, openDrawer } = useCart()
  const { count: wishlistCount } = useWishlist()

  const [scrolled, setScrolled] = useState(false)
  const [bounce, setBounce] = useState(false)
  const previousCount = useRef(count)

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bounce the bag icon only when the count actually grows.
  useEffect(() => {
    const grew = count > previousCount.current
    previousCount.current = count
    if (!grew) return
    setBounce(true)
    const id = window.setTimeout(() => setBounce(false), 620)
    return () => window.clearTimeout(id)
  }, [count])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Announcement strip — retracts on scroll to give the hero its full height */}
      <motion.div
        initial={false}
        animate={{ height: scrolled ? 0 : 34, opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden bg-noir text-ivory"
      >
        <div className="flex h-[34px] items-center justify-center gap-2 border-b border-gold/40 px-4">
          <span className="eyebrow text-[0.5625rem] text-ivory/85 sm:text-[0.625rem]">
            <span className="hidden sm:inline">{FREE_SHIPPING_COPY} — </span>
            Free delivery • Easy returns • Secure payment
          </span>
        </div>
      </motion.div>

      <div
        className={cn(
          'relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          transparent
            ? 'bg-transparent'
            : 'border-b border-gold/25 bg-ivory/85 shadow-[0_1px_24px_-16px_rgba(12,12,14,0.45)] backdrop-blur-xl',
        )}
      >
        {/* Mobile: three columns so the wordmark stays optically centred;
            desktop: a flex row with the nav in the middle. */}
        <div className="container-lux grid h-16 grid-cols-[auto_1fr_auto] items-center gap-2 lg:flex lg:h-20 lg:justify-between lg:gap-4">
          {/* Mobile: menu trigger */}
          <button
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            className="-ml-2 justify-self-start rounded-xs p-2 text-dark transition-colors hover:text-noir lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          <Link
            to="/"
            aria-label="Diva Store — home"
            className={cn(
              'justify-self-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:w-[15rem] lg:justify-self-auto',
              scrolled ? 'opacity-100' : 'opacity-95',
            )}
          >
            <Logo />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'link-underline text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300',
                        isActive ? 'text-noir' : 'text-dark/70 hover:text-noir',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-self-end gap-1 lg:w-[15rem] lg:justify-end">
            <IconAction label="Search" onClick={openSearch}>
              <Search className="size-[1.15rem]" aria-hidden="true" />
            </IconAction>

            {/* Account and wishlist live in the fullscreen menu below lg so the
                mobile wordmark keeps its optical centre. Max-width variants are
                used because `.inline-flex` is emitted after `.hidden`. */}
            <IconAction label="Account" to="/account" className="max-lg:hidden">
              <User className="size-[1.15rem]" aria-hidden="true" />
            </IconAction>

            <IconAction label="Wishlist" to="/wishlist" className="max-lg:hidden">
              <Heart className="size-[1.15rem]" aria-hidden="true" />
              <Count value={wishlistCount} />
            </IconAction>

            <motion.div animate={bounce ? { scale: [1, 1.28, 0.94, 1] } : {}} transition={{ duration: 0.55 }}>
              <IconAction label="Shopping bag" onClick={openDrawer}>
                <ShoppingBag className="size-[1.15rem]" aria-hidden="true" />
                <Count value={count} />
              </IconAction>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  )
}

/* --------------------------------------------------------------------------
   Pieces
   -------------------------------------------------------------------------- */

function IconAction({
  label,
  onClick,
  to,
  children,
  className,
}: {
  label: string
  onClick?: () => void
  to?: string
  children: React.ReactNode
  className?: string
}) {
  const inner = (
    <>
      {children}
      <span className="sr-only">{label}</span>
    </>
  )
  const classes = cn(
    'relative -mr-0.5 inline-flex size-10 items-center justify-center rounded-xs text-dark transition-colors duration-300 hover:text-noir',
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={label}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={classes} aria-label={label}>
      {inner}
    </button>
  )
}

function Count({ value }: { value: number }) {
  return (
    <AnimatePresence>
      {value > 0 && (
        <motion.span
          key={value}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-noir text-[0.5rem] font-medium text-ivory"
        >
          {value > 9 ? '9+' : value}
          <span className="sr-only"> items</span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export default Header