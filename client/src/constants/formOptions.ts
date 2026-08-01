/** Year levels stay chronological (Foundation → Year 12). All other option lists are A–Z. */

export const YEAR_LEVEL_OPTIONS = [
  'Foundation',
  'Year 1',
  'Year 2',
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

export const DEFAULT_YEAR_LEVEL = 'Year 8'
export const DEFAULT_SUBJECT = 'Humanities and Social Sciences'

/** Client fallback if /api/subjects is slow — must stay A–Z and match server `KLA_OPTIONS` (ACARA F–10). */
export const SUBJECT_OPTIONS_FALLBACK = [
  'Aboriginal Languages and Torres Strait Islander Languages',
  'Arabic',
  'Auslan',
  'Chinese',
  'Civics and Citizenship',
  'Classical Greek',
  'Dance',
  'Design and Technologies',
  'Digital Technologies',
  'Drama',
  'Economics and Business',
  'English',
  'French',
  'Geography',
  'German',
  'Health and Physical Education',
  'Hindi',
  'History',
  'Humanities and Social Sciences',
  'Indonesian',
  'Italian',
  'Japanese',
  'Korean',
  'Languages',
  'Latin',
  'Mathematics',
  'Media Arts',
  'Modern Greek',
  'Music',
  'Science',
  'Spanish',
  'Technologies',
  'The Arts',
  'Turkish',
  'Vietnamese',
  'Visual Arts',
  'Work Studies',
] as const

export const PEDAGOGY_FOCUS_OPTIONS = [
  'Collaborative group work',
  'Direct instruction with guided practice',
  'Flipped classroom hooks',
  'Inquiry-based learning',
  'Project-based learning',
  'Workshop / station rotation',
] as const

export const TOPIC_PLACEHOLDER =
  'e.g. Rights and freedoms in Australia · Migration stories in our community'

export const CLASS_CONTEXT_PLACEHOLDER =
  'Optional — e.g. mixed-ability Year 8 HASS class, strong oral discussion, limited devices, 50-minute periods'

export const REFINE_SUGGESTIONS = [
  'Add more formative checks',
  'Add more scaffolding',
  'Lower reading level',
  'Make more hands-on',
  'Strengthen summative assessment alignment',
] as const

export const DRAFT_STORAGE_KEY = 'acara-unit-planner-draft-v1'
