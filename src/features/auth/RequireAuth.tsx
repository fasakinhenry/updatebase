import { useEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '@/stores/session'
import { stepPath } from '@/lib/routing'
import { Spinner } from '@/components/ui/Spinner'
import type { OnboardingStep } from '@/types/api'

interface RequireAuthProps {
  children: ReactNode
  /**
   * the step this route serves. when the user belongs somewhere earlier in the
   * flow we send them there, so nobody can skip onboarding by typing a url.
   */
  step?: OnboardingStep
}

const ORDER: OnboardingStep[] = ['profile', 'conversation', 'location', 'app']

export function RequireAuth({ children, step }: RequireAuthProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const status = useSession((s) => s.status)
  const nextStep = useSession((s) => s.nextStep)
  const restore = useSession((s) => s.restore)

  useEffect(() => {
    if (status === 'unknown') void restore()
  }, [status, restore])

  useEffect(() => {
    if (status === 'anonymous') {
      // remember where they were headed so sign in can finish the journey
      navigate('/auth', { replace: true, state: { from: location.pathname } })
      return
    }

    if (status !== 'authenticated' || !step) return

    // a later step than they have earned sends them back to the right one
    if (ORDER.indexOf(step) > ORDER.indexOf(nextStep)) {
      navigate(stepPath(nextStep), { replace: true })
    }
  }, [status, step, nextStep, navigate, location.pathname])

  if (status === 'unknown' || status === 'loading') {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner label="loading your account" />
      </div>
    )
  }

  if (status === 'anonymous') return null

  return <>{children}</>
}
