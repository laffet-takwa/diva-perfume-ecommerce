import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import Logo from './Logo'
import { NAV_ITEMS, SOCIAL_LINKS } from '@/data/navigation'
import { useCart, useUI, useWishlist } from '@/context'
import { Flacon } from '@/components/product/Flacon'
import { BESTSELLERS, HERO_DECANT, getPriceForSize } from '@/data/products'
import { formatPrice } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/motion'

/* ==========================================================================
   MobileMenu — fullscreen navigation, slides in from the left.
   ========================================================================== */

const SOCIAL_INITIAL: Record<string, string> = {
  Instagram: 'IG',
  TikTok: 'TT',
}

export function MobileMenu() {
  const { isMenuOpen, closeMenu, openSearch } = useUI()
  const { count } = useCart()
  const { count: wishlistCount } = useWishlist()
  const spotlight = BESTSELLERS[0]

  return (
    <Drawer open={isMenuOpen} onClose={closeMenu} title="Menu" side="left" bareHeader className="max-w-[22rem]">
      <div className="flex h-full flex-col overflow-y-auto px-6 pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] pt-6">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="eyebrow text-muted">Est. 2026</span>
        </div>

        <nav aria-label="Mobile" className="mt-10">
          <motion.ul variants={staggerContainer(0.05)} initial="hidden" animate="visible" className="flex flex-col">
            {NAV_ITEMS.map((item, i) => (
              <motion.li key={item.to} variants={fadeUp} className="border-b border-noir/8 first:border-t">
                <Link
                  to={item.to}
                  onClick={closeMenu}
                  className="flex items-baseline justify-between py-4 font-display text-[1.375rem] text-dark transition-colors hover:text-noir"
                >
                  <span>{item.label}</span>
                  <span className="font-sans text-[0.5625rem] tracking-[0.2em] text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* In-menu utility links */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to="/wishlist"
            onClick={closeMenu}
            className="rounded-xs border border-noir/12 px-3 py-2 text-[0.625rem] uppercase tracking-[0.18em] text-dark"
          >
            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
          </Link>
          <Link
            to="/account"
            onClick={closeMenu}
            className="rounded-xs border border-noir/12 px-3 py-2 text-[0.625rem] uppercase tracking-[0.18em] text-dark"
          >
            Account
          </Link>
          <button
            type="button"
            onClick={openSearch}
            className="rounded-xs border border-noir/12 px-3 py-2 text-[0.625rem] uppercase tracking-[0.18em] text-dark"
          >
            Search
          </button>
        </div>

        {/* Editorial spotlight */}
        {spotlight && (
          <Link
            to={`/product/${spotlight.slug}`}
            onClick={closeMenu}
            className="group mt-10 flex items-center gap-4 rounded-md border border-noir/10 bg-taupe/30 p-4"
          >
            <Flacon
              art={spotlight.art}
              photo={spotlight.photo}
              photoTone={spotlight.photoTone}
              photoAlt={spotlight.name}
              sizeMl={HERO_DECANT}
              className="h-20 w-16 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <span className="eyebrow text-[0.5rem] text-muted">In the spotlight</span>
              <p className="mt-1 truncate font-display text-sm text-dark">{spotlight.name}</p>
              <p className="text-[0.6875rem] text-muted">
                {HERO_DECANT} ml · {formatPrice(getPriceForSize(spotlight, HERO_DECANT))}
              </p>
            </div>
            <ArrowRight
              className="size-4 shrink-0 text-noir transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        )}

        <div className="mt-auto pt-10">
          <div className="gold-hairline" />
          <p className="mt-4 text-[0.6875rem] leading-relaxed text-muted">
            Decanted to order · Free delivery over 150 DT · Pay cash on delivery.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full border border-noir/12 font-display text-[0.75rem] text-muted transition-colors hover:border-noir hover:text-noir"
              >
                {social.label === 'WhatsApp' ? (
                  <WhatsAppIcon className="size-4 text-whatsapp" />
                ) : (
                  SOCIAL_INITIAL[social.label]
                )}
              </a>
            ))}
          </div>
          <p className="mt-6 font-sans text-[0.5625rem] uppercase tracking-[0.28em] text-muted">
            Poured to order · {count > 0 ? `${count} in your cart` : 'Your cart is empty'}
          </p>
        </div>
      </div>
    </Drawer>
  )
}

export default MobileMenu
