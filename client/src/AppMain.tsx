import { useCallback, useEffect, useState } from 'react'
import {
  exportMicroUnit,
  FetchTimeoutError,
  fetchDescriptors,
  fetchHealth,
  fetchSubjects,
  generateMicroUnit,
  refineUnitSection,
  type DescriptorRef,
  type MicroUnit,
} from './api/client'
import { CurriculumLinksPanel } from './components/CurriculumLinksPanel'
import { HowToUseGuide } from './components/HowToUseGuide'
import { Layout } from './components/Layout'
import { SignInCreditsCallout } from './components/SignInCreditsCallout'
import { SignInGatedButton } from './components/SignInGatedButton'
import { UnitPreviewPanel } from './components/UnitPreviewPanel'
import { UnitSetupForm } from './components/UnitSetupForm'
import {
  DEFAULT_LESSON_COUNT,
  DEFAULT_SUBJECT,
  DEFAULT_YEAR_LEVEL,
  SUBJECT_OPTIONS_FALLBACK,
} from './constants/formOptions'
import { useAuth } from './context/AuthContext'
import { useBillingGate } from './hooks/useBillingGate'
import { clearUnitDraft, loadUnitDraft, saveUnitDraft } from './hooks/useUnitDraft'

import { applySectionUpdate } from './utils/applySectionUpdate'

export default function AppMain() {
  const { applyCreditsRemaining } = useAuth()
  const { billingActive, requiresSignIn, requiresEmailVerification, signInTo, emailVerifyTo } =
    useBillingGate()
  const draft = loadUnitDraft()

  const [subjects, setSubjects] = useState<string[]>([...SUBJECT_OPTIONS_FALLBACK])
  const [descriptors, setDescriptors] = useState<DescriptorRef[]>([])
  const [selectedDescriptors, setSelectedDescriptors] = useState<Set<string>>(
    new Set(draft?.selectedDescriptorIds ?? []),
  )
  const [topic, setTopic] = useState(draft?.topic ?? '')
  const [schoolName, setSchoolName] = useState(draft?.schoolName ?? '')
  const [yearLevel, setYearLevel] = useState(draft?.yearLevel ?? DEFAULT_YEAR_LEVEL)
  const [subject, setSubject] = useState(draft?.subject ?? DEFAULT_SUBJECT)
  const [lessonCount, setLessonCount] = useState(draft?.lessonCount ?? DEFAULT_LESSON_COUNT)
  const [pedagogyFocus, setPedagogyFocus] = useState(draft?.pedagogyFocus ?? '')
  const [classContext, setClassContext] = useState(draft?.classContext ?? '')
  const [crossCurriculumPriorities, setCrossCurriculumPriorities] = useState<string[]>(
    draft?.crossCurriculumPriorities ?? [],
  )
  const [generalCapabilities, setGeneralCapabilities] = useState<string[]>(
    draft?.generalCapabilities ?? [],
  )
  const [unit, setUnit] = useState<MicroUnit | null>(draft?.unit ?? null)
  const [activeLesson, setActiveLesson] = useState(draft?.activeLesson ?? 1)
  const [draftBanner, setDraftBanner] = useState(Boolean(draft?.unit))
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')
  const [apiReady, setApiReady] = useState<boolean | null>(null)
  const [assistantReady, setAssistantReady] = useState(false)

  useEffect(() => {
    fetchHealth()
      .then((health) => {
        setApiReady(Boolean(health.api_key_configured))
        setAssistantReady(
          Boolean(health.assistant_ready ?? health.gemini_configured ?? health.anthropic_configured),
        )
      })
      .catch(() => {
        setApiReady(false)
        setAssistantReady(false)
      })
    fetchSubjects()
      .then((data) => {
        const sorted = [...data.subjects].sort((a, b) =>
          a.localeCompare(b, 'en-AU', { sensitivity: 'base' }),
        )
        const next = sorted.length ? sorted : [...SUBJECT_OPTIONS_FALLBACK]
        setSubjects(next)
        setSubject((current) => (next.includes(current) ? current : DEFAULT_SUBJECT))
      })
      .catch(() => {
        setSubjects([...SUBJECT_OPTIONS_FALLBACK])
        setSubject((current) =>
          (SUBJECT_OPTIONS_FALLBACK as readonly string[]).includes(current)
            ? current
            : DEFAULT_SUBJECT,
        )
        setError('Could not load subject list — using Australian curriculum defaults.')
      })
  }, [])

  useEffect(() => {
    fetchDescriptors(subject)
      .then((data) => {
        setDescriptors(data.descriptors)
        setSelectedDescriptors((prev) => {
          const allowed = new Set(data.descriptors.map((item) => item.id))
          return new Set([...prev].filter((id) => allowed.has(id)))
        })
      })
      .catch(() => setDescriptors([]))
  }, [subject])

  useEffect(() => {
    saveUnitDraft({
      unit,
      topic,
      schoolName,
      yearLevel,
      subject,
      lessonCount,
      pedagogyFocus,
      classContext,
      crossCurriculumPriorities,
      generalCapabilities,
      selectedDescriptorIds: [...selectedDescriptors],
      activeLesson,
    })
  }, [
    unit,
    topic,
    schoolName,
    yearLevel,
    subject,
    lessonCount,
    pedagogyFocus,
    classContext,
    crossCurriculumPriorities,
    generalCapabilities,
    selectedDescriptors,
    activeLesson,
  ])

  function toggleDescriptor(id: string) {
    setSelectedDescriptors((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < 4) {
        next.add(id)
      }
      return next
    })
  }

  function clearAll() {
    setTopic('')
    setSchoolName('')
    setYearLevel(DEFAULT_YEAR_LEVEL)
    setSubject(DEFAULT_SUBJECT)
    setLessonCount(DEFAULT_LESSON_COUNT)
    setPedagogyFocus('')
    setClassContext('')
    setCrossCurriculumPriorities([])
    setGeneralCapabilities([])
    setSelectedDescriptors(new Set())
    setUnit(null)
    setActiveLesson(1)
    setError('')
    setDraftBanner(false)
    clearUnitDraft()
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setDraftBanner(false)

    if (!topic.trim()) {
      setError('Enter a unit topic to generate.')
      return
    }

    setLoading(true)
    try {
      const data = await generateMicroUnit({
        topic: topic.trim(),
        year_level: yearLevel,
        subject,
        lesson_count: lessonCount,
        school_name: schoolName.trim(),
        pedagogy_focus: pedagogyFocus,
        class_context: classContext.trim(),
        descriptor_ids: [...selectedDescriptors],
        cross_curriculum_priorities: crossCurriculumPriorities,
        general_capabilities: generalCapabilities,
      })
      setUnit(data.unit)
      setActiveLesson(1)
      if (typeof data.credits_remaining === 'number') {
        applyCreditsRemaining(data.credits_remaining)
      }
    } catch (err) {
      if (err instanceof FetchTimeoutError) {
        setError('Generation timed out — try again in a moment.')
      } else {
        setError(err instanceof Error ? err.message : 'Generation failed')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleExport(format: 'zip' | 'docx' | 'pdf' | 'txt') {
    if (!unit) return
    setExporting(true)
    setError('')
    try {
      const { blob, filename } = await exportMicroUnit({
        unit,
        school_name: schoolName.trim(),
        format,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  const handleRefine = useCallback(
    async (sectionPath: string, instruction: string) => {
      if (!unit) return
      const result = await refineUnitSection({ unit, section_path: sectionPath, instruction })
      setUnit(applySectionUpdate(unit, sectionPath, result))
      if (typeof result.credits_remaining === 'number') {
        applyCreditsRemaining(result.credits_remaining)
      }
    },
    [unit, applyCreditsRemaining],
  )

  function handlePrint() {
    window.print()
  }

  return (
    <Layout
      apiReady={apiReady}
      assistantReady={assistantReady}
      creditsCallout={
        <SignInCreditsCallout
          linkSignIn
          fullWidth
          creditQuote={billingActive ? '12 credits per generate, 2 per refine' : null}
        />
      }
    >
      <div className="space-y-8">
        <HowToUseGuide />

        {draftBanner && unit ? (
          <div className="unit-draft-banner no-print" role="status">
            <span>Restored your last unit from this browser — keep editing or Clear All to start fresh.</span>
            <button type="button" className="ui-btn-ghost text-xs" onClick={() => setDraftBanner(false)}>
              Dismiss
            </button>
          </div>
        ) : null}

        {error ? (
          <div className="ui-callout-orange no-print" role="alert">
            {error}
          </div>
        ) : null}

        <div className="unit-workspace">
          <form className="unit-workspace__form no-print" onSubmit={handleGenerate}>
            <UnitSetupForm
              topic={topic}
              schoolName={schoolName}
              yearLevel={yearLevel}
              subject={subject}
              subjects={subjects.length ? subjects : [...SUBJECT_OPTIONS_FALLBACK]}
              lessonCount={lessonCount}
              pedagogyFocus={pedagogyFocus}
              classContext={classContext}
              crossCurriculumPriorities={crossCurriculumPriorities}
              generalCapabilities={generalCapabilities}
              onTopicChange={setTopic}
              onSchoolNameChange={setSchoolName}
              onYearLevelChange={setYearLevel}
              onSubjectChange={setSubject}
              onLessonCountChange={setLessonCount}
              onPedagogyFocusChange={setPedagogyFocus}
              onClassContextChange={setClassContext}
              onCrossCurriculumPrioritiesChange={setCrossCurriculumPriorities}
              onGeneralCapabilitiesChange={setGeneralCapabilities}
            />

            <CurriculumLinksPanel
              subject={subject}
              descriptors={descriptors}
              selectedDescriptors={selectedDescriptors}
              onToggleDescriptor={toggleDescriptor}
            />

            <div className="unit-actions-row grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <SignInGatedButton
                type="submit"
                className="ui-btn-primary w-full"
                requiresSignIn={requiresSignIn}
                requiresEmailVerification={requiresEmailVerification}
                signInTo={signInTo}
                emailVerifyTo={emailVerifyTo}
                disabled={loading || apiReady !== true}
                functionalTitle={!topic.trim() ? 'Enter a unit topic to generate.' : undefined}
              >
                {loading
                  ? 'Building your term plan…'
                  : billingActive
                    ? 'Generate Term Plan (12 credits)'
                    : 'Generate Term Plan'}
              </SignInGatedButton>
              <button
                type="button"
                className="ui-btn-primary w-full"
                onClick={clearAll}
                disabled={loading}
              >
                Clear All
              </button>
            </div>
          </form>

          {unit ? (
            <UnitPreviewPanel
              unit={unit}
              schoolName={schoolName}
              activeLesson={activeLesson}
              apiReady={apiReady === true}
              exporting={exporting}
              onActiveLessonChange={setActiveLesson}
              onUnitChange={setUnit}
              onRefine={handleRefine}
              onExport={(format) => void handleExport(format)}
              onPrint={handlePrint}
            />
          ) : (
            <aside className="unit-workspace__placeholder no-print" aria-hidden={loading}>
              <div className="unit-empty-state">
                <p className="unit-empty-state__title">Your teacher pack appears here</p>
                <p className="unit-empty-state__text">
                  After generation you will get editable weeks with objectives, materials,
                  differentiation, assessment tasks, and a marking rubric — plus docx, pdf, txt, or
                  zip export.
                </p>
                <ul className="unit-empty-state__list">
                  <li>Week tabs for quick navigation</li>
                  <li>Refine any section with AI</li>
                  <li>Auto-saved in this browser</li>
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>
    </Layout>
  )
}
