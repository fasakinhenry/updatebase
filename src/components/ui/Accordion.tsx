import { useId, useState, type ReactNode } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

export interface AccordionItem {
  question: string
  answer: ReactNode
}

/**
 * a real disclosure pattern: a button that owns aria-expanded and controls the
 * panel, so keyboard and screen reader users get the same affordance as mouse
 * users. the panel stays in the dom so in page search can still find it.
 */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()

  return (
    <div className={cn('divide-y divide-hairline border-y border-hairline', className)}>
      {items.map((item, index) => {
        const expanded = open === index
        const triggerId = `${base}-trigger-${index}`
        const panelId = `${base}-panel-${index}`

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-fast ease-standard hover:text-primary"
              >
                <span className="text-display-xs text-ink">{item.question}</span>
                <CaretDown
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className={cn(
                    'shrink-0 text-ink-muted transition-transform duration-base ease-standard',
                    expanded && 'rotate-180 text-primary',
                  )}
                />
              </button>
            </h3>

            <section
              id={panelId}
              aria-labelledby={triggerId}
              hidden={!expanded}
              className="pb-5"
            >
              <div className="measure text-body text-ink-soft">{item.answer}</div>
            </section>
          </div>
        )
      })}
    </div>
  )
}
