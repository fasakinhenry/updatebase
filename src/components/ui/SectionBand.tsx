import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "canvas" | "light" | "dark" | "paper";

interface SectionBandProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
}

const tones: Record<Tone, string> = {
  canvas: "bg-canvas text-ink",
  paper: "bg-paper text-ink",
  light: "bg-band-light text-ink",
  dark: "bg-band-dark text-on-ink",
};

export function SectionBand({ children, tone = "canvas", className, id }: SectionBandProps) {
  return (
    <section id={id} className={cn("w-full py-section", tones[tone], className)}>
      {children}
    </section>
  );
}
