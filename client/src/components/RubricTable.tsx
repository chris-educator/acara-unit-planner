import type { RubricCriterion } from '../api/client'
import { RefineWithAi } from './RefineWithAi'
import { rubricPath } from '../utils/applySectionUpdate'

type RubricTableProps = {
  rubric: RubricCriterion[]
  apiReady: boolean
  onChange: (index: number, field: keyof RubricCriterion, value: string) => void
  onRefine: (sectionPath: string, instruction: string) => Promise<void>
}

const LEVELS: Array<{ key: keyof RubricCriterion; label: string }> = [
  { key: 'developing', label: 'Developing' },
  { key: 'meeting', label: 'Meeting' },
  { key: 'exceeding', label: 'Exceeding' },
]

export function RubricTable({ rubric, apiReady, onChange, onRefine }: RubricTableProps) {
  if (!rubric.length) return null

  return (
    <div className="unit-rubric-wrap">
      <h4 className="text-sm font-semibold text-text">Assessment Rubric</h4>
      <div className="unit-rubric-scroll">
        <table className="unit-rubric-table">
          <thead>
            <tr>
              <th scope="col">Criterion</th>
              {LEVELS.map((level) => (
                <th key={level.key} scope="col">
                  {level.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rubric.map((row, rowIndex) => (
              <tr key={row.criterion || rowIndex}>
                <th scope="row">
                  <div className="unit-field-with-refine">
                    <input
                      value={row.criterion}
                      onChange={(e) => onChange(rowIndex, 'criterion', e.target.value)}
                      className="ui-input text-sm"
                      aria-label={`Criterion ${rowIndex + 1}`}
                    />
                    <RefineWithAi
                      apiReady={apiReady}
                      sectionLabel={`criterion ${rowIndex + 1}`}
                      onRefine={(instruction) => onRefine(rubricPath(rowIndex, 'criterion'), instruction)}
                    />
                  </div>
                </th>
                {LEVELS.map((level) => (
                  <td key={level.key}>
                    <div className="unit-field-with-refine">
                      <textarea
                        value={row[level.key]}
                        onChange={(e) => onChange(rowIndex, level.key, e.target.value)}
                        rows={3}
                        className="ui-input resize-y text-sm"
                        aria-label={`${row.criterion || 'Criterion'} — ${level.label}`}
                      />
                      <RefineWithAi
                        apiReady={apiReady}
                        sectionLabel={`${level.label.toLowerCase()} level`}
                        onRefine={(instruction) =>
                          onRefine(rubricPath(rowIndex, level.key), instruction)
                        }
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
