import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FloppyDisk, Plus, Sparkle, TrashSimple, X } from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Textarea } from '@/components/ui/Textarea'
import { Spinner } from '@/components/ui/Spinner'
import { Dialog } from '@/components/ui/Dialog'
import { Checkbox } from '@/components/ui/Checkbox'
import { useOrganization } from '@/features/organizations/useOrganizations'
import { api, ApiError } from '@/lib/api'
import { toast } from '@/stores/toast'
import type { AiRuleSet } from '@/types/api'

const SUGGESTED_RULES = [
  'always write in lowercase, including the first word',
  'keep it under 80 words',
  'put the deadline on its own line',
  'never use exclamation marks',
  'say who can apply before you say how to apply',
]

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-hairline bg-canvas p-5 sm:p-6">
      <h2 className="text-display-xs text-ink">{title}</h2>
      <p className="mt-1.5 text-body-sm text-ink-soft">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default function RulesPage() {
  const { handle } = useParams<{ handle: string }>()
  const client = useQueryClient()
  const { data: organization } = useOrganization(handle)
  const organizationId = organization?._id

  const { data: rules, isPending } = useQuery({
    queryKey: ['rules', organizationId],
    queryFn: () => api.get<AiRuleSet>(`/api/composer/${organizationId}/rules`),
    enabled: Boolean(organizationId),
  })

  const [draft, setDraft] = useState<Partial<AiRuleSet>>({})
  const [newRule, setNewRule] = useState('')
  const [newEmoji, setNewEmoji] = useState('')
  const [exampleOpen, setExampleOpen] = useState(false)
  const [example, setExample] = useState({ input: '', output: '', note: '' })
  const [loadedFor, setLoadedFor] = useState<string | undefined>()

  // adopt the saved rules once, then the draft is the truth while editing.
  // done during render rather than in an effect, so the form never flashes
  // empty before the saved values land.
  if (rules && loadedFor !== rules._id) {
    setLoadedFor(rules._id)
    setDraft(rules)
  }

  const save = useMutation({
    mutationFn: () =>
      api.patch<AiRuleSet>(`/api/composer/${organizationId}/rules`, {
        rules: draft.rules,
        lowercase: draft.lowercase,
        footer: draft.footer,
        signatureTemplate: draft.signatureTemplate,
        showNumber: draft.showNumber,
        numberPrefix: draft.numberPrefix,
        emojiVocabulary: draft.emojiVocabulary,
        customPrompt: draft.customPrompt,
      }),
    onSuccess: (saved) => {
      client.setQueryData(['rules', organizationId], saved)
      toast.success('saved', 'every update from now on follows these')
    },
    onError: (error) => {
      toast.error(
        'could not save',
        error instanceof ApiError ? error.friendlyMessage : 'try again in a moment',
      )
    },
  })

  const addExample = useMutation({
    mutationFn: () =>
      api.post<AiRuleSet>(`/api/composer/${organizationId}/rules/examples`, example),
    onSuccess: (saved) => {
      client.setQueryData(['rules', organizationId], saved)
      setDraft(saved)
      setExample({ input: '', output: '', note: '' })
      setExampleOpen(false)
      toast.success('example saved', 'the formatter follows this style from now on')
    },
  })

  const removeExample = useMutation({
    mutationFn: (id: string) =>
      api.delete<AiRuleSet>(`/api/composer/${organizationId}/rules/examples/${id}`),
    onSuccess: (saved) => {
      client.setQueryData(['rules', organizationId], saved)
      setDraft(saved)
    },
  })

  if (isPending || !rules) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="loading your formatting rules" />
      </div>
    )
  }

  const addRule = () => {
    const value = newRule.trim()
    if (!value) return
    setDraft((current) => ({ ...current, rules: [...(current.rules ?? []), value] }))
    setNewRule('')
  }

  const signaturePreview = (draft.signatureTemplate ?? '{username} from {organization}')
    .replace('{username}', 'HENQSOFT')
    .replace('{organization}', organization?.name ?? 'your organization')

  return (
    <>
      <Seo
        title="formatting rules"
        description="teach the formatter how your community writes."
        path="/app/org/rules"
        noindex
      />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <header>
          <h1 className="text-display-md text-ink">how you write</h1>
          <p className="mt-2 text-body-lg text-ink-soft">
            teach it once and every update after this follows the same voice.
          </p>
        </header>

        <div className="mt-8 flex flex-col gap-5">
          <Section
            title="the mechanics"
            description="the parts that appear in every single update, exactly the same way."
          >
            <div className="flex flex-col gap-5">
              <Checkbox
                label="write everything in lowercase"
                description="proper nouns keep their capitals. this is the FUTA Techies house style."
                checked={draft.lowercase ?? true}
                onChange={(checked) =>
                  setDraft((current) => ({ ...current, lowercase: checked }))
                }
              />

              <Checkbox
                label="number every update"
                description="so your community can see how many you have posted"
                checked={draft.showNumber ?? true}
                onChange={(checked) =>
                  setDraft((current) => ({ ...current, showNumber: checked }))
                }
              />

              {draft.showNumber !== false && (
                <Field
                  label="number prefix"
                  value={draft.numberPrefix ?? '✅'}
                  maxLength={8}
                  hint={`shows up as "${draft.numberPrefix ?? '✅'} ${(organization?.updateCounter ?? 0) + 1}"`}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, numberPrefix: event.target.value }))
                  }
                  className="max-w-40"
                />
              )}

              <Field
                label="signature"
                value={draft.signatureTemplate ?? '{username} from {organization}'}
                hint={`use {username} and {organization}. yours reads "${signaturePreview}"`}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, signatureTemplate: event.target.value }))
                }
              />

              <Textarea
                label="footer"
                rows={3}
                maxLength={400}
                value={draft.footer ?? ''}
                hint="your community link, added above the signature on every update"
                placeholder="💬 join us: bit.ly/futatechies2"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, footer: event.target.value }))
                }
              />
            </div>
          </Section>

          <Section
            title="your rules"
            description="written in your own words. these override everything else."
          >
            <ul className="flex flex-col gap-2">
              {(draft.rules ?? []).map((rule, index) => (
                <li
                  key={`${rule}-${index}`}
                  className="flex items-start gap-3 rounded-lg border border-hairline bg-surface px-3.5 py-2.5"
                >
                  <span className="flex-1 text-body-sm text-ink">{rule}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        rules: (current.rules ?? []).filter((_, i) => i !== index),
                      }))
                    }
                    aria-label={`remove rule: ${rule}`}
                    className="shrink-0 rounded p-0.5 text-ink-muted transition-colors duration-fast hover:text-danger"
                  >
                    <X size={14} weight="bold" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex gap-2">
              <Field
                label="add a rule"
                hideLabel
                value={newRule}
                placeholder="e.g. never use exclamation marks"
                onChange={(event) => setNewRule(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addRule()
                  }
                }}
                className="flex-1"
              />
              <Button variant="secondary" onClick={addRule} icon={<Plus size={15} weight="bold" />}>
                add
              </Button>
            </div>

            {(draft.rules ?? []).length === 0 && (
              <div className="mt-4">
                <p className="text-caption text-ink-muted">not sure where to start?</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {SUGGESTED_RULES.map((rule) => (
                    <li key={rule}>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            rules: [...(current.rules ?? []), rule],
                          }))
                        }
                        className="rounded-pill border border-hairline-strong px-3 py-1.5 text-caption text-ink-soft transition-colors duration-fast hover:border-primary hover:text-primary"
                      >
                        {rule}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>

          <Section
            title="your emojis"
            description="it reuses these instead of picking its own."
          >
            <ul className="flex flex-wrap gap-2">
              {(draft.emojiVocabulary ?? []).map((emoji, index) => (
                <li key={`${emoji}-${index}`}>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        emojiVocabulary: (current.emojiVocabulary ?? []).filter(
                          (_, i) => i !== index,
                        ),
                      }))
                    }
                    aria-label={`remove ${emoji}`}
                    className="rounded-lg border border-hairline px-3 py-2 text-body transition-colors duration-fast hover:border-danger"
                  >
                    {emoji}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex gap-2">
              <Field
                label="add an emoji"
                hideLabel
                value={newEmoji}
                maxLength={8}
                placeholder="🎓"
                onChange={(event) => setNewEmoji(event.target.value)}
                className="w-24"
              />
              <Button
                variant="secondary"
                onClick={() => {
                  if (!newEmoji.trim()) return
                  setDraft((current) => ({
                    ...current,
                    emojiVocabulary: [...(current.emojiVocabulary ?? []), newEmoji.trim()],
                  }))
                  setNewEmoji('')
                }}
                icon={<Plus size={15} weight="bold" />}
              >
                add
              </Button>
            </div>
          </Section>

          <Section
            title="worked examples"
            description="the most useful thing on this page. show it one update you liked and it learns more than ten rules could teach it."
          >
            <ul className="flex flex-col gap-3">
              {(draft.examples ?? []).map((item) => (
                <li key={item._id} className="rounded-xl border border-hairline bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-caption font-semibold text-ink-muted">pasted</p>
                      <p className="mt-1 line-clamp-2 text-body-sm text-ink-soft">{item.input}</p>

                      <p className="mt-3 text-caption font-semibold text-primary">became</p>
                      <p className="mt-1 whitespace-pre-wrap text-body-sm text-ink">
                        {item.output}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExample.mutate(item._id)}
                      aria-label="remove this example"
                      className="shrink-0 rounded p-1 text-ink-muted transition-colors duration-fast hover:text-danger"
                    >
                      <TrashSimple size={14} weight="bold" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => setExampleOpen(true)}
              icon={<Plus size={15} weight="bold" />}
              iconPosition="left"
            >
              add an example
            </Button>
          </Section>

          <Section
            title="anything else"
            description="whatever the fields above cannot say. it reads this like an instruction from you."
          >
            <Textarea
              label="extra instructions"
              hideLabel
              rows={4}
              maxLength={2000}
              showCount
              value={draft.customPrompt ?? ''}
              placeholder="we write for final year students in nigeria, so skip anything that needs a visa nobody can get."
              onChange={(event) =>
                setDraft((current) => ({ ...current, customPrompt: event.target.value }))
              }
            />
          </Section>
        </div>

        <div className="sticky bottom-20 mt-6 lg:bottom-6">
          <Button
            block
            size="lg"
            onClick={() => save.mutate()}
            loading={save.isPending}
            icon={<FloppyDisk size={17} weight="bold" />}
            iconPosition="left"
          >
            save these rules
          </Button>
        </div>
      </div>

      <Dialog
        open={exampleOpen}
        onClose={() => setExampleOpen(false)}
        title="add a worked example"
        description="paste something raw, then the version you would have sent. it matches that style from then on."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setExampleOpen(false)}>
              cancel
            </Button>
            <Button
              onClick={() => addExample.mutate()}
              loading={addExample.isPending}
              disabled={example.input.trim().length < 10 || example.output.trim().length < 10}
              icon={<Sparkle size={15} weight="fill" />}
              iconPosition="left"
            >
              save the example
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Textarea
            label="what you pasted"
            rows={5}
            maxLength={4000}
            value={example.input}
            onChange={(event) => setExample((c) => ({ ...c, input: event.target.value }))}
            placeholder="the raw announcement, email or page"
          />

          <Textarea
            label="what you sent"
            rows={7}
            maxLength={4000}
            value={example.output}
            onChange={(event) => setExample((c) => ({ ...c, output: event.target.value }))}
            placeholder="the finished update, exactly as it went out"
          />

          <Field
            label="anything worth noting"
            value={example.note}
            maxLength={200}
            placeholder="optional, e.g. we always cut the eligibility list to one line"
            onChange={(event) => setExample((c) => ({ ...c, note: event.target.value }))}
          />
        </div>
      </Dialog>
    </>
  )
}
