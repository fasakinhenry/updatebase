import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Check, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { Seo } from '@/components/seo/Seo'
import { AvatarPicker, type AvatarValue } from '@/features/onboarding/AvatarPicker'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { useSession } from '@/stores/session'
import { api, ApiError } from '@/lib/api'
import { randomSeed, type AvatarStyle } from '@/lib/avatar'
import { toast } from '@/stores/toast'
import { stepPath } from '@/lib/routing'
import type { User } from '@/types/api'

const RESERVED = [
  'app', 'auth', 'api', 'admin', 'onboarding', 'settings',
  'terms', 'privacy', 'cookies', 'discover', 'feed', 'me',
]

const schema = z.object({
  name: z.string().trim().min(1, 'tell us your name').max(60, '60 characters at most'),
  username: z
    .string()
    .trim()
    .min(3, 'at least 3 characters')
    .max(24, '24 characters at most')
    .regex(/^[a-zA-Z0-9_]+$/, 'letters, numbers and underscores only')
    .refine((value) => !RESERVED.includes(value.toLowerCase()), 'that username is reserved'),
  gender: z.enum(['woman', 'man', 'non-binary', 'prefer-not-to-say'], {
    message: 'pick one so we know how to refer to you',
  }),
  dateOfBirth: z
    .string()
    .min(1, 'we need your date of birth')
    .refine((value) => {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return false
      const age = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      return age >= 16 && age <= 100
    }, 'you need to be at least 16 to use updatebase'),
})

type FormValues = z.infer<typeof schema>

const genderOptions = [
  { value: 'woman', label: 'woman' },
  { value: 'man', label: 'man' },
  { value: 'non-binary', label: 'non-binary' },
  { value: 'prefer-not-to-say', label: 'prefer not to say' },
]

type NameCheck = 'idle' | 'checking' | 'free' | 'taken'

function ProfileStep() {
  const navigate = useNavigate()
  const user = useSession((s) => s.user)
  const patchUser = useSession((s) => s.patchUser)

  const [avatar, setAvatar] = useState<AvatarValue>(() => ({
    seed: user?.avatarSeed ?? randomSeed(),
    style: (user?.avatarStyle as AvatarStyle) ?? 'notionists',
    photoUrl: user?.photoUrl,
    // arriving from google with a picture means showing it by default
    mode: user?.photoUrl ? 'photo' : 'avatar',
  }))

  const [nameCheck, setNameCheck] = useState<NameCheck>('idle')

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: user?.name ?? '',
      username: user?.username ?? '',
      gender: user?.gender ?? undefined,
      dateOfBirth: user?.dateOfBirth?.slice(0, 10) ?? '',
    },
  })

  const username = watch('username')

  // debounced availability check, so the answer is there before they submit
  useEffect(() => {
    const candidate = username?.trim()
    if (!candidate || candidate.length < 3 || !/^[a-zA-Z0-9_]+$/.test(candidate)) {
      setNameCheck('idle')
      return
    }

    setNameCheck('checking')
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const result = await api.get<{ available: boolean }>(
          '/api/onboarding/username-available',
          { username: candidate },
          { signal: controller.signal },
        )
        setNameCheck(result.available ? 'free' : 'taken')
      } catch {
        setNameCheck('idle')
      }
    }, 400)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [username])

  const onSubmit = handleSubmit(async (values) => {
    if (nameCheck === 'taken') {
      setError('username', { message: 'that username is already taken' })
      return
    }

    try {
      const result = await api.post<{ user: User }>('/api/onboarding/profile', {
        ...values,
        avatarSeed: avatar.seed,
        avatarStyle: avatar.style,
        avatarMode: avatar.mode,
        // a blob url is only a local preview, never send it to the server
        photoUrl: avatar.photoUrl?.startsWith('blob:') ? undefined : avatar.photoUrl,
      })

      patchUser(result.user)
      useSession.setState({ nextStep: 'conversation' })
      navigate(stepPath('conversation'))
    } catch (error) {
      if (!(error instanceof ApiError)) throw error

      const fields = error.fieldErrors
      for (const [field, message] of Object.entries(fields)) {
        if (field in schema.shape) setError(field as keyof FormValues, { message })
      }
      if (Object.keys(fields).length === 0) {
        toast.error('could not save that', error.friendlyMessage)
      }
    }
  })

  return (
    <div className="container-page max-w-xl py-12 sm:py-16">
      <h1 className="text-display-lg text-ink">let's set you up</h1>
      <p className="mt-2.5 text-body-lg text-ink-soft">
        this is what people see when they find you. you can change any of it later.
      </p>

      <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-6" noValidate>
        <AvatarPicker value={avatar} onChange={setAvatar} googlePhotoUrl={user?.photoUrl} />

        <Field
          label="your name"
          autoComplete="name"
          placeholder="henry fasakin"
          error={errors.name?.message}
          {...register('name')}
        />

        <Field
          label="username"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="henqsoft"
          hint="this is your link, updatebase.app/u/yourname"
          error={
            errors.username?.message ??
            (nameCheck === 'taken' ? 'that username is already taken' : undefined)
          }
          trailing={
            nameCheck === 'checking' ? (
              <Spinner label="checking that username" size={14} />
            ) : nameCheck === 'free' ? (
              <Check size={15} weight="bold" aria-label="available" className="text-success" />
            ) : nameCheck === 'taken' ? (
              <X size={15} weight="bold" aria-label="taken" className="text-danger" />
            ) : undefined
          }
          {...register('username')}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Select
            label="gender"
            placeholder="choose one"
            options={genderOptions}
            defaultValue=""
            error={errors.gender?.message}
            {...register('gender')}
          />

          <Field
            label="date of birth"
            type="date"
            autoComplete="bday"
            max={new Date().toISOString().slice(0, 10)}
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          block
          loading={isSubmitting}
          icon={<ArrowRight size={17} weight="bold" />}
          className="mt-2 sm:w-auto sm:self-start"
        >
          continue
        </Button>
      </form>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <RequireAuth step="profile">
      <Seo
        title="set up your profile"
        description="tell updatebase who you are."
        path="/onboarding/profile"
        noindex
      />
      <ProfileStep />
    </RequireAuth>
  )
}
