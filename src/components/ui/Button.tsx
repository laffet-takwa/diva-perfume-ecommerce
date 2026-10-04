import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

/* ==========================================================================
   Button — the single interactive primitive of the design system.
   Burgundy ink on cream paper; gold only ever appears as an accent.
   ========================================================================== */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-md font-sans font-medium uppercase tracking-[0.16em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:cursor-not-allowed disabled:opacity-45 select-none'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-burgundy text-cream hover:bg-burgundy-deep active:bg-burgundy-deep shadow-[0_1px_2px_rgba(23,19,21,0.12)] hover:shadow-[0_14px_30px_-16px_rgba(74,23,40,0.85)]',
  secondary:
    'bg-cream text-burgundy hover:bg-champagne active:bg-champagne shadow-[0_1px_2px_rgba(23,19,21,0.08)]',
  outline:
    'border border-burgundy/35 bg-transparent text-burgundy hover:border-burgundy hover:bg-burgundy/5 active:bg-burgundy/10',
  ghost: 'bg-transparent text-dark hover:bg-dark/5 active:bg-dark/10',
  gold: 'bg-gold text-dark hover:bg-[#B8934B] active:bg-[#A9863F]',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[0.625rem]',
  md: 'h-11 px-6 text-[0.6875rem]',
  lg: 'h-[3.25rem] px-8 text-xs',
}

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
  children?: ReactNode
  /** Adds the two-arrow "SHOP NOW → →" motion */
  arrow?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  /** Renders as a block element with inline-flex, for cards and strips */
  block?: boolean
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth,
  block,
  className,
}: Pick<BaseProps, 'variant' | 'size' | 'fullWidth' | 'block' | 'className'> = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', block && 'w-full', className)
}

/** The signature arrow pair: one arrow always, a second fades in on hover. */
export function ButtonArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative flex items-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'group-hover:translate-x-1',
        className,
      )}
    >
      <svg viewBox="0 0 16 10" className="h-[9px] w-4 fill-none stroke-current" strokeWidth="1.4">
        <path d="M0 5h14M10 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg
        viewBox="0 0 16 10"
        className="absolute left-0 top-0 h-[9px] w-4 -translate-x-3 fill-none stroke-current opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-hover:opacity-45"
        strokeWidth="1.4"
      >
        <path d="M0 5h14M10 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, className, children, arrow, iconLeft, iconRight, block, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonStyles({ variant, size, fullWidth, block, className })} {...rest}>
      {iconLeft}
      {children}
      {arrow ? <ButtonArrow /> : iconRight}
    </button>
  )
})

export type ButtonLinkProps = BaseProps & {
  to: string
  onClick?: () => void
  'aria-label'?: string
}

export function ButtonLink({
  to,
  variant,
  size,
  fullWidth,
  block,
  className,
  children,
  arrow,
  iconLeft,
  iconRight,
  onClick,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={buttonStyles({ variant, size, fullWidth, block, className })}
      {...rest}
    >
      {iconLeft}
      {children}
      {arrow ? <ButtonArrow /> : iconRight}
    </Link>
  )
}