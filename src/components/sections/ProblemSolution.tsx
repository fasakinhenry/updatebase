import { Check, X } from "@phosphor-icons/react";
import { Container } from "../ui/Container";
import { SectionBand } from "../ui/SectionBand";
import { Reveal } from "../ui/Reveal";

const oldWay = [
  "copy the opportunity from wherever you found it",
  "paste it into a chatgpt chat and rewrite the prompt every time",
  "manually count and track which update number you're on",
  "remind yourself to add the community link and your name",
  "repeat this for every single delegate posting updates",
];

const newWay = [
  "paste the opportunity into your updatebase editor",
  "AI formats it to your saved brand rules automatically",
  "numbering, header, footer and poster credit added for you",
  "copy or schedule straight to whatsapp and every other channel",
  "your whole team posts in the same consistent voice",
];

export function ProblemSolution() {
  return (
    <SectionBand tone="dark" id="story">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-body text-caption-md uppercase text-primary">the problem we started with</p>
          <h2 className="mt-sm font-display text-display-lg text-on-ink">
            running a community's updates shouldn't feel like a second job.
          </h2>
          <p className="mt-md font-body text-body-lg text-white/70">
            as convener of FUTA Techies, formatting every opportunity by hand and bouncing
            between chat windows was the bottleneck. updatebase is the tool we built to fix it.
          </p>
        </Reveal>

        <div className="mt-xxl grid grid-cols-1 gap-lg md:grid-cols-2">
          <Reveal delay={0.05} className="rounded-xl border border-white/10 bg-white/5 p-lg">
            <p className="font-display text-display-sm text-white/60">the old way</p>
            <ul className="mt-md flex flex-col gap-sm">
              {oldWay.map((item) => (
                <li key={item} className="flex items-start gap-sm font-body text-body-md text-white/70">
                  <X size={18} className="mt-0.5 shrink-0 text-accent-rust" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="rounded-xl border border-primary/30 bg-white/5 p-lg">
            <p className="font-display text-display-sm text-primary">the updatebase way</p>
            <ul className="mt-md flex flex-col gap-sm">
              {newWay.map((item) => (
                <li key={item} className="flex items-start gap-sm font-body text-body-md text-on-ink">
                  <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </SectionBand>
  );
}
