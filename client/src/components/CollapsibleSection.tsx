import { useState, type ReactNode } from 'react'

type CollapsibleSectionProps = {
  title: string
  children: ReactNode
  /** Shown beside the collapse control (e.g. Reset Data). */
  actions?: ReactNode
  defaultOpen?: boolean
  tourId?: string
}

export function CollapsibleSection({
  title,
  children,
  actions,
  defaultOpen = true,
  tourId,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  const toggle = () => setOpen((v) => !v)
  const toggleSymbol = (
    <span className="shrink-0 text-sm text-text-muted" aria-hidden>
      {open ? '−' : '+'}
    </span>
  )

  return (
    <section className="ui-card overflow-hidden" data-tour={tourId}>
      <div className="flex items-center gap-2 px-4 py-3 sm:px-5">
        {actions ? (
          <>
            <button
              type="button"
              onClick={toggle}
              className="min-w-0 flex-1 text-left"
              aria-expanded={open}
            >
              <h2 className="text-sm font-semibold text-text">{title}</h2>
            </button>
            <div className="shrink-0">{actions}</div>
            <button
              type="button"
              onClick={toggle}
              className="shrink-0 px-1 text-text-muted hover:text-text"
              aria-expanded={open}
              aria-label={open ? 'Collapse section' : 'Expand section'}
            >
              {toggleSymbol}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={toggle}
            className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"
            aria-expanded={open}
          >
            <h2 className="text-sm font-semibold text-text">{title}</h2>
            {toggleSymbol}
          </button>
        )}
      </div>

      {open ? (
        <div className="border-t border-border px-4 pb-4 pt-3 sm:px-5">{children}</div>
      ) : null}
    </section>
  )
}
