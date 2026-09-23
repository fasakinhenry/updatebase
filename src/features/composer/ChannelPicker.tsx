import { Lock } from '@phosphor-icons/react'
import { CHANNEL_META } from '@/lib/channels'
import { cn } from '@/lib/cn'
import type { Channel, OrgRole } from '@/types/api'

interface ChannelPickerProps {
  /** channels the organization has actually connected */
  available: Channel[]
  /** channels this member was assigned. empty means updatebase only. */
  allowed: Channel[]
  /** the viewer's role. named to avoid colliding with the aria attribute. */
  viewerRole: OrgRole
  selected: Channel[]
  onChange: (channels: Channel[]) => void
  className?: string
}

export function ChannelPicker({
  available,
  allowed,
  viewerRole,
  selected,
  onChange,
  className,
}: ChannelPickerProps) {
  // owners and admins are never restricted to an assigned set
  const canUse = (channel: Channel) => {
    if (viewerRole !== 'delegate') return true
    if (allowed.length === 0) return channel === 'updatebase'
    return allowed.includes(channel)
  }

  const toggle = (channel: Channel) => {
    onChange(
      selected.includes(channel)
        ? selected.filter((item) => item !== channel)
        : [...selected, channel],
    )
  }

  return (
    <fieldset className={cn('flex flex-col gap-2', className)}>
      <legend className="sr-only">channels to publish to</legend>

      <ul className="flex flex-wrap gap-2">
        {available.map((channel) => {
          const meta = CHANNEL_META[channel]
          const Icon = meta.icon
          const locked = !canUse(channel)
          const active = selected.includes(channel)

          return (
            <li key={channel}>
              <button
                type="button"
                onClick={() => !locked && toggle(channel)}
                disabled={locked}
                aria-pressed={active}
                title={locked ? 'an admin has not given you this channel yet' : undefined}
                className={cn(
                  'inline-flex items-center gap-2 rounded-pill border px-3.5 py-2 text-caption transition-colors duration-fast ease-standard',
                  locked
                    ? 'cursor-not-allowed border-hairline bg-surface text-ink-muted'
                    : active
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-hairline-strong bg-canvas text-ink-soft hover:border-primary hover:text-primary',
                )}
              >
                {locked ? (
                  <Lock size={13} weight="fill" aria-hidden="true" />
                ) : (
                  <Icon size={14} weight="fill" aria-hidden="true" />
                )}
                {meta.label}
              </button>
            </li>
          )
        })}
      </ul>

      {available.length === 1 && (
        <p className="text-caption text-ink-muted">
          connect more platforms in your organization settings to post everywhere at once.
        </p>
      )}
    </fieldset>
  )
}
