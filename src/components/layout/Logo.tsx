import { cn } from '@/lib/cn'

/**
 * the mark is three stacked bars with the top one broadcasting: updates,
 * numbered and sent. the svg itself is decorative and the name is carried by
 * real text, so assistive tech reads one label rather than two.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8', className)} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <rect x="8" y="19" width="16" height="3" rx="1.5" className="fill-on-primary opacity-40" />
      <rect x="8" y="14" width="16" height="3" rx="1.5" className="fill-on-primary opacity-70" />
      <rect x="8" y="9" width="11" height="3" rx="1.5" className="fill-on-primary" />
      <circle cx="22.5" cy="10.5" r="2.5" className="fill-on-primary" />
    </svg>
  )
}

export function Logo({
  className,
  onBand = false,
  showWordmark = true,
}: {
  className?: string
  onBand?: boolean
  showWordmark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span
        className={cn(
          showWordmark
            ? cn(
                'font-display text-[1.0625rem] font-semibold tracking-[-0.03em]',
                onBand ? 'text-on-ink' : 'text-ink',
              )
            : 'sr-only',
        )}
      >
        updatebase
      </span>
    </span>
  )
}
