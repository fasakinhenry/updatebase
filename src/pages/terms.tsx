import { LegalLayout, LegalSection } from '@/components/layout/LegalLayout'
import { Seo } from '@/components/seo/Seo'
import { breadcrumbSchema } from '@/components/seo/structuredData'

export default function TermsPage() {
  return (
    <>
      <Seo
        title="terms and conditions"
        description="the terms you agree to when you use updatebase, written in plain language."
        path="/terms"
        jsonLd={breadcrumbSchema([
          { name: 'home', path: '/' },
          { name: 'terms', path: '/terms' },
        ])}
      />

      <LegalLayout title="terms and conditions" updated="23 september 2026">
        <LegalSection heading="the short version">
          <p>
            updatebase is a tool for sharing opportunities with a community. you own what you
            post. be honest, do not post things that hurt people, and do not use the platform to
            scam anyone. if you do, we will close the account.
          </p>
        </LegalSection>

        <LegalSection heading="your account">
          <p>
            you need an account to post, follow or message. you are responsible for what happens
            under it, so keep your sign in details to yourself. you must be at least 16 to use
            updatebase.
          </p>
          <p>
            you can sign in with google or with an email and password. if you use the same email
            for both, they point at the same account.
          </p>
        </LegalSection>

        <LegalSection heading="what you post">
          <p>
            you keep ownership of your updates, testimonials, comments and media. by posting, you
            give us permission to store it and show it to the people it was meant for, including
            in feeds, search and previews when someone shares a link.
          </p>
          <p>do not post:</p>
          <ul>
            <li>opportunities you know are fake, expired or misleading</li>
            <li>anything that asks people to pay you for a job or a scholarship</li>
            <li>someone else's work presented as your own</li>
            <li>harassment, hate speech or content that targets a person</li>
            <li>personal details of other people without their permission</li>
          </ul>
        </LegalSection>

        <LegalSection heading="organizations and delegates">
          <p>
            the person who creates an organization owns it and can transfer it to someone else.
            admins and delegates act on the organization's behalf, and the organization is
            responsible for what they publish under its name.
          </p>
          <p>
            if you invite someone as a delegate, you are vouching for them. you can remove them at
            any time, which stops them posting immediately.
          </p>
        </LegalSection>

        <LegalSection heading="tips and wallets">
          <p>
            members can fund a wallet and tip updates. where that money goes depends on the split
            the organization set: fully to the poster, split by a percentage, or fully to the
            organization.
          </p>
          <p>
            updatebase takes a percentage of each tip as a platform fee. the exact amount is shown
            before the tip is sent. tips are not refundable once they land, so check before you
            send.
          </p>
          <p>
            payouts go to the bank details on the account. we may hold a payout if we think an
            account is being used fraudulently.
          </p>
        </LegalSection>

        <LegalSection heading="ai formatting">
          <p>
            the composer uses ai to reshape what you paste. it can get things wrong. you are
            responsible for reading the result before you publish it, and the published update is
            yours, not ours.
          </p>
        </LegalSection>

        <LegalSection heading="ending things">
          <p>
            you can delete your account whenever you like. we will remove your content, though
            copies may sit in backups for a short while before they roll off.
          </p>
          <p>
            we can suspend an account that breaks these terms. where we reasonably can, we will
            tell you why.
          </p>
        </LegalSection>

        <LegalSection heading="the legal part">
          <p>
            updatebase is provided as is. we work hard to keep it up but we cannot promise it will
            never go down or never lose data, and we are not liable for opportunities that turn
            out to be a waste of your time.
          </p>
          <p>
            these terms are governed by the laws of the Federal Republic of Nigeria. if we change
            them in a way that matters, we will tell you before the change takes effect.
          </p>
        </LegalSection>

        <LegalSection heading="questions">
          <p>
            email <a href="mailto:hello@updatebase.app">hello@updatebase.app</a> and a person will
            reply.
          </p>
        </LegalSection>
      </LegalLayout>
    </>
  )
}
