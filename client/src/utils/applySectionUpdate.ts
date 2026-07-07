import type { MicroUnit } from '../api/client'

export function applySectionUpdate(
  unit: MicroUnit,
  sectionPath: string,
  result: { value?: string; values?: string[] },
): MicroUnit {
  const copy = structuredClone(unit)
  const parts = sectionPath.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = copy

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    node = /^\d+$/.test(key) ? node[Number(key)] : node[key]
  }

  const last = parts[parts.length - 1]
  if (result.values) {
    node[last] = result.values
  } else if (result.value !== undefined) {
    node[last] = result.value
  }

  return copy
}

export function lessonPath(lessonIndex: number, field: string) {
  return `lessons.${lessonIndex}.${field}`
}

export function rubricPath(rowIndex: number, field: string) {
  return `unit_assessment.rubric.${rowIndex}.${field}`
}
