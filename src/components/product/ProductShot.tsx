import { Flacon } from '@/components/product/Flacon'
import type { Product } from '@/types'

/* ==========================================================================
   ProductShot — a framed "photograph" of a flacon.
   Real product photography when the product has it, otherwise the drawn
   bottle. Each view index is a different crop / light setup of the same
   subject, which gives the PDP gallery a full set of images from one asset.
   ========================================================================== */

/** Crops taken from a single photograph, one per gallery view */
const PHOTO_VIEWS = ['center 42%', 'center 55%', 'center 35%', 'center 60%']

interface ViewSpec {
  /** Framing: how far in / out, and where the bottle sits */
  scale: number
  x: number
  y: number
  backdropOpacity: number
  floor: boolean
}

const VIEWS: ViewSpec[] = [
  { scale: 1, x: 0, y: 0, backdropOpacity: 1, floor: true },
  { scale: 1.34, x: -7, y: 4, backdropOpacity: 0.55, floor: false },
  { scale: 0.88, x: 11, y: -3, backdropOpacity: 0.85, floor: true },
  { scale: 1.16, x: 4, y: 8, backdropOpacity: 0.35, floor: false },
]

const FRAMES = {
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
  wide: 'aspect-[4/3]',
} as const

export interface ProductShotProps {
  product: Product
  view?: number
  className?: string
  /** Adds the 1.05 hover zoom used on desktop */
  zoomOnHover?: boolean
  title?: string
  frame?: keyof typeof FRAMES
}

export function ProductShot({
  product,
  view = 0,
  className,
  zoomOnHover = false,
  title,
  frame = 'portrait',
}: ProductShotProps) {
  const spec = VIEWS[view % VIEWS.length]
  const { art } = product
  // Real photography fills the plate; the drawn bottle keeps the framed stage.
  const photo = product.photo
  const dark = product.photoTone === 'dark'

  return (
    <div
      className={[
        'relative overflow-hidden',
        FRAMES[frame],
        zoomOnHover ? 'group/shot' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Backdrop — photography brings its own, so the stage drops away */}
      {!photo && (
        <>
          <div
            className="absolute inset-0"
            style={{ background: art.backdrop, opacity: spec.backdropOpacity }}
            aria-hidden="true"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgba(255,255,255,0.7),transparent_70%)]"
          />
          <div aria-hidden="true" className="grain-layer opacity-25" />

          {/* Light pool behind the flacon */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[42%] size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-3xl"
          />
        </>
      )}

      {/* Plinth */}
      {spec.floor && !photo && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(23,19,21,0.10)] to-transparent"
        />
      )}

      {/* Framing offset → view scale → hover zoom, kept on separate layers so
          inline transforms never fight the CSS transition. */}
      {photo ? (
        <div className="absolute inset-0 overflow-hidden">
          <Flacon
            art={art}
            photo={photo}
            photoAlt={product.photoAlt ?? title}
            photoTone={product.photoTone}
            title={title}
            bare
            focus={PHOTO_VIEWS[view % PHOTO_VIEWS.length]}
            className={`size-full ${dark ? '' : 'p-[7%]'} ${
              zoomOnHover
                ? 'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/shot:scale-[1.05]'
                : ''
            }`}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `translate(${spec.x}%, ${spec.y}%)` }}
        >
          <div
            style={{
              transform: `scale(${spec.scale})`,
              transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <Flacon
              art={art}
              title={title}
              bare
              className={`h-auto w-[92%] max-w-none ${
                zoomOnHover
                  ? 'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/shot:scale-[1.04]'
                  : ''
              }`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductShot