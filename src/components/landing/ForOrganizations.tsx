import {
  ChartLineUp,
  ChatCircleDots,
  CalendarBlank,
  PencilSimpleLine,
  UsersThree,
  Wallet,
} from '@phosphor-icons/react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { FeatureGrid, type Feature } from './FeatureGrid'

const features: Feature[] = [
  {
    icon: PencilSimpleLine,
    title: 'a composer that knows your style',
    description:
      'give it your rules once. lowercase, your emojis, your headers, your sign off. it follows them on every update and learns from the ones you publish.',
  },
  {
    icon: UsersThree,
    title: 'delegates who can post for you',
    description:
      'invite admins and posters by email, username, phone or a link. assign each one the channels they are allowed to publish to.',
  },
  {
    icon: CalendarBlank,
    title: 'plan ahead, not at midnight',
    description:
      'schedule to every connected channel, build series, and lay the month out on a calendar so nothing goes quiet for a week.',
  },
  {
    icon: ChartLineUp,
    title: 'see what actually landed',
    description:
      'which updates got saved, shared and clicked. follower growth month over month, and a csv when you need the raw list.',
  },
  {
    icon: Wallet,
    title: 'a wallet your community can fill',
    description:
      'members tip the updates that helped them. you decide whether it goes to the poster, to the organization, or splits between both.',
  },
  {
    icon: ChatCircleDots,
    title: 'feedback without a google form',
    description:
      'a button on your page where followers tell you what they need. it lands in one inbox instead of your dms.',
  },
]

export function ForOrganizations() {
  return (
    <Section id="organizations" tone="canvas" bordered>
      <SectionHeading
        eyebrow="for organizations"
        title={
          <>
            run your community like a{' '}
            <span className="emphasis text-primary">newsroom</span>
          </>
        }
        description="everything a convener does by hand today, in one place, with the people who help you built in from the start."
      />

      <FeatureGrid features={features} className="mt-12" />
    </Section>
  )
}
