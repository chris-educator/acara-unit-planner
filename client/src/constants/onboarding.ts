/** Permanent — tour finished or skipped. */
export const ONBOARDING_COMPLETE_KEY = 'acara-unit-planner-onboarding-complete'

/** Session — welcome dismissed with “Maybe later” (clears when the tab closes). */
export const ONBOARDING_WELCOME_DISMISSED_SESSION_KEY =
  'acara-unit-planner-welcome-dismissed-session'

/** Session — resume tour after refresh in the same tab. */
export const ONBOARDING_TOUR_STEP_SESSION_KEY = 'acara-unit-planner-tour-step'

export type TourStep = {
  id: string
  target: string
  title: string
  body: string
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'how-to-use',
    target: '[data-tour="how-to-use"]',
    title: 'Your workflow at a glance',
    body: 'This card walks through a 6–10 week term unit: curriculum links, weekly intents, assessment, then export for your folders.',
  },
  {
    id: 'ask-assistant',
    target: '[data-tour="ask-assistant"]',
    title: 'Ask for help anytime',
    body: 'Open Ask in the top bar for setup tips, curriculum links, Refine, or export help. Ask will not write the unit for you.',
  },
  {
    id: 'unit-setup',
    target: '[data-tour="unit-setup"]',
    title: 'Set up the unit',
    body: 'Enter topic, year level, subject, week count, and pedagogy focus. School name and class context show on the export if you add them.',
  },
  {
    id: 'curriculum-links',
    target: '[data-tour="curriculum-links"]',
    title: 'Link the curriculum',
    body: 'Optionally pick up to four Australian Curriculum themes so weekly objectives stay syllabus-aligned.',
  },
  {
    id: 'generate',
    target: '[data-tour="generate"]',
    title: 'Generate the term plan',
    body: 'Sign in to use credits (12 per plan, 2 to refine a section). Clear All resets the form and draft in this browser.',
  },
  {
    id: 'unit-preview',
    target: '[data-tour="unit-preview"]',
    title: 'Preview, refine, and export',
    body: 'After generation, edit weeks here, refine any section with AI, then download docx, pdf, txt, or zip.',
  },
]

export function isOnboardingComplete(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === '1'
  } catch {
    return false
  }
}

export function markOnboardingComplete(): void {
  try {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, '1')
  } catch {
    /* ignore */
  }
  clearTourStepSession()
}

export function isWelcomeDismissedThisSession(): boolean {
  try {
    return sessionStorage.getItem(ONBOARDING_WELCOME_DISMISSED_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function markWelcomeDismissedThisSession(): void {
  try {
    sessionStorage.setItem(ONBOARDING_WELCOME_DISMISSED_SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function readTourStepSession(): number | null {
  try {
    const raw = sessionStorage.getItem(ONBOARDING_TOUR_STEP_SESSION_KEY)
    if (raw === null) return null
    const step = Number.parseInt(raw, 10)
    if (!Number.isFinite(step) || step < 0 || step >= TOUR_STEPS.length) return null
    return step
  } catch {
    return null
  }
}

export function writeTourStepSession(step: number): void {
  try {
    sessionStorage.setItem(ONBOARDING_TOUR_STEP_SESSION_KEY, String(step))
  } catch {
    /* ignore */
  }
}

export function clearTourStepSession(): void {
  try {
    sessionStorage.removeItem(ONBOARDING_TOUR_STEP_SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function shouldShowWelcome(): boolean {
  return !isOnboardingComplete() && !isWelcomeDismissedThisSession()
}
