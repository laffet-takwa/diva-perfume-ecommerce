import Hero from '@/components/home/Hero'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import CategorySection from '@/components/home/CategorySection'
import PerfumeFinder from '@/components/home/PerfumeFinder'
import EditorialSection from '@/components/home/EditorialSection'
import NewArrivals from '@/components/home/NewArrivals'
import PromoBanner from '@/components/home/PromoBanner'
import ProductCarousel from '@/components/product/ProductCarousel'
import { BESTSELLERS } from '@/data/products'
import { useSeo } from '@/hooks/useSeo'

/* ==========================================================================
   Home — the campaign page.
   ========================================================================== */

export function Home() {
  useSeo({
    canonicalPath: '/',
  })

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategorySection />
      <PerfumeFinder />
      <ProductCarousel
        index="04"
        eyebrow="The Icons"
        title="House bestsellers"
        products={BESTSELLERS}
        action={{ label: 'Shop the icons', to: '/collections?edit=bestsellers' }}
        className="bg-ivory"
      />
      <EditorialSection />
      <NewArrivals />
      <PromoBanner />
    </>
  )
}

export default Home