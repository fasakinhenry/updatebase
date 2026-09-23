import { useEffect } from 'react'

/**
 * lenis smooth scroll, wired to gsap's ticker so scroll driven animations and
 * the scroll position are updated on the same frame. disabled outright when
 * the user asks for reduced motion.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let dispose = () => {}
    let cancelled = false

    void (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // native momentum on touch feels better than a simulated one
        syncTouch: false,
      })

      const onScroll = () => ScrollTrigger.update()
      lenis.on('scroll', onScroll)

      const raf = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)

      dispose = () => {
        lenis.off('scroll', onScroll)
        gsap.ticker.remove(raf)
        lenis.destroy()
      }
    })()

    return () => {
      cancelled = true
      dispose()
    }
  }, [enabled])
}
