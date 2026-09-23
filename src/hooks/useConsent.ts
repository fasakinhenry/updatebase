import { useSyncExternalStore } from 'react'
import {
  consentServerSnapshot,
  consentSnapshot,
  subscribeToConsent,
  type StoredConsent,
} from '@/lib/consent'

/** the stored decision, or null if the visitor has not chosen yet. */
export function useConsent(): StoredConsent | null {
  return useSyncExternalStore(subscribeToConsent, consentSnapshot, consentServerSnapshot)
}
