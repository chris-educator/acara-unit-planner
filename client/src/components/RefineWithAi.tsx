import { useEffect, useState } from 'react'
import { refineUnitSection } from '../api/client'
import { REFINE_SUGGESTIONS } from '../constants/formOptions'
import { useBillingGate } from '../hooks/useBillingGate'
import { SignInGatedButton } from './SignInGatedButton'

type RefineWithAiProps = {
  apiReady: boolean
  sectionLabel: string
  onRefine: (instruction: string) => Promise<void>
}

export function RefineWithAi({ apiReady, sectionLabel, onRefine }: RefineWithAiProps) {
  const { billingActive, requiresSignIn, requiresEmailVerification, signInTo, emailVerifyTo } =
    useBillingGate()
  const [open, setOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setInstruction('')
      setError('')
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!instruction.trim()) return
    setLoading(true)
    setError('')
    try {
      await onRefine(instruction.trim())
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refinement failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="unit-refine-trigger"
        disabled={!apiReady}
        onClick={() => setOpen(true)}
        title={apiReady ? `Refine ${sectionLabel} with AI` : 'AI unavailable'}
      >
        Refine
      </button>

      {open ? (
        <div className="unit-refine-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="unit-refine-dialog"
            role="dialog"
            aria-labelledby="refine-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="refine-dialog-title" className="unit-refine-dialog__title">
              Refine {sectionLabel}
            </h3>
            <p className="unit-refine-dialog__lead">
              Describe how you want this section changed — tone, length, difficulty, or activity type.
            </p>
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={3}
                className="ui-input resize-y"
                placeholder="e.g. Make the main activity more hands-on with a gallery walk"
                autoFocus
              />
              <div className="unit-refine-suggestions">
                {REFINE_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="unit-refine-suggestion"
                    onClick={() => setInstruction(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              {error ? <div className="ui-callout-orange text-sm" role="alert">{error}</div> : null}
              <div className="flex flex-wrap gap-2">
                <SignInGatedButton
                  type="submit"
                  className="ui-btn-primary"
                  requiresSignIn={requiresSignIn}
                  requiresEmailVerification={requiresEmailVerification}
                  signInTo={signInTo}
                  emailVerifyTo={emailVerifyTo}
                  disabled={loading || !instruction.trim()}
                >
                  {loading
                    ? 'Refining…'
                    : billingActive
                      ? 'Apply Refinement (3 credits)'
                      : 'Apply Refinement'}
                </SignInGatedButton>
                <button type="button" className="ui-btn-ghost" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}

export async function runRefine(
  unit: Parameters<typeof refineUnitSection>[0]['unit'],
  sectionPath: string,
  instruction: string,
): Promise<{ value?: string; values?: string[] }> {
  return refineUnitSection({ unit, section_path: sectionPath, instruction })
}
