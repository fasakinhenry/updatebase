export interface ConsentPreferences {
  /** always on: session, auth, security. cannot be switched off. */
  essential: true
  analytics: boolean
  personalization: boolean
}

const STORAGE_KEY = 'updatebase:consent'
const VERSION = 1

export interface StoredConsent extends ConsentPreferences {
  version: number
  decidedAt: string
}

export const DEFAULT_CONSENT: ConsentPreferences = {
  essential: true,
  analytics: false,
  personalization: false,
}

export function readConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredConsent
    // a new version means the terms changed, so we ask again
    if (parsed.version !== VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function writeConsent(preferences: ConsentPreferences) {
  try {
    const record: StoredConsent = {
      ...preferences,
      essential: true,
      version: VERSION,
      decidedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
    window.dispatchEvent(new CustomEvent('updatebase:consent', { detail: record }))
  } catch {
    // storage blocked. we simply ask again next visit rather than assume consent.
  }
}

export function hasConsent(kind: keyof ConsentPreferences): boolean {
  const stored = readConsent()
  if (!stored) return kind === 'essential'
  return Boolean(stored[kind])
}

/** subscribe to consent changes, for useSyncExternalStore. */
export function subscribeToConsent(onChange: () => void) {
  window.addEventListener('updatebase:consent', onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener('updatebase:consent', onChange)
    window.removeEventListener('storage', onChange)
  }
}

let cachedRaw: string | null = null
let cachedValue: StoredConsent | null = null

/**
 * a stable snapshot. useSyncExternalStore compares by identity, so parsing
 * fresh every call would loop forever. we only reparse when the raw string
 * actually changed.
 */
export function consentSnapshot(): StoredConsent | null {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    raw = null
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedValue = readConsent()
  }

  return cachedValue
}

export function consentServerSnapshot(): StoredConsent | null {
  return null
}
