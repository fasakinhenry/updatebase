import type { Icon } from '@phosphor-icons/react'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

export interface Feature {
  icon: Icon
  title: string
  description: string
}

export function FeatureGrid({
  features,
  columns = 3,
  tone = 'light',
  className,
}: {
  features: Feature[]
  columns?: 2 | 3
  tone?: 'light' | 'dark'
  className?: string
}) {
  const dark = tone === 'dark'

  return (
    <Reveal
      as="ul"
      className={cn(
        'grid gap-4 sm:grid-cols-2',
        columns === 3 && 'lg:grid-cols-3',
        className,
      )}
      stagger={0.05}
    >
      {features.map(({ icon: Icon, title, description }) => (
        <li key={title} className="h-full">
          <Card
            interactive
            tone={dark ? 'band' : 'canvas'}
            className="flex h-full flex-col gap-3 p-6"
          >
            <span
              className={cn(
                'inline-flex size-10 items-center justify-center rounded-lg',
                dark ? 'bg-white/10 text-primary' : 'bg-primary-soft text-primary',
              )}
            >
              <Icon size={19} weight="duotone" aria-hidden="true" />
            </span>

            <h3 className={cn('text-display-xs', dark ? 'text-on-ink' : 'text-ink')}>{title}</h3>

            <p className={cn('text-body', dark ? 'text-white/60' : 'text-ink-soft')}>
              {description}
            </p>
          </Card>
        </li>
      ))}
    </Reveal>
  )
}
