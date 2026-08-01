import { SignInGatedButton } from './SignInGatedButton'
import {
  CLASS_CONTEXT_PLACEHOLDER,
  CROSS_CURRICULUM_PRIORITY_OPTIONS,
  GENERAL_CAPABILITY_OPTIONS,
  LESSON_COUNT_OPTIONS,
  PEDAGOGY_FOCUS_OPTIONS,
  TOPIC_PLACEHOLDER,
  YEAR_LEVEL_OPTIONS,
} from '../constants/formOptions'

type UnitSetupFormProps = {
  topic: string
  schoolName: string
  yearLevel: string
  subject: string
  subjects: string[]
  lessonCount: number
  pedagogyFocus: string
  classContext: string
  crossCurriculumPriorities: string[]
  generalCapabilities: string[]
  loading: boolean
  apiReady: boolean
  billingActive?: boolean
  requiresSignIn?: boolean
  requiresEmailVerification?: boolean
  signInTo?: string
  emailVerifyTo?: string
  onTopicChange: (value: string) => void
  onSchoolNameChange: (value: string) => void
  onYearLevelChange: (value: string) => void
  onSubjectChange: (value: string) => void
  onLessonCountChange: (value: number) => void
  onPedagogyFocusChange: (value: string) => void
  onClassContextChange: (value: string) => void
  onCrossCurriculumPrioritiesChange: (values: string[]) => void
  onGeneralCapabilitiesChange: (values: string[]) => void
  onClearDraft: () => void
}

function toggleInList(values: string[], option: string): string[] {
  return values.includes(option) ? values.filter((item) => item !== option) : [...values, option]
}

export function UnitSetupForm({
  topic,
  schoolName,
  yearLevel,
  subject,
  subjects,
  lessonCount,
  pedagogyFocus,
  classContext,
  crossCurriculumPriorities,
  generalCapabilities,
  loading,
  apiReady,
  billingActive = false,
  requiresSignIn = false,
  requiresEmailVerification = false,
  signInTo = '',
  emailVerifyTo,
  onTopicChange,
  onSchoolNameChange,
  onYearLevelChange,
  onSubjectChange,
  onLessonCountChange,
  onPedagogyFocusChange,
  onClassContextChange,
  onCrossCurriculumPrioritiesChange,
  onGeneralCapabilitiesChange,
  onClearDraft,
}: UnitSetupFormProps) {
  const sortedSubjects = [...subjects].sort((a, b) =>
    a.localeCompare(b, 'en-AU', { sensitivity: 'base' }),
  )

  return (
    <div className="space-y-6 no-print">
      <section className="ui-card p-4 sm:p-6">
        <div className="min-w-0">
          <h2 className="ui-section-heading border-l-2 border-blue pl-3">Unit Setup</h2>
          <p className="mt-2 text-sm text-text-muted">
            Plan against Australian Curriculum (ACARA) learning areas and subjects. Defaults open on
            Year 5 Humanities and Social Sciences — change year and subject to match your class.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="ui-label" htmlFor="topic">
              Unit Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              placeholder={TOPIC_PLACEHOLDER}
              className="ui-input"
              required
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="ui-label" htmlFor="school_name">
              School Name
            </label>
            <input
              id="school_name"
              type="text"
              value={schoolName}
              onChange={(e) => onSchoolNameChange(e.target.value)}
              placeholder="Optional — appears on exported pack"
              className="ui-input"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3 min-w-0">
            <label className="ui-label" htmlFor="subject">
              Subject / Learning Area
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="ui-input w-full min-w-0"
            >
              {sortedSubjects.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label className="ui-label" htmlFor="year_level">
              Year Level
            </label>
            <select
              id="year_level"
              value={yearLevel}
              onChange={(e) => onYearLevelChange(e.target.value)}
              className="ui-input w-full"
            >
              {YEAR_LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label className="ui-label" htmlFor="lesson_count">
              Week Count
            </label>
            <select
              id="lesson_count"
              value={lessonCount}
              onChange={(e) => onLessonCountChange(Number(e.target.value))}
              className="ui-input w-full"
            >
              {LESSON_COUNT_OPTIONS.map((count) => (
                <option key={count} value={count}>
                  {count} weeks
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <label className="ui-label" htmlFor="pedagogy_focus">
              Pedagogy Focus
            </label>
            <select
              id="pedagogy_focus"
              value={pedagogyFocus}
              onChange={(e) => onPedagogyFocusChange(e.target.value)}
              className="ui-input w-full"
            >
              <option value="">Default (balanced mix)</option>
              {PEDAGOGY_FOCUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="ui-label" htmlFor="class_context">
              Class Context
            </label>
            <textarea
              id="class_context"
              value={classContext}
              onChange={(e) => onClassContextChange(e.target.value)}
              placeholder={CLASS_CONTEXT_PLACEHOLDER}
              rows={2}
              className="ui-input w-full resize-y"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <fieldset className="min-w-0">
            <legend className="ui-label">Cross-curriculum priorities (optional)</legend>
            <p className="mt-1 text-xs text-text-muted">
              Select any to weave through overview, objectives, and weekly activities.
            </p>
            <div className="mt-3 space-y-2">
              {CROSS_CURRICULUM_PRIORITY_OPTIONS.map((option) => (
                <label key={option} className="flex cursor-pointer items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={crossCurriculumPriorities.includes(option)}
                    onChange={() =>
                      onCrossCurriculumPrioritiesChange(
                        toggleInList(crossCurriculumPriorities, option),
                      )
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="min-w-0">
            <legend className="ui-label">General capabilities (optional)</legend>
            <p className="mt-1 text-xs text-text-muted">
              Optional Australian Curriculum capabilities to emphasise in the plan.
            </p>
            <div className="mt-3 space-y-2">
              {GENERAL_CAPABILITY_OPTIONS.map((option) => (
                <label key={option} className="flex cursor-pointer items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={generalCapabilities.includes(option)}
                    onChange={() =>
                      onGeneralCapabilitiesChange(toggleInList(generalCapabilities, option))
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SignInGatedButton
          type="submit"
          className="ui-btn-primary w-full sm:w-auto"
          requiresSignIn={requiresSignIn}
          requiresEmailVerification={requiresEmailVerification}
          signInTo={signInTo}
          emailVerifyTo={emailVerifyTo}
          disabled={loading || !apiReady}
          functionalTitle={!topic.trim() ? 'Enter a unit topic to generate.' : undefined}
        >
          {loading
            ? 'Building your term plan…'
            : billingActive
              ? 'Generate Term Plan (15 credits)'
              : 'Generate Term Plan'}
        </SignInGatedButton>
        <button
          type="button"
          className="ui-btn-primary w-full sm:w-auto"
          onClick={onClearDraft}
          disabled={loading}
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
