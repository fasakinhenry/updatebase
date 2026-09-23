import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * one card surface for the whole product: a hairline, a radius and at most a
 * whisper of shadow. no heavy drop shadows anywhere.
 */
export function Card({
  children,
  className,
  interactive = false,
  tone = 'canvas',
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
  tone?: 'canvas' | 'surface' | 'band'
}) {
  return (
    <div
      className={cn(
        'rounded-xl border',
        tone === 'canvas' && 'border-hairline bg-canvas',
        tone === 'surface' && 'border-hairline bg-surface',
        tone === 'band' && 'border-band-line bg-band-soft text-on-ink',
        interactive &&
          'transition-[border-color,transform] duration-base ease-standard hover:-translate-y-0.5 hover:border-hairline-strong',
        className,
      )}
    >
      {children}
    </div>
  )
}
