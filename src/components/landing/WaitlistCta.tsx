import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CheckCircle, EnvelopeSimple } from '@phosphor-icons/react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Reveal } from '@/components/ui/Reveal'
import { api, ApiError } from '@/lib/api'
import { celebrate } from '@/lib/confetti'
import { waitlistSchema, type WaitlistInput } from '@/lib/schemas'
import { toast } from '@/stores/toast'
import { cn } from '@/lib/cn'

const roles = [
  { value: 'organization' as const, label: 'I run a community' },
  { value: 'member' as const, label: 'I am looking for opportunities' },
]

export function WaitlistCta() {
  const [joined, setJoined] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: '', role: 'organization' },
  })

  const role = watch('role')

  const onSubmit = handleSubmit(async (values) => {
    try {
      await api.post('/api/waitlist', values)
      setJoined(true)
      void celebrate()
    } catch (error) {
      const message =
        error instanceof ApiError ? error.friendlyMessage : 'something went wrong, please try again'
      toast.error('could not join the list', message)
    }
  })

  return (
    <section id="waitlist" className="border-t border-hairline bg-canvas py-section">
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-display-xl measure-tight text-ink">
            your community is already waiting on the{' '}
            <span className="emphasis text-primary">next one</span>
          </h2>

          <p className="measure text-lead text-ink-soft">
            join the early list. we are letting communities in a handful at a time so we can
            actually help you set up.
          </p>

          {joined ? (
            <output className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-primary-line bg-primary-soft p-6">
              <CheckCircle size={28} weight="fill" aria-hidden="true" className="text-primary" />
              <p className="text-display-xs text-ink">you are on the list</p>
              <p className="text-body-sm text-ink-soft">
                we will email you the moment your spot opens up.
              </p>
            </output>
          ) : (
            <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3">
              <fieldset className="flex w-full gap-1 rounded-lg border border-hairline bg-surface p-1">
                <legend className="sr-only">what brings you here</legend>
                {roles.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md px-3 py-2 text-center text-caption transition-colors duration-fast ease-standard',
                      role === option.value
                        ? 'bg-canvas text-ink shadow-subtle'
                        : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={role === option.value}
                      onChange={() => setValue('role', option.value)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </fieldset>

              <Field
                label="email address"
                hideLabel
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                leading={<EnvelopeSimple size={16} aria-hidden="true" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                size="lg"
                block
                loading={isSubmitting}
                icon={<ArrowRight size={17} weight="bold" />}
              >
                {isSubmitting ? 'joining' : 'get early access'}
              </Button>

              <p className="text-caption text-ink-muted">
                one email when your spot opens. nothing else, ever.
              </p>
            </form>
          )}
        </Reveal>
      </Container>
    </section>
  )
}
