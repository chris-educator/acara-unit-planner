import type { MicroUnit } from '../api/client'
import { DRAFT_STORAGE_KEY } from '../constants/formOptions'

export type UnitDraft = {
  unit: MicroUnit | null
  topic: string
  schoolName: string
  yearLevel: string
  subject: string
  lessonCount: number
  pedagogyFocus: string
  classContext: string
  selectedDescriptorIds: string[]
  activeLesson: number
  savedAt: string
}

export function loadUnitDraft(): UnitDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as UnitDraft
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function saveUnitDraft(draft: Omit<UnitDraft, 'savedAt'>) {
  try {
    const payload: UnitDraft = { ...draft, savedAt: new Date().toISOString() }
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota errors */
  }
}

export function clearUnitDraft() {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
