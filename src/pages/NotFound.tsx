import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useSeo } from '@/hooks/useSeo'

/* ==========================================================================
   404
   ========================================================================== */

export function NotFound() {
  useSeo({
    title: 'Page not found',
    description: 'This page could not be found at DIVA STORE.',
  })

  return (
    <div className="pt-16 lg:pt-20">
      <div className="container-lux">
        <EmptyState
          icon={<Compass className="size-6" aria-hidden="true" />}
          eyebrow="Error 404"
          title="This page has left the building."
          description="The page you are looking for does not exist, or it has moved somewhere more elegant. The collection is still here."
          action={{ label: 'Explore all perfumes', to: '/perfumes' }}
          secondaryAction={{ label: 'Back to home', to: '/' }}
          className="min-h-[60vh]"
        />
      </div>
    </div>
  )
}

export default NotFound