import type { UnitLesson } from '../api/client'
import { RefineWithAi } from './RefineWithAi'
import { lessonPath } from '../utils/applySectionUpdate'

type LessonEditorProps = {
  lesson: UnitLesson
  lessonIndex: number
  apiReady: boolean
  onChange: (patch: Partial<UnitLesson>) => void
  onRefine: (sectionPath: string, instruction: string) => Promise<void>
}

function listField(
  label: string,
  values: string[],
  onChange: (values: string[]) => void,
  sectionPath: string,
  apiReady: boolean,
  onRefine: (path: string, instruction: string) => Promise<void>,
  id: string,
) {
  return (
    <div>
      <div className="unit-field-label-row">
        <label className="ui-label" htmlFor={id}>
          {label}
        </label>
        <RefineWithAi
          apiReady={apiReady}
          sectionLabel={label.toLowerCase()}
          onRefine={(instruction) => onRefine(sectionPath, instruction)}
        />
      </div>
      <textarea
        id={id}
        value={values.join('\n')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean),
          )
        }
        rows={Math.max(3, values.length + 1)}
        className="ui-input resize-y font-mono text-sm"
        placeholder="One item per line"
      />
    </div>
  )
}

function textField(
  label: string,
  value: string,
  onChange: (value: string) => void,
  sectionPath: string,
  apiReady: boolean,
  onRefine: (path: string, instruction: string) => Promise<void>,
  id: string,
  rows = 3,
) {
  return (
    <div>
      <div className="unit-field-label-row">
        <label className="ui-label" htmlFor={id}>
          {label}
        </label>
        <RefineWithAi
          apiReady={apiReady}
          sectionLabel={label.toLowerCase()}
          onRefine={(instruction) => onRefine(sectionPath, instruction)}
        />
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="ui-input resize-y"
      />
    </div>
  )
}

export function LessonEditor({
  lesson,
  lessonIndex,
  apiReady,
  onChange,
  onRefine,
}: LessonEditorProps) {
  const n = lesson.lesson_number
  const base = lessonIndex

  return (
    <div className="unit-lesson-editor">
      <div className="unit-lesson-editor__header">
        <span className="unit-lesson-badge">Lesson {n}</span>
        {lesson.timing_notes ? (
          <span className="unit-lesson-timing">{lesson.timing_notes}</span>
        ) : null}
      </div>

      <div>
        <div className="unit-field-label-row">
          <label className="ui-label" htmlFor={`title-${n}`}>
            Lesson Title
          </label>
          <RefineWithAi
            apiReady={apiReady}
            sectionLabel="lesson title"
            onRefine={(instruction) => onRefine(lessonPath(base, 'title'), instruction)}
          />
        </div>
        <input
          id={`title-${n}`}
          value={lesson.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="ui-input"
        />
      </div>

      {listField(
        'Learning Objectives',
        lesson.learning_objectives,
        (learning_objectives) => onChange({ learning_objectives }),
        lessonPath(base, 'learning_objectives'),
        apiReady,
        onRefine,
        `objectives-${n}`,
      )}

      {listField(
        'Materials Needed',
        lesson.materials_needed,
        (materials_needed) => onChange({ materials_needed }),
        lessonPath(base, 'materials_needed'),
        apiReady,
        onRefine,
        `materials-${n}`,
      )}

      {textField(
        'Starter',
        lesson.starter,
        (starter) => onChange({ starter }),
        lessonPath(base, 'starter'),
        apiReady,
        onRefine,
        `starter-${n}`,
        3,
      )}

      {textField(
        'Main Activity',
        lesson.main_activity,
        (main_activity) => onChange({ main_activity }),
        lessonPath(base, 'main_activity'),
        apiReady,
        onRefine,
        `main-${n}`,
        5,
      )}

      {textField(
        'Exit Ticket',
        lesson.exit_ticket,
        (exit_ticket) => onChange({ exit_ticket }),
        lessonPath(base, 'exit_ticket'),
        apiReady,
        onRefine,
        `exit-${n}`,
        2,
      )}

      <div className="unit-diff-grid">
        {textField(
          'Differentiation — Support',
          lesson.differentiation_support,
          (differentiation_support) => onChange({ differentiation_support }),
          lessonPath(base, 'differentiation_support'),
          apiReady,
          onRefine,
          `support-${n}`,
          3,
        )}
        {textField(
          'Differentiation — Extension',
          lesson.differentiation_extension,
          (differentiation_extension) => onChange({ differentiation_extension }),
          lessonPath(base, 'differentiation_extension'),
          apiReady,
          onRefine,
          `extension-${n}`,
          3,
        )}
      </div>

      <div>
        <label className="ui-label" htmlFor={`timing-${n}`}>
          Timing Notes
        </label>
        <input
          id={`timing-${n}`}
          value={lesson.timing_notes}
          onChange={(e) => onChange({ timing_notes: e.target.value })}
          className="ui-input"
          placeholder="e.g. 50 min · Starter 8 min · Main 32 min · Exit 10 min"
        />
      </div>
    </div>
  )
}
