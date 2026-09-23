import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from './Container'
import { Reveal } from './Reveal'

type Tone = 'canvas' | 'surface' | 'band'

const tones: Record<Tone, string> = {
  canvas: 'bg-canvas text-ink',
  surface: 'bg-surface text-ink',
  band: 'bg-band text-on-ink',
}

export function Section({
  id,
  tone = 'canvas',
  className,
  children,
  bordered = false,
}: {
  id?: string
  tone?: Tone
  className?: string
  children: ReactNode
  bordered?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        'py-section',
        tones[tone],
        bordered && (tone === 'band' ? 'border-band-line hairline-t' : 'hairline-t'),
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}) {
  const dark = tone === 'dark'

  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'text-overline uppercase',
            dark ? 'text-primary' : 'text-primary',
          )}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={cn(
          'text-display-lg measure-tight',
          align === 'center' && 'mx-auto',
          dark ? 'text-on-ink' : 'text-ink',
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'text-lead measure',
            align === 'center' && 'mx-auto',
            dark ? 'text-white/65' : 'text-ink-soft',
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}
