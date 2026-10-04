import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Flacon } from '@/components/product/Flacon'
import { BESTSELLERS, DECANT_SIZE_COPY, DECANT_SIZES, ENTRY_PRICE, products } from '@/data/products'
import type { DecantSize, Product } from '@/types'
import { staggerMedium, fadeUp } from '@/lib/motion'
import { formatPrice } from '@/lib/utils'

/* ==========================================================================
   Shop by Size
   The one decision that defines a decant store: how much do I want? Each tile
   shows its entry price, roughly how many sprays that buys, and a real bottle
   of that volume so the size reads as an object rather than a number.
   ========================================================================== */

interface SizeTile {
  ml: DecantSize
  copy: (typeof DECANT_SIZE_COPY)[DecantSize]
  price: number
  /** The fragrance the entry price belongs to, so the number is verifiable */
  product: Product
  /** Rotates the artwork so the three tiles are not the same bottle thrice */
  showcase: Product
}

/** Three different houses, so the shelf does not read as one fragrance. */
const SHOWCASE_POOL = BESTSELLERS.length >= 3 ? BESTSELLERS : products

function buildTile(ml: DecantSize, index: number): SizeTile {
  const price = ENTRY_PRICE[ml]
  const product = products.find((p) => p.sizes.some((s) => s.ml === ml && s.price === price)) ?? products[0]
  const showcase = SHOWCASE_POOL[index % SHOWCASE_POOL.length] ?? product
  return { ml, copy: DECANT_SIZE_COPY[ml], price, product, showcase }
}

const TILES = DECANT_SIZES.map(buildTile)

/** Plates step warmer as the volume grows — the shelf reads as a gradient. */
const PLATES = [
  'from-ivory via-sand to-taupe/70',
  'from-ivory via-sand to-taupe',
  'from-ivory via-sand to-taupe',
]

export function ShopBySize() {
  return (
    <section
      id="shop-by-size"
      className="relative scroll-mt-24 bg-sand/40 py-20 md:py-28"
      aria-labelledby="sizes-title"
    >
      <div className="container-lux">
        <Reveal variant="up">
          <SectionHeading
            index="01"
            eyebrow="Shop by size"
            title={<span id="sizes-title">Choose your pour</span>}
            subtitle="Every fragrance is decanted fresh into three volumes. Same juice, same atomiser — a different commitment."
            action={{ label: 'All sizes', to: '/perfumes' }}
          />
        </Reveal>

        <motion.ul
          variants={staggerMedium}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6 lg:mt-20"
        >
          {TILES.map((tile, i) => (
            <motion.li key={tile.ml} variants={fadeUp} className="h-full">
              <Link
                to={`/perfumes?size=${tile.ml}`}
                className="group/size flex h-full flex-col overflow-hidden rounded-md border border-noir/10 bg-ivory transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-float focus-visible:outline-offset-4"
              >
                {/* Bottle plate */}
                <div className="relative aspect-[5/4] overflow-hidden">
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-b ${PLATES[i] ?? PLATES[0]}`}
                  />
                  <div className="absolute inset-x-[16%] bottom-[10%] h-16 rounded-[50%] bg-noir/[0.08] blur-xl" />

                  <Flacon
                    art={tile.showcase.art}
                    photo={tile.showcase.photo}
                    photoTone={tile.showcase.photoTone}
                    photoAlt={`${tile.showcase.name} — ${tile.ml} ml decant`}
                    sizeMl={tile.ml}
                    bare
                    className="absolute inset-0 m-auto h-[124%] w-[124%] object-contain p-4 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/size:scale-[1.05]"
                  />

                  {/* Volume badge */}
                  <span className="absolute left-5 top-5 flex size-14 flex-col items-center justify-center rounded-full border border-gold/50 bg-ivory/90 backdrop-blur-sm">
                    <span className="font-display text-[0.9375rem] leading-none text-noir">
                      {tile.ml}
                    </span>
                    <span className="mt-0.5 text-[0.4375rem] uppercase tracking-[0.2em] text-muted">
                      ml
                    </span>
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-6 md:p-7">
                  <span className="eyebrow text-gold">{tile.copy.kicker}</span>
                  <h3 className="font-display text-[1.375rem] text-dark">{tile.copy.label}</h3>
                  <p className="text-[0.8125rem] leading-relaxed text-muted">{tile.copy.blurb}</p>

                  <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.625rem] uppercase tracking-[0.16em] text-muted">
                    <li>{tile.copy.sprays}</li>
                    <li aria-hidden="true" className="h-2.5 w-px bg-gold/50" />
                    <li>{products.length} fragrances</li>
                  </ul>

                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-noir/10 pt-5">
                    <div>
                      <span className="block text-[0.5625rem] uppercase tracking-[0.22em] text-muted">
                        From
                      </span>
                      <span className="mt-0.5 block font-display text-xl text-noir">
                        {formatPrice(tile.price)}
                      </span>
                      <span className="mt-0.5 block text-[0.625rem] text-muted">
                        {tile.product.brand}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 pb-1 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-noir">
                      Shop {tile.ml} ml
                      <ArrowUpRight
                        className="size-3.5 transition-transform duration-400 group-hover/size:-translate-y-0.5 group-hover/size:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

export default ShopBySize
