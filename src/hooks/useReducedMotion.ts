import { useMediaQuery } from './useMediaQuery'

/**
 * false during prerender, so the markup never assumes a preference we cannot
 * know until the browser tells us.
 */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)', false)
}
