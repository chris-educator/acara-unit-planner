export type HowToUseStep = {
  step: string
  title: string
  detail: string
}

export const HOW_TO_USE_STEPS: HowToUseStep[] = [
  {
    step: '1',
    title: 'Set up your Term',
    detail: 'Enter topic, year level, subject, pedagogy focus, and how many weeks (6–10).',
  },
  {
    step: '2',
    title: 'Link Descriptors',
    detail: 'Tick up to four curriculum descriptors so each week stays syllabus-aligned.',
  },
  {
    step: '3',
    title: 'Generate & refine',
    detail:
      'Review the teacher pack (vocab, misconceptions, checklist), weekly prep and resource searches, then refine any section for 2 credits.',
  },
  {
    step: '4',
    title: 'Export',
    detail: 'Download docx, pdf, txt, or zip for your accreditation folder. Draft auto-saves locally.',
  },
]

export const HOW_TO_USE_HINTS = [
  '6–10 week plans',
  '12 credits per plan',
  'Teacher Pack + resources',
  'Descriptor-aligned',
  'Accreditation export',
  'Ask in top bar',
]
