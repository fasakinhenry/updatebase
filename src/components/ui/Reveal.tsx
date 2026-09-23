import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface RevealProps {
  children: ReactNode
  className?: string
  as?: ElementType
  /** distance in px the content travels up into place */
  y?: number
  delay?: number
  stagger?: number
  /** animate the element itself rather than its children */
  self?: boolean
  /** play immediately instead of waiting for the element to scroll into view */
  immediate?: boolean
}

/**
 * reveals children on scroll. above the fold content passes `immediate` so the
 * hero never waits on a scroll trigger, which keeps lcp honest.
 */
export function Reveal({
  children,
  className,
  as: Tag = 'div',
  y = 18,
  delay = 0,
  stagger = 0.07,
  self = false,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const targets = self ? node : Array.from(node.children)
    if (Array.isArray(targets) && targets.length === 0) return

    let cleanup = () => {}
    let cancelled = false

    void (async () => {
      const { default: gsap } = await import('gsap')
      if (cancelled) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(targets, { opacity: 1, y: 0, clearProps: 'willChange' })
        return
      }

      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay,
            stagger,
            ease: 'power3.out',
            clearProps: 'willChange',
            ...(immediate
              ? {}
              : { scrollTrigger: { trigger: node, start: 'top 88%', once: true } }),
          },
        )
      }, node)

      cleanup = () => ctx.revert()
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [y, delay, stagger, self, immediate])

  return (
    <Tag ref={ref} data-reveal={self ? 'self' : ''} className={cn(className)}>
      {children}
    </Tag>
  )
}
