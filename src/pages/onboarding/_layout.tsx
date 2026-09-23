import { Outlet, useLocation } from 'react-router-dom'
import { Check } from '@phosphor-icons/react'
import { Logo } from '@/components/layout/Logo'
import { SmartLink } from '@/components/ui/SmartLink'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { cn } from '@/lib/cn'

const steps = [
  { path: '/onboarding/profile', label: 'your profile' },
  { path: '/onboarding/about-you', label: 'about you' },
  { path: '/onboarding/location', label: 'where you are' },
]

export default function OnboardingLayout() {
  const { pathname } = useLocation()
  const currentIndex = Math.max(
    steps.findIndex((step) => pathname.startsWith(step.path)),
    0,
  )

  return (
    <RequireAuth>
      <div className="flex min-h-svh flex-col bg-canvas">
        <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-md">
          <div className="container-page flex h-16 items-center justify-between gap-4">
            <SmartLink to="/" aria-label="updatebase, back home">
              <Logo />
            </SmartLink>

            <nav aria-label="setup progress" className="hidden sm:block">
              <ol className="flex items-center gap-2">
                {steps.map((step, index) => {
                  const done = index < currentIndex
                  const current = index === currentIndex

                  return (
                    <li key={step.path} className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex items-center gap-2 rounded-pill px-3 py-1.5 text-caption transition-colors duration-base',
                          current && 'bg-primary-soft text-primary',
                          done && 'text-ink-muted',
                          !current && !done && 'text-ink-muted',
                        )}
                        aria-current={current ? 'step' : undefined}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'flex size-[18px] items-center justify-center rounded-full text-[10px] font-semibold',
                            current && 'bg-primary text-on-primary',
                            done && 'bg-success text-white',
                            !current && !done && 'border border-hairline-strong',
                          )}
                        >
                          {done ? <Check size={10} weight="bold" /> : index + 1}
                        </span>
                        {step.label}
                      </span>

                      {index < steps.length - 1 && (
                        <span aria-hidden="true" className="h-px w-4 bg-hairline" />
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>

            <ThemeToggle />
          </div>

          {/* on phones the step list collapses to a bar. the bar itself is
              decoration, the step is announced as text instead. */}
          <div className="sm:hidden">
            <p className="sr-only" aria-live="polite">
              step {currentIndex + 1} of {steps.length}, {steps[currentIndex]?.label}
            </p>
            <div aria-hidden="true" className="h-1 w-full bg-surface-2">
              <div
                className="h-full bg-primary transition-[width] duration-slow ease-out"
                style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <main id="main" className="flex-1">
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  )
}
