import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** false during prerender, so nothing animates before we know the preference. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    setReduced(mq.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
