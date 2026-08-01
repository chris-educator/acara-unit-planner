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
export const DEFAULT_CURRICULUM_FRAMEWORK = 'Australian Curriculum (ACARA)'

/** Client fallback if /api/subjects is slow — must stay A–Z and match server. */
export const SUBJECT_OPTIONS_FALLBACK = [
  'Accounting',
  'Agricultural Science',
  'Ancient History',
  'Arabic',
  'Biology',
  'Business',
  'Chemistry',
  'Chinese',
  'Civics and Citizenship',
  'Dance',
  'Design and Technologies',
  'Digital Technologies',
  'Drama',
  'Earth and Environmental Science',
  'Economics',
  'Economics and Business',
  'Engineering',
  'English',
  'English as an Additional Language or Dialect (EAL/D)',
  'Food Technology',
  'French',
  'Geography',
  'German',
  'Health and Physical Education',
  'History',
  'Humanities and Social Sciences',
  'Indonesian',
  'Italian',
  'Japanese',
  'Korean',
  'Languages',
  'Legal Studies',
  'Literature',
  'Marine Science',
  'Mathematics',
  'Media Arts',
  'Modern History',
  'Music',
  'Outdoor Education',
  'Philosophy',
  'Physics',
  'Psychology',
  'Religion and Ethics',
  'Science',
  'Spanish',
  'Studies of Religion',
  'Textiles and Design',
  'The Arts',
  'Visual Arts',
  'Work Studies',
] as const

export const CURRICULUM_FRAMEWORK_OPTIONS = [
  'ACT Board of Senior Secondary Studies (BSSS)',
  'Australian Curriculum (ACARA)',
  'Cambridge International (IGCSE / A Level)',
  'Early Years Learning Framework (EYLF)',
  'International Baccalaureate (IB DP)',
  'International Baccalaureate (IB MYP)',
  'International Baccalaureate (IB PYP)',
  'Northern Territory Certificate of Education and Training (NTCET)',
  'NSW Education Standards Authority (NESA)',
  'Queensland Curriculum and Assessment Authority (QCAA)',
  'South Australian Certificate of Education (SACE)',
  'Tasmanian Assessment, Standards and Certification (TASC)',
  'Victorian Curriculum and Assessment Authority (VCAA)',
  'Western Australian Certificate of Education (WACE)',
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
