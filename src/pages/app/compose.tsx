import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowClockwise,
  Buildings,
  CheckCircle,
  Copy,
  Gear,
  PaperPlaneTilt,
  Sparkle,
  TrashSimple,
  WarningCircle,
} from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { Dialog } from '@/components/ui/Dialog'
import { Checkbox } from '@/components/ui/Checkbox'
import { EmptyState } from '@/components/app/EmptyState'
import { ChannelPicker } from '@/features/composer/ChannelPicker'
import { ChannelPreview } from '@/features/composer/ChannelPreview'
import { useComposer } from '@/features/composer/useComposer'
import { useMyOrganizations } from '@/features/organizations/useOrganizations'
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/categories'
import { celebrate } from '@/lib/confetti'
import { toast } from '@/stores/toast'
import type { Category } from '@/types/api'
import { cn } from '@/lib/cn'

const REFINEMENTS = [
  'make it shorter',
  'make it more urgent',
  'simpler words',
  'add who can apply',
  'lead with the money',
]

export default function ComposePage() {
  const navigate = useNavigate()
  const { data: memberships, isPending } = useMyOrganizations()
  const [orgIndex, setOrgIndex] = useState(0)
  const [refineOpen, setRefineOpen] = useState(false)
  const [refinement, setRefinement] = useState('')

  const membership = memberships?.[orgIndex]
  const organization = membership?.organization

  const composer = useComposer(organization?._id)

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="loading your organizations" />
      </div>
    )
  }

  if (!memberships || memberships.length === 0) {
    return (
      <>
        <Seo title="post an update" description="format and publish an update." path="/app/compose" noindex />
        <EmptyState
          icon={Buildings}
          title="you need an organization first"
          description="updates are posted by communities, not individuals. create one and you can start posting in a couple of minutes."
          action={
            <Button to="/app/organizations/new" icon={null}>
              create an organization
            </Button>
          }
        />
      </>
    )
  }

  const publish = async () => {
    const update = await composer.publish()
    if (!update) return

    void celebrate()
    toast.success('published', `update ${composer.draft.number} is live`)
    navigate(`/app/updates/${update._id}`)
  }

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('copied', `formatted for ${label}`)
    } catch {
      toast.error('could not copy', 'your browser blocked clipboard access')
    }
  }

  return (
    <>
      <Seo
        title="post an update"
        description="paste an opportunity and get it back branded, numbered and ready to send."
        path="/app/compose"
        noindex
      />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-display-md text-ink">post an update</h1>
            <p className="mt-1 text-body text-ink-soft">
              paste it in. we shape it to your community's voice.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {memberships.length > 1 && (
              <Select
                label="posting as"
                options={memberships.map((item, index) => ({
                  value: String(index),
                  label: item.organization.name,
                }))}
                value={String(orgIndex)}
                onChange={(event) => setOrgIndex(Number(event.target.value))}
                className="h-10"
              />
            )}

            <Button
              to={`/app/org/${organization?.handle}/rules`}
              variant="secondary"
              size="sm"
              icon={<Gear size={15} weight="bold" />}
              iconPosition="left"
            >
              rules
            </Button>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.92fr] lg:gap-8">
          {/* the canvas */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-hairline bg-canvas p-5">
              <Textarea
                label="paste the opportunity"
                hint="the whole thing, however messy. we keep only what matters."
                rows={6}
                maxLength={8000}
                value={composer.draft.raw}
                onChange={(event) => composer.patch({ raw: event.target.value })}
                placeholder="paste the announcement, the email, the whole page. anything works."
              />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => void composer.format()}
                  loading={composer.formatting}
                  icon={<Sparkle size={16} weight="fill" />}
                  iconPosition="left"
                >
                  {composer.formatting ? 'formatting' : 'format with ai'}
                </Button>

                {composer.draft.body && (
                  <Button
                    variant="secondary"
                    onClick={() => setRefineOpen(true)}
                    icon={<ArrowClockwise size={15} weight="bold" />}
                    iconPosition="left"
                  >
                    refine
                  </Button>
                )}

                {(composer.draft.raw || composer.draft.body) && (
                  <Button
                    variant="ghost"
                    onClick={composer.clear}
                    icon={<TrashSimple size={15} />}
                    iconPosition="left"
                  >
                    clear
                  </Button>
                )}
              </div>

              {!composer.usedAi && composer.draft.body && (
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-warning-soft px-3 py-2.5 text-body-sm text-warning">
                  <WarningCircle size={15} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0" />
                  <span>
                    the free ai quota is used up right now, so we formatted this the simple way.
                    read it over before you publish.
                  </span>
                </p>
              )}
            </div>

            {composer.draft.body && (
              <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-canvas p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-display-xs text-ink">the update</h2>
                  <span className="tabular rounded-pill bg-primary-soft px-2.5 py-1 text-caption font-semibold text-primary">
                    ✅ {composer.draft.number}
                  </span>
                </div>

                <Field
                  label="header"
                  value={composer.draft.header}
                  onChange={(event) => composer.patch({ header: event.target.value })}
                  hint="the category line your community recognises"
                />

                {/* the update keeps its own casing here, it is their voice */}
                <Textarea
                  label="body"
                  rows={10}
                  maxLength={4000}
                  showCount
                  value={composer.draft.body}
                  onChange={(event) => composer.patch({ body: event.target.value })}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="category"
                    options={CATEGORIES.map((item) => ({
                      value: item,
                      label: CATEGORY_LABELS[item],
                    }))}
                    value={composer.draft.category}
                    onChange={(event) =>
                      composer.patch({ category: event.target.value as Category })
                    }
                  />

                  <Field
                    label="deadline"
                    type="date"
                    hint="leave empty if none was given"
                    value={composer.draft.deadline}
                    onChange={(event) => composer.patch({ deadline: event.target.value })}
                  />
                </div>

                <Field
                  label="application link"
                  type="url"
                  placeholder="https://"
                  value={composer.draft.link}
                  onChange={(event) => composer.patch({ link: event.target.value })}
                />

                <Textarea
                  label="footer"
                  rows={3}
                  maxLength={400}
                  hint="your community link and signature, added to every update"
                  value={composer.draft.footer}
                  onChange={(event) => composer.patch({ footer: event.target.value })}
                />

                <Checkbox
                  label="remote, or open to anyone anywhere"
                  description="we use this to rank it for people outside your country"
                  checked={composer.draft.isRemote}
                  onChange={(checked) => composer.patch({ isRemote: checked })}
                />
              </div>
            )}
          </div>

          {/* the channels */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-hairline bg-canvas p-5">
              <h2 className="text-display-xs text-ink">where it goes</h2>
              <p className="mt-1 text-body-sm text-ink-soft">
                pick the platforms. we reshape it for each one.
              </p>

              <ChannelPicker
                available={organization?.connectedChannels ?? ['updatebase']}
                allowed={membership?.channels ?? []}
                viewerRole={membership?.role ?? 'delegate'}
                selected={composer.draft.channels}
                onChange={(channels) => composer.patch({ channels })}
                className="mt-4"
              />

              {composer.draft.body && (
                <Button
                  variant="secondary"
                  block
                  className="mt-4"
                  onClick={() => void composer.render()}
                  loading={composer.rendering}
                  icon={<Copy size={15} weight="bold" />}
                  iconPosition="left"
                >
                  {composer.rendering ? 'preparing each version' : 'prepare every version'}
                </Button>
              )}
            </div>

            {Object.keys(composer.renderings).length > 0 && (
              <ChannelPreview
                renderings={composer.renderings}
                limits={composer.limits}
                onCopy={(text, label) => void copy(text, label)}
              />
            )}

            {composer.ready && (
              <div className="sticky bottom-20 rounded-2xl border border-hairline bg-canvas p-5 lg:bottom-6">
                <div className="flex items-start gap-2.5">
                  <CheckCircle
                    size={18}
                    weight="fill"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-success"
                  />
                  <p className="text-body-sm text-ink-soft">
                    this goes out as update{' '}
                    <span className="tabular font-semibold text-ink">
                      {composer.draft.number}
                    </span>{' '}
                    to {composer.draft.channels.length}{' '}
                    {composer.draft.channels.length === 1 ? 'channel' : 'channels'}, and onto your
                    updatebase page.
                  </p>
                </div>

                <Button
                  block
                  size="lg"
                  className="mt-4"
                  onClick={() => void publish()}
                  loading={composer.publishing}
                  icon={<PaperPlaneTilt size={17} weight="fill" />}
                >
                  publish
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={refineOpen}
        onClose={() => setRefineOpen(false)}
        title="what should change?"
        description="tell it in your own words. the update is reshaped, not rewritten from scratch."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRefineOpen(false)}>
              cancel
            </Button>
            <Button
              onClick={() => {
                void composer.format(refinement)
                setRefineOpen(false)
                setRefinement('')
              }}
              disabled={!refinement.trim()}
            >
              apply it
            </Button>
          </>
        }
      >
        <Textarea
          label="what to change"
          hideLabel
          rows={3}
          maxLength={400}
          value={refinement}
          onChange={(event) => setRefinement(event.target.value)}
          placeholder="e.g. cut it in half and put the deadline first"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {REFINEMENTS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRefinement(option)}
              className={cn(
                'rounded-pill border px-3 py-1.5 text-caption transition-colors duration-fast',
                refinement === option
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-hairline-strong text-ink-soft hover:border-primary hover:text-primary',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </Dialog>
    </>
  )
}
