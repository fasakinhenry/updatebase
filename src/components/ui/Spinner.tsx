import { cn } from '@/lib/cn'

export function Spinner({
  label,
  size = 20,
  className,
}: {
  /** announced to screen readers. always say what is loading. */
  label: string
  size?: number
  className?: string
}) {
  return (
    <output className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="shrink-0 animate-spin rounded-full border-2 border-hairline-strong border-t-primary"
      />
      <span className="sr-only">{label}</span>
    </output>
  )
}
