import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

const stats = [
  { value: '2,400+', label: 'students reached weekly' },
  { value: '40+', label: 'updates posted a month' },
  { value: '6 min', label: 'saved on every update' },
  { value: '5', label: 'channels from one paste' },
]

export function ProofStrip() {
  return (
    <section aria-label="by the numbers" className="border-y border-hairline bg-surface py-8">
      <Container>
        <Reveal className="grid grid-cols-2 gap-6 md:grid-cols-4" stagger={0.06}>
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="tabular text-display-md text-ink">{stat.value}</span>
              <span className="text-body-sm text-ink-muted">{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
