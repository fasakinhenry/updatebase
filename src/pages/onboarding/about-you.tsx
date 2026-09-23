import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowClockwise, ArrowRight, PencilSimple, Sparkle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Spinner } from '@/components/ui/Spinner'
import { Seo } from '@/components/seo/Seo'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { ConversationCanvas } from '@/features/onboarding/ConversationCanvas'
import { useSession } from '@/stores/session'
import { api, ApiError } from '@/lib/api'
import { toast } from '@/stores/toast'
import { celebrate } from '@/lib/confetti'
import { stepPath } from '@/lib/routing'
import type { ConversationState, ConversationTurn, User } from '@/types/api'
import { cn } from '@/lib/cn'

/** the topics the review screen lets someone jump back into. */
const REVISABLE = [
  { topic: 'interests', label: 'what you are interested in' },
  { topic: 'specifics', label: 'the specifics' },
  { topic: 'stage', label: 'where you are in your career' },
  { topic: 'background', label: 'your school or work' },
  { topic: 'accomplishments', label: 'what you have done' },
  { topic: 'goals', label: 'your goals' },
] as const

function AboutYouStep() {
  const navigate = useNavigate()
  const user = useSession((s) => s.user)
  const patchUser = useSession((s) => s.patchUser)

  const [state, setState] = useState<ConversationState | null>(null)
  const [thinking, setThinking] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bioDraft, setBioDraft] = useState('')
  const [editingBio, setEditingBio] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rewriting, setRewriting] = useState(false)

  // resume whatever conversation already exists, or start a fresh one
  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const result = await api.get<ConversationState>('/api/onboarding/conversation')
        if (cancelled) return
        setState(result)
        if (result.draftBio) setBioDraft(result.draftBio)
      } catch (error) {
        if (cancelled) return
        const message =
          error instanceof ApiError ? error.friendlyMessage : 'could not load your setup'
        toast.error('something went wrong', message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const send = async (message: string) => {
    if (!state) return

    // show their message straight away rather than after the round trip
    const optimistic: ConversationTurn = {
      id: `pending-${Date.now()}`,
      role: 'user',
      content: message,
      at: new Date().toISOString(),
    }
    setState({ ...state, turns: [...state.turns, optimistic] })
    setThinking(true)

    try {
      const result = await api.post<ConversationState>('/api/onboarding/conversation', { message })
      setState(result)
      if (result.draftBio) setBioDraft(result.draftBio)
      if (result.complete) void celebrate()
    } catch (error) {
      // roll the optimistic message back so they can edit and resend it
      setState((current) =>
        current
          ? { ...current, turns: current.turns.filter((turn) => turn.id !== optimistic.id) }
          : current,
      )
      const reason =
        error instanceof ApiError ? error.friendlyMessage : 'that did not go through'
      toast.error('could not send that', reason)
    } finally {
      setThinking(false)
    }
  }

  const revise = async (topic: string) => {
    setThinking(true)
    try {
      const result = await api.post<ConversationState>('/api/onboarding/conversation/revise', {
        topic,
      })
      setState(result)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.friendlyMessage : 'could not reopen that question'
      toast.error('something went wrong', message)
    } finally {
      setThinking(false)
    }
  }

  const rewrite = async () => {
    setRewriting(true)
    try {
      const result = await api.post<{ bio: string }>('/api/onboarding/conversation/rewrite-bio')
      setBioDraft(result.bio)
      toast.success('rewritten', 'have a look and change anything you like')
    } catch (error) {
      const message = error instanceof ApiError ? error.friendlyMessage : 'could not rewrite it'
      toast.error('something went wrong', message)
    } finally {
      setRewriting(false)
    }
  }

  const accept = async () => {
    setSaving(true)
    try {
      const result = await api.post<{ user: User }>('/api/onboarding/conversation/complete', {
        bio: bioDraft,
      })
      patchUser(result.user)
      useSession.setState({ nextStep: 'location' })
      navigate(stepPath('location'))
    } catch (error) {
      const message = error instanceof ApiError ? error.friendlyMessage : 'could not save your bio'
      toast.error('something went wrong', message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="loading your setup" />
      </div>
    )
  }

  if (!state) {
    return (
      <div className="container-page max-w-xl py-16">
        <h1 className="text-display-md text-ink">we could not start that</h1>
        <p className="mt-2 text-body-lg text-ink-soft">
          reload the page and try again. if it keeps happening you can skip this and write your bio
          later.
        </p>
        <Button to={stepPath('location')} className="mt-6" icon={null}>
          skip for now
        </Button>
      </div>
    )
  }

  // the review screen takes over once there is a bio to look at
  if (state.complete && bioDraft) {
    return (
      <div className="container-page max-w-xl py-12 sm:py-16">
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-primary-line bg-primary-soft px-3 py-1.5 text-caption text-primary">
          <Sparkle size={12} weight="fill" aria-hidden="true" />
          here is what we heard
        </span>

        <h1 className="mt-4 text-display-lg text-ink">your bio</h1>
        <p className="mt-2.5 text-body-lg text-ink-soft">
          this is what people read when they land on your profile. change anything that is not
          quite you.
        </p>

        <div className="mt-8">
          {editingBio ? (
            <Textarea
              label="your bio"
              hideLabel
              rows={6}
              maxLength={600}
              showCount
              value={bioDraft}
              onChange={(event) => setBioDraft(event.target.value)}
            />
          ) : (
            <div className="rounded-xl border border-hairline bg-surface p-5">
              <p className="whitespace-pre-wrap text-body-lg text-ink">{bioDraft}</p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditingBio((value) => !value)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong px-3 py-2 text-caption text-ink transition-colors duration-fast hover:bg-surface"
            >
              <PencilSimple size={13} weight="bold" aria-hidden="true" />
              {editingBio ? 'done editing' : 'edit it myself'}
            </button>

            <button
              type="button"
              onClick={() => void rewrite()}
              disabled={rewriting}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong px-3 py-2 text-caption text-ink transition-colors duration-fast hover:bg-surface',
                rewriting && 'pointer-events-none opacity-60',
              )}
            >
              <ArrowClockwise size={13} weight="bold" aria-hidden="true" />
              {rewriting ? 'rewriting' : 'write it again'}
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-display-xs text-ink">want to change an answer?</h2>
          <p className="mt-1.5 text-body-sm text-ink-soft">
            pick a part and we will ask you about it again.
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {REVISABLE.map((item) => (
              <li key={item.topic}>
                <button
                  type="button"
                  onClick={() => void revise(item.topic)}
                  disabled={thinking}
                  className="rounded-pill border border-hairline-strong px-3.5 py-2 text-caption text-ink-soft transition-colors duration-fast hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <Button
          size="lg"
          block
          onClick={() => void accept()}
          loading={saving}
          icon={<ArrowRight size={17} weight="bold" />}
          className="mt-10 sm:w-auto"
        >
          looks right, continue
        </Button>
      </div>
    )
  }

  return (
    <div className="container-page flex h-[calc(100svh-4rem)] max-w-2xl flex-col py-6 sm:py-10">
      <div className="shrink-0 pb-6">
        <h1 className="text-display-md text-ink">tell us about you</h1>
        <p className="mt-2 text-body text-ink-soft">
          a short conversation so your feed is not random. answer properly and we will write your
          bio from it.
        </p>
      </div>

      <ConversationCanvas
        turns={state.turns}
        suggestions={state.suggestions}
        multiSelect={state.multiSelect}
        thinking={thinking}
        avatarSeed={user?.avatarSeed}
        onSend={(message) => void send(message)}
      />
    </div>
  )
}

export default function AboutYouPage() {
  return (
    <RequireAuth step="conversation">
      <Seo
        title="tell us about you"
        description="a short conversation so updatebase knows what to show you."
        path="/onboarding/about-you"
        noindex
      />
      <AboutYouStep />
    </RequireAuth>
  )
}
