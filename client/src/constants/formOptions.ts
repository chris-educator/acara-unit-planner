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

/** Primary-friendly default — teachers change year as needed. */
export const DEFAULT_YEAR_LEVEL = 'Year 5'
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
  'Inquiry-based learning',
  'Play-based / hands-on exploration',
  'Project-based learning',
  'Workshop / station rotation',
] as const

/** Australian Curriculum cross-curriculum priorities. */
export const CROSS_CURRICULUM_PRIORITY_OPTIONS = [
  'Aboriginal and Torres Strait Islander Histories and Cultures',
  "Asia and Australia's Engagement with Asia",
  'Sustainability',
] as const

/** Australian Curriculum general capabilities (Version 9 naming). */
export const GENERAL_CAPABILITY_OPTIONS = [
  'Critical and Creative Thinking',
  'Digital Literacy',
  'Ethical Understanding',
  'Intercultural Understanding',
  'Literacy',
  'Numeracy',
  'Personal and Social Capability',
] as const

export const TOPIC_PLACEHOLDER =
  'e.g. Our local places and mapping · Living things in the schoolyard · Stories of migration'

export const CLASS_CONTEXT_PLACEHOLDER =
  'Optional — e.g. mixed-ability Year 5 class, strong oral discussion, limited devices, 45–60 min blocks'

export const REFINE_SUGGESTIONS = [
  'Add More Formative Checks',
  'Add More Scaffolding',
  'Lower Reading Level',
  'Make More Hands-On',
  'Strengthen Summative Assessment Alignment',
  'Strengthen EAL/D Supports',
] as const

export const DRAFT_STORAGE_KEY = 'acara-unit-planner-draft-v2'
