import { useState, type FormEvent } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { Container } from "../ui/Container";
import { SectionBand } from "../ui/SectionBand";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import { cn } from "../../lib/cn";
import { joinWaitlist, type WaitlistRole } from "../../lib/api";

type Status = "idle" | "loading" | "success" | "error";

export function FinalCTA() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WaitlistRole>("organization");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    try {
      await joinWaitlist(email, role);
      setStatus("success");
      setMessage("you're on the list. we'll email you the moment updatebase is ready.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "something went wrong, please try again");
    }
  };

  return (
    <SectionBand tone="dark" id="waitlist">
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-lg text-center">
          <h2 className="font-display text-display-lg text-on-ink">
            ready to give your community a voice worth following?
          </h2>
          <p className="max-w-lg font-body text-body-lg text-white/70">
            join the waitlist and be first to bring your organization, or yourself, onto
            updatebase.
          </p>

          <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-sm">
            <div className="flex w-full items-center rounded-lg border border-white/15 bg-white/5 p-xxs">
              {(["organization", "member"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={cn(
                    "flex-1 rounded-md px-md py-xs font-body text-button-lg transition-colors duration-fast ease-standard cursor-pointer",
                    role === option ? "bg-primary text-on-primary" : "text-white/70 hover:text-on-ink"
                  )}
                >
                  {option === "organization" ? "I run a community" : "I'm looking for opportunities"}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-sm sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="email address"
                className="w-full rounded-md border border-white/15 bg-white/5 px-md py-sm font-body text-body-md text-on-ink placeholder:text-white/40 outline-none transition-colors duration-fast ease-standard focus:border-cta"
              />
              <Button type="submit" size="md" disabled={status === "loading"} className="shrink-0">
                {status === "loading" ? "joining..." : "join the waitlist"}
              </Button>
            </div>

            {status === "success" && (
              <p className="flex items-center justify-center gap-xs font-body text-body-sm text-primary">
                <CheckCircle size={16} weight="fill" /> {message}
              </p>
            )}
            {status === "error" && (
              <p className="flex items-center justify-center gap-xs font-body text-body-sm text-accent-peach">
                <WarningCircle size={16} weight="fill" /> {message}
              </p>
            )}
          </form>
        </Reveal>
      </Container>
    </SectionBand>
  );
}
