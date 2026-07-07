export type HowToUseStep = {
  step: string
  title: string
  detail: string
}

export const HOW_TO_USE_STEPS: HowToUseStep[] = [
  {
    step: '1',
    title: 'Set up your term',
    detail: 'Enter topic, year level, subject, pedagogy focus, and how many weeks (6–10).',
  },
  {
    step: '2',
    title: 'Link descriptors',
    detail: 'Tick up to four curriculum descriptors so each week stays syllabus-aligned.',
  },
  {
    step: '3',
    title: 'Generate & refine',
    detail: 'Review weekly plans and summative assessment. Refine any section for 3 credits.',
  },
  {
    step: '4',
    title: 'Export',
    detail: 'Download DOCX, ZIP, or TXT for your accreditation folder. Draft auto-saves locally.',
  },
]

export const HOW_TO_USE_HINTS = [
  '6–10 week plans',
  '15 credits per plan',
  'Descriptor-aligned',
  'Accreditation export',
  'Ask in top bar',
]
