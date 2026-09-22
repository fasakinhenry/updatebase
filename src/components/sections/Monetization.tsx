import { Coins, Handshake, Wallet } from "@phosphor-icons/react";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { Pill } from "../ui/Pill";

const points = [
  {
    icon: Wallet,
    title: "members tip what helped them",
    description:
      "when an update leads to a scholarship or a job, members can fund their wallet and tip the update that made the difference.",
  },
  {
    icon: Handshake,
    title: "you decide how tips are shared",
    description:
      "credit the delegate who posted it and let them keep the tip, split it by a percentage you set, or route it fully to your organization.",
  },
  {
    icon: Coins,
    title: "a small fee keeps updatebase running",
    description:
      "updatebase takes a small percentage on tips as a transaction fee. no subscriptions, no hidden charges, you only pay when value moves.",
  },
];

export function Monetization() {
  return (
    <section id="monetization" className="w-full bg-canvas py-section">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>simple monetization</Pill>
          <h2 className="mt-md font-display text-display-lg text-ink">
            let your community fund the work you already do.
          </h2>
          <p className="mt-md font-body text-body-lg text-ink-soft">
            posting updates takes real effort. updatebase's wallet turns gratitude from your
            members into real support for you and your delegates.
          </p>
        </Reveal>

        <Reveal className="mt-xxl grid grid-cols-1 gap-lg md:grid-cols-3" stagger={0.1}>
          {points.map((point) => (
            <div key={point.title} className="rounded-xl border border-hairline bg-paper p-lg shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cloud text-cta">
                <point.icon size={22} weight="bold" />
              </span>
              <h3 className="mt-md font-display text-display-sm text-ink">{point.title}</h3>
              <p className="mt-xs font-body text-body-sm text-ink-soft">{point.description}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
