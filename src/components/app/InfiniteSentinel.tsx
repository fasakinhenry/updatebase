import { useEffect, useRef } from 'react'
import { Spinner } from '@/components/ui/Spinner'

/**
 * loads the next page when it comes near the viewport. the margin means the
 * fetch starts before anyone reaches the bottom, so a fast scroll never hits
 * an empty gap.
 */
export function InfiniteSentinel({
  onReach,
  hasMore,
  loading,
}: {
  onReach: () => void
  hasMore: boolean
  loading: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const callback = useRef(onReach)

  useEffect(() => {
    callback.current = onReach
  }, [onReach])

  useEffect(() => {
    const node = ref.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) callback.current()
      },
      { rootMargin: '600px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore])

  if (!hasMore) return null

  return (
    <div ref={ref} className="flex justify-center py-8">
      {loading && <Spinner label="loading more updates" />}
    </div>
  )
}
