import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, Lightbulb, Sparkle } from '@phosphor-icons/react'
import { Spinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'
import type { ConversationTurn } from '@/types/api'

interface ConversationCanvasProps {
  turns: ConversationTurn[]
  suggestions: string[]
  multiSelect: boolean
  thinking: boolean
  disabled?: boolean
  avatarSeed?: string
  onSend: (message: string) => void
}

export function ConversationCanvas({
  turns,
  suggestions,
  multiSelect,
  thinking,
  disabled = false,
  avatarSeed,
  onSend,
}: ConversationCanvasProps) {
  const [draft, setDraft] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [pickedFor, setPickedFor] = useState(suggestions)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // a new message should bring itself into view without yanking the page
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns.length, thinking])

  // a new question brings a new pill set, and a selection from the last one
  // would be nonsense against it. adjusting during render is what react
  // recommends here, and it avoids a second render pass.
  if (pickedFor !== suggestions) {
    setPickedFor(suggestions)
    setPicked([])
  }

  const grow = (node: HTMLTextAreaElement) => {
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, 200)}px`
  }

  const send = (message: string) => {
    const trimmed = message.trim()
    if (!trimmed || thinking || disabled) return

    onSend(trimmed)
    setDraft('')
    setPicked([])
    if (inputRef.current) inputRef.current.style.height = 'auto'
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    send(multiSelect && picked.length > 0 ? picked.join(', ') : draft)
  }

  const togglePill = (value: string) => {
    if (multiSelect) {
      setPicked((current) =>
        current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      )
      return
    }
    send(value)
  }

  const canSend = multiSelect ? picked.length > 0 || draft.trim().length > 0 : draft.trim().length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="flex-1 overflow-y-auto"
        // a live region means new answers are announced as they arrive
        aria-live="polite"
        aria-atomic="false"
      >
        <ul className="flex flex-col gap-5 pb-6">
          {turns.map((turn) => (
            <li
              key={turn.id}
              className={cn(
                'flex gap-3',
                turn.role === 'user' ? 'flex-row-reverse' : 'flex-row',
              )}
            >
              {turn.role === 'assistant' ? (
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
                >
                  <Sparkle size={15} weight="fill" />
                </span>
              ) : (
                <Avatar seed={avatarSeed ?? 'you'} alt="" size={32} className="mt-0.5" />
              )}

              <div
                className={cn(
                  'min-w-0 max-w-[85%] rounded-2xl px-4 py-3 text-body',
                  turn.role === 'user'
                    ? 'bg-primary text-on-primary'
                    : 'border border-hairline bg-canvas text-ink',
                )}
              >
                <p className="whitespace-pre-wrap">{turn.content}</p>

                {turn.critique && (
                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-warning-soft px-3 py-2 text-body-sm text-warning">
                    <Lightbulb
                      size={14}
                      weight="fill"
                      aria-hidden="true"
                      className="mt-0.5 shrink-0"
                    />
                    <span>{turn.critique}</span>
                  </p>
                )}
              </div>
            </li>
          ))}

          {thinking && (
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
              >
                <Sparkle size={15} weight="fill" />
              </span>
              <div className="rounded-2xl border border-hairline bg-canvas px-4 py-3">
                <Spinner label="thinking about your answer" size={16} />
              </div>
            </li>
          )}
        </ul>

        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 border-t border-hairline bg-canvas pt-4">
        {suggestions.length > 0 && (
          <fieldset className="mb-3 flex flex-col gap-2">
            <legend className="sr-only">
              {multiSelect ? 'pick as many as apply' : 'quick answers'}
            </legend>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((option) => {
                const selected = picked.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => togglePill(option)}
                    aria-pressed={multiSelect ? selected : undefined}
                    disabled={thinking || disabled}
                    className={cn(
                      'rounded-pill border px-3.5 py-2 text-caption transition-colors duration-fast ease-standard',
                      selected
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-hairline-strong bg-canvas text-ink-soft hover:border-primary hover:text-primary',
                      (thinking || disabled) && 'pointer-events-none opacity-50',
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        <form onSubmit={submit} className="flex items-end gap-2 pb-4">
          <div className="flex-1">
            <label htmlFor="conversation-input" className="sr-only">
              your answer
            </label>
            <textarea
              ref={inputRef}
              id="conversation-input"
              value={draft}
              rows={1}
              disabled={thinking || disabled}
              placeholder={
                multiSelect
                  ? 'pick above, or type something else'
                  : 'type your answer, take your time'
              }
              onChange={(event) => {
                setDraft(event.target.value)
                grow(event.target)
              }}
              onKeyDown={(event) => {
                // enter sends, shift and enter makes a new line
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  send(multiSelect && picked.length > 0 ? picked.join(', ') : draft)
                }
              }}
              className={cn(
                'w-full resize-none rounded-xl border border-hairline-strong bg-canvas px-4 py-3 text-body text-ink',
                'placeholder:text-ink-muted focus:outline-none',
                'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
                'disabled:bg-surface disabled:text-ink-muted',
              )}
            />
          </div>

          <button
            type="submit"
            disabled={!canSend || thinking || disabled}
            aria-label="send your answer"
            className={cn(
              'mb-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-fast ease-standard',
              canSend && !thinking && !disabled
                ? 'bg-primary text-on-primary hover:bg-primary-hover'
                : 'cursor-not-allowed bg-surface-2 text-ink-muted',
            )}
          >
            <ArrowUp size={18} weight="bold" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}
