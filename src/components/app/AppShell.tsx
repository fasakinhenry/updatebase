import { useEffect, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Bell,
  BookmarkSimple,
  Compass,
  Confetti,
  ChatCircleDots,
  House,
  PlusCircle,
  User as UserIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Logo } from '@/components/layout/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { SmartLink } from '@/components/ui/SmartLink'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useSession } from '@/stores/session'
import { useUnreadCount } from '@/features/notifications/useUnreadCount'
import { prefetchRoute } from '@/lib/prefetch'
import { cn } from '@/lib/cn'

interface NavItem {
  to: string
  label: string
  icon: Icon
  /** shown in the bottom bar on phones. the rest live behind the profile. */
  primary?: boolean
  badge?: boolean
}

const items: NavItem[] = [
  { to: '/app/feed', label: 'feed', icon: House, primary: true },
  { to: '/app/discover', label: 'discover', icon: Compass, primary: true },
  { to: '/app/testimonials', label: 'testimonials', icon: Confetti, primary: true },
  { to: '/app/notifications', label: 'activity', icon: Bell, primary: true, badge: true },
  { to: '/app/messages', label: 'messages', icon: ChatCircleDots },
  { to: '/app/bookmarks', label: 'bookmarks', icon: BookmarkSimple },
]

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span
      className="tabular absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-pill bg-danger px-1 text-[10px] font-semibold text-white"
      aria-label={`${count} unread`}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const user = useSession((s) => s.user)
  const { data: unread = 0 } = useUnreadCount()
  const { pathname } = useLocation()

  // the next screen someone is most likely to open, warmed while they read
  useEffect(() => {
    const idle = window.setTimeout(() => {
      for (const item of items) {
        if (item.to !== pathname) void prefetchRoute(item.to)
      }
    }, 1200)
    return () => window.clearTimeout(idle)
  }, [pathname])

  const profilePath = user?.username ? `/u/${user.username}` : '/app/profile'

  return (
    <div className="min-h-svh bg-canvas">
      {/* desktop: a fixed rail. phones: a bottom bar, which is where thumbs are. */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-hairline bg-canvas px-4 py-5 lg:flex xl:w-64">
        <SmartLink to="/app/feed" aria-label="updatebase" className="px-2">
          <Logo />
        </SmartLink>

        <nav aria-label="main" className="mt-7 flex-1">
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  viewTransition
                  onMouseEnter={() => void prefetchRoute(item.to)}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-body transition-colors duration-fast ease-standard',
                      isActive
                        ? 'bg-primary-soft font-medium text-primary'
                        : 'text-ink-soft hover:bg-surface hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative">
                        <item.icon
                          size={20}
                          weight={isActive ? 'fill' : 'regular'}
                          aria-hidden="true"
                        />
                        {item.badge && <Badge count={unread} />}
                      </span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <SmartLink
            to="/app/compose"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-label text-on-primary transition-colors duration-fast hover:bg-primary-hover"
          >
            <PlusCircle size={18} weight="bold" aria-hidden="true" />
            post an update
          </SmartLink>
        </nav>

        <div className="flex items-center gap-2 border-t border-hairline pt-4">
          <SmartLink
            to={profilePath}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-2 transition-colors duration-fast hover:bg-surface"
          >
            <Avatar
              seed={user?.avatarSeed}
              src={user?.avatarMode === 'photo' ? user?.photoUrl : undefined}
              alt=""
              size={34}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-label text-ink">{user?.name}</span>
              <span className="block truncate text-caption text-ink-muted">@{user?.username}</span>
            </span>
          </SmartLink>
          <ThemeToggle />
        </div>
      </aside>

      {/* phones get a compact top bar so the brand and activity stay reachable */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <SmartLink to="/app/feed" aria-label="updatebase">
            <Logo showWordmark={false} />
          </SmartLink>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <SmartLink
              to={profilePath}
              aria-label="your profile"
              className="rounded-full p-1 transition-colors duration-fast hover:bg-surface"
            >
              <Avatar
                seed={user?.avatarSeed}
                src={user?.avatarMode === 'photo' ? user?.photoUrl : undefined}
                alt=""
                size={30}
              />
            </SmartLink>
          </div>
        </div>
      </header>

      <div className="lg:pl-60 xl:pl-64">
        <main id="main" className="pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <nav
        aria-label="main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/95 backdrop-blur-md lg:hidden"
        // keeps the bar clear of the home indicator on ios
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="flex items-stretch">
          {items
            .filter((item) => item.primary)
            .map((item) => (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  viewTransition
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors duration-fast',
                      isActive ? 'text-primary' : 'text-ink-muted',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative">
                        <item.icon
                          size={21}
                          weight={isActive ? 'fill' : 'regular'}
                          aria-hidden="true"
                        />
                        {item.badge && <Badge count={unread} />}
                      </span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}

          <li className="flex-1">
            <SmartLink
              to="/app/compose"
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-ink-muted"
            >
              <PlusCircle size={21} aria-hidden="true" />
              post
            </SmartLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export { UserIcon }
