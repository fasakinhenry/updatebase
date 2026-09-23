import { ArrowRight, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Pill } from '@/components/ui/Pill'
import { Reveal } from '@/components/ui/Reveal'
import { ComposerPreview } from './ComposerPreview'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-section-sm pt-12 lg:pt-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <Reveal className="flex flex-col items-start gap-6" immediate>
            <Pill>
              <Lightning size={12} weight="fill" aria-hidden="true" />
              built by a convener, for conveners
            </Pill>

            {/* the measure keeps this to roughly three lines at every width, so
                the headline never turns into a wall on a phone */}
            <h1 className="text-display-2xl measure-tight text-ink">
              stop rewriting every opportunity{' '}
              <span className="emphasis text-primary">by hand</span>
            </h1>

            <p className="measure text-lead text-ink-soft">
              paste a scholarship, a job, a hackathon. updatebase formats it in your community's
              voice, numbers it, signs it with the poster's name and hands it back ready to send.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                href="#waitlist"
                size="lg"
                block
                icon={<ArrowRight size={17} weight="bold" />}
                className="sm:w-auto"
              >
                get early access
              </Button>
              <Button
                href="#how-it-works"
                size="lg"
                variant="secondary"
                block
                icon={null}
                className="sm:w-auto"
              >
                see how it works
              </Button>
            </div>

            <p className="text-body-sm text-ink-muted">
              free while we are in beta. no card, no catch.
            </p>
          </Reveal>

          <Reveal className="flex justify-center lg:justify-end" delay={0.12} immediate>
            <ComposerPreview />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
