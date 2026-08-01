import type { DescriptorRef } from '../api/client'

type CurriculumLinksPanelProps = {
  subject: string
  descriptors: DescriptorRef[]
  selectedDescriptors: Set<string>
  onToggleDescriptor: (id: string) => void
}

export function CurriculumLinksPanel({
  subject,
  descriptors,
  selectedDescriptors,
  onToggleDescriptor,
}: CurriculumLinksPanelProps) {
  const sortedDescriptors = [...descriptors].sort((a, b) =>
    a.label.localeCompare(b.label, 'en-AU', { sensitivity: 'base' }),
  )

  if (!sortedDescriptors.length) {
    return (
      <section className="ui-card p-4 sm:p-6 no-print">
        <h2 className="ui-section-heading border-l-2 border-blue pl-3">Curriculum Links</h2>
        <p className="mt-2 text-sm text-text-muted">
          Choose a subject on the left to load optional Australian Curriculum descriptors.
        </p>
      </section>
    )
  }

  return (
    <section className="ui-card p-4 sm:p-6 no-print">
      <h2 className="ui-section-heading border-l-2 border-blue pl-3">Curriculum Links</h2>
      <p className="mt-2 text-sm text-text-muted">
        Optional alignment themes for {subject} — planning prompts to weave into objectives, not
        official ACARA content description codes. Select up to four (A–Z).
      </p>
      <div className="mt-4 max-h-[min(28rem,50vh)] space-y-2 overflow-y-auto overscroll-contain pr-1">
        {sortedDescriptors.map((descriptor) => {
          const checked = selectedDescriptors.has(descriptor.id)
          const disabled = !checked && selectedDescriptors.size >= 4
          return (
            <label
              key={descriptor.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                checked
                  ? 'border-blue bg-blue-soft/40'
                  : 'border-border bg-surface hover:border-blue/40'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggleDescriptor(descriptor.id)}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-medium text-text">{descriptor.label}</span>
                <span className="block text-sm text-text-muted">{descriptor.summary}</span>
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}
