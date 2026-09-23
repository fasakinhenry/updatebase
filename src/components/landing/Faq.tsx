import { Section, SectionHeading } from '@/components/ui/Section'
import { Accordion } from '@/components/ui/Accordion'
import { Reveal } from '@/components/ui/Reveal'

export const faqItems = [
  {
    question: 'do I have to stop using whatsapp?',
    answer:
      'no. updatebase formats the update and you copy it straight into your group or channel like you always have. the difference is you stop doing the formatting yourself, and the same update also lands on your page here.',
  },
  {
    question: 'will the ai change how my updates sound?',
    answer:
      'only if you want it to. you give it your rules and a few examples of updates you liked, and it follows them. lowercase, your emojis, your headers, your sign off. you can always edit the result before it goes out.',
  },
  {
    question: 'how does the numbering work?',
    answer:
      'your organization has a counter. every update you publish gets the next number automatically, so your community can see how many you have posted without you scrolling back to check.',
  },
  {
    question: 'can other people post for my community?',
    answer:
      'yes. invite them as admins or delegates by email, username, phone number or a link anyone can click. you choose which channels each person is allowed to publish to.',
  },
  {
    question: 'what does it cost?',
    answer:
      'creating an organization and posting updates is free. the only money that moves is tips from members, and updatebase takes a small percentage of those to keep the lights on.',
  },
  {
    question: 'are my messages really private?',
    answer:
      'direct messages are encrypted end to end, so we store the ciphertext and cannot read them. it is not the signal protocol, so it does not rotate keys per message, and we say that plainly rather than overclaim.',
  },
  {
    question: 'I am not in a community, is this still for me?',
    answer:
      'yes. follow the organizations that post what you care about, save what you cannot act on yet, and post a testimonial when something works out. you never have to run anything.',
  },
]

export function Faq() {
  return (
    <Section id="faq" tone="surface" bordered>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading
          eyebrow="faq"
          title={
            <>
              the questions people{' '}
              <span className="emphasis text-primary">actually ask</span>
            </>
          }
          description="if yours is not here, it is probably worth asking us directly."
        />

        <Reveal self>
          <Accordion items={faqItems} />
        </Reveal>
      </div>
    </Section>
  )
}
