import { cn } from '@/lib/utils'

/* ==========================================================================
   Skeletons — a slow, low-contrast shimmer that matches the paper palette.
   ========================================================================== */

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('shimmer rounded-xs', className)} />
}

export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[3/4] w-full rounded-md" />
      <Skeleton className="h-2.5 w-16" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-2.5 w-20" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="container-lux grid gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24" aria-hidden="true">
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <div className="flex gap-3 sm:flex-col">
          <Skeleton className="size-16 rounded-xs" />
          <Skeleton className="size-16 rounded-xs" />
          <Skeleton className="size-16 rounded-xs" />
        </div>
        <Skeleton className="aspect-[3/4] flex-1 rounded-md" />
      </div>
      <div className="flex flex-col gap-5 pt-4">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-24 w-full rounded-xs" />
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-xs" />
          <Skeleton className="h-12 w-12 rounded-xs" />
        </div>
        <Skeleton className="h-12 w-full rounded-xs" />
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="container-lux py-20" aria-hidden="true">
      <Skeleton className="h-2.5 w-32" />
      <Skeleton className="mt-5 h-12 w-2/3" />
      <Skeleton className="mt-8 h-4 w-full max-w-lg" />
      <Skeleton className="mt-4 h-4 w-full max-w-md" />
      <div className="mt-14">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  )
}