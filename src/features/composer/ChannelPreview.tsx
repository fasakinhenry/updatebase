import { useId, useRef, useState } from 'react'
import { Copy } from '@phosphor-icons/react'
import { CHANNEL_META } from '@/lib/channels'
import { cn } from '@/lib/cn'
import type { Channel } from '@/types/api'

interface ChannelPreviewProps {
  renderings: Record<string, string>
  limits: Record<string, number>
  onCopy: (text: string, label: string) => void
}

export function ChannelPreview({ renderings, limits, onCopy }: ChannelPreviewProps) {
  const channels = Object.keys(renderings) as Channel[]
  const [active, setActive] = useState(0)
  const tabsId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const current = channels[active]
  if (!current) return null

  const text = renderings[current] ?? ''
  const limit = limits[current]
  const meta = CHANNEL_META[current]
  const overLimit = limit !== undefined && text.length > limit

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = channels.length - 1
    let next: number | null = null

    if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1
    if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last
    if (next === null) return

    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="rounded-2xl border border-hairline bg-canvas">
      <div
        role="tablist"
        aria-label="channel versions"
        className="flex gap-1.5 overflow-x-auto border-b border-hairline p-3 [scrollbar-width:none]"
      >
        {channels.map((channel, index) => {
          const selected = index === active
          const Icon = CHANNEL_META[channel].icon

          return (
            <button
              key={channel}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              role="tab"
              id={`${tabsId}-tab-${channel}`}
              aria-selected={selected}
              aria-controls={`${tabsId}-panel-${channel}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-caption transition-colors duration-fast',
                selected
                  ? 'bg-primary-soft font-medium text-primary'
                  : 'text-ink-muted hover:bg-surface hover:text-ink',
              )}
            >
              <Icon size={14} weight="fill" aria-hidden="true" />
              {CHANNEL_META[channel].label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`${tabsId}-panel-${current}`}
        aria-labelledby={`${tabsId}-tab-${current}`}
        tabIndex={0}
        className="p-4"
      >
        {/* the post keeps its own casing, since it is the community's voice */}
        <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap break-words font-body text-body text-ink">
          {text}
        </pre>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-hairline pt-3">
          <span
            className={cn(
              'tabular text-caption',
              overLimit ? 'font-semibold text-danger' : 'text-ink-muted',
            )}
          >
            {text.length}
            {limit !== undefined && ` / ${limit}`}
            {overLimit && ' over the limit'}
          </span>

          <button
            type="button"
            onClick={() => onCopy(text, meta.label)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-caption font-semibold text-primary transition-colors duration-fast hover:bg-primary-soft"
          >
            <Copy size={13} weight="bold" aria-hidden="true" />
            copy
          </button>
        </div>
      </div>
    </div>
  )
}
