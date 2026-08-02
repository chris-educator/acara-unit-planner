type ApiStatusProps = {
  /** Primary generation LLM readiness (`null` = still checking). */
  apiReady: boolean | null
  /** Ask / Gemini readiness — when false and generate is ready, show a partial label. */
  assistantReady?: boolean | null
}

/**
 * Status pill for the title-row cluster (left of Claude / Gemini badges).
 * Matches badge height so the right-aligned group reads as one unit.
 */
export function ApiStatus({ apiReady, assistantReady = null }: ApiStatusProps) {
  const checking = apiReady === null
  const ready = apiReady === true
  const partial = ready && assistantReady === false

  const label = checking
    ? 'Checking API…'
    : ready
      ? partial
        ? 'AI ready · Ask unavailable'
        : 'AI Ready'
      : 'API not configured'

  const tone = checking ? 'api-status--checking' : ready ? 'api-status--ready' : 'api-status--warn'

  return (
    <div role="status" title={label} className={`api-status ${tone}`}>
      <span
        className={`api-status__dot${ready && !partial ? ' api-status__dot--pulse' : ''}`}
        aria-hidden
      />
      <span>{label}</span>
    </div>
  )
}
