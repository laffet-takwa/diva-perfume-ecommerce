import Hero from '@/components/home/Hero'
import ShopBySize from '@/components/home/ShopBySize'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import WhyDiva from '@/components/home/WhyDiva'
import ScentShelf from '@/components/home/ScentShelf'
import WhatsAppBanner from '@/components/home/WhatsAppBanner'
import { useSeo } from '@/hooks/useSeo'

/* ==========================================================================
   Home — the conversion page, in the order a first-time customer decides.
     1  Hero            the promise and the price
     2  Shop by size    how much do I want
     3  Featured        what to start with
     4  Why DIVA        why trust us
     5  Best sellers    proof, filterable by who it is for
     6  WhatsApp        how to actually order
   ========================================================================== */

export function Home() {
  useSeo({
    canonicalPath: '/',
  })

  return (
    <>
      <Hero />
      <ShopBySize />
      <FeaturedProducts />
      <WhyDiva />
      <ScentShelf />
      <WhatsAppBanner />
    </>
  )
}

export default Home
