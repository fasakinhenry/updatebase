import { InstagramLogo, LinkedinLogo, XLogo } from '@phosphor-icons/react'
import { Logo } from './Logo'
import { Container } from '@/components/ui/Container'
import { SmartLink } from '@/components/ui/SmartLink'

const groups = [
  {
    title: 'product',
    links: [
      { label: 'how it works', href: '#how-it-works' },
      { label: 'for organizations', href: '#organizations' },
      { label: 'for members', href: '#members' },
      { label: 'tips and splits', href: '#tips' },
    ],
  },
  {
    title: 'company',
    links: [
      { label: 'faq', href: '#faq' },
      { label: 'early access', href: '#waitlist' },
      { label: 'contact', href: 'mailto:hello@updatebase.app', external: true },
    ],
  },
]

const legal = [
  { label: 'terms', to: '/terms' },
  { label: 'privacy', to: '/privacy' },
  { label: 'cookies', to: '/cookies' },
]

const socials = [
  { label: 'updatebase on x', href: 'https://x.com/updatebase', icon: XLogo },
  {
    label: 'updatebase on linkedin',
    href: 'https://www.linkedin.com/company/updatebase',
    icon: LinkedinLogo,
  },
  {
    label: 'updatebase on instagram',
    href: 'https://www.instagram.com/updatebase',
    icon: InstagramLogo,
  },
]

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="measure-tight text-body-sm text-ink-soft">
              every opportunity your community shares, branded, numbered and easy to find later.
            </p>

            <ul className="mt-1 flex items-center gap-1">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-9 items-center justify-center rounded-lg text-ink-muted transition-colors duration-fast hover:bg-surface-2 hover:text-ink"
                  >
                    <Icon size={17} weight="fill" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-overline uppercase text-ink-muted">{group.title}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-body-sm text-ink-soft transition-colors duration-fast hover:text-primary"
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-ink-muted">
            © {new Date().getFullYear()} updatebase. made in akure.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legal.map((item) => (
              <li key={item.to}>
                <SmartLink
                  to={item.to}
                  prefetch="viewport"
                  className="text-caption text-ink-muted transition-colors duration-fast hover:text-primary"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
