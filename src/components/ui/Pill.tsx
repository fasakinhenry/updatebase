import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface PillProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "primary" | "dark";
}

const tones = {
  default: "bg-paper text-ink-soft border-hairline",
  primary: "bg-primary text-on-primary border-transparent",
  dark: "bg-white/10 text-on-ink border-white/15",
};

export function Pill({ children, className, tone = "default" }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-xxs rounded-pill border px-sm py-xxs font-body text-body-sm",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
