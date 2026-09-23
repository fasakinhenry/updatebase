import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Eye, EyeSlash, LockSimple, EnvelopeSimple } from '@phosphor-icons/react'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { SmartLink } from '@/components/ui/SmartLink'
import { Seo } from '@/components/seo/Seo'
import { useGoogleSignIn } from '@/features/auth/useGoogleSignIn'
import { useSession } from '@/stores/session'
import { api, ApiError } from '@/lib/api'
import { toast } from '@/stores/toast'
import { stepPath } from '@/lib/routing'
import type { SessionPayload } from '@/types/api'
import { cn } from '@/lib/cn'

const schema = z.object({
  email: z.email('that does not look like an email address'),
  password: z
    .string()
    .min(8, 'use at least 8 characters')
    .refine((value) => /[a-zA-Z]/.test(value) && /[0-9]/.test(value), {
      message: 'mix in at least one letter and one number',
    }),
})

type FormValues = z.infer<typeof schema>
type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const navigate = useNavigate()
  const adopt = useSession((s) => s.adopt)
  const status = useSession((s) => s.status)
  const nextStep = useSession((s) => s.nextStep)

  const [mode, setMode] = useState<Mode>('signup')
  const [showPassword, setShowPassword] = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)

  // already signed in, so there is nothing to do here
  useEffect(() => {
    if (status === 'authenticated') navigate(stepPath(nextStep), { replace: true })
  }, [status, nextStep, navigate])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  const land = (payload: SessionPayload) => {
    adopt(payload)
    navigate(stepPath(payload.nextStep), { replace: true })
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = await api.post<SessionPayload>(
        mode === 'signup' ? '/api/auth/register' : '/api/auth/login',
        values,
      )
      land(payload)
    } catch (error) {
      if (!(error instanceof ApiError)) throw error

      const fields = error.fieldErrors
      if (Object.keys(fields).length > 0) {
        for (const [field, message] of Object.entries(fields)) {
          if (field === 'email' || field === 'password') setError(field, { message })
        }
        return
      }

      // an account that only has google gets pointed at google, not a dead end
      if (error.message.includes('google sign in')) {
        toast.info('use google for this one', error.message)
        return
      }

      setError('email', { message: error.friendlyMessage })
    }
  })

  const onGoogleCredential = async (credential: string) => {
    setGoogleBusy(true)
    try {
      land(await api.post<SessionPayload>('/api/auth/google', { credential }))
    } catch (error) {
      const message =
        error instanceof ApiError ? error.friendlyMessage : 'that did not work, please try again'
      toast.error('google sign in failed', message)
    } finally {
      setGoogleBusy(false)
    }
  }

  const { containerRef, state: googleState } = useGoogleSignIn({
    onCredential: (credential) => void onGoogleCredential(credential),
    text: mode === 'signup' ? 'signup_with' : 'signin_with',
  })

  return (
    <>
      <Seo
        title={mode === 'signup' ? 'create your account' : 'sign in'}
        description="join updatebase to follow the communities posting the opportunities you care about."
        path="/auth"
        noindex
      />

      <main id="main" className="flex min-h-svh flex-col">
        <header className="container-page flex h-16 items-center">
          <SmartLink to="/" aria-label="updatebase, back home">
            <Logo />
          </SmartLink>
        </header>

        <div className="container-page flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-display-lg text-ink">
              {mode === 'signup' ? 'create your account' : 'welcome back'}
            </h1>
            <p className="mt-2.5 text-body-lg text-ink-soft">
              {mode === 'signup'
                ? 'takes about two minutes. we ask a few things so your feed is not random.'
                : 'pick up where you left off.'}
            </p>

            {/* google is the primary path, so it sits above the fold and above the form */}
            <div className="mt-8">
              {googleState === 'unavailable' ? (
                <p className="rounded-lg border border-hairline bg-surface px-4 py-3 text-body-sm text-ink-muted">
                  google sign in is not set up yet. use your email below.
                </p>
              ) : (
                <div
                  ref={containerRef}
                  className={cn(
                    'flex min-h-11 justify-center [color-scheme:light]',
                    (googleState === 'loading' || googleBusy) && 'pointer-events-none opacity-60',
                  )}
                />
              )}
            </div>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-hairline" />
              <span className="text-caption text-ink-muted">or use your email</span>
              <span className="h-px flex-1 bg-hairline" />
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
              <Field
                label="email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                leading={<EnvelopeSimple size={16} aria-hidden="true" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Field
                label="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder={mode === 'signup' ? 'at least 8 characters' : 'your password'}
                hint={mode === 'signup' ? 'mix in at least one letter and one number' : undefined}
                leading={<LockSimple size={16} aria-hidden="true" />}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'hide password' : 'show password'}
                    className="rounded p-0.5 text-ink-muted transition-colors duration-fast hover:text-ink"
                  >
                    {showPassword ? (
                      <EyeSlash size={16} aria-hidden="true" />
                    ) : (
                      <Eye size={16} aria-hidden="true" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                size="lg"
                block
                loading={isSubmitting}
                icon={<ArrowRight size={17} weight="bold" />}
              >
                {mode === 'signup' ? 'create account' : 'sign in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-body-sm text-ink-soft">
              {mode === 'signup' ? 'already have an account?' : 'new here?'}{' '}
              <button
                type="button"
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
              >
                {mode === 'signup' ? 'sign in' : 'create one'}
              </button>
            </p>

            <p className="mt-8 text-center text-caption text-ink-muted">
              by continuing you agree to our{' '}
              <SmartLink to="/terms" className="underline underline-offset-4 hover:text-ink">
                terms
              </SmartLink>{' '}
              and{' '}
              <SmartLink to="/privacy" className="underline underline-offset-4 hover:text-ink">
                privacy policy
              </SmartLink>
              .
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
