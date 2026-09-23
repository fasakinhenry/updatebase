import { useEffect, useState } from 'react'

export function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback)

  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
