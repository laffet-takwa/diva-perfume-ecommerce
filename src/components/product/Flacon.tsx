import { cn } from '@/lib/utils'
import { BottleArt } from '@/components/art/BottleArt'
import type { ProductArt } from '@/types'

/* ==========================================================================
   Flacon — one renderer for every product image in the storefront.

   A product either has real studio photography or a drawn flacon recipe. Both
   are rendered here so the cart, the finder, the search overlay and the cards
   stay pixel-consistent, and so a photograph shot on white drops into the
   house plate instead of sitting on it as a white rectangle.
   ========================================================================== */

export interface FlaconProps {
  art: ProductArt
  photo?: string
  photoAlt?: string
  /** `light` = white studio backdrop (multiply), `dark` = a full-frame shot */
  photoTone?: 'light' | 'dark'
  sizeMl?: number
  /** Multiplier on the drawn flacon; photography is always fully bled */
  zoom?: number
  /** Drifts the crop so several views can be taken from one photograph */
  focus?: string
  title?: string
  bare?: boolean
  className?: string
}

export function Flacon({
  art,
  photo,
  photoAlt,
  photoTone = 'light',
  sizeMl,
  zoom = 1,
  focus = 'center',
  title,
  bare = false,
  className,
}: FlaconProps) {
  if (photo) {
    const dark = photoTone === 'dark'
    return (
      <img
        src={photo}
        alt={photoAlt ?? title ?? ''}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{ objectPosition: focus }}
        className={cn(
          'size-full select-none',
          dark ? 'object-cover' : 'object-contain mix-blend-multiply',
          className,
        )}
      />
    )
  }

  return (
    <BottleArt
      art={art}
      sizeMl={sizeMl}
      title={title}
      bare={bare}
      className={cn('h-auto w-full', zoom !== 1 && 'origin-center', className)}
      style={zoom !== 1 ? { transform: `scale(${zoom})` } : undefined}
    />
  )
}

export default Flacon