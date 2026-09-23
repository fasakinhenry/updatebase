import { useId, useRef, useState } from 'react'
import {
  Copy,
  InstagramLogo,
  LinkedinLogo,
  Megaphone,
  WhatsappLogo,
  XLogo,
} from '@phosphor-icons/react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { toast } from '@/stores/toast'
import { cn } from '@/lib/cn'

interface Channel {
  id: string
  label: string
  icon: typeof WhatsappLogo
  note: string
  body: string
}

const channels: Channel[] = [
  {
    id: 'whatsapp',
    label: 'whatsapp',
    icon: WhatsappLogo,
    note: 'numbered, signed, link at the bottom',
    body: `🎓 scholarship update

✅ 42
mastercard foundation scholars program 2026 is open for undergraduate study.

fully funded. covers tuition, accommodation, monthly stipend and a laptop.
open to african students. closes march 30.

🔗 apply: bit.ly/mcf-scholars-26
💬 join us: bit.ly/futatechies2

HENQSOFT from FUTA Techies`,
  },
  {
    id: 'x',
    label: 'x',
    icon: XLogo,
    note: 'trimmed to fit, hook first',
    body: `fully funded undergrad scholarship, applications open 🎓

mastercard foundation scholars program 2026
→ tuition, housing, stipend and a laptop
→ open to african students
→ closes march 30

apply: bit.ly/mcf-scholars-26`,
  },
  {
    id: 'linkedin',
    label: 'linkedin',
    icon: LinkedinLogo,
    note: 'longer form, professional register',
    body: `Applications are open for the Mastercard Foundation Scholars Program 2026.

This is a fully funded undergraduate scholarship covering tuition, accommodation, a monthly stipend and a laptop. It is open to African students with strong academic records and demonstrated financial need.

Applications close on March 30.

Apply here: bit.ly/mcf-scholars-26

Posted by HENQSOFT for FUTA Techies.`,
  },
  {
    id: 'instagram',
    label: 'instagram',
    icon: InstagramLogo,
    note: 'caption plus the hashtags you use',
    body: `fully funded scholarship alert 🎓

mastercard foundation scholars program 2026 is open. tuition, housing, monthly stipend and a laptop, all covered.

open to african students. closes march 30.

link in bio 🔗

#scholarships #futatechies #studyabroad #fullyfunded #opportunities`,
  },
  {
    id: 'updatebase',
    label: 'updatebase',
    icon: Megaphone,
    note: 'posted to your page the moment you publish',
    body: `🎓 scholarship update

✅ 42
mastercard foundation scholars program 2026 is open for undergraduate study.

fully funded. covers tuition, accommodation, monthly stipend and a laptop.
open to african students. closes march 30.

🔗 apply: bit.ly/mcf-scholars-26

HENQSOFT from FUTA Techies`,
  },
]

export function ChannelShowcase() {
  const [active, setActive] = useState(0)
  const tabsId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const current = channels[active]!

  /** left and right move between tabs, which is what a tablist owes a keyboard user. */
  const onTabKeyDown = (event: React.KeyboardEvent) => {
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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current.body)
      toast.success('copied', `formatted for ${current.label}`)
    } catch {
      toast.error('could not copy', 'your browser blocked clipboard access')
    }
  }

  return (
    <Section tone="surface" bordered>
      <SectionHeading
        eyebrow="one paste, every channel"
        title={
          <>
            write it once. it fits{' '}
            <span className="emphasis text-primary">everywhere</span> you post.
          </>
        }
        description="each platform has its own habits. updatebase reshapes the same update to match them, so you are not retyping the same thing five times."
      />

      <Reveal className="mt-12 flex flex-col gap-6" stagger={0.1}>
        <div
          role="tablist"
          aria-label="channel formats"
          className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {channels.map((channel, index) => {
            const selected = index === active
            const Icon = channel.icon
            return (
              <button
                key={channel.id}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                role="tab"
                id={`${tabsId}-tab-${channel.id}`}
                aria-selected={selected}
                aria-controls={`${tabsId}-panel-${channel.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={onTabKeyDown}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-pill border px-4 py-2.5 text-label',
                  'transition-colors duration-fast ease-standard',
                  selected
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-hairline bg-canvas text-ink-soft hover:border-hairline-strong hover:text-ink',
                )}
              >
                <Icon size={15} weight="fill" aria-hidden="true" />
                {channel.label}
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id={`${tabsId}-panel-${current.id}`}
          aria-labelledby={`${tabsId}-tab-${current.id}`}
          tabIndex={0}
          className="rounded-2xl border border-hairline bg-canvas"
        >
          <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3.5">
            <p className="text-caption text-ink-muted">{current.note}</p>
            <button
              type="button"
              onClick={copy}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-caption font-semibold text-primary transition-colors duration-fast hover:bg-primary-soft"
            >
              <Copy size={13} weight="bold" aria-hidden="true" />
              copy
            </button>
          </div>

          {/* the update keeps its own casing and line breaks, it is the
              community's voice not our interface copy */}
          <pre className="overflow-x-auto whitespace-pre-wrap break-words p-5 font-body text-body text-ink">
            {current.body}
          </pre>
        </div>
      </Reveal>
    </Section>
  )
}
