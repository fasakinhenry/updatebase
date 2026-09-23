import { ArrowBendUpRight, Confetti } from '@phosphor-icons/react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { Avatar } from '@/components/ui/Avatar'

const testimonials = [
  {
    name: 'Ayomide O.',
    handle: 'ayomide',
    seed: 'ayomide-futa',
    body: 'I almost scrolled past this one. saved it, applied on the last day, and I start in january. the fact that the link was right there mattered more than it should.',
    quoted: '🎓 scholarship update · ✅ 31',
    celebrations: 214,
  },
  {
    name: 'Chiamaka N.',
    handle: 'chiamaka',
    seed: 'chiamaka-dev',
    body: 'first hackathon, first win. my team found each other in the comments of the update. we would never have met otherwise.',
    quoted: '🚀 hackathon update · ✅ 18',
    celebrations: 389,
  },
  {
    name: 'Tobi A.',
    handle: 'tobiwrites',
    seed: 'tobi-writes',
    body: 'I run a smaller community and I used to spend sunday nights formatting posts. now it is one paste and I get my evening back.',
    quoted: '💼 internship update · ✅ 7',
    celebrations: 156,
  },
]

export function Testimonials() {
  return (
    <Section tone="canvas" bordered>
      <SectionHeading
        eyebrow="testimonials"
        title={
          <>
            every update has someone on the{' '}
            <span className="emphasis text-primary">other end</span>
          </>
        }
        description="testimonials on updatebase always quote the update they came from. the person who posted it finally gets to see what it did."
      />

      <Reveal as="ul" className="mt-12 grid gap-4 lg:grid-cols-3" stagger={0.07}>
        {testimonials.map((item) => (
          <li key={item.handle} className="h-full">
            <Card className="flex h-full flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <Avatar seed={item.seed} size={40} alt="" />
                <div className="min-w-0">
                  <p className="truncate text-label text-ink">{item.name}</p>
                  <p className="truncate text-caption text-ink-muted">@{item.handle}</p>
                </div>
              </div>

              <p className="flex-1 text-body text-ink-soft">{item.body}</p>

              <div className="flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3 py-2.5">
                <ArrowBendUpRight
                  size={13}
                  weight="bold"
                  aria-hidden="true"
                  className="shrink-0 text-ink-muted"
                />
                <span className="truncate text-caption text-ink-soft">{item.quoted}</span>
              </div>

              <div className="flex items-center gap-1.5 text-caption text-ink-muted">
                <Confetti size={14} weight="fill" aria-hidden="true" className="text-primary" />
                <span className="tabular">{item.celebrations}</span>
                <span>celebrated this</span>
              </div>
            </Card>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}
