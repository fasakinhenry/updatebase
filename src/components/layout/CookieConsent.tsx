import { useEffect, useState } from 'react'
import { Cookie } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { SmartLink } from '@/components/ui/SmartLink'
import { DEFAULT_CONSENT, readConsent, writeConsent, type ConsentPreferences } from '@/lib/consent'
import { cn } from '@/lib/cn'

const options = [
  {
    key: 'essential' as const,
    label: 'essential',
    description: 'keeps you signed in and keeps your account secure. always on.',
    locked: true,
  },
  {
    key: 'analytics' as const,
    label: 'analytics',
    description: 'tells us which pages work and which ones lose people.',
    locked: false,
  },
  {
    key: 'personalization' as const,
    label: 'personalization',
    description: 'uses what you open to pick the updates you see first.',
    locked: false,
  },
]

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [managing, setManaging] = useState(false)
  const [prefs, setPrefs] = useState<ConsentPreferences>(DEFAULT_CONSENT)

  useEffect(() => {
    // wait a beat so the banner never competes with the first paint
    const timer = window.setTimeout(() => {
      if (!readConsent()) setVisible(true)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [])

  const decide = (next: ConsentPreferences) => {
    writeConsent(next)
    setManaging(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      <div
        role="region"
        aria-label="cookie preferences"
        className={cn(
          'fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:left-auto sm:right-6 sm:max-w-md sm:pb-6',
          'motion-safe:animate-[ub-toast-in_320ms_cubic-bezier(0.16,1,0.3,1)_both]',
        )}
      >
        <div className="rounded-2xl border border-hairline bg-canvas p-5 shadow-raised">
          <div className="flex items-start gap-3">
            <Cookie size={20} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-label text-ink">we use a few cookies</p>
              <p className="mt-1.5 text-body-sm text-ink-soft">
                essential ones keep you signed in. the rest are yours to decide. read the{' '}
                <SmartLink
                  to="/privacy"
                  className="text-primary underline underline-offset-4 hover:text-primary-hover"
                >
                  privacy policy
                </SmartLink>
                .
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              size="sm"
              block
              icon={null}
              onClick={() => decide({ essential: true, analytics: true, personalization: true })}
            >
              accept all
            </Button>
            <Button size="sm" variant="secondary" block onClick={() => decide(DEFAULT_CONSENT)}>
              essential only
            </Button>
            <Button size="sm" variant="ghost" block onClick={() => setManaging(true)}>
              manage
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={managing}
        onClose={() => setManaging(false)}
        title="cookie preferences"
        description="turn on only what you are comfortable with. you can change this any time."
        footer={
          <>
            <Button variant="secondary" onClick={() => setManaging(false)}>
              cancel
            </Button>
            <Button onClick={() => decide(prefs)}>save preferences</Button>
          </>
        }
      >
        <ul className="flex flex-col gap-3">
          {options.map((option) => {
            const checked = option.locked ? true : prefs[option.key]
            return (
              <li key={option.key}>
                <label
                  className={cn(
                    'flex items-start gap-3 rounded-xl border border-hairline p-4 transition-colors duration-fast',
                    option.locked ? 'cursor-not-allowed bg-surface' : 'hover:border-hairline-strong',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={option.locked}
                    onChange={(event) =>
                      setPrefs((current) => ({ ...current, [option.key]: event.target.checked }))
                    }
                    className="mt-0.5 size-4 shrink-0 accent-primary"
                  />
                  <span className="min-w-0">
                    <span className="block text-label text-ink">
                      {option.label}
                      {option.locked && (
                        <span className="ml-2 text-caption font-normal text-ink-muted">
                          always on
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-body-sm text-ink-soft">
                      {option.description}
                    </span>
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </Dialog>
    </>
  )
}
