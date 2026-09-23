import { useEffect } from 'react'
import { Moon, Sun } from '@phosphor-icons/react'
import { hydrateTheme, useThemeStore } from '@/stores/theme'
import { cn } from '@/lib/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const resolved = useThemeStore((s) => s.resolved)
  const toggle = useThemeStore((s) => s.toggle)
  const syncSystem = useThemeStore((s) => s.syncSystem)

  useEffect(() => {
    hydrateTheme()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', syncSystem)
    return () => mq.removeEventListener('change', syncSystem)
  }, [syncSystem])

  const next = resolved === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      title={`switch to ${next} mode`}
      aria-label={`switch to ${next} mode`}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-lg text-ink-soft',
        'transition-colors duration-fast ease-standard hover:bg-surface hover:text-ink',
        className,
      )}
    >
      {resolved === 'dark' ? (
        <Sun size={18} weight="bold" aria-hidden="true" />
      ) : (
        <Moon size={18} weight="bold" aria-hidden="true" />
      )}
    </button>
  )
}
