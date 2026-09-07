import { cn } from '../lib/utils.js'

/**
 * Single card skeleton loader with shimmer effect.
 * Matches NewsCard, EventCard, StaffCard, ProgramCard dimensions.
 */
export function CardSkeleton({ aspect = 'aspect-[16/10]', className }) {
  return (
    <div className={cn('card overflow-hidden border border-slate-200/80 bg-white p-0', className)}>
      {/* Image placeholder */}
      <div className={cn('skeleton-shimmer relative w-full overflow-hidden bg-slate-100', aspect)} />

      {/* Content lines */}
      <div className="flex flex-col gap-3 p-6">
        {/* Tag / Date */}
        <div className="flex items-center gap-3">
          <div className="skeleton-shimmer h-5 w-16 rounded-md bg-slate-100" />
          <div className="skeleton-shimmer h-4 w-24 rounded bg-slate-100" />
        </div>

        {/* Title */}
        <div className="skeleton-shimmer mt-1 h-6 w-5/6 rounded-md bg-slate-100" />
        <div className="skeleton-shimmer h-6 w-2/3 rounded-md bg-slate-100" />

        {/* Description */}
        <div className="mt-2 space-y-2">
          <div className="skeleton-shimmer h-3.5 w-full rounded bg-slate-100" />
          <div className="skeleton-shimmer h-3.5 w-4/5 rounded bg-slate-100" />
        </div>

        {/* CTA link */}
        <div className="skeleton-shimmer mt-4 h-4 w-28 rounded bg-slate-100" />
      </div>
    </div>
  )
}

/**
 * Grid of card skeletons.
 */
export function GridSkeleton({ count = 6, cols = 'sm:grid-cols-2 lg:grid-cols-3', aspect = 'aspect-[16/10]' }) {
  return (
    <div className={cn('grid gap-8', cols)} aria-busy="true" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} aspect={aspect} />
      ))}
    </div>
  )
}

/**
 * Detail page skeleton (for single news article, event, or program).
 */
export function DetailSkeleton() {
  return (
    <div className="container-x py-12" aria-busy="true" aria-label="Loading article">
      {/* Breadcrumb skeleton */}
      <div className="skeleton-shimmer mb-6 h-4 w-48 rounded bg-slate-100" />

      {/* Hero title skeleton */}
      <div className="skeleton-shimmer mb-3 h-10 w-3/4 rounded-lg bg-slate-100 sm:h-12" />
      <div className="skeleton-shimmer mb-8 h-5 w-44 rounded bg-slate-100" />

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="skeleton-shimmer aspect-[16/9] w-full rounded-2xl bg-slate-100" />
          <div className="space-y-3 pt-4">
            <div className="skeleton-shimmer h-4 w-full rounded bg-slate-100" />
            <div className="skeleton-shimmer h-4 w-full rounded bg-slate-100" />
            <div className="skeleton-shimmer h-4 w-5/6 rounded bg-slate-100" />
            <div className="skeleton-shimmer h-4 w-4/5 rounded bg-slate-100" />
          </div>
          <div className="space-y-3 pt-4">
            <div className="skeleton-shimmer h-4 w-full rounded bg-slate-100" />
            <div className="skeleton-shimmer h-4 w-11/12 rounded bg-slate-100" />
            <div className="skeleton-shimmer h-4 w-3/4 rounded bg-slate-100" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="skeleton-shimmer h-6 w-32 rounded bg-slate-100" />
            <div className="skeleton-shimmer h-4 w-full rounded bg-slate-100" />
            <div className="skeleton-shimmer h-4 w-5/6 rounded bg-slate-100" />
            <div className="skeleton-shimmer h-10 w-full rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Table skeleton for Downloads, Fees, Calendar, Notices.
 */
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" aria-busy="true">
      {/* Table Header */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-4">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="flex-1 px-3">
            <div className="skeleton-shimmer h-4 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center p-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="flex-1 px-3">
                <div
                  className="skeleton-shimmer h-4 rounded bg-slate-100"
                  style={{ width: `${60 + ((r * 17 + c * 23) % 35)}%` }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
