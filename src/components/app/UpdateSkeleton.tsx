/**
 * the skeleton matches the card's real geometry, so nothing jumps when the
 * content arrives. that is the difference between a loading state and a
 * layout shift.
 */
export function UpdateSkeleton() {
  return (
    <div className="border-b border-hairline px-4 py-5 sm:px-6" aria-hidden="true">
      <div className="flex items-start gap-3">
        <div className="size-[42px] shrink-0 animate-pulse rounded-full bg-surface-2" />

        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="h-3.5 w-40 animate-pulse rounded bg-surface-2" />
          <div className="h-4 w-52 animate-pulse rounded bg-surface-2" />
          <div className="space-y-2 pt-1">
            <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
            <div className="h-3 w-11/12 animate-pulse rounded bg-surface-2" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-surface-2" />
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-20 animate-pulse rounded-pill bg-surface-2" />
            <div className="h-6 w-24 animate-pulse rounded-pill bg-surface-2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function UpdateSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div>
      <output className="sr-only">loading updates</output>
      {Array.from({ length: count }, (_, index) => (
        <UpdateSkeleton key={index} />
      ))}
    </div>
  )
}
