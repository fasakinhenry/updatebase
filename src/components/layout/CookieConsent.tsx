import { useEffect, useState } from 'react'
import { Cookie } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { SmartLink } from '@/components/ui/SmartLink'
import { ConsentOption } from '@/components/ui/ConsentOption'
import { CONSENT_OPTIONS, type ToggleableConsent } from '@/lib/consentOptions'
import { DEFAULT_CONSENT, readConsent, writeConsent, type ConsentPreferences } from '@/lib/consent'
import { cn } from '@/lib/cn'

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
      <section
        aria-label="cookie preferences"
        className={cn(
          'fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:left-auto sm:right-6 sm:max-w-md sm:pb-6',
          'motion-safe:animate-[ub-toast-in_320ms_cubic-bezier(0.16,1,0.3,1)_both]',
        )}
      >
        <div className="rounded-2xl border border-hairline bg-canvas p-5 shadow-raised">
          <div className="flex items-start gap-3">
            <Cookie
              size={20}
              weight="fill"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-primary"
            />
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
      </section>

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
          {CONSENT_OPTIONS.map((option) => (
            <li key={option.key}>
              <ConsentOption
                label={option.label}
                description={option.description}
                locked={option.locked}
                checked={option.locked ? true : prefs[option.key as ToggleableConsent]}
                onChange={(checked) =>
                  setPrefs((current) => ({ ...current, [option.key]: checked }))
                }
              />
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  )
}
