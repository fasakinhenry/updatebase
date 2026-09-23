import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowClockwise, ArrowRight, PencilSimple, Sparkle } from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Spinner } from '@/components/ui/Spinner'
import { ConversationCanvas } from '@/features/onboarding/ConversationCanvas'
import { useOrganization } from '@/features/organizations/useOrganizations'
import { api, ApiError } from '@/lib/api'
import { toast } from '@/stores/toast'
import { celebrate } from '@/lib/confetti'
import type { ConversationState, ConversationTurn } from '@/types/api'
import { cn } from '@/lib/cn'

const REVISABLE = [
  { topic: 'interests', label: 'who it is for' },
  { topic: 'specifics', label: 'what you post' },
  { topic: 'stage', label: 'where the community lives' },
  { topic: 'background', label: 'what makes it different' },
  { topic: 'accomplishments', label: 'your voice' },
  { topic: 'goals', label: 'how it started' },
] as const

export default function OrganizationSetupPage() {
  const { handle } = useParams<{ handle: string }>()
  const navigate = useNavigate()
  const client = useQueryClient()

  const { data: organization, isPending: loadingOrg } = useOrganization(handle)
  const organizationId = organization?._id

  const [state, setState] = useState<ConversationState | null>(null)
  const [thinking, setThinking] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bioDraft, setBioDraft] = useState('')
  const [editingBio, setEditingBio] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rewriting, setRewriting] = useState(false)

  useEffect(() => {
    if (!organizationId) return
    let cancelled = false

    void (async () => {
      try {
        const result = await api.get<ConversationState>(
          `/api/org-setup/${organizationId}/conversation`,
        )
        if (cancelled) return
        setState(result)
        if (result.draftBio) setBioDraft(result.draftBio)
      } catch (error) {
        if (cancelled) return
        const message =
          error instanceof ApiError ? error.friendlyMessage : 'could not load the setup'
        toast.error('something went wrong', message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [organizationId])

  const send = async (message: string) => {
    if (!state || !organizationId) return

    const optimistic: ConversationTurn = {
      id: `pending-${Date.now()}`,
      role: 'user',
      content: message,
      at: new Date().toISOString(),
    }
    setState({ ...state, turns: [...state.turns, optimistic] })
    setThinking(true)

    try {
      const result = await api.post<ConversationState>(
        `/api/org-setup/${organizationId}/conversation`,
        { message },
      )
      setState(result)
      if (result.draftBio) setBioDraft(result.draftBio)
      if (result.complete) void celebrate()
    } catch (error) {
      setState((current) =>
        current
          ? { ...current, turns: current.turns.filter((turn) => turn.id !== optimistic.id) }
          : current,
      )
      const reason = error instanceof ApiError ? error.friendlyMessage : 'that did not go through'
      toast.error('could not send that', reason)
    } finally {
      setThinking(false)
    }
  }

  const revise = async (topic: string) => {
    if (!organizationId) return
    setThinking(true)
    try {
      setState(
        await api.post<ConversationState>(
          `/api/org-setup/${organizationId}/conversation/revise`,
          { topic },
        ),
      )
    } catch (error) {
      const message =
        error instanceof ApiError ? error.friendlyMessage : 'could not reopen that question'
      toast.error('something went wrong', message)
    } finally {
      setThinking(false)
    }
  }

  const rewrite = async () => {
    if (!organizationId) return
    setRewriting(true)
    try {
      const result = await api.post<{ bio: string }>(
        `/api/org-setup/${organizationId}/conversation/rewrite-bio`,
      )
      setBioDraft(result.bio)
      toast.success('rewritten', 'change anything that does not sound like you')
    } catch (error) {
      const message = error instanceof ApiError ? error.friendlyMessage : 'could not rewrite it'
      toast.error('something went wrong', message)
    } finally {
      setRewriting(false)
    }
  }

  const accept = async () => {
    if (!organizationId) return
    setSaving(true)
    try {
      await api.post(`/api/org-setup/${organizationId}/conversation/complete`, { bio: bioDraft })
      await client.invalidateQueries({ queryKey: ['organizations', 'mine'] })
      await client.invalidateQueries({ queryKey: ['organization', handle] })

      toast.success('all set', 'invite the people who post with you next')
      navigate(`/app/org/${handle}/members`)
    } catch (error) {
      const message = error instanceof ApiError ? error.friendlyMessage : 'could not save the bio'
      toast.error('something went wrong', message)
    } finally {
      setSaving(false)
    }
  }

  if (loadingOrg || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="loading the setup" />
      </div>
    )
  }

  if (!state) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-display-md text-ink">we could not start that</h1>
        <p className="mt-2 text-body-lg text-ink-soft">
          reload and try again, or skip it and write the bio yourself in settings.
        </p>
        <Button to={`/app/org/${handle}/members`} className="mt-6" icon={null}>
          skip for now
        </Button>
      </div>
    )
  }

  if (state.complete && bioDraft) {
    return (
      <>
        <Seo title="organization bio" description="your community's bio." path="/app/org/setup" noindex />

        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-primary-line bg-primary-soft px-3 py-1.5 text-caption text-primary">
            <Sparkle size={12} weight="fill" aria-hidden="true" />
            here is what we heard
          </span>

          <h1 className="mt-4 text-display-lg text-ink">{organization?.name}</h1>
          <p className="mt-2.5 text-body-lg text-ink-soft">
            this is what people read before they decide to follow you. make it sound like you.
          </p>

          <div className="mt-8">
            {editingBio ? (
              <Textarea
                label="the bio"
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
            save and invite your team
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Seo
        title="set up your organization"
        description="a short conversation to write your community's bio."
        path="/app/org/setup"
        noindex
      />

      <div className="mx-auto flex h-[calc(100svh-3.5rem)] max-w-2xl flex-col px-4 py-6 sm:px-6 lg:h-svh lg:py-10">
        <div className="shrink-0 pb-6">
          <h1 className="text-display-md text-ink">tell us about {organization?.name}</h1>
          <p className="mt-2 text-body text-ink-soft">
            a few questions so we can write a bio that makes the right people follow you.
          </p>
        </div>

        <ConversationCanvas
          turns={state.turns}
          suggestions={state.suggestions}
          multiSelect={state.multiSelect}
          thinking={thinking}
          avatarSeed={organization?.handle}
          onSend={(message) => void send(message)}
        />
      </div>
    </>
  )
}
