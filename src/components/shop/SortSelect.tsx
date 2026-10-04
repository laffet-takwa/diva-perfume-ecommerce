import { ChevronDown } from 'lucide-react'
import { SORT_OPTIONS } from '@/hooks/useCatalog'
import type { SortKey } from '@/hooks/useCatalog'
import { cn } from '@/lib/utils'

/* ==========================================================================
   SortSelect — a styled native select keeps full keyboard + screen-reader
   support without reimplementing the listbox.
   ========================================================================== */

export interface SortSelectProps {
  value: SortKey
  onChange: (value: SortKey) => void
  className?: string
  id?: string
}

export function SortSelect({ value, onChange, className, id = 'sort' }: SortSelectProps) {
  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <label htmlFor={id} className="sr-only">
        Sort products
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-10 cursor-pointer appearance-none rounded-xs border border-dark/15 bg-transparent pl-4 pr-9 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-dark transition-colors hover:border-burgundy/50 focus:border-burgundy focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 size-3.5 text-muted"
        aria-hidden="true"
      />
    </div>
  )
}

export default SortSelect