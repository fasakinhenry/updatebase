import { InstagramLogo, LinkedinLogo, WhatsappLogo, XLogo } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { Container } from "../ui/Container";

const columns = [
  {
    title: "product",
    links: [
      { label: "how it works", href: "#how-it-works" },
      { label: "for organizations", href: "#organizations" },
      { label: "for members", href: "#members" },
      { label: "monetization", href: "#monetization" },
    ],
  },
  {
    title: "company",
    links: [
      { label: "our story", href: "#story" },
      { label: "faq", href: "#faq" },
      { label: "contact us", href: "mailto:hello@updatebase.app" },
    ],
  },
  {
    title: "legal",
    links: [
      { label: "terms of service", href: "/terms" },
      { label: "privacy policy", href: "/privacy" },
      { label: "cookie preferences", href: "#", id: "footer-cookie-preferences" },
    ],
  },
];

const socials = [
  { label: "whatsapp", href: "https://bit.ly/futatechies2", icon: WhatsappLogo },
  { label: "x", href: "#", icon: XLogo },
  { label: "instagram", href: "#", icon: InstagramLogo },
  { label: "linkedin", href: "#", icon: LinkedinLogo },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-hairline bg-canvas">
      <Container className="py-section">
        <div className="grid grid-cols-1 gap-xxl md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-md">
            <Logo />
            <p className="max-w-xs font-body text-body-sm text-ink-soft">
              the branded update engine for student communities. paste an opportunity, get a
              formatted post, keep every follower in the loop.
            </p>
            <div className="flex items-center gap-sm">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-ink-soft transition-colors duration-fast ease-standard hover:text-ink hover:bg-cloud cursor-pointer"
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-sm">
              <span className="font-body text-caption-md uppercase text-ink-soft">
                {column.title}
              </span>
              <ul className="flex flex-col gap-xs">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      id={"id" in link ? link.id : undefined}
                      href={link.href}
                      className="font-body text-body-sm text-ink-soft transition-colors duration-fast ease-standard hover:text-ink cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-xxxl flex flex-col items-center justify-between gap-sm border-t border-hairline pt-lg text-body-sm text-ink-soft md:flex-row">
          <p>&copy; {new Date().getFullYear()} updatebase. built for community leaders.</p>
          <p>made for organizations like FUTA Techies and their communities.</p>
        </div>
      </Container>
    </footer>
  );
}
