import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import Reveal from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'

/* ==========================================================================
   Horizontal carousel — "The Icons"
   Desktop 4 · tablet 3 · mobile 1.2 (peeking, so it reads as scrollable)
   ========================================================================== */

export interface ProductCarouselProps {
  products: Product[]
  title: string
  eyebrow?: string
  index?: string
  action?: { label: string; to: string }
  className?: string
}

export function ProductCarousel({
  products,
  title,
  eyebrow,
  index,
  action,
  className,
}: ProductCarouselProps) {
  const scroller = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    sync()
    const el = scroller.current
    if (!el) return
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync])

  const scrollByPage = (direction: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section className={cn('py-20 md:py-28', className)} aria-labelledby={`${index ?? 'carousel'}-title`}>
      <div className="container-lux">
        <Reveal variant="up" className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            index={index}
            eyebrow={eyebrow}
            title={<span id={`${index ?? 'carousel'}-title`}>{title}</span>}
            action={action}
          />

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <CarouselButton label="Previous products" disabled={atStart} onClick={() => scrollByPage(-1)}>
              <ChevronLeft className="size-4" aria-hidden="true" />
            </CarouselButton>
            <CarouselButton label="Next products" disabled={atEnd} onClick={() => scrollByPage(1)}>
              <ChevronRight className="size-4" aria-hidden="true" />
            </CarouselButton>
          </div>
        </Reveal>
      </div>

      <motion.ul
        ref={scroller}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mt-16 sm:gap-5 md:px-10 xl:px-[max(2.5rem,calc((100vw-88rem)/2+3.5rem))]"
        // 4 / 3 / 1.2 columns
        style={{ scrollPaddingLeft: '1.25rem' }}
      >
        {products.map((product, i) => (
          <li
            key={product.id}
            className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%] xl:w-[calc((100%-3*1.25rem)/4)]"
          >
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: Math.min(i, 3) * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          </li>
        ))}
      </motion.ul>

      {/* Mobile affordances */}
      <div className="container-lux mt-8 flex items-center justify-between sm:hidden">
        <p className="text-[0.625rem] uppercase tracking-[0.2em] text-muted">Swipe to explore</p>
        <div className="flex gap-2">
          <CarouselButton label="Previous products" disabled={atStart} onClick={() => scrollByPage(-1)}>
            <ChevronLeft className="size-4" aria-hidden="true" />
          </CarouselButton>
          <CarouselButton label="Next products" disabled={atEnd} onClick={() => scrollByPage(1)}>
            <ChevronRight className="size-4" aria-hidden="true" />
          </CarouselButton>
        </div>
      </div>
    </section>
  )
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-dark/15 text-dark transition-all duration-300 hover:border-noir hover:text-noir disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </button>
  )
}

export default ProductCarousel