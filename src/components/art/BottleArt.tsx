import { useId, type CSSProperties } from 'react'
import type { ProductArt } from '@/types'

/* ==========================================================================
   DIVA STORE — Generated bottle artwork
   Every flacon is drawn as vector art from its recipe, so the catalogue stays
   perfectly cohesive, weighs nothing, and never shows a broken image.
   ========================================================================== */

interface Silhouette {
  body: string
  neck: { x: number; y: number; w: number; h: number }
  cap: string
  /** Y coordinate where the liquid meets the glass shoulder */
  liquidTop: number
  /** Where the label plate sits */
  labelY: number
}

const SILHOUETTES: Record<ProductArt['silhouette'], Silhouette> = {
  rect: {
    body: 'M96 134a16 16 0 0 1 16-16h76a16 16 0 0 1 16 16v164a18 18 0 0 1-18 18h-72a18 18 0 0 1-18-18z',
    neck: { x: 138, y: 96, w: 24, h: 24 },
    cap: 'M124 56h52a4 4 0 0 1 4 4v38a2 2 0 0 1-2 2h-56a2 2 0 0 1-2-2V60a4 4 0 0 1 4-4z',
    liquidTop: 150,
    labelY: 208,
  },
  oval: {
    body: 'M150 116c40 0 62 38 62 96 0 60-26 102-62 102s-62-42-62-102c0-58 22-96 62-96z',
    neck: { x: 141, y: 86, w: 18, h: 32 },
    cap: 'M127 50h46a6 6 0 0 1 6 6v30a4 4 0 0 1-4 4h-50a4 4 0 0 1-4-4V56a6 6 0 0 1 6-6z',
    liquidTop: 152,
    labelY: 212,
  },
  tall: {
    body: 'M116 106h68a8 8 0 0 1 8 8v188a16 16 0 0 1-16 16h-52a16 16 0 0 1-16-16V114a8 8 0 0 1 8-8z',
    neck: { x: 138, y: 84, w: 24, h: 24 },
    cap: 'M126 30h48a4 4 0 0 1 4 4v52a2 2 0 0 1-2 2h-52a2 2 0 0 1-2-2V34a4 4 0 0 1 4-4z',
    liquidTop: 138,
    labelY: 200,
  },
  faceted: {
    body: 'M100 122l50-16 50 16 12 78-24 114h-76l-24-114z',
    neck: { x: 140, y: 88, w: 20, h: 20 },
    cap: 'M120 44h60l-8 46h-44z',
    liquidTop: 140,
    labelY: 200,
  },
}

/** Volume nudges proportions a touch so a bigger decant reads as bigger. */
const SIZE_SCALE: Record<number, number> = { 3: 0.84, 5: 1, 10: 1.09 }

export interface BottleArtProps {
  art: ProductArt
  sizeMl?: number
  className?: string
  style?: CSSProperties
  /** Hide the plinth shadow for use inside tight crops */
  bare?: boolean
  title?: string
}

export function BottleArt({
  art,
  sizeMl = 5,
  className,
  style,
  bare = false,
  title,
}: BottleArtProps) {
  const raw = useId()
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '')
  const s = SILHOUETTES[art.silhouette] ?? SILHOUETTES.rect
  const scale = SIZE_SCALE[sizeMl] ?? 1
  const cx = 150
  const cy = 210

  return (
    <svg
      viewBox="0 0 300 380"
      className={className}
      style={style}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="18%" stopColor={art.glass} />
          <stop offset="62%" stopColor={art.glass} />
          <stop offset="100%" stopColor="#6B5B52" stopOpacity="0.45" />
        </linearGradient>

        <linearGradient id={`juice-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.juice} stopOpacity="0.92" />
          <stop offset="100%" stopColor={art.juice} stopOpacity="1" />
        </linearGradient>

        <linearGradient id={`juiceEdge-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="22%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="78%" stopColor="#0E0E10" stopOpacity="0" />
          <stop offset="100%" stopColor="#0E0E10" stopOpacity="0.28" />
        </linearGradient>

        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={art.cap} stopOpacity="0.7" />
          <stop offset="34%" stopColor={art.cap} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </linearGradient>

        <linearGradient id={`metal-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8F7434" />
          <stop offset="30%" stopColor={art.hardware} />
          <stop offset="55%" stopColor="#F3E3BE" />
          <stop offset="100%" stopColor="#8F7434" />
        </linearGradient>

        <radialGradient id={`halo-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="55%" stopColor={art.backdrop} stopOpacity="0.7" />
          <stop offset="100%" stopColor={art.backdrop} stopOpacity="0" />
        </radialGradient>

        <clipPath id={`clip-${uid}`}>
          <path d={s.body} />
        </clipPath>

        <filter id={`soft-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>

      {/* Ambient halo — the light source behind the flacon */}
      {!bare && (
        <>
          <circle cx={cx} cy={cy - 6} r="140" fill={`url(#halo-${uid})`} />
          <ellipse
            cx={cx}
            cy={cy - 40}
            rx="86"
            ry="104"
            fill="#FFFFFF"
            opacity="0.22"
            filter={`url(#soft-${uid})`}
          />
        </>
      )}

      <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
        {/* Contact shadow */}
        {!bare && (
          <ellipse
            cx={cx}
            cy={322}
            rx={72}
            ry={9}
            fill="#121214"
            opacity="0.16"
            filter={`url(#soft-${uid})`}
          />
        )}

        {/* Neck — drawn first so the shoulder overlaps it cleanly */}
        <rect
          x={s.neck.x}
          y={s.neck.y}
          width={s.neck.w}
          height={s.neck.h + 14}
          fill={art.glass}
        />
        <rect
          x={s.neck.x}
          y={s.neck.y}
          width={s.neck.w}
          height={s.neck.h + 14}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.55"
        />
        <rect
          x={s.neck.x + 2.5}
          y={s.neck.y + 2}
          width="3"
          height={s.neck.h + 6}
          rx="1.5"
          fill="#FFFFFF"
          opacity="0.7"
        />
        <rect
          x={s.neck.x + s.neck.w - 5}
          y={s.neck.y + 3}
          width="2"
          height={s.neck.h + 4}
          rx="1"
          fill="#0E0E10"
          opacity="0.18"
        />

        {/* Glass body */}
        <path d={s.body} fill={`url(#glass-${uid})`} />

        {/* Juice, clipped inside the glass */}
        <g clipPath={`url(#clip-${uid})`}>
          <rect
            x="60"
            y={s.liquidTop}
            width="180"
            height="260"
            fill={`url(#juice-${uid})`}
            opacity="0.88"
          />
          {/* Meniscus */}
          <rect x="60" y={s.liquidTop} width="180" height="4" fill="#FFFFFF" opacity="0.35" />
          <rect
            x="60"
            y={s.liquidTop + 4}
            width="180"
            height="256"
            fill={`url(#juiceEdge-${uid})`}
          />
          {/* Specular band */}
          <rect
            x="104"
            y="100"
            width="16"
            height="240"
            fill="#FFFFFF"
            opacity="0.5"
            filter={`url(#soft-${uid})`}
          />
          <rect x="100" y="110" width="5" height="210" rx="2.5" fill="#FFFFFF" opacity="0.72" />
          {/* Right edge refraction */}
          <rect x="188" y="128" width="4" height="180" rx="2" fill="#FFFFFF" opacity="0.35" />
        </g>

        {/* Glass outline */}
        <path
          d={s.body}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.55"
          strokeWidth="1.25"
        />

        {/* Label plate */}
        <g>
          <rect
            x="118"
            y={s.labelY}
            width="64"
            height="34"
            rx="3"
            fill="#FAF7F1"
            stroke={art.hardware}
            strokeOpacity="0.6"
            strokeWidth="0.75"
          />
          <text
            x="150"
            y={s.labelY + 14}
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="9.5"
            letterSpacing="1.4"
            fill="#0E0E10"
          >
            DIVA
          </text>
          <rect x="140" y={s.labelY + 19} width="20" height="1" fill={art.hardware} />
          <text
            x="150"
            y={s.labelY + 29}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize="4"
            letterSpacing="1.6"
            fill="#7C776F"
          >
            {art.silhouette === 'tall' ? 'EAU DE P.' : 'PARIS'}
          </text>
        </g>

        {/* Collar — bridges the neck and the shoulder */}
        <rect
          x={s.neck.x - 5}
          y={s.neck.y + s.neck.h - 6}
          width={s.neck.w + 10}
          height="8"
          rx="2"
          fill={`url(#metal-${uid})`}
        />
        <rect
          x={s.neck.x - 5}
          y={s.neck.y + s.neck.h - 6}
          width={s.neck.w + 10}
          height="1.5"
          fill="#F3E3BE"
          opacity="0.7"
        />

        {/* Cap */}
        <path d={s.cap} fill={`url(#cap-${uid})`} />
        <path
          d={s.cap}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.24"
          strokeWidth="0.9"
        />
        {/* Cap specular */}
        <rect
          x={s.neck.x + 4}
          y={s.neck.y - 34}
          width="4"
          height="26"
          rx="2"
          fill="#FFFFFF"
          opacity="0.16"
        />
      </g>
    </svg>
  )
}

export default BottleArt