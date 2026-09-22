import { ClipboardText, MagicWand, PaperPlaneTilt, SlidersHorizontal } from "@phosphor-icons/react";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

const steps = [
  {
    number: "01",
    icon: ClipboardText,
    title: "paste the opportunity",
    description:
      "drop in a link, a flyer's text or a rough description of the scholarship, job, hackathon or bounty you found.",
  },
  {
    number: "02",
    icon: MagicWand,
    title: "AI formats it your way",
    description:
      "the editor applies your saved rules: lowercase copy, your emoji header, a short description and the registration link.",
  },
  {
    number: "03",
    icon: SlidersHorizontal,
    title: "refine on the canvas",
    description:
      "work with the AI side by side, ask it to shorten, add detail or match an example post, until it's exactly right.",
  },
  {
    number: "04",
    icon: PaperPlaneTilt,
    title: "post everywhere, numbered",
    description:
      "get an auto-numbered, branded update with your community link and poster credit, ready for whatsapp and every other channel.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-canvas py-section">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-body text-caption-md uppercase text-ink-soft">how it works</p>
          <h2 className="mt-sm font-display text-display-lg text-ink">
            from raw opportunity to <span className="font-emphasis italic text-cta">branded update</span> in four steps.
          </h2>
        </Reveal>

        <Reveal className="mt-xxl grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col gap-md rounded-xl border border-hairline bg-paper p-lg shadow-card transition-transform duration-base ease-standard hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cloud text-cta">
                  <step.icon size={20} weight="bold" />
                </span>
                <span className="font-display text-display-sm text-hairline">{step.number}</span>
              </div>
              <h3 className="font-display text-display-sm text-ink">{step.title}</h3>
              <p className="font-body text-body-sm text-ink-soft">{step.description}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
