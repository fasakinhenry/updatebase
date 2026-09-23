import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ShieldCheck } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Seo } from '@/components/seo/Seo'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { useSession } from '@/stores/session'
import { api, ApiError } from '@/lib/api'
import { toast } from '@/stores/toast'
import { stepPath } from '@/lib/routing'
import { reverseGeocode } from '@/lib/geocode'
import type { User } from '@/types/api'

type State = 'idle' | 'asking' | 'saving' | 'denied'

function LocationStep() {
  const navigate = useNavigate()
  const patchUser = useSession((s) => s.patchUser)
  const [state, setState] = useState<State>('idle')

  const finish = (user: User) => {
    patchUser(user)
    useSession.setState({ nextStep: 'app' })
    navigate(stepPath('app'), { replace: true })
  }

  const skip = async () => {
    setState('saving')
    try {
      finish((await api.post<{ user: User }>('/api/onboarding/location/skip')).user)
    } catch (error) {
      const message = error instanceof ApiError ? error.friendlyMessage : 'could not continue'
      toast.error('something went wrong', message)
      setState('idle')
    }
  }

  const share = () => {
    if (!('geolocation' in navigator)) {
      toast.info('your browser cannot do this', 'no problem, you can carry on without it')
      void skip()
      return
    }

    setState('asking')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setState('saving')
        const { latitude, longitude } = position.coords

        // a friendly place name, but the coordinates are what actually rank
        const place = await reverseGeocode(latitude, longitude)

        try {
          const result = await api.post<{ user: User }>('/api/onboarding/location', {
            latitude,
            longitude,
            city: place?.city,
            country: place?.country,
          })
          finish(result.user)
        } catch (error) {
          const message = error instanceof ApiError ? error.friendlyMessage : 'could not save that'
          toast.error('something went wrong', message)
          setState('idle')
        }
      },
      () => {
        // refusing is a normal choice, not an error to shout about
        setState('denied')
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    )
  }

  return (
    <div className="container-page flex min-h-[calc(100svh-4rem)] max-w-lg flex-col justify-center py-12">
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <MapPin size={22} weight="duotone" aria-hidden="true" />
      </span>

      <h1 className="mt-6 text-display-lg text-ink">where are you based?</h1>

      <p className="mt-2.5 text-body-lg text-ink-soft">
        a lot of opportunities only open to certain countries or cities. sharing your location
        means we can stop showing you the ones you cannot apply for.
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {[
          'we only ever store the rough area, never a live trail',
          'nobody else sees it, it is not on your profile',
          'you can turn it off any time in settings',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-body text-ink-soft">
            <ShieldCheck
              size={16}
              weight="fill"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-success"
            />
            {item}
          </li>
        ))}
      </ul>

      {state === 'denied' && (
        <output className="mt-8 rounded-xl border border-hairline bg-surface p-4">
          <p className="text-label text-ink">your browser blocked it</p>
          <p className="mt-1.5 text-body-sm text-ink-soft">
            that is completely fine. you can carry on without it, or allow location for this site
            in your browser settings and try again.
          </p>
        </output>
      )}

      <div className="mt-10 flex flex-col gap-3">
        <Button
          size="lg"
          block
          onClick={share}
          loading={state === 'asking' || state === 'saving'}
          icon={<MapPin size={17} weight="bold" />}
          iconPosition="left"
        >
          {state === 'asking' ? 'waiting for your browser' : 'share my location'}
        </Button>

        <Button
          size="lg"
          variant="ghost"
          block
          onClick={() => void skip()}
          disabled={state === 'asking' || state === 'saving'}
          icon={null}
        >
          not now
        </Button>
      </div>
    </div>
  )
}

export default function LocationPage() {
  return (
    <RequireAuth step="location">
      <Seo
        title="where you are"
        description="share your location so updatebase can show opportunities open to you."
        path="/onboarding/location"
        noindex
      />
      <LocationStep />
    </RequireAuth>
  )
}
