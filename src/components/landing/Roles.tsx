import { Crown, PaperPlaneTilt, ShieldCheck } from '@phosphor-icons/react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Card } from '@/components/ui/Card'

const roles = [
  {
    icon: Crown,
    name: 'owner',
    summary: 'the person who created the organization',
    can: ['everything an admin can do', 'transfer the organization to someone else', 'set how tips are split', 'delete the organization'],
  },
  {
    icon: ShieldCheck,
    name: 'admin',
    summary: 'your second in command',
    can: ['invite and remove delegates', 'assign channels to people', 'edit the ai rules and the footer', 'see analytics and the wallet'],
  },
  {
    icon: PaperPlaneTilt,
    name: 'delegate',
    summary: 'the people who post',
    can: ['write and format updates', 'publish to the channels they were given', 'reply as the organization', 'collect tips on what they posted'],
  },
]

export function Roles() {
  return (
    <Section tone="canvas" bordered>
      <SectionHeading
        eyebrow="roles"
        title={
          <>
            you are not the only one posting, so{' '}
            <span className="emphasis text-primary">share the load</span>
          </>
        }
        description="three roles, clear boundaries. people help without you handing over the keys to everything."
      />

      <Reveal as="ul" className="mt-12 grid gap-4 lg:grid-cols-3" stagger={0.07}>
        {roles.map(({ icon: Icon, name, summary, can }) => (
          <li key={name} className="h-full">
            <Card className="flex h-full flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon size={19} weight="duotone" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-display-xs text-ink">{name}</h3>
                  <p className="text-caption text-ink-muted">{summary}</p>
                </div>
              </div>

              <ul className="flex flex-col gap-2 border-t border-hairline pt-4">
                {can.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-body-sm text-ink-soft">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] size-1 shrink-0 rounded-full bg-primary"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}
