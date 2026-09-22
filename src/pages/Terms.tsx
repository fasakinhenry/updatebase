import { LegalLayout } from "../components/layout/LegalLayout";

export function Terms() {
  return (
    <LegalLayout title="terms of service" updated="22 september 2026">
      <p>
        these terms govern your use of updatebase, the platform for discovering and posting
        opportunity updates for communities and their members. by creating an account, you agree
        to these terms.
      </p>

      <section>
        <h2>1. your account</h2>
        <p>
          you must provide accurate information when creating an account. you're responsible for
          activity that happens under your account, including updates posted by delegates you add
          to an organization.
        </p>
      </section>

      <section>
        <h2>2. posting updates</h2>
        <ul>
          <li>you're responsible for the accuracy of opportunities you post or format.</li>
          <li>don't post misleading, fraudulent or scam opportunities.</li>
          <li>organizations are responsible for the conduct of their delegates.</li>
          <li>we may remove content that violates these terms or applicable law.</li>
        </ul>
      </section>

      <section>
        <h2>3. wallet and tips</h2>
        <p>
          updatebase lets members fund a wallet and tip updates. organizations decide how tips are
          shared between delegates and the organization. updatebase deducts a service fee from
          tips processed through the platform. tips are voluntary and non-refundable once sent.
        </p>
      </section>

      <section>
        <h2>4. acceptable use</h2>
        <p>
          don't use updatebase to harass others, impersonate a person or organization, or attempt
          to disrupt the platform. we may suspend accounts that violate this policy.
        </p>
      </section>

      <section>
        <h2>5. termination</h2>
        <p>
          you can delete your account at any time. we may suspend or terminate accounts that
          violate these terms, with notice where reasonably possible.
        </p>
      </section>

      <section>
        <h2>6. changes to these terms</h2>
        <p>
          we'll notify you of material changes to these terms before they take effect. continued
          use of updatebase after changes take effect means you accept the updated terms.
        </p>
      </section>

      <section>
        <h2>7. contact</h2>
        <p>
          questions about these terms? reach us at{" "}
          <a href="mailto:hello@updatebase.app" className="text-link underline">
            hello@updatebase.app
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
