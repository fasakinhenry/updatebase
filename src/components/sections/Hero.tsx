import { ArrowRight, GraduationCap, Sparkle, WhatsappLogo } from "@phosphor-icons/react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Pill } from "../ui/Pill";
import { Reveal } from "../ui/Reveal";

export function Hero() {
  return (
    <section id="top" className="relative w-full overflow-hidden bg-canvas pb-section pt-xxxl">
      <Container className="grid grid-cols-1 items-center gap-xxl lg:grid-cols-[1.05fr_0.95fr] lg:gap-xl">
        <Reveal className="flex flex-col items-start gap-lg">
          <Pill tone="primary">
            <Sparkle size={14} weight="fill" />
            built for community leaders
          </Pill>

          <h1 className="font-display text-display-xl text-ink">
            every opportunity you share,{" "}
            <span className="relative inline-block whitespace-nowrap">
              branded and numbered
              <svg
                aria-hidden="true"
                viewBox="0 0 300 14"
                className="absolute -bottom-1 left-0 h-[10px] w-full text-primary"
                preserveAspectRatio="none"
              >
                <path d="M2 10.5C60 3 150 1 298 8" stroke="currentColor" strokeWidth="7" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            in seconds.
          </h1>

          <p className="max-w-lg font-body text-body-lg text-ink-soft">
            paste any scholarship, hackathon or job link. updatebase's AI formats it to your
            community's style, numbers it, adds your delegate's name and gets it ready for
            whatsapp, all in your voice, every single time.
          </p>

          <div className="flex flex-col gap-sm sm:flex-row">
            <Button href="#waitlist" size="lg" icon={<ArrowRight size={18} weight="bold" />}>
              get started free
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg">
              see how it works
            </Button>
          </div>

          <div className="flex items-center gap-sm pt-xs font-body text-body-sm text-ink-soft">
            <div className="flex -space-x-2">
              {["#d9ed92", "#f4c6ae", "#e8e2f5", "#f4de88"].map((color) => (
                <span
                  key={color}
                  className="h-8 w-8 rounded-pill border-2 border-canvas"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span>trusted by community convenors sharing 100+ updates a month</span>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative flex justify-center lg:justify-end">
          <div className="w-full max-w-sm rounded-xxl border border-hairline bg-paper p-lg shadow-card">
            <div className="flex items-center justify-between border-b border-hairline pb-sm">
              <div className="flex items-center gap-xs">
                <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-band-dark text-on-ink">
                  <WhatsappLogo size={18} weight="fill" />
                </span>
                <div>
                  <p className="font-body text-body-sm font-medium text-ink">futa techies updates</p>
                  <p className="font-body text-caption-md text-ink-soft">2,481 members</p>
                </div>
              </div>
              <span className="rounded-pill bg-cloud px-sm py-xxs font-body text-caption-md text-ink-soft">
                live
              </span>
            </div>

            <div className="mt-md rounded-lg bg-cloud p-md">
              <div className="flex items-center gap-xs">
                <GraduationCap size={16} weight="bold" className="text-cta" />
                <p className="font-display text-display-sm text-ink">🎓 scholarship update</p>
              </div>
              <p className="mt-xs font-body text-body-sm text-ink">
                ✅ 42. mastercard foundation scholars program is open for undergraduate
                admission, fully funded, covers tuition, housing and a laptop.
              </p>
              <p className="mt-xs font-body text-link-md text-link">
                register: bit.ly/mcf-scholars-2026
              </p>
              <p className="mt-sm font-body text-body-sm text-ink-soft">
                join our community: bit.ly/futatechies2
              </p>
              <p className="mt-xxs font-body text-caption-md text-ink-soft">
                henqsoft from FUTA Techies
              </p>
            </div>

            <div className="mt-md flex items-center justify-between font-body text-caption-md text-ink-soft">
              <span>formatted with updatebase</span>
              <span className="flex items-center gap-xxs text-cta">
                <Sparkle size={12} weight="fill" /> AI styled
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
