import type { ConsentPreferences } from './consent'

export type ToggleableConsent = Exclude<keyof ConsentPreferences, 'essential'>

export interface ConsentOptionDefinition {
  key: keyof ConsentPreferences
  label: string
  description: string
  locked: boolean
}

/** one source of truth, used by the banner and the cookies page alike. */
export const CONSENT_OPTIONS: ConsentOptionDefinition[] = [
  {
    key: 'essential',
    label: 'essential',
    description:
      'keeps you signed in, remembers your theme and protects the account. the product does not work without these.',
    locked: true,
  },
  {
    key: 'analytics',
    label: 'analytics',
    description:
      'anonymous counts of which pages get used and where people give up, so we know what to fix.',
    locked: false,
  },
  {
    key: 'personalization',
    label: 'personalization',
    description:
      'remembers what you open so the for you feed gets better instead of showing you the same things.',
    locked: false,
  },
]
