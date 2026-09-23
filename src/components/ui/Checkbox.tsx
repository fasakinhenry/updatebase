import { useId } from 'react'
import { cn } from '@/lib/cn'

interface CheckboxProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

/**
 * label and input are linked by id rather than nesting, so the accessible name
 * is the label text itself. a nested label with markup inside it leaves some
 * screen readers announcing nothing.
 */
export function Checkbox({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className,
}: CheckboxProps) {
  const id = useId()
  const descriptionId = `${id}-description`

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-describedby={description ? descriptionId : undefined}
        onChange={(event) => onChange(event.target.checked)}
        className={cn(
          'mt-1 size-4 shrink-0 accent-primary',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      />

      <div className="min-w-0">
        <label
          htmlFor={id}
          className={cn(
            'block text-label text-ink',
            disabled ? 'cursor-not-allowed text-ink-muted' : 'cursor-pointer',
          )}
        >
          {label}
        </label>

        {description && (
          <p id={descriptionId} className="mt-1 text-body-sm text-ink-soft">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
