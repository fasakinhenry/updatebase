import { LegalLayout } from "../components/layout/LegalLayout";

export function Privacy() {
  return (
    <LegalLayout title="privacy policy" updated="22 september 2026">
      <p>
        this policy explains what information updatebase collects, how we use it and the choices
        you have.
      </p>

      <section>
        <h2>1. information we collect</h2>
        <ul>
          <li>account details: name, username, email, date of birth and profile photo or avatar.</li>
          <li>onboarding answers: your interests, stage and goals, used to curate your bio and feed.</li>
          <li>location: only with your permission, used to recommend nearby opportunities.</li>
          <li>content you post: updates, testimonials, comments and messages.</li>
          <li>usage data: pages visited, features used and device information.</li>
        </ul>
      </section>

      <section>
        <h2>2. how we use your information</h2>
        <ul>
          <li>to run your feed, notifications and the AI formatting editor.</li>
          <li>to recommend organizations, updates and people to follow.</li>
          <li>to process wallet top ups and tips.</li>
          <li>to keep updatebase secure and prevent abuse.</li>
        </ul>
      </section>

      <section>
        <h2>3. cookies</h2>
        <p>
          we use essential cookies to keep you signed in, and optional analytics cookies to
          understand how updatebase is used. you can manage your preferences at any time from the
          cookie banner or the link in our footer.
        </p>
      </section>

      <section>
        <h2>4. sharing your information</h2>
        <p>
          we don't sell your personal information. we share data with service providers that help
          us run updatebase, such as hosting and payment processing, under agreements that protect
          your data.
        </p>
      </section>

      <section>
        <h2>5. your choices</h2>
        <ul>
          <li>update or delete your account information from your profile settings.</li>
          <li>set your profile to private or limit who can see it.</li>
          <li>turn off direct messages for a period of time.</li>
          <li>request a copy or deletion of your data by contacting us.</li>
        </ul>
      </section>

      <section>
        <h2>6. contact</h2>
        <p>
          for privacy questions or requests, email{" "}
          <a href="mailto:privacy@updatebase.app" className="text-link underline">
            privacy@updatebase.app
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
