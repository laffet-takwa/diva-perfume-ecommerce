import { useId } from 'react'
import { cn } from '@/lib/utils'

/* ==========================================================================
   DIVA STORE — Editorial art scenes
   Vector art-direction stand-ins for campaign photography. Deterministic,
   lightweight, and tonally locked to the brand palette.
   ========================================================================== */

export type SceneVariant =
  | 'hero'
  | 'women'
  | 'men'
  | 'unisex'
  | 'editorial'
  | 'philosophy'
  | 'atelier'
  | 'ritual'
  | 'story'
  | 'promise'
  | 'journal'

interface ScenePalette {
  from: string
  to: string
  ink: string
  accent: string
  line: string
}

const PALETTES: Record<SceneVariant, ScenePalette> = {
  hero: { from: '#F7F1EA', to: '#E8D8C3', ink: '#4A1728', accent: '#C9A45C', line: '#C98F9F' },
  women: { from: '#F6E7E4', to: '#E2C6C4', ink: '#4A1728', accent: '#C9A45C', line: '#C98F9F' },
  men: { from: '#2A2124', to: '#171315', ink: '#F7F1EA', accent: '#C9A45C', line: '#8E8588' },
  unisex: { from: '#E8D8C3', to: '#4A1728', ink: '#F7F1EA', accent: '#C9A45C', line: '#E3CD9D' },
  editorial: { from: '#EFE4D6', to: '#D9C6B0', ink: '#4A1728', accent: '#C9A45C', line: '#A98E7A' },
  philosophy: { from: '#F7F1EA', to: '#E8D8C3', ink: '#4A1728', accent: '#C9A45C', line: '#8E8588' },
  atelier: { from: '#3B222C', to: '#1B1417', ink: '#F7F1EA', accent: '#C9A45C', line: '#C98F9F' },
  ritual: { from: '#F2E8DE', to: '#DFC9B4', ink: '#4A1728', accent: '#C9A45C', line: '#A98E7A' },
  story: { from: '#EFDDD9', to: '#C9A7A6', ink: '#4A1728', accent: '#C9A45C', line: '#8E8588' },
  promise: { from: '#4A1728', to: '#25121B', ink: '#F7F1EA', accent: '#C9A45C', line: '#C98F9F' },
  journal: { from: '#F4EDE4', to: '#E0CFC0', ink: '#4A1728', accent: '#C9A45C', line: '#8E8588' },
}

export interface ArtSceneProps {
  variant: SceneVariant
  className?: string
  /** Optional grain strength — some scenes read better cleaner */
  grain?: number
}

/** Thin botanical sprig — the recurring motif across campaign art. */
function Sprig({ stroke, opacity = 0.5 }: { stroke: string; opacity?: number }) {
  return (
    <g stroke={stroke} strokeWidth="1.5" fill="none" opacity={opacity} strokeLinecap="round">
      <path d="M0 210C6 150 18 92 44 44" />
      {[
        { y: 190, dir: 1 },
        { y: 150, dir: -1 },
        { y: 112, dir: 1 },
        { y: 78, dir: -1 },
      ].map(({ y, dir }) => (
        <g key={y}>
          <path d={`M${8 + (210 - y) * 0.09} ${y}c14 ${dir * 4} 22 ${dir * 12} 26 ${dir * 24}`} />
          <path
            d={`M${8 + (210 - y) * 0.09} ${y}c-10 ${dir * 3} -18 ${dir * 9} -22 ${dir * 19}`}
            opacity="0.6"
          />
        </g>
      ))}
    </g>
  )
}

export function ArtScene({ variant, className, grain = 0.35 }: ArtSceneProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const p = PALETTES[variant]

  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={p.from} />
          <stop offset="100%" stopColor={p.to} />
        </linearGradient>
        <radialGradient id={`orb-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.72" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.to} stopOpacity="0" />
          <stop offset="100%" stopColor={p.to} stopOpacity="0.55" />
        </linearGradient>
        <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern id={`grainPat-${uid}`} width="180" height="180" patternUnits="userSpaceOnUse">
          <rect width="180" height="180" filter={`url(#grain-${uid})`} opacity="0.55" />
        </pattern>
        <filter id={`blur-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
      </defs>

      <rect width="800" height="1000" fill={`url(#bg-${uid})`} />

      {variant === 'hero' && (
        <g>
          <circle cx="520" cy="470" r="300" fill={`url(#orb-${uid})`} />
          <circle
            cx="520"
            cy="470"
            r="232"
            fill="none"
            stroke={p.accent}
            strokeOpacity="0.45"
            strokeWidth="1"
          />
          <circle
            cx="520"
            cy="470"
            r="278"
            fill="none"
            stroke={p.line}
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <g transform="translate(96 560) rotate(-14)">
            <Sprig stroke={p.ink} opacity={0.28} />
          </g>
          <g transform="translate(690 250) rotate(24) scale(0.7)">
            <Sprig stroke={p.ink} opacity={0.2} />
          </g>
          <circle cx="140" cy="190" r="4" fill={p.accent} opacity="0.7" />
          <circle cx="690" cy="790" r="3" fill={p.accent} opacity="0.6" />
          <circle cx="240" cy="860" r="2.5" fill={p.line} opacity="0.8" />
        </g>
      )}

      {variant === 'women' && (
        <g>
          <circle cx="400" cy="330" r="210" fill={`url(#orb-${uid})`} />
          <g opacity="0.72">
            {[
              { cx: 400, cy: 420, r: 150, rot: 0, fill: '#C98F9F' },
              { cx: 340, cy: 500, r: 120, rot: 24, fill: '#E0AFBA' },
              { cx: 470, cy: 520, r: 104, rot: -18, fill: '#F0D3D8' },
            ].map((petal, i) => (
              <ellipse
                key={petal.r}
                cx={petal.cx}
                cy={petal.cy}
                rx={petal.r}
                ry={petal.r * 0.62}
                fill={petal.fill}
                opacity={0.55 - i * 0.1}
                transform={`rotate(${petal.rot} ${petal.cx} ${petal.cy})`}
              />
            ))}
          </g>
          <path
            d="M120 760c140-90 300-120 460-40"
            fill="none"
            stroke={p.accent}
            strokeOpacity="0.7"
            strokeWidth="1.5"
          />
          <g transform="translate(620 700) rotate(12)">
            <Sprig stroke={p.ink} opacity={0.32} />
          </g>
        </g>
      )}

      {variant === 'men' && (
        <g>
          <g opacity="0.5">
            <rect x="-40" y="180" width="900" height="180" fill="#FFFFFF" opacity="0.04" />
            <rect x="-40" y="420" width="900" height="180" fill="#FFFFFF" opacity="0.06" />
            <rect x="-40" y="660" width="900" height="180" fill="#FFFFFF" opacity="0.03" />
          </g>
          <circle cx="400" cy="500" r="250" fill={`url(#orb-${uid})`} opacity="0.22" />
          <g stroke={p.accent} strokeOpacity="0.55" fill="none" strokeWidth="1">
            <path d="M90 800c90-120 150-240 180-360s90-180 210-240 240-30 330 60" />
            <path d="M60 880c110-140 180-270 210-400s90-190 200-250 220-40 300 40" opacity="0.6" />
            <path d="M140 700c70-100 120-200 140-300s80-150 170-200 190-30 260 40" opacity="0.4" />
          </g>
          <g opacity="0.35" fill={p.line}>
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx={100 + i * 90} cy="930" r="2.5" />
            ))}
          </g>
          <rect x="70" y="70" width="1.5" height="200" fill={p.accent} opacity="0.7" />
        </g>
      )}

      {variant === 'unisex' && (
        <g>
          <rect x="0" y="0" width="400" height="1000" fill="#E8D8C3" opacity="0.55" />
          <g style={{ mixBlendMode: 'multiply' }}>
            <circle cx="330" cy="500" r="200" fill="#C98F9F" opacity="0.5" />
            <circle cx="480" cy="500" r="200" fill="#4A1728" opacity="0.4" />
          </g>
          <circle cx="330" cy="500" r="200" fill="none" stroke={p.accent} strokeWidth="1.5" opacity="0.7" />
          <circle cx="480" cy="500" r="200" fill="none" stroke={p.accent} strokeWidth="1.5" opacity="0.5" />
          <g style={{ mixBlendMode: 'screen' }}>
            <circle cx="405" cy="500" r="200" fill="#FFFFFF" opacity="0.1" />
          </g>
          <circle cx="400" cy="200" r="4" fill={p.accent} />
        </g>
      )}

      {variant === 'editorial' && (
        <g>
          <circle cx="300" cy="360" r="280" fill={`url(#orb-${uid})`} />
          {/* Campaign arch — the recurring "portal" motif of the house */}
          <path
            d="M228 1000V446a172 172 0 0 1 344 0v554Z"
            fill="#4A1728"
            fillOpacity="0.14"
          />
          <path
            d="M228 1000V446a172 172 0 0 1 344 0v554"
            fill="none"
            stroke={p.accent}
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
          <path
            d="M262 1000V452a138 138 0 0 1 276 0v548"
            fill="none"
            stroke={p.line}
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          {/* Silk smoke drifting through the arch */}
          <g fill="none" stroke={p.line} strokeOpacity="0.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <path
                key={i}
                d={`M-40 ${700 + i * 34}c120-70 200-140 300-140s240 60 380-40`}
                strokeWidth={1 + i * 0.35}
                opacity={0.9 - i * 0.09}
              />
            ))}
          </g>
          <path
            d="M600 120c-60 160-40 300 60 420"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="26"
            strokeOpacity="0.35"
            strokeLinecap="round"
            filter={`url(#blur-${uid})`}
          />
          <circle cx="400" cy="446" r="7" fill={p.accent} opacity="0.9" />
          <rect x="600" y="700" width="120" height="1.5" fill={p.accent} />
          <g fill={p.accent} opacity="0.5">
            <circle cx="132" cy="180" r="3" />
            <circle cx="688" cy="252" r="2.5" />
            <circle cx="228" cy="700" r="2" />
          </g>
        </g>
      )}

      {variant === 'philosophy' && (
        <g>
          <circle cx="400" cy="500" r="300" fill={`url(#orb-${uid})`} />
          <g fill="none" stroke={p.line} strokeOpacity="0.35">
            {[120, 190, 260, 330].map((r) => (
              <circle key={r} cx="400" cy="500" r={r} strokeWidth="0.9" />
            ))}
          </g>
          <circle cx="400" cy="500" r="44" fill="none" stroke={p.accent} strokeWidth="1.5" />
          <circle cx="400" cy="500" r="7" fill={p.ink} />
          <g stroke={p.ink} strokeOpacity="0.25" strokeWidth="1">
            <path d="M400 200v60M400 740v60M100 500h60M640 500h60" />
          </g>
          <circle cx="400" cy="500" r="380" fill="none" stroke={p.accent} strokeOpacity="0.3" strokeWidth="0.8" strokeDasharray="2 10" />
        </g>
      )}

      {variant === 'atelier' && (
        <g>
          <circle cx="500" cy="420" r="300" fill="#C9A45C" opacity="0.16" filter={`url(#blur-${uid})`} />
          <g fill={p.line} opacity="0.28">
            {Array.from({ length: 12 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={90 + col * 92} cy={140 + row * 62} r={1.8} />
              )),
            )}
          </g>
          <path d="M120 0l260 1000" stroke="#FFFFFF" strokeWidth="60" strokeOpacity="0.06" />
          <path d="M340 0l260 1000" stroke="#FFFFFF" strokeWidth="24" strokeOpacity="0.05" />
          <rect x="120" y="120" width="1.5" height="180" fill={p.accent} opacity="0.8" />
          <text
            x="120"
            y="900"
            fill={p.ink}
            fillOpacity="0.7"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="150"
            letterSpacing="6"
          >
            01
          </text>
        </g>
      )}

      {variant === 'ritual' && (
        <g>
          <circle cx="400" cy="480" r="290" fill={`url(#orb-${uid})`} />
          <g fill="none" stroke={p.line} strokeOpacity="0.4" strokeWidth="1.2">
            {[290, 240, 190, 140, 90].map((r, i) => (
              <path
                key={r}
                d={`M${400 - r} 480a${r} ${r} 0 0 1 ${r * 2} 0`}
                strokeDasharray={i % 2 ? '4 8' : undefined}
              />
            ))}
          </g>
          {/* Diffusion plume — fine vertical ticks */}
          <g stroke={p.ink} strokeOpacity="0.22" strokeWidth="1">
            {Array.from({ length: 21 }).map((_, i) => {
              const height = 30 + Math.round(90 * Math.sin((i / 20) * Math.PI))
              return <path key={i} d={`M${190 + i * 21} ${480}h0`} transform={`translate(0 -${height})`} />
            })}
          </g>
          <g fill={p.accent} opacity="0.45">
            {Array.from({ length: 21 }).map((_, i) => {
              const height = 30 + Math.round(90 * Math.sin((i / 20) * Math.PI))
              return <circle key={i} cx={190 + i * 21} cy={480 - height} r="2" />
            })}
          </g>
          <circle cx="400" cy="480" r="46" fill="#4A1728" opacity="0.85" />
          <circle cx="400" cy="480" r="46" fill="none" stroke={p.accent} strokeWidth="1.5" />
          <circle cx="400" cy="480" r="18" fill={p.accent} opacity="0.9" />
          <g fill={p.ink} opacity="0.2">
            {[
              [200, 300],
              [640, 660],
              [180, 700],
              [660, 260],
            ].map(([cx, cy]) => (
              <circle key={`${cx}`} cx={cx} cy={cy} r="3" />
            ))}
          </g>
        </g>
      )}

      {variant === 'story' && (
        <g>
          <circle cx="400" cy="400" r="260" fill={`url(#orb-${uid})`} />
          <g transform="translate(150 420) rotate(-8)">
            <Sprig stroke={p.ink} opacity={0.4} />
          </g>
          <g transform="translate(560 300) rotate(18) scale(0.8)">
            <Sprig stroke={p.ink} opacity={0.25} />
          </g>
          <path d="M100 840h600" stroke={p.accent} strokeWidth="1.5" opacity="0.8" />
          <path d="M100 860h300" stroke={p.line} strokeWidth="1" opacity="0.5" />
        </g>
      )}

      {variant === 'promise' && (
        <g>
          <circle cx="400" cy="480" r="320" fill={p.accent} opacity="0.14" filter={`url(#blur-${uid})`} />
          <circle cx="400" cy="480" r="230" fill="none" stroke={p.accent} strokeOpacity="0.4" strokeWidth="1" />
          <circle cx="400" cy="480" r="300" fill="none" stroke={p.line} strokeOpacity="0.22" strokeWidth="1" />
          <g stroke={p.accent} strokeOpacity="0.5" strokeWidth="1">
            <path d="M400 120v120M400 720v120M40 480h120M640 480h120" />
          </g>
          <circle cx="400" cy="480" r="9" fill={p.accent} />
          <g fill={p.accent} opacity="0.5">
            <circle cx="400" cy="120" r="3" />
            <circle cx="640" cy="480" r="3" />
            <circle cx="160" cy="480" r="3" />
            <circle cx="400" cy="840" r="3" />
          </g>
        </g>
      )}

      {variant === 'journal' && (
        <g>
          <circle cx="400" cy="420" r="240" fill={`url(#orb-${uid})`} />
          <g fill="none" stroke={p.line} strokeOpacity="0.4" strokeWidth="1.4">
            <path d="M120 620c90-40 160-120 240-120s150 80 240 40 120-140 120-140" />
            <path d="M120 680c90-40 160-120 240-120s150 80 240 40 120-140 120-140" opacity="0.6" />
          </g>
          <g fill={p.ink} opacity="0.25">
            {Array.from({ length: 4 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <rect key={`${row}-${col}`} x={110 + col * 100} y={780 + row * 26} width="60" height="2" />
              )),
            )}
          </g>
        </g>
      )}

      <rect width="800" height="1000" fill={`url(#fade-${uid})`} />
      {grain > 0 && (
        <rect width="800" height="1000" fill={`url(#grainPat-${uid})`} opacity={grain} />
      )}
    </svg>
  )
}

export default ArtScene