export const YEAR_LEVEL_OPTIONS = [
  'Year 3',
  'Year 4',
  'Year 5',
  'Year 6',
  'Year 7',
  'Year 8',
  'Year 9',
  'Year 10',
  'Year 11',
  'Year 12',
] as const

export const LESSON_COUNT_OPTIONS = [6, 7, 8, 9, 10] as const
export const DEFAULT_LESSON_COUNT = 8

export const PEDAGOGY_FOCUS_OPTIONS = [
  '',
  'Inquiry-based learning',
  'Direct instruction with guided practice',
  'Project-based learning',
  'Collaborative group work',
  'Flipped classroom hooks',
  'Workshop / station rotation',
] as const

export const CLASS_CONTEXT_PLACEHOLDER =
  'Optional — e.g. mixed-ability class, low literacy cohort, limited devices, 50-minute periods'

export const REFINE_SUGGESTIONS = [
  'Make more hands-on',
  'Add more formative checks',
  'Lower reading level',
  'Add more scaffolding',
  'Strengthen summative assessment alignment',
] as const

export const DRAFT_STORAGE_KEY = 'acara-unit-planner-draft-v1'
