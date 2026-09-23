import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, Sparkle, WhatsappLogo } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

const RAW = `Mastercard Foundation Scholars Program 2026 applications are now open for undergraduate study. The scholarship is fully funded and covers tuition, accommodation, a monthly stipend and a laptop. Open to African students with strong academic records and demonstrated financial need. Apply before March 30.`

const FORMATTED = [
  { text: '🎓 scholarship update', className: 'font-semibold text-ink' },
  { text: '', className: '' },
  { text: '✅ 42', className: 'text-ink-soft' },
  {
    text: 'mastercard foundation scholars program 2026 is open for undergraduate study.',
    className: 'text-ink',
  },
  {
    text: 'fully funded. covers tuition, accommodation, monthly stipend and a laptop.',
    className: 'text-ink',
  },
  { text: 'open to african students. closes march 30.', className: 'text-ink' },
  { text: '', className: '' },
  { text: '🔗 apply: bit.ly/mcf-scholars-26', className: 'text-primary' },
  { text: '💬 join us: bit.ly/futatechies2', className: 'text-primary' },
  { text: '', className: '' },
  { text: 'HENQSOFT from FUTA Techies', className: 'text-ink-soft' },
]

type Stage = 'pasting' | 'formatting' | 'done'

/**
 * the loop a convener recognises instantly: paste the raw thing, watch it come
 * back branded, numbered and signed. runs on a timer rather than gsap because
 * it is a state machine, not a tween.
 */
export function ComposerPreview() {
  const [stage, setStage] = useState<Stage>('pasting')
  const [typed, setTyped] = useState('')
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced.current) {
      setTyped(RAW)
      setStage('done')
      return
    }

    let timers: number[] = []
    let frame = 0

    const run = () => {
      setStage('pasting')
      setTyped('')

      // reveal the raw paste a chunk at a time, which reads as typing without
      // the cost of a character by character timer
      const step = 6
      const typeTimer = window.setInterval(() => {
        frame += step
        setTyped(RAW.slice(0, frame))
        if (frame >= RAW.length) {
          window.clearInterval(typeTimer)
          timers.push(
            window.setTimeout(() => setStage('formatting'), 420),
            window.setTimeout(() => setStage('done'), 1750),
            window.setTimeout(() => {
              frame = 0
              run()
            }, 8200),
          )
        }
      }, 26)

      timers.push(typeTimer)
    }

    run()

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.forEach((timer) => window.clearInterval(timer))
      timers = []
    }
  }, [])

  return (
    <div className="w-full max-w-[26rem] rounded-2xl border border-hairline bg-canvas p-2 shadow-raised">
      {/* the paste */}
      <div className="rounded-xl bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-overline uppercase text-ink-muted">pasted</span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-caption transition-colors duration-base',
              stage === 'pasting'
                ? 'bg-surface-2 text-ink-muted'
                : 'bg-primary-soft text-primary',
            )}
          >
            {stage === 'pasting' ? (
              'reading'
            ) : (
              <>
                <Check size={11} weight="bold" aria-hidden="true" />
                understood
              </>
            )}
          </span>
        </div>

        <p className="mt-2.5 min-h-[4.5rem] text-body-sm leading-relaxed text-ink-muted">
          {typed}
          {stage === 'pasting' && (
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-primary motion-safe:animate-pulse"
            />
          )}
        </p>
      </div>

      {/* the handoff */}
      <div className="flex items-center justify-center gap-2 py-2.5">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-caption transition-colors duration-base ease-standard',
            stage === 'formatting'
              ? 'border-primary-line bg-primary-soft text-primary'
              : 'border-hairline bg-canvas text-ink-muted',
          )}
        >
          <Sparkle
            size={12}
            weight="fill"
            aria-hidden="true"
            className={cn(stage === 'formatting' && 'motion-safe:animate-spin')}
          />
          {stage === 'formatting' ? 'formatting in your style' : 'format with ai'}
        </span>
      </div>

      {/* the result */}
      <div
        className={cn(
          'rounded-xl border border-hairline bg-canvas p-4 transition-opacity duration-slow ease-out',
          stage === 'done' ? 'opacity-100' : 'opacity-35',
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-hairline pb-3">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-success-soft text-success">
            <WhatsappLogo size={16} weight="fill" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption font-semibold text-ink">FUTA Techies</p>
            <p className="text-caption text-ink-muted">whatsapp channel</p>
          </div>
          <span className="shrink-0 text-caption text-ink-muted">now</span>
        </div>

        {/* the update itself keeps its own casing, it is the community's voice */}
        <div className="mt-3 space-y-1 font-body text-body-sm leading-relaxed">
          {FORMATTED.map((line, index) =>
            line.text === '' ? (
              <div key={index} className="h-1.5" aria-hidden="true" />
            ) : (
              <p key={index} className={line.className}>
                {line.text}
              </p>
            ),
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
          <span className="text-caption text-ink-muted">ready for 4 channels</span>
          <span className="inline-flex items-center gap-1 text-caption font-semibold text-primary">
            copy
            <ArrowRight size={11} weight="bold" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  )
}
