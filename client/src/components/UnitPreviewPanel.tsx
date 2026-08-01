import type { MicroUnit, RubricCriterion, UnitLesson } from '../api/client'
import { LessonEditor } from './LessonEditor'
import { RefineWithAi } from './RefineWithAi'
import { RubricTable } from './RubricTable'

type UnitPreviewPanelProps = {
  unit: MicroUnit
  schoolName: string
  activeLesson: number
  apiReady: boolean
  exporting: boolean
  onActiveLessonChange: (lessonNumber: number) => void
  onUnitChange: (unit: MicroUnit) => void
  onRefine: (sectionPath: string, instruction: string) => Promise<void>
  onExport: (format: 'zip' | 'docx' | 'pdf' | 'txt') => void
  onPrint?: () => void
}

function updateLesson(unit: MicroUnit, lessonNumber: number, patch: Partial<UnitLesson>): MicroUnit {
  return {
    ...unit,
    lessons: unit.lessons.map((lesson) =>
      lesson.lesson_number === lessonNumber ? { ...lesson, ...patch } : lesson,
    ),
  }
}

export function UnitPreviewPanel({
  unit,
  schoolName,
  activeLesson,
  apiReady,
  exporting,
  onActiveLessonChange,
  onUnitChange,
  onRefine,
  onExport,
  onPrint,
}: UnitPreviewPanelProps) {
  const active = unit.lessons.find((l) => l.lesson_number === activeLesson) ?? unit.lessons[0]
  const activeIndex = active ? active.lesson_number - 1 : 0

  function updateRubric(index: number, field: keyof RubricCriterion, value: string) {
    const rubric = unit.unit_assessment.rubric.map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    )
    onUnitChange({
      ...unit,
      unit_assessment: { ...unit.unit_assessment, rubric },
    })
  }

  return (
    <div className="unit-preview-panel print-unit">
      <section className="ui-card p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue">Your unit</p>
            <h2 className="mt-1 font-heading text-xl font-bold text-text sm:text-2xl">
              {unit.unit_title}
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              {unit.lesson_count} weeks · {unit.subject} · {unit.year_level}
              {schoolName.trim() ? ` · ${schoolName.trim()}` : ''}
            </p>
          </div>
          <div className="unit-export-actions no-print">
            <button
              type="button"
              className="ui-btn-secondary"
              disabled={exporting}
              onClick={() => onExport('docx')}
            >
              docx
            </button>
            <button
              type="button"
              className="ui-btn-secondary"
              disabled={exporting}
              onClick={() => onExport('pdf')}
            >
              pdf
            </button>
            <button
              type="button"
              className="ui-btn-secondary"
              disabled={exporting}
              onClick={() => onExport('txt')}
            >
              txt
            </button>
            <button
              type="button"
              className="ui-btn-secondary"
              disabled={exporting}
              onClick={() => onExport('zip')}
            >
              zip
            </button>
            {onPrint ? (
              <button type="button" className="ui-btn-ghost text-xs sm:col-span-1" onClick={onPrint}>
                Print
              </button>
            ) : null}
          </div>
        </div>

        {unit.suggested_descriptors.length ? (
          <div className="mt-4">
            <p className="mb-2 text-xs text-text-muted">
              Alignment themes (not official ACARA codes)
            </p>
            <ul className="unit-descriptor-chips">
              {unit.suggested_descriptors.map((d) => (
                <li key={d.id} className="unit-descriptor-chip">
                  {d.label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {(unit.cross_curriculum_priorities?.length || unit.general_capabilities?.length) ? (
          <div className="mt-4 space-y-2 text-sm text-text-muted">
            {unit.cross_curriculum_priorities?.length ? (
              <p>
                <span className="font-semibold text-text">Cross-curriculum priorities: </span>
                {unit.cross_curriculum_priorities.join(' · ')}
              </p>
            ) : null}
            {unit.general_capabilities?.length ? (
              <p>
                <span className="font-semibold text-text">General capabilities: </span>
                {unit.general_capabilities.join(' · ')}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="ui-card p-4 sm:p-6">
        <div className="unit-field-label-row">
          <label className="ui-label" htmlFor="unit_title">
            Unit Title
          </label>
          <RefineWithAi
            apiReady={apiReady}
            sectionLabel="unit title"
            onRefine={(instruction) => onRefine('unit_title', instruction)}
          />
        </div>
        <input
          id="unit_title"
          value={unit.unit_title}
          onChange={(e) => onUnitChange({ ...unit, unit_title: e.target.value })}
          className="ui-input"
        />

        <div className="mt-4">
          <div className="unit-field-label-row">
            <label className="ui-label" htmlFor="overview">
              Unit Overview
            </label>
            <RefineWithAi
              apiReady={apiReady}
              sectionLabel="unit overview"
              onRefine={(instruction) => onRefine('overview', instruction)}
            />
          </div>
          <textarea
            id="overview"
            value={unit.overview}
            onChange={(e) => onUnitChange({ ...unit, overview: e.target.value })}
            rows={4}
            className="ui-input resize-y"
          />
        </div>

        <div className="mt-4">
          <div className="unit-field-label-row">
            <label className="ui-label" htmlFor="success_criteria">
              Success Criteria
            </label>
            <RefineWithAi
              apiReady={apiReady}
              sectionLabel="success criteria"
              onRefine={(instruction) => onRefine('success_criteria', instruction)}
            />
          </div>
          <textarea
            id="success_criteria"
            value={unit.success_criteria.join('\n')}
            onChange={(e) =>
              onUnitChange({
                ...unit,
                success_criteria: e.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean),
              })
            }
            rows={4}
            className="ui-input resize-y font-mono text-sm"
            placeholder="One criterion per line"
          />
        </div>
      </section>

      <section className="ui-card p-4 sm:p-6">
        <h3 className="ui-section-heading border-l-2 border-blue pl-3">Weeks</h3>
        <nav className="unit-lesson-tabs no-print" aria-label="Week navigation">
          {unit.lessons.map((lesson) => (
            <button
              key={lesson.lesson_number}
              type="button"
              className={`unit-lesson-tab ${activeLesson === lesson.lesson_number ? 'unit-lesson-tab--active' : ''}`}
              onClick={() => onActiveLessonChange(lesson.lesson_number)}
            >
              <span className="unit-lesson-tab__num">{lesson.lesson_number}</span>
              <span className="unit-lesson-tab__title">{lesson.title}</span>
            </button>
          ))}
        </nav>

        {active ? (
          <LessonEditor
            lesson={active}
            lessonIndex={activeIndex}
            apiReady={apiReady}
            onChange={(patch) => onUnitChange(updateLesson(unit, active.lesson_number, patch))}
            onRefine={onRefine}
          />
        ) : null}
      </section>

      <section className="ui-card p-4 sm:p-6">
        <h3 className="ui-section-heading border-l-2 border-blue pl-3">Unit Assessment</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="ui-label" htmlFor="assessment-title">
              Assessment Title
            </label>
            <input
              id="assessment-title"
              value={unit.unit_assessment.title}
              onChange={(e) =>
                onUnitChange({
                  ...unit,
                  unit_assessment: { ...unit.unit_assessment, title: e.target.value },
                })
              }
              className="ui-input"
            />
          </div>
          <div>
            <div className="unit-field-label-row">
              <label className="ui-label" htmlFor="assessment-instructions">
                Instructions
              </label>
              <RefineWithAi
                apiReady={apiReady}
                sectionLabel="assessment instructions"
                onRefine={(instruction) => onRefine('unit_assessment.instructions', instruction)}
              />
            </div>
            <textarea
              id="assessment-instructions"
              value={unit.unit_assessment.instructions}
              onChange={(e) =>
                onUnitChange({
                  ...unit,
                  unit_assessment: { ...unit.unit_assessment, instructions: e.target.value },
                })
              }
              rows={2}
              className="ui-input resize-y"
            />
          </div>
          <div>
            <div className="unit-field-label-row">
              <label className="ui-label" htmlFor="assessment-tasks">
                Tasks (one per line)
              </label>
              <RefineWithAi
                apiReady={apiReady}
                sectionLabel="assessment tasks"
                onRefine={(instruction) => onRefine('unit_assessment.tasks', instruction)}
              />
            </div>
            <textarea
              id="assessment-tasks"
              value={unit.unit_assessment.tasks.join('\n')}
              onChange={(e) =>
                onUnitChange({
                  ...unit,
                  unit_assessment: {
                    ...unit.unit_assessment,
                    tasks: e.target.value
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean),
                  },
                })
              }
              rows={4}
              className="ui-input resize-y font-mono text-sm"
            />
          </div>
          <RubricTable
            rubric={unit.unit_assessment.rubric}
            apiReady={apiReady}
            onChange={updateRubric}
            onRefine={onRefine}
          />
        </div>
      </section>
    </div>
  )
}
