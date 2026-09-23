import { useEffect, useState } from 'react'
import { List, X } from '@phosphor-icons/react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const links = [
  { label: 'how it works', href: '#how-it-works' },
  { label: 'for organizations', href: '#organizations' },
  { label: 'for members', href: '#members' },
  { label: 'tips', href: '#tips' },
  { label: 'faq', href: '#faq' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-[background-color,border-color] duration-base ease-standard',
        scrolled || open
          ? 'border-b border-hairline bg-canvas/85 backdrop-blur-md'
          : 'border-b border-transparent bg-canvas',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <a href="#top" aria-label="updatebase, back to top" className="shrink-0">
          <Logo />
        </a>

        <nav aria-label="primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-label text-ink-soft transition-colors duration-fast ease-standard hover:bg-surface hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <a
            href="#waitlist"
            className="rounded-lg px-3 py-2 text-label text-ink-soft transition-colors duration-fast ease-standard hover:bg-surface hover:text-ink"
          >
            log in
          </a>
          <Button href="#waitlist" size="sm" icon={null}>
            get early access
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'close menu' : 'open menu'}
            className="inline-flex size-10 items-center justify-center rounded-lg text-ink transition-colors duration-fast hover:bg-surface"
          >
            {open ? (
              <X size={20} weight="bold" aria-hidden="true" />
            ) : (
              <List size={20} weight="bold" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-hairline bg-canvas lg:hidden"
      >
        <nav aria-label="mobile" className="container-page py-4">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-body-lg text-ink-soft transition-colors duration-fast hover:bg-surface hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-hairline pt-4">
            <Button href="#waitlist" variant="secondary" block onClick={() => setOpen(false)}>
              log in
            </Button>
            <Button href="#waitlist" block icon={null} onClick={() => setOpen(false)}>
              get early access
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
