import { useState } from 'react'
import { LegalLayout, LegalSection } from '@/components/layout/LegalLayout'
import { Seo } from '@/components/seo/Seo'
import { breadcrumbSchema } from '@/components/seo/structuredData'
import { Button } from '@/components/ui/Button'
import { ConsentOption } from '@/components/ui/ConsentOption'
import { useConsent } from '@/hooks/useConsent'
import { CONSENT_OPTIONS, type ToggleableConsent } from '@/lib/consentOptions'
import { writeConsent, type ConsentPreferences } from '@/lib/consent'
import { toast } from '@/stores/toast'

export default function CookiesPage() {
  const stored = useConsent()
  const [draft, setDraft] = useState<Partial<ConsentPreferences>>({})

  // the saved decision is the truth, the draft only holds what changed since
  const value = (key: ToggleableConsent) => draft[key] ?? stored?.[key] ?? false

  const save = () => {
    writeConsent({
      essential: true,
      analytics: value('analytics'),
      personalization: value('personalization'),
    })
    setDraft({})
    toast.success('preferences saved', 'this applies from your next page load')
  }

  return (
    <>
      <Seo
        title="cookie preferences"
        description="choose which cookies updatebase can use. essential ones keep you signed in, the rest are yours to decide."
        path="/cookies"
        jsonLd={breadcrumbSchema([
          { name: 'home', path: '/' },
          { name: 'cookies', path: '/cookies' },
        ])}
      />

      <LegalLayout title="cookie preferences" updated="23 september 2026">
        <LegalSection heading="your choices">
          <p>
            change these whenever you like. nothing except the essential set runs until you say
            yes.
          </p>
        </LegalSection>

        <ul className="flex flex-col gap-3">
          {CONSENT_OPTIONS.map((option) => (
            <li key={option.key}>
              <ConsentOption
                size="md"
                label={option.label}
                description={option.description}
                locked={option.locked}
                checked={option.locked ? true : value(option.key as ToggleableConsent)}
                onChange={(checked) =>
                  setDraft((current) => ({ ...current, [option.key]: checked }))
                }
              />
            </li>
          ))}
        </ul>

        <div>
          <Button onClick={save} icon={null}>
            save preferences
          </Button>
        </div>
      </LegalLayout>
    </>
  )
}
