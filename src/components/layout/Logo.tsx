import { Broadcast } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-xs", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cta text-on-cta">
        <Broadcast size={18} weight="bold" />
      </span>
      <span
        className={cn(
          "font-display text-[20px] font-semibold tracking-tight",
          dark ? "text-on-ink" : "text-ink"
        )}
      >
        updatebase
      </span>
    </span>
  );
}
