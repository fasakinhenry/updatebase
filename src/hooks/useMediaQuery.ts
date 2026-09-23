import { useCallback, useSyncExternalStore } from 'react'

/**
 * subscribes to a media query the way react wants external state read: a
 * subscribe function plus a snapshot, with a server snapshot for the prerender
 * pass. no setState in an effect, so no extra render on mount.
 */
export function useMediaQuery(query: string, serverFallback = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
