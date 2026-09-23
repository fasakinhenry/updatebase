import { useId, forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const control =
  'w-full rounded-lg border bg-canvas px-3.5 text-body text-ink placeholder:text-ink-muted ' +
  'transition-[border-color,box-shadow] duration-fast ease-standard ' +
  'focus:outline-none focus-visible:outline-none ' +
  'disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink-muted'

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  hint?: string
  error?: string
  /** render the label for screen readers only, e.g. a single field inline form */
  hideLabel?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, hideLabel = false, leading, trailing, className, id, ...props },
  ref,
) {
  const generated = useId()
  const inputId = id ?? generated
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className={cn('text-label text-ink', hideLabel && 'sr-only')}>
        {label}
      </label>

      <div className="relative">
        {leading && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-muted"
          >
            {leading}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            control,
            'h-11',
            error
              ? 'border-danger focus-visible:border-danger focus-visible:ring-2 focus-visible:ring-danger/25'
              : 'border-hairline-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
            leading && 'pl-10',
            trailing && 'pr-10',
            className,
          )}
          {...props}
        />

        {trailing && (
          <span className="absolute inset-y-0 right-3.5 flex items-center text-ink-muted">
            {trailing}
          </span>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="text-caption text-ink-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  )
})
