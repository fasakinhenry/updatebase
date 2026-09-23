import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  action,
}: {
  icon: Icon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <IconComponent size={26} weight="duotone" aria-hidden="true" />
      </span>

      <h2 className="mt-5 text-display-sm text-ink">{title}</h2>
      <p className="measure mt-2 text-body text-ink-soft">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
