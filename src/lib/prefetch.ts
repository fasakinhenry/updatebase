import { matchRoutes, type RouteObject } from 'react-router-dom'
import { routes } from '@/router/routes'

const done = new Set<string>()
const inFlight = new Map<string, Promise<void>>()

type NetworkInfo = { saveData?: boolean; effectiveType?: string }

/**
 * never spend someone's data plan on a guess. respects data saver and bails on
 * 2g style connections, which matters a lot for the audience this is built for.
 */
function shouldPrefetch(): boolean {
  if (typeof navigator === 'undefined') return false
  const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection
  if (!connection) return true
  if (connection.saveData) return false
  if (connection.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return false
  return true
}

/**
 * warm the code chunk for a route before the click lands, so navigation is a
 * render rather than a download.
 */
export function prefetchRoute(path: string): Promise<void> {
  if (done.has(path)) return Promise.resolve()

  const existing = inFlight.get(path)
  if (existing) return existing

  if (!shouldPrefetch()) return Promise.resolve()

  const matches = matchRoutes(routes as RouteObject[], path)
  if (!matches || matches.length === 0) return Promise.resolve()

  const loads = matches
    .map((match) => (match.route as RouteObject).lazy)
    .filter((lazy): lazy is Exclude<RouteObject['lazy'], undefined> => typeof lazy === 'function')
    .map((lazy) => Promise.resolve((lazy as () => Promise<unknown>)()))

  if (loads.length === 0) {
    done.add(path)
    return Promise.resolve()
  }

  const task = Promise.all(loads)
    .then(() => {
      done.add(path)
    })
    .catch(() => {
      // a failed prefetch is not a user facing problem, the real navigation retries
    })
    .finally(() => {
      inFlight.delete(path)
    })

  inFlight.set(path, task)
  return task
}

/** run work when the main thread is free, with a timeout so it always runs. */
export function onIdle(task: () => void, timeout = 2000) {
  if (typeof window === 'undefined') return () => {}

  const ric = window.requestIdleCallback
  if (typeof ric === 'function') {
    const handle = ric(task, { timeout })
    return () => window.cancelIdleCallback?.(handle)
  }

  const handle = window.setTimeout(task, 1)
  return () => window.clearTimeout(handle)
}
