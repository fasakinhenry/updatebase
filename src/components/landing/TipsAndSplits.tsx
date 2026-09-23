import { Buildings, HandCoins, UserCircle } from '@phosphor-icons/react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'

const modes = [
  {
    icon: UserCircle,
    title: 'the poster keeps it',
    split: '100% to the poster',
    description:
      'the update shows who wrote it. when someone tips, it lands in that person\'s wallet. good for communities where posting is volunteer work.',
  },
  {
    icon: HandCoins,
    title: 'split it',
    split: 'you choose the percentage',
    description:
      'set the share once, for example 30% to the organization and 70% to the poster. every tip follows that rule automatically.',
  },
  {
    icon: Buildings,
    title: 'the organization keeps it',
    split: '100% to the organization',
    description:
      'tips go to the community account. you decide separately how and when to share it with the people who post.',
  },
]

export function TipsAndSplits() {
  return (
    <Section id="tips" tone="band" bordered>
      <SectionHeading
        eyebrow="tips"
        tone="dark"
        title={
          <>
            the people who post get{' '}
            <span className="emphasis text-primary">paid for it</span>
          </>
        }
        description="members fund a wallet and tip the updates that actually helped them. you set where that money goes before the first one arrives."
      />

      <Reveal as="ul" className="mt-12 grid gap-4 lg:grid-cols-3" stagger={0.07}>
        {modes.map(({ icon: Icon, title, split, description }) => (
          <li key={title} className="h-full">
            <Card tone="band" className="flex h-full flex-col gap-3 p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white/10 text-primary">
                <Icon size={19} weight="duotone" aria-hidden="true" />
              </span>

              <h3 className="text-display-xs text-on-ink">{title}</h3>
              <p className="text-label text-primary">{split}</p>
              <p className="text-body text-white/60">{description}</p>
            </Card>
          </li>
        ))}
      </Reveal>

      <Reveal className="mt-8" self>
        <p className="measure-wide text-body-sm text-white/50">
          updatebase takes a small percentage of each tip to keep the platform running. you see
          the exact amount before anything moves, and so does the person sending it.
        </p>
      </Reveal>
    </Section>
  )
}
