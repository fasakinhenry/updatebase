import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";
import { cn } from "../../lib/cn";

const links = [
  { label: "product", href: "#how-it-works" },
  { label: "for organizations", href: "#organizations" },
  { label: "for members", href: "#members" },
  { label: "monetization", href: "#monetization" },
  { label: "faq", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-base ease-standard",
        scrolled ? "bg-paper/90 border-hairline backdrop-blur-sm" : "bg-canvas/80 border-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="cursor-pointer">
          <Logo />
        </a>

        <nav className="hidden items-center gap-xs lg:flex" aria-label="primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-sm py-xs font-body text-link-md text-ink-soft transition-colors duration-fast ease-standard hover:text-ink cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-sm lg:flex">
          <ThemeToggle />
          <a
            href="#waitlist"
            className="rounded-md px-sm py-xs font-body text-link-md text-ink-soft transition-colors duration-fast ease-standard hover:text-ink cursor-pointer"
          >
            log in
          </a>
          <Button href="#waitlist" size="md">
            get started free
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-ink lg:hidden cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "close menu" : "open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-hairline bg-paper shadow-card transition-[transform,opacity] duration-base ease-standard lg:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="container-page flex flex-col gap-xxs py-lg" aria-label="mobile primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-sm py-sm font-body text-body-md text-ink-soft hover:bg-cloud hover:text-ink cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-sm flex flex-col gap-sm border-t border-hairline pt-lg">
            <a
              href="#waitlist"
              onClick={() => setOpen(false)}
              className="text-center font-body text-link-md text-ink-soft hover:text-ink cursor-pointer"
            >
              log in
            </a>
            <Button href="#waitlist" size="md" onClick={() => setOpen(false)}>
              get started free
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
