/**
 * loaded on demand, so the confetti bundle never sits in the landing critical
 * path. silently does nothing when the user has asked for reduced motion.
 */
export async function celebrate() {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const { default: confetti } = await import('canvas-confetti')

  const shared = {
    spread: 70,
    startVelocity: 34,
    ticks: 160,
    gravity: 0.9,
    disableForReducedMotion: true,
    colors: ['#287bff', '#6aa5ff', '#cbdffd', '#0b1220'],
  }

  void confetti({ ...shared, particleCount: 46, origin: { x: 0.2, y: 0.75 }, angle: 60 })
  void confetti({ ...shared, particleCount: 46, origin: { x: 0.8, y: 0.75 }, angle: 120 })
}
