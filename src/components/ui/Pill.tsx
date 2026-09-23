import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'primary' | 'neutral' | 'success' | 'inverse'

const tones: Record<Tone, string> = {
  primary: 'bg-primary-soft text-primary border-primary-line',
  neutral: 'bg-surface text-ink-soft border-hairline',
  success: 'bg-success-soft text-success border-transparent',
  inverse: 'bg-white/10 text-white/80 border-white/15',
}

export function Pill({
  children,
  tone = 'primary',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-caption',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
