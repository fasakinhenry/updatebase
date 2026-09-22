import { ArrowRight, Broadcast, UsersThree } from "@phosphor-icons/react";
import { Container } from "../ui/Container";
import { SectionBand } from "../ui/SectionBand";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";

const organizationFeatures = [
  "an AI editor that learns your brand rules, headers and footer over time",
  "delegate roles so members can post on your behalf, credited automatically",
  "repurpose one update across whatsapp, x, instagram and linkedin",
  "content calendar, drafts and scheduling for every channel you manage",
  "analytics on every update, plus a monthly report for your team",
];

const memberFeatures = [
  "a for you feed of opportunities matched to your interests and stage",
  "follow organizations and never miss a scholarship, job or hackathon again",
  "love, repost, quote or bookmark any update for later",
  "share your win as a testimonial and tag the update that got you there",
  "a public profile that shows the organizations you're part of",
];

export function AudienceSplit() {
  return (
    <SectionBand tone="light">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-body text-caption-md uppercase text-ink-soft">one platform, two experiences</p>
          <h2 className="mt-sm font-display text-display-lg text-ink">
            built for the people posting and the people scrolling.
          </h2>
        </Reveal>

        <div className="mt-xxl grid grid-cols-1 gap-lg lg:grid-cols-2">
          <Reveal id="organizations" className="flex flex-col gap-lg rounded-xxl border border-hairline bg-paper p-xl shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cta text-on-cta">
              <Broadcast size={22} weight="bold" />
            </span>
            <div>
              <h3 className="font-display text-display-md text-ink">for organizations</h3>
              <p className="mt-xs font-body text-body-md text-ink-soft">
                run your community's updates like a real content operation, with a team.
              </p>
            </div>
            <ul className="flex flex-col gap-sm">
              {organizationFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-sm font-body text-body-sm text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-cta" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button href="#waitlist" variant="secondary" icon={<ArrowRight size={16} weight="bold" />}>
              create your organization
            </Button>
          </Reveal>

          <Reveal id="members" delay={0.1} className="flex flex-col gap-lg rounded-xxl border border-hairline bg-paper p-xl shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-on-primary">
              <UsersThree size={22} weight="bold" />
            </span>
            <div>
              <h3 className="font-display text-display-md text-ink">for members</h3>
              <p className="mt-xs font-body text-body-md text-ink-soft">
                discover opportunities picked for you, and follow the organizations that matter.
              </p>
            </div>
            <ul className="flex flex-col gap-sm">
              {memberFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-sm font-body text-body-sm text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button href="#waitlist" variant="secondary" icon={<ArrowRight size={16} weight="bold" />}>
              join updatebase
            </Button>
          </Reveal>
        </div>
      </Container>
    </SectionBand>
  );
}
