import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { ArrowRight, Check, X, Buildings } from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Spinner } from '@/components/ui/Spinner'
import { LogoUpload } from '@/features/organizations/LogoUpload'
import { api, ApiError } from '@/lib/api'
import { toast } from '@/stores/toast'
import { celebrate } from '@/lib/confetti'
import type { Organization } from '@/types/api'

const RESERVED = [
  'app', 'auth', 'api', 'admin', 'onboarding', 'settings', 'terms',
  'privacy', 'cookies', 'discover', 'feed', 'me', 'updatebase', 'support',
]

const schema = z.object({
  name: z.string().trim().min(2, 'give it a name').max(60, '60 characters at most'),
  handle: z
    .string()
    .trim()
    .min(3, 'at least 3 characters')
    .max(30, '30 characters at most')
    .regex(/^[a-zA-Z0-9_]+$/, 'letters, numbers and underscores only')
    .refine((value) => !RESERVED.includes(value.toLowerCase()), 'that handle is reserved'),
  communityLink: z
    .string()
    .trim()
    .url('that does not look like a link')
    .optional()
    .or(z.literal('')),
})

type FormValues = z.infer<typeof schema>
type HandleCheck = 'idle' | 'checking' | 'free' | 'taken'

/** "FUTA Techies" becomes "futatechies", which is what people would type. */
function suggestHandle(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 30)
}

export default function NewOrganizationPage() {
  const navigate = useNavigate()
  const client = useQueryClient()

  const [logoUrl, setLogoUrl] = useState<string | undefined>()
  const [handleCheck, setHandleCheck] = useState<HandleCheck>('idle')
  const [touchedHandle, setTouchedHandle] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { name: '', handle: '', communityLink: '' },
  })

  const name = watch('name')
  const handle = watch('handle')

  // suggest a handle from the name until they take it over themselves
  useEffect(() => {
    if (touchedHandle || !name) return
    setValue('handle', suggestHandle(name))
  }, [name, touchedHandle, setValue])

  useEffect(() => {
    const candidate = handle?.trim()
    if (!candidate || candidate.length < 3 || !/^[a-zA-Z0-9_]+$/.test(candidate)) {
      setHandleCheck('idle')
      return
    }

    setHandleCheck('checking')
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const result = await api.get<{ available: boolean }>(
          '/api/organizations/handle-available',
          { handle: candidate },
          { signal: controller.signal },
        )
        setHandleCheck(result.available ? 'free' : 'taken')
      } catch {
        setHandleCheck('idle')
      }
    }, 400)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [handle])

  const onSubmit = handleSubmit(async (values) => {
    if (handleCheck === 'taken') {
      setError('handle', { message: 'that handle is already taken' })
      return
    }

    try {
      const organization = await api.post<Organization>('/api/organizations', {
        name: values.name,
        handle: values.handle,
        logoUrl: logoUrl?.startsWith('blob:') ? undefined : logoUrl,
        communityLink: values.communityLink || undefined,
      })

      void celebrate()
      await client.invalidateQueries({ queryKey: ['organizations', 'mine'] })

      // straight into the bio conversation, while the momentum is there
      navigate(`/app/org/${organization.handle}/setup`)
    } catch (error) {
      if (!(error instanceof ApiError)) throw error

      const fields = error.fieldErrors
      for (const [field, message] of Object.entries(fields)) {
        if (field === 'name' || field === 'handle') setError(field, { message })
      }
      if (Object.keys(fields).length === 0) {
        toast.error('could not create that', error.friendlyMessage)
      }
    }
  })

  return (
    <>
      <Seo
        title="create an organization"
        description="start a community on updatebase and bring your delegates with you."
        path="/app/organizations/new"
        noindex
      />

      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:py-16">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Buildings size={22} weight="duotone" aria-hidden="true" />
        </span>

        <h1 className="mt-6 text-display-lg text-ink">create your organization</h1>
        <p className="mt-2.5 text-body-lg text-ink-soft">
          this is the name your updates go out under. you can invite people to post with you
          straight after.
        </p>

        <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-6" noValidate>
          <LogoUpload value={logoUrl} onChange={setLogoUrl} name={name} />

          <Field
            label="organization name"
            placeholder="FUTA Techies"
            hint="written the way you want it to appear in every update"
            error={errors.name?.message}
            {...register('name')}
          />

          <Field
            label="handle"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="futatechies"
            hint="your page lives at updatebase.app/o/yourhandle"
            error={
              errors.handle?.message ??
              (handleCheck === 'taken' ? 'that handle is already taken' : undefined)
            }
            trailing={
              handleCheck === 'checking' ? (
                <Spinner label="checking that handle" size={14} />
              ) : handleCheck === 'free' ? (
                <Check size={15} weight="bold" aria-label="available" className="text-success" />
              ) : handleCheck === 'taken' ? (
                <X size={15} weight="bold" aria-label="taken" className="text-danger" />
              ) : undefined
            }
            {...register('handle', {
              onChange: () => setTouchedHandle(true),
            })}
          />

          <Field
            label="community link"
            type="url"
            placeholder="https://bit.ly/futatechies2"
            hint="your whatsapp group or channel. we add it to the bottom of every update."
            error={errors.communityLink?.message}
            {...register('communityLink')}
          />

          <Button
            type="submit"
            size="lg"
            block
            loading={isSubmitting}
            icon={<ArrowRight size={17} weight="bold" />}
            className="mt-2 sm:w-auto sm:self-start"
          >
            create it
          </Button>
        </form>
      </div>
    </>
  )
}
