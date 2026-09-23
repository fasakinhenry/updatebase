import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, placeholder, className, id, ...props },
  ref,
) {
  const generated = useId()
  const fieldId = id ?? generated
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-label text-ink">
        {label}
      </label>

      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-lg border bg-canvas pl-3.5 pr-10 text-body text-ink',
            'transition-[border-color,box-shadow] duration-fast ease-standard focus:outline-none',
            error
              ? 'border-danger focus-visible:border-danger focus-visible:ring-2 focus-visible:ring-danger/25'
              : 'border-hairline-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <CaretDown
          size={14}
          weight="bold"
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
        />
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
