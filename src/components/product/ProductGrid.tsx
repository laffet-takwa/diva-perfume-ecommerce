import { motion } from 'framer-motion'
import type { Product } from '@/types'
import ProductCard from './ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { fadeUp, staggerMedium } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ==========================================================================
   ProductGrid — responsive 2 / 3 / 4 column layout with stagger.
   Changing `animationKey` replays the entrance (filters, sorting).
   ========================================================================== */

export interface ProductGridProps {
  products: Product[]
  columns?: 3 | 4
  className?: string
  /** Change this to replay the entrance animation (filters, sorting) */
  animationKey?: string | number
  loading?: boolean
  skeletonCount?: number
}

const COLUMN_CLASSES: Record<3 | 4, string> = {
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
}

export function ProductGrid({
  products,
  columns = 4,
  className,
  animationKey,
  loading = false,
  skeletonCount = 8,
}: ProductGridProps) {
  if (loading) return <ProductGridSkeleton count={skeletonCount} />

  return (
    <motion.div
      key={animationKey}
      variants={staggerMedium}
      initial="hidden"
      animate="visible"
      className={cn(
        'grid gap-x-4 gap-y-10 sm:gap-x-5 lg:gap-x-6 lg:gap-y-14',
        COLUMN_CLASSES[columns],
        className,
      )}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={fadeUp} layout="position" className="flex">
          <ProductCard product={product} className="w-full" />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProductGrid