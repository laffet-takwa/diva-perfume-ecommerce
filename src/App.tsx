import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileMenu from '@/components/layout/MobileMenu'
import SearchOverlay from '@/components/layout/SearchOverlay'
import WhatsAppFab from '@/components/layout/WhatsAppFab'
import CartDrawer from '@/components/cart/CartDrawer'
import ScrollToTop from '@/components/layout/ScrollToTop'
import CustomCursor from '@/components/ui/CustomCursor'
import { PageSkeleton } from '@/components/ui/Skeleton'
import Home from '@/pages/Home'

/* ==========================================================================
   DIVA STORE — application shell
   Home ships in the initial bundle; every other route is code-split.
   ========================================================================== */

const Shop = lazy(() => import('@/pages/Shop'))
const ProductDetails = lazy(() => import('@/pages/ProductDetails'))
const Collections = lazy(() => import('@/pages/Collections'))
const About = lazy(() => import('@/pages/About'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Cart = lazy(() => import('@/pages/Cart'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'))
const Account = lazy(() => import('@/pages/Account'))
const Help = lazy(() => import('@/pages/Help').then((m) => ({ default: m.Help })))
const HelpIndex = lazy(() => import('@/pages/Help').then((m) => ({ default: m.HelpIndex })))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** A route transition wrapper — soft rise, never a hard cut. */
function Page({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.main
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}

export function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xs focus:bg-noir focus:px-4 focus:py-2.5 focus:text-[0.6875rem] focus:uppercase focus:tracking-[0.16em] focus:text-ivory"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <CustomCursor />
      <Header />

      <div id="main" className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<PageSkeleton />}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <Page>
                    <Home />
                  </Page>
                }
              />
              <Route
                path="/perfumes"
                element={
                  <Page>
                    <Shop />
                  </Page>
                }
              />
              <Route
                path="/perfumes/:gender"
                element={
                  <Page>
                    <Shop />
                  </Page>
                }
              />
              <Route
                path="/product/:slug"
                element={
                  <Page>
                    <ProductDetails />
                  </Page>
                }
              />
              <Route
                path="/collections"
                element={
                  <Page>
                    <Collections />
                  </Page>
                }
              />
              <Route
                path="/about"
                element={
                  <Page>
                    <About />
                  </Page>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <Page>
                    <Wishlist />
                  </Page>
                }
              />
              <Route
                path="/cart"
                element={
                  <Page>
                    <Cart />
                  </Page>
                }
              />
              <Route
                path="/checkout"
                element={
                  <Page>
                    <Checkout />
                  </Page>
                }
              />
              <Route
                path="/order-success"
                element={
                  <Page>
                    <OrderSuccess />
                  </Page>
                }
              />
              <Route
                path="/account"
                element={
                  <Page>
                    <Account />
                  </Page>
                }
              />
              <Route
                path="/help"
                element={
                  <Page>
                    <HelpIndex />
                  </Page>
                }
              />
              <Route
                path="/help/:topic"
                element={
                  <Page>
                    <Help />
                  </Page>
                }
              />
              <Route
                path="*"
                element={
                  <Page>
                    <NotFound />
                  </Page>
                }
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>

      <Footer />

      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <WhatsAppFab />
    </div>
  )
}

export default App