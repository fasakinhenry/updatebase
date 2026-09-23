import { LegalLayout, LegalSection } from '@/components/layout/LegalLayout'
import { Seo } from '@/components/seo/Seo'
import { breadcrumbSchema } from '@/components/seo/structuredData'

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title="privacy policy"
        description="what updatebase collects, why we collect it, and what you can do about it."
        path="/privacy"
        jsonLd={breadcrumbSchema([
          { name: 'home', path: '/' },
          { name: 'privacy', path: '/privacy' },
        ])}
      />

      <LegalLayout title="privacy policy" updated="23 september 2026">
        <LegalSection heading="the short version">
          <p>
            we collect what we need to show you relevant opportunities and nothing we cannot
            justify. we do not sell your data. your direct messages are encrypted and we cannot
            read them.
          </p>
        </LegalSection>

        <LegalSection heading="what we collect">
          <ul>
            <li>
              <strong>account details.</strong> your name, username, email, gender and date of
              birth. if you sign in with google we get your email, name and profile picture.
            </li>
            <li>
              <strong>your onboarding answers.</strong> the interests, stage and goals you share
              in the conversation, which we use to write your bio and to pick what shows in your
              feed.
            </li>
            <li>
              <strong>approximate location.</strong> only if you grant it. we use it to rank
              opportunities that are near you or open to where you are.
            </li>
            <li>
              <strong>what you do here.</strong> what you open, save, react to and follow, so the
              for you feed gets better instead of staying random.
            </li>
            <li>
              <strong>technical basics.</strong> device type, browser and ip address, for
              security and for keeping the service up.
            </li>
          </ul>
        </LegalSection>

        <LegalSection heading="what we do not do">
          <ul>
            <li>we do not sell your personal data to anyone</li>
            <li>we do not read your direct messages, because we cannot</li>
            <li>we do not track you across other websites</li>
            <li>we do not share your email with the organizations you follow</li>
          </ul>
        </LegalSection>

        <LegalSection heading="direct messages">
          <p>
            messages are encrypted on your device before they leave it, and only the person you
            are talking to can decrypt them. we store the encrypted version. this means we cannot
            recover your message history if you lose your key.
          </p>
          <p>
            to be precise about what this is: we use x25519 key agreement with
            xchacha20-poly1305. it is genuine end to end encryption, but it does not rotate keys
            on every message the way signal does, so it does not give per message forward secrecy.
          </p>
        </LegalSection>

        <LegalSection heading="cookies">
          <p>
            essential cookies keep you signed in and keep the account secure. those cannot be
            turned off because the product does not work without them.
          </p>
          <p>
            analytics and personalization cookies are off until you turn them on. you choose in
            the banner on your first visit, and you can change it any time from the cookies page.
          </p>
        </LegalSection>

        <LegalSection heading="who else touches your data">
          <p>we use a small number of services to run updatebase:</p>
          <ul>
            <li>mongodb atlas, to store your account and content</li>
            <li>google, for sign in, if you choose it</li>
            <li>an ai provider, to format updates and write bios from what you type</li>
            <li>cloudinary, to store images, video and voice notes</li>
            <li>resend, to send invites and account emails</li>
            <li>a payment processor, to move money in and out of wallets</li>
          </ul>
          <p>
            each one only receives what it needs to do its job.
          </p>
        </LegalSection>

        <LegalSection heading="what you can ask for">
          <ul>
            <li>a copy of everything we hold about you</li>
            <li>a correction, if something is wrong</li>
            <li>deletion of your account and content</li>
            <li>an export of your organization's updates and follower list</li>
          </ul>
          <p>
            email <a href="mailto:privacy@updatebase.app">privacy@updatebase.app</a> and we will
            act within 30 days.
          </p>
        </LegalSection>

        <LegalSection heading="how long we keep things">
          <p>
            account data stays while your account is open. when you delete it, content goes
            straight away and backups roll off within 30 days. wallet and tip records are kept
            longer because financial records have to be.
          </p>
        </LegalSection>

        <LegalSection heading="questions">
          <p>
            email <a href="mailto:privacy@updatebase.app">privacy@updatebase.app</a>. a person
            reads it.
          </p>
        </LegalSection>
      </LegalLayout>
    </>
  )
}
