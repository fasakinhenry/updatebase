import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  /** shows a live count against maxLength */
  showCount?: boolean
  value?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, hideLabel = false, showCount = false, className, id, value, ...props },
  ref,
) {
  const generated = useId()
  const fieldId = id ?? generated
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={fieldId} className={cn('text-label text-ink', hideLabel && 'sr-only')}>
          {label}
        </label>
        {showCount && props.maxLength && (
          <span className="tabular text-caption text-ink-muted">
            {(value ?? '').length} / {props.maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={fieldId}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          'w-full rounded-lg border bg-canvas px-3.5 py-2.5 text-body text-ink placeholder:text-ink-muted',
          'transition-[border-color,box-shadow] duration-fast ease-standard focus:outline-none',
          error
            ? 'border-danger focus-visible:border-danger focus-visible:ring-2 focus-visible:ring-danger/25'
            : 'border-hairline-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
          className,
        )}
        {...props}
      />

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
