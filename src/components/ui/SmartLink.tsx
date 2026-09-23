import { useCallback, useEffect, useRef, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { onIdle, prefetchRoute } from '@/lib/prefetch'

export type PrefetchStrategy = 'intent' | 'viewport' | 'render' | 'none'

interface SmartLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Pick<LinkProps, 'replace' | 'state'> {
  to: string
  children: ReactNode
  /**
   * intent   hover, focus or touch. the default, and the right call almost always.
   * viewport prefetch once the link is on screen and the thread is idle.
   * render   prefetch straight away. reserve this for the one next step in a flow.
   */
  prefetch?: PrefetchStrategy
}

/** small delay so brushing past a link on the way elsewhere costs nothing. */
const INTENT_DELAY = 60

export function SmartLink({
  to,
  children,
  prefetch = 'intent',
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onTouchStart,
  ...rest
}: SmartLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const timer = useRef<number | undefined>(undefined)

  const warm = useCallback(() => {
    void prefetchRoute(to)
  }, [to])

  const scheduleWarm = useCallback(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(warm, INTENT_DELAY)
  }, [warm])

  const cancelWarm = useCallback(() => {
    window.clearTimeout(timer.current)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (prefetch === 'render') return onIdle(warm)

    if (prefetch !== 'viewport') return
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    let cancelIdle = () => {}
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer.disconnect()
          cancelIdle = onIdle(warm)
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelIdle()
    }
  }, [prefetch, warm])

  return (
    <Link
      ref={ref}
      to={to}
      // view transitions give the browser native cross fade between routes
      viewTransition
      onMouseEnter={(event) => {
        if (prefetch === 'intent') scheduleWarm()
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        cancelWarm()
        onMouseLeave?.(event)
      }}
      onFocus={(event) => {
        if (prefetch === 'intent') warm()
        onFocus?.(event)
      }}
      onTouchStart={(event) => {
        if (prefetch === 'intent') warm()
        onTouchStart?.(event)
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
