import type { DescriptorRef } from '../api/client'
import { SignInGatedButton } from './SignInGatedButton'
import {
  CLASS_CONTEXT_PLACEHOLDER,
  LESSON_COUNT_OPTIONS,
  PEDAGOGY_FOCUS_OPTIONS,
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
  descriptors: DescriptorRef[]
  selectedDescriptors: Set<string>
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
  onToggleDescriptor: (id: string) => void
  onClearDraft: () => void
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
  descriptors,
  selectedDescriptors,
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
  onToggleDescriptor,
  onClearDraft,
}: UnitSetupFormProps) {
  return (
    <div className="space-y-6 no-print">
      <section className="ui-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="ui-section-heading border-l-2 border-blue pl-3">Unit Setup</h2>
            <p className="mt-2 text-sm text-text-muted">
              Describe your topic and class context — the AI builds a sequenced mini-unit with
              materials, differentiation, and a marking rubric.
            </p>
          </div>
          <button type="button" className="ui-btn-ghost text-xs" onClick={onClearDraft}>
            Clear All
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="ui-label" htmlFor="topic">
              Unit Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              placeholder="e.g. Ecosystem interactions and food webs"
              className="ui-input"
              required
            />
          </div>
          <div className="sm:col-span-2">
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
          <div>
            <label className="ui-label" htmlFor="year_level">
              Year Level
            </label>
            <select
              id="year_level"
              value={yearLevel}
              onChange={(e) => onYearLevelChange(e.target.value)}
              className="ui-input"
            >
              {YEAR_LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="ui-label" htmlFor="subject">
              Subject / KLA
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="ui-input"
            >
              {subjects.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="ui-label" htmlFor="lesson_count">
              Lesson Count
            </label>
            <select
              id="lesson_count"
              value={lessonCount}
              onChange={(e) => onLessonCountChange(Number(e.target.value))}
              className="ui-input"
            >
              {LESSON_COUNT_OPTIONS.map((count) => (
                <option key={count} value={count}>
                  {count} lessons
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="ui-label" htmlFor="pedagogy_focus">
              Pedagogy Focus
            </label>
            <select
              id="pedagogy_focus"
              value={pedagogyFocus}
              onChange={(e) => onPedagogyFocusChange(e.target.value)}
              className="ui-input"
            >
              <option value="">Default (balanced mix)</option>
              {PEDAGOGY_FOCUS_OPTIONS.filter(Boolean).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="ui-label" htmlFor="class_context">
              Class Context
            </label>
            <textarea
              id="class_context"
              value={classContext}
              onChange={(e) => onClassContextChange(e.target.value)}
              placeholder={CLASS_CONTEXT_PLACEHOLDER}
              rows={2}
              className="ui-input resize-y"
            />
          </div>
        </div>
      </section>

      {descriptors.length ? (
        <section className="ui-card p-4 sm:p-6">
          <h2 className="ui-section-heading border-l-2 border-blue pl-3">
            Curriculum Links
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Optional descriptors for {subject}. Select up to four to weave into objectives.
          </p>
          <div className="mt-4 space-y-2">
            {descriptors.map((descriptor) => {
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
      ) : null}

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
          ? 'Building your micro-unit…'
          : billingActive
            ? 'Generate Micro-Unit (10 credits)'
            : 'Generate Micro-Unit'}
      </SignInGatedButton>
    </div>
  )
}
