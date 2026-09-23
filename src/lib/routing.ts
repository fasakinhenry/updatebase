import type { OnboardingStep } from '@/types/api'

/** the single place that maps an onboarding step to the route that serves it. */
export const STEP_PATHS: Record<OnboardingStep, string> = {
  profile: '/onboarding/profile',
  conversation: '/onboarding/about-you',
  location: '/onboarding/location',
  app: '/app/feed',
}

export function stepPath(step: OnboardingStep): string {
  return STEP_PATHS[step]
}

/** routes a signed out visitor is allowed to sit on. */
export const PUBLIC_PATHS = new Set(['/', '/terms', '/privacy', '/cookies', '/auth'])
