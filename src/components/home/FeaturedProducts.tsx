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
  .slice(0, 4)

export function FeaturedProducts() {
  return (
    <section id="the-diva-edit" className="relative py-20 md:py-28 lg:py-32" aria-labelledby="edit-title">
      <div className="container-lux">
        <Reveal variant="up">
          <SectionHeading
            index="01"
            eyebrow="The Diva Edit"
            title={<span id="edit-title">Curated for every version of you</span>}
            subtitle="Four signatures we cannot stop recommending. Each one is a complete mood, bottled."
            action={{ label: 'View all perfumes', to: '/perfumes' }}
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