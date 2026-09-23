import { ArrowRight, Check, X } from '@phosphor-icons/react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

const before = [
  'find the opportunity somewhere on the internet',
  'open a chat and paste it in with the same instructions again',
  'wait, read it, fix the parts it got wrong',
  'scroll back to find what number the last update was',
  'add the community link and your name by hand',
  'copy it out and send it to the group, then the channel',
]

const after = [
  'paste the opportunity into the composer',
  'your rules are already saved, so hit format',
  'the number, the link and your name are added for you',
  'copy for whatsapp, x, linkedin or instagram in one tap',
  'it lands on your updatebase page at the same time',
]

function Column({
  label,
  tone,
  items,
  note,
}: {
  label: string
  tone: 'before' | 'after'
  items: string[]
  note: string
}) {
  const isAfter = tone === 'after'
  const Icon = isAfter ? Check : X

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border p-6 sm:p-8',
        isAfter ? 'border-primary-line bg-primary-soft' : 'border-hairline bg-surface',
      )}
    >
      <span
        className={cn(
          'text-overline uppercase',
          isAfter ? 'text-primary' : 'text-ink-muted',
        )}
      >
        {label}
      </span>

      <ol className="mt-5 flex flex-1 flex-col gap-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={cn(
                'mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full',
                isAfter ? 'bg-primary text-on-primary' : 'bg-surface-2 text-ink-muted',
              )}
            >
              <Icon size={10} weight="bold" />
            </span>
            <span className={cn('text-body', isAfter ? 'text-ink' : 'text-ink-soft')}>{item}</span>
          </li>
        ))}
      </ol>

      <p
        className={cn(
          'mt-6 border-t pt-4 text-label',
          isAfter ? 'border-primary-line text-primary' : 'border-hairline text-ink-muted',
        )}
      >
        {note}
      </p>
    </div>
  )
}

export function BeforeAfter() {
  return (
    <Section id="how-it-works" tone="canvas">
      <SectionHeading
        eyebrow="the difference"
        title={
          <>
            the same update, <span className="emphasis text-primary">six minutes</span> shorter
          </>
        }
        description="this is the exact loop that made us build updatebase. one of these is a chore you repeat forty times a month. the other is one screen."
      />

      <Reveal className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-6">
        <Column
          label="what you do today"
          tone="before"
          items={before}
          note="about 7 minutes, every single update"
        />

        <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
          <span className="inline-flex size-10 items-center justify-center rounded-full border border-hairline bg-canvas text-ink-muted">
            <ArrowRight size={16} weight="bold" />
          </span>
        </div>

        <Column
          label="what you do on updatebase"
          tone="after"
          items={after}
          note="under a minute, and it gets better as it learns you"
        />
      </Reveal>
    </Section>
  )
}
