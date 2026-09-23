import { useEffect } from 'react'
import { CheckCircle, Info, WarningCircle, Warning, X } from '@phosphor-icons/react'
import { useToastStore, type Toast, type ToastTone } from '@/stores/toast'
import { cn } from '@/lib/cn'

const icons: Record<ToastTone, typeof Info> = {
  info: Info,
  success: CheckCircle,
  error: WarningCircle,
  warning: Warning,
}

const accents: Record<ToastTone, string> = {
  info: 'text-primary',
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss)
  const Icon = icons[toast.tone]

  useEffect(() => {
    if (toast.duration === Infinity) return
    const timer = window.setTimeout(() => dismiss(toast.id), toast.duration)
    return () => window.clearTimeout(timer)
  }, [toast.id, toast.duration, dismiss])

  return (
    <li
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-hairline',
        'bg-canvas p-4 shadow-raised',
        'motion-safe:animate-[ub-toast-in_260ms_cubic-bezier(0.16,1,0.3,1)_both]',
      )}
    >
      <Icon
        size={18}
        weight="fill"
        aria-hidden="true"
        className={cn('mt-0.5 shrink-0', accents[toast.tone])}
      />

      <div className="min-w-0 flex-1">
        <p className="text-label text-ink">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-body-sm text-ink-soft">{toast.description}</p>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick()
              dismiss(toast.id)
            }}
            className="mt-2 text-label text-primary underline underline-offset-4 hover:text-primary-hover"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="dismiss notification"
        className="-m-1 shrink-0 rounded-md p-1 text-ink-muted transition-colors duration-fast hover:bg-surface hover:text-ink"
      >
        <X size={14} weight="bold" aria-hidden="true" />
      </button>
    </li>
  )
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center px-4 pb-4 sm:inset-x-auto sm:right-0 sm:justify-end sm:px-6 sm:pb-6"
      // polite so a screen reader finishes the current sentence first
      aria-live="polite"
      aria-atomic="false"
    >
      <ul className="flex w-full max-w-sm flex-col gap-2">
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} />
        ))}
      </ul>
    </div>
  )
}
