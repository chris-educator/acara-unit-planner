/** Must match edstack-billing FREE_SIGNUP_CREDITS. */
export const FREE_SIGNUP_CREDITS = 20

/** Unsigned SignInCreditsCallout body (login banner + home when signed out). */
export const SIGN_IN_CREDITS_CALLOUT_TEXT = `Sign up includes ${FREE_SIGNUP_CREDITS} free credits to use across all EdStack apps.`

export const APPSTAX_HOME_URL = 'https://appstax.ai'
export const EDSTACK_CREDITS_URL = 'https://edstack.appstax.ai/credits'
export const EDSTACK_HOME_URL = 'https://edstack.appstax.ai'
export const EDSTACK_TOOLS_URL = 'https://edstack.appstax.ai/#stack'
export const CLAUDE_HOME_URL = 'https://claude.ai'
export const GEMINI_HOME_URL = 'https://gemini.google.com'

export const APP_TITLE = 'ACARA Unit Planner'
export const APP_TITLE_MUTED = 'ACARA '
export const APP_TITLE_ACCENT = 'Unit Planner'

export type EdStackAudienceLabel = 'Teachers' | 'Students' | 'Parents'
export const EDSTACK_AUDIENCE: EdStackAudienceLabel = 'Teachers'
export const BROWSER_TAB_TITLE = `${APP_TITLE} | EdStack for ${EDSTACK_AUDIENCE}`
export const APP_BUG_REPORT_NAME = 'ACARA Unit Planner'

export const APP_TAGLINE =
  'Build a 6–10 week term unit plan with curriculum descriptor links, weekly intents, formative checks, and summative assessment — export for accreditation folders.'

export const APP_INTRO_LINES = [
  'Enter topic, year level, and pedagogy focus — link up to four curriculum descriptors so each week stays syllabus-aligned.',
  '12 credits per term plan, and 2 credits to refine a section. Export docx, pdf, txt, or zip.',
] as const

export const APPSTAX_SUPPORT_EMAIL = 'apps@appstax.ai'

export function appstaxMailto(options: { subject?: string; body?: string } = {}) {
  const params: string[] = []
  if (options.subject) params.push(`subject=${encodeURIComponent(options.subject)}`)
  if (options.body) params.push(`body=${encodeURIComponent(options.body)}`)
  const query = params.length ? `?${params.join('&')}` : ''
  return `mailto:${APPSTAX_SUPPORT_EMAIL}${query}`
}

export function appstaxBugReportMailto(appName = APP_BUG_REPORT_NAME) {
  return appstaxMailto({ subject: `Bug report — ${appName}` })
}

export function appstaxFlagAssistantReplyMailto(options: { assistantMessage?: string } = {}) {
  const excerpt = options.assistantMessage?.trim().slice(0, 1200) ?? ''
  const body = excerpt
    ? `I want to flag this Assistant reply from ${APP_TITLE}:\n\n---\n${excerpt}\n---\n\n`
    : `I want to flag an Assistant reply from ${APP_TITLE}.\n\n`
  return appstaxMailto({ subject: `Flag Assistant reply — ${APP_TITLE}`, body })
}

export function appstaxCopyrightLine(year = new Date().getFullYear()) {
  return `© ${year} AppStax · Limited only by Imagination · Brisbane · Australia`
}

export const THEME_STORAGE_KEY = 'acara-unit-planner-theme'
