import { useEffect, useRef, type ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** hide the visible title but keep it for screen readers */
  hideTitle?: boolean
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

/**
 * built on the native dialog element, so focus trapping, the top layer and
 * escape to close come from the platform instead of a hand rolled trap.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  hideTitle = false,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // clicking the backdrop lands on the dialog element itself, since the
    // backdrop is a pseudo element. bound natively rather than through a react
    // prop, because the platform already gives us escape via onCancel.
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === node) onClose()
    }

    node.addEventListener('click', onBackdropClick)
    return () => node.removeEventListener('click', onBackdropClick)
  }, [onClose])

  useEffect(() => {
    if (!open) return
    // the page behind must not scroll while a modal owns the screen
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby="ub-dialog-title"
      aria-describedby={description ? 'ub-dialog-description' : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className={cn(
        'w-[calc(100vw-2rem)] rounded-2xl border border-hairline bg-canvas p-0 text-ink shadow-raised',
        'backdrop:bg-band/45 backdrop:backdrop-blur-[2px]',
        'motion-safe:open:animate-[ub-dialog-in_240ms_cubic-bezier(0.16,1,0.3,1)]',
        'm-auto',
        sizes[size],
      )}
    >
      <div className="flex items-start justify-between gap-4 p-6 pb-0">
        <div className="min-w-0">
          <h2
            id="ub-dialog-title"
            className={cn('text-display-sm text-ink', hideTitle && 'sr-only')}
          >
            {title}
          </h2>
          {description && (
            <p id="ub-dialog-description" className="mt-1.5 text-body-sm text-ink-soft">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="close dialog"
          className="-m-1.5 shrink-0 rounded-lg p-1.5 text-ink-muted transition-colors duration-fast hover:bg-surface hover:text-ink"
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>

      {children && <div className="p-6">{children}</div>}

      {footer && (
        <div className="flex flex-col-reverse gap-2 border-hairline p-6 pt-0 sm:flex-row sm:justify-end">
          {footer}
        </div>
      )}
    </dialog>
  )
}
