import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { buttonStyles } from '@/components/ui/Button'
import type { ButtonSize } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

/* ==========================================================================
   WhatsAppLink — every WhatsApp action in the storefront.
   An anchor dressed as a button, because it leaves the app: it opens the
   customer's chat. External links always carry rel="noreferrer noopener".
   ========================================================================== */

export interface WhatsAppLinkProps {
  href: string
  children: ReactNode
  /** Solid green is reserved for the primary checkout action */
  tone?: 'whatsapp' | 'gold' | 'outline' | 'ghost'
  size?: ButtonSize
  block?: boolean
  className?: string
  /** Renders the label for assistive tech only, for round icon buttons */
  iconOnly?: boolean
  'aria-label'?: string
}

export function WhatsAppLink({
  href,
  children,
  tone = 'outline',
  size = 'md',
  block,
  className,
  iconOnly,
  ...rest
}: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(buttonStyles({ variant: tone, size, block }), className)}
      {...rest}
    >
      <WhatsAppIcon className="size-[1.05em] shrink-0" />
      {iconOnly ? <span className="sr-only">{children}</span> : children}
    </a>
  )
}

export default WhatsAppLink
