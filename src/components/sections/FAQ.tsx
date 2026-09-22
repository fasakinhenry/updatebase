import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { Container } from "../ui/Container";
import { SectionBand } from "../ui/SectionBand";
import { Reveal } from "../ui/Reveal";
import { cn } from "../../lib/cn";

const faqs = [
  {
    question: "who is updatebase for?",
    answer:
      "any student community, organization or convenor who regularly shares opportunities like scholarships, jobs, hackathons or events with their followers, and any student or professional looking to discover those opportunities.",
  },
  {
    question: "do I need to know how to prompt an AI?",
    answer:
      "no. you set your formatting rules once, in plain language, and updatebase's AI applies them to every update from then on. you can still ask it to tweak a specific update at any time.",
  },
  {
    question: "can more than one person post for my organization?",
    answer:
      "yes. add delegates by email, username or a shareable invite link, assign them channels, and every update they post is credited to them under your organization.",
  },
  {
    question: "does updatebase replace whatsapp?",
    answer:
      "no, it formats your updates for whatsapp and every other channel you use, then you post them where your community already is. we're building direct scheduling too.",
  },
  {
    question: "how does the wallet and tipping work?",
    answer:
      "members can fund a wallet and tip updates that helped them. you choose whether tips go to the delegate who posted it, get split by a percentage, or go fully to your organization.",
  },
  {
    question: "is updatebase free to use?",
    answer:
      "yes, creating an account, an organization and posting updates is free. updatebase only takes a small percentage when tips are sent through the platform.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionBand tone="canvas" id="faq">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-body text-caption-md uppercase text-ink-soft">questions</p>
          <h2 className="mt-sm font-display text-display-lg text-ink">
            everything you're wondering about updatebase.
          </h2>
        </Reveal>

        <Reveal className="mx-auto mt-xxl flex max-w-2xl flex-col gap-sm">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-lg border border-hairline bg-paper"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-md px-lg py-md text-left cursor-pointer"
                >
                  <span className="font-body text-body-md font-medium text-ink">{faq.question}</span>
                  <CaretDown
                    size={18}
                    className={cn(
                      "shrink-0 text-ink-soft transition-transform duration-base ease-standard",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-base ease-standard",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-lg pb-md font-body text-body-sm text-ink-soft">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </SectionBand>
  );
}
