import type { SuggestedResource, SuggestedResourceKind } from '../api/client'
import {
  RESOURCE_KIND_OPTIONS,
  RESOURCE_PORTAL_OPTIONS,
  RESOURCE_SEARCH_DISCLAIMER,
  resourceSearchUrl,
} from '../constants/resources'

type SuggestedResourcesEditorProps = {
  resources: SuggestedResource[]
  weekNumber: number
  onChange: (resources: SuggestedResource[]) => void
}

function emptyResource(): SuggestedResource {
  return {
    title: '',
    kind: 'website',
    why: '',
    search_query: '',
    portal: '',
  }
}

export function SuggestedResourcesEditor({
  resources,
  weekNumber,
  onChange,
}: SuggestedResourcesEditorProps) {
  const items = resources.length ? resources : [emptyResource()]

  function updateAt(index: number, patch: Partial<SuggestedResource>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    onChange(next)
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label className="ui-label mb-0">Suggested Resources</label>
        <p className="text-[11px] text-text-muted">{RESOURCE_SEARCH_DISCLAIMER}</p>
      </div>
      {items.map((item, index) => {
        const searchHref = resourceSearchUrl(item.search_query)
        return (
          <div
            key={`resource-${weekNumber}-${index}`}
            className="space-y-2 rounded-lg border border-border bg-surface-raised/40 p-3"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="ui-label" htmlFor={`res-title-${weekNumber}-${index}`}>
                  Title
                </label>
                <input
                  id={`res-title-${weekNumber}-${index}`}
                  className="ui-input"
                  value={item.title}
                  onChange={(e) => updateAt(index, { title: e.target.value })}
                />
              </div>
              <div>
                <label className="ui-label" htmlFor={`res-kind-${weekNumber}-${index}`}>
                  Kind
                </label>
                <select
                  id={`res-kind-${weekNumber}-${index}`}
                  className="ui-input w-full"
                  value={item.kind}
                  onChange={(e) =>
                    updateAt(index, { kind: e.target.value as SuggestedResourceKind })
                  }
                >
                  {RESOURCE_KIND_OPTIONS.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="ui-label" htmlFor={`res-why-${weekNumber}-${index}`}>
                Why This Helps
              </label>
              <input
                id={`res-why-${weekNumber}-${index}`}
                className="ui-input"
                value={item.why}
                onChange={(e) => updateAt(index, { why: e.target.value })}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="ui-label" htmlFor={`res-query-${weekNumber}-${index}`}>
                  Search Query
                </label>
                <input
                  id={`res-query-${weekNumber}-${index}`}
                  className="ui-input"
                  value={item.search_query}
                  onChange={(e) => updateAt(index, { search_query: e.target.value })}
                  placeholder="e.g. ABC Education Year 5 water cycle"
                />
                {searchHref ? (
                  <a
                    href={searchHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-blue hover:underline"
                  >
                    Open Search
                  </a>
                ) : null}
              </div>
              <div>
                <label className="ui-label" htmlFor={`res-portal-${weekNumber}-${index}`}>
                  Portal (Optional)
                </label>
                <select
                  id={`res-portal-${weekNumber}-${index}`}
                  className="ui-input w-full"
                  value={item.portal ?? ''}
                  onChange={(e) => updateAt(index, { portal: e.target.value })}
                >
                  {RESOURCE_PORTAL_OPTIONS.map((portal) => (
                    <option key={portal || 'none'} value={portal}>
                      {portal || 'None'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="ui-btn-ghost text-xs"
                onClick={() => removeAt(index)}
                disabled={items.length <= 1}
              >
                Remove
              </button>
            </div>
          </div>
        )
      })}
      <button
        type="button"
        className="ui-btn-ghost text-xs"
        onClick={() => onChange([...items, emptyResource()])}
        disabled={items.length >= 4}
      >
        Add Resource
      </button>
    </div>
  )
}
