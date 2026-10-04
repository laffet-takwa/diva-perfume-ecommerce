import { motion } from 'framer-motion'
import ProductGrid from '@/components/product/ProductGrid'
import { SectionHeading } from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import { products } from '@/data/products'

/* ==========================================================================
   Featured collection — "The Diva Edit"
   ========================================================================== */

const EDIT = [...products]
  .filter((p) => p.badge === 'BESTSELLER' || p.badge === 'EXCLUSIVE' || p.rating >= 4.8)
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 8)

export function FeaturedProducts() {
  return (
    <section id="the-diva-edit" className="relative scroll-mt-24 py-20 md:py-28 lg:py-32" aria-labelledby="edit-title">
      <div className="container-lux">
        <Reveal variant="up">
          <SectionHeading
            index="02"
            eyebrow="Featured decants"
            title={<span id="edit-title">The Diva Edit</span>}
            subtitle="Eight signatures we would put in your hand first. Pick 3, 5 or 10 ml on the card and add it in one tap."
            action={{ label: 'Shop all fragrances', to: '/perfumes' }}
          />
        </Reveal>

        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 lg:mt-20"
        >
          <ProductGrid products={EDIT} animationKey="edit" />
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts
