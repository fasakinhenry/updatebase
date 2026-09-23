import { useId } from 'react'
import { cn } from '@/lib/cn'

export interface ConsentOptionProps {
  label: string
  description: string
  checked: boolean
  locked?: boolean
  onChange?: (checked: boolean) => void
  size?: 'sm' | 'md'
}

export function ConsentOption({
  label,
  description,
  checked,
  locked = false,
  onChange,
  size = 'sm',
}: ConsentOptionProps) {
  const id = useId()
  const descriptionId = `${id}-description`

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-hairline transition-colors duration-fast',
        size === 'sm' ? 'p-4' : 'p-5',
        locked ? 'bg-surface' : 'hover:border-hairline-strong',
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={locked}
        aria-describedby={descriptionId}
        onChange={(event) => onChange?.(event.target.checked)}
        className={cn(
          'mt-0.5 size-4 shrink-0 accent-primary',
          locked ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      />

      <div className="min-w-0">
        <label
          htmlFor={id}
          className={cn(
            'block text-ink',
            size === 'sm' ? 'text-label' : 'text-display-xs',
            locked ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {label}
          {locked && (
            <span className="ml-2 text-caption font-normal text-ink-muted">always on</span>
          )}
        </label>

        <p
          id={descriptionId}
          className={cn('mt-1 text-ink-soft', size === 'sm' ? 'text-body-sm' : 'text-body')}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
