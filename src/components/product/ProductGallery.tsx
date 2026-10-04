import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductShot from './ProductShot'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

/* ==========================================================================
   ProductGallery
   Thumbnails, crossfade between shots, drag/swipe on touch, hover zoom on
   desktop. Keyboard accessible via the thumbnail strip.
   ========================================================================== */

const VIEW_COUNT = 4
const VIEW_LABELS = ['Front', 'Detail', 'Angled', 'Label']

export interface ProductGalleryProps {
  product: Product
  className?: string
}

export function ProductGallery({ product, className }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)
  const touchStart = useRef<number | null>(null)

  const go = useCallback((next: number) => {
    setIndex((next + VIEW_COUNT) % VIEW_COUNT)
  }, [])

  const step = useCallback((delta: number) => {
    setIndex((current) => (current + delta + VIEW_COUNT) % VIEW_COUNT)
  }, [])

  // Arrow keys when the gallery has focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (!target?.closest('[data-gallery]')) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        step(1)
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  const label = `${product.name} — view ${index + 1} of ${VIEW_COUNT}: ${VIEW_LABELS[index]}`

  return (
    <div className={cn('flex flex-col-reverse gap-3 sm:flex-row sm:gap-4', className)} data-gallery>
      {/* Thumbnails */}
      <div
        className="no-scrollbar flex shrink-0 gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible"
        role="tablist"
        aria-label="Product images"
      >
        {Array.from({ length: VIEW_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={VIEW_LABELS[i]}
            onClick={() => go(i)}
            className={cn(
              'relative w-16 shrink-0 overflow-hidden rounded-xs border transition-all duration-300 sm:w-20',
              i === index
                ? 'border-burgundy'
                : 'border-transparent opacity-60 hover:opacity-100',
            )}
          >
            <ProductShot product={product} view={i} frame="square" className="rounded-xs" />
          </button>
        ))}
      </div>

      {/* Main frame */}
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-md">
        <div
          className="group/frame relative overflow-hidden rounded-md bg-champagne/35"
          onTouchStart={(e) => {
            touchStart.current = e.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current
            const end = e.changedTouches[0]?.clientX
            touchStart.current = null
            if (start === null || end === undefined) return
            const delta = end - start
            if (Math.abs(delta) > 45) step(delta < 0 ? 1 : -1)
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) step(1)
                else if (info.offset.x > 60) step(-1)
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <ProductShot
                product={product}
                view={index}
                zoomOnHover
                title={label}
                className="rounded-md"
              />
            </motion.div>
          </AnimatePresence>

          {/* Arrows, desktop */}
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-dark opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-cream hover:text-burgundy group-hover/frame:opacity-100 focus-visible:opacity-100 md:grid"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-dark opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-cream hover:text-burgundy group-hover/frame:opacity-100 focus-visible:opacity-100 md:grid"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>

          {/* Counter */}
          <span className="absolute bottom-4 right-4 rounded-xs bg-cream/85 px-2.5 py-1 font-sans text-[0.5625rem] uppercase tracking-[0.2em] text-dark backdrop-blur-sm">
            {String(index + 1).padStart(2, '0')} / {String(VIEW_COUNT).padStart(2, '0')}
          </span>
        </div>

        <p className="mt-3 text-[0.625rem] uppercase tracking-[0.2em] text-muted sm:hidden">
          Swipe for more views
        </p>
      </div>
    </div>
  )
}

export default ProductGallery