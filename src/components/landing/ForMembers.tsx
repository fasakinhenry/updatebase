import {
  BookmarkSimple,
  ChatTeardropText,
  Compass,
  Confetti,
  Lightning,
  Rss,
} from '@phosphor-icons/react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { FeatureGrid, type Feature } from './FeatureGrid'

const features: Feature[] = [
  {
    icon: Rss,
    title: 'a feed that fits you',
    description:
      'for you learns what you care about. following is strictly the communities you chose. same updates, your call on how you see them.',
  },
  {
    icon: Compass,
    title: 'search the way you talk',
    description:
      'ask for remote internships for final year students and get real results, not a keyword match. filter to people or organizations.',
  },
  {
    icon: BookmarkSimple,
    title: 'save it for when you can focus',
    description:
      'bookmark anything and come back to it grouped by month, sorted how you like, with the date you saved it.',
  },
  {
    icon: Confetti,
    title: 'tell people it worked',
    description:
      'got the scholarship? post a testimonial that quotes the update that got you there. the person who posted it gets to see it.',
  },
  {
    icon: ChatTeardropText,
    title: 'talk to people, privately',
    description:
      'direct messages with end to end encryption, voice notes and media. turn them off whenever you need the quiet.',
  },
  {
    icon: Lightning,
    title: 'tip what helped you',
    description:
      'fund your wallet and send something small to the person who posted the update that changed your year.',
  },
]

export function ForMembers() {
  return (
    <Section id="members" tone="surface" bordered>
      <SectionHeading
        eyebrow="for everyone else"
        title={
          <>
            stop missing things because you{' '}
            <span className="emphasis text-primary">scrolled past</span>
          </>
        }
        description="opportunities get buried in group chats at 2am. here they stay findable, saveable and yours."
      />

      <FeatureGrid features={features} className="mt-12" />
    </Section>
  )
}
