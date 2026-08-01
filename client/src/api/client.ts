import { FetchTimeoutError, fetchWithTimeout } from './fetchWithTimeout'
import { parseJsonResponse } from './parseJsonResponse'

const HEALTH_TIMEOUT_MS = 15_000
const GENERATE_TIMEOUT_MS = 300_000
const REFINE_TIMEOUT_MS = 90_000
const EXPORT_TIMEOUT_MS = 120_000
const ASSISTANT_TIMEOUT_MS = 90_000

export type AssistantChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type DescriptorRef = {
  id: string
  label: string
  summary: string
}

export type VocabularyItem = {
  term: string
  gloss: string
}

export type MisconceptionItem = {
  misconception: string
  address: string
}

export type SuggestedResourceKind = 'video' | 'website' | 'text' | 'interactive' | 'book'

export type SuggestedResource = {
  title: string
  kind: SuggestedResourceKind
  why: string
  search_query: string
  portal?: string
}

export type UnitLesson = {
  lesson_number: number
  title: string
  learning_objectives: string[]
  materials_needed: string[]
  teacher_prep?: string[]
  suggested_resources?: SuggestedResource[]
  starter: string
  main_activity: string
  exit_ticket: string
  differentiation_support: string
  differentiation_extension: string
  differentiation_eald?: string
  differentiation_adjustments?: string
  timing_notes: string
}

export type RubricCriterion = {
  criterion: string
  developing: string
  meeting: string
  exceeding: string
}

export type UnitAssessment = {
  title: string
  instructions: string
  tasks: string[]
  rubric: RubricCriterion[]
}

export type MicroUnit = {
  unit_title: string
  topic: string
  year_level: string
  subject: string
  lesson_count: number
  overview: string
  success_criteria: string[]
  key_vocabulary?: VocabularyItem[]
  common_misconceptions?: MisconceptionItem[]
  term_materials_checklist?: string[]
  parent_carer_blurb?: string
  sequence_at_a_glance?: string[]
  cross_curriculum_priorities?: string[]
  general_capabilities?: string[]
  suggested_descriptors: DescriptorRef[]
  lessons: UnitLesson[]
  unit_assessment: UnitAssessment
}

export { FetchTimeoutError }

export async function fetchHealth() {
  const res = await fetchWithTimeout('/api/health', undefined, HEALTH_TIMEOUT_MS)
  return parseJsonResponse<{
    api_key_configured?: boolean
    gemini_configured?: boolean
    anthropic_configured?: boolean
    assistant_ready?: boolean
  }>(res)
}

export async function fetchSubjects() {
  const res = await fetchWithTimeout('/api/subjects', undefined, HEALTH_TIMEOUT_MS)
  return parseJsonResponse<{ subjects: string[] }>(res)
}

export async function fetchDescriptors(subject: string) {
  const res = await fetchWithTimeout(
    `/api/descriptors?subject=${encodeURIComponent(subject)}`,
    undefined,
    HEALTH_TIMEOUT_MS,
  )
  return parseJsonResponse<{ descriptors: DescriptorRef[] }>(res)
}

type GenerateResponse = {
  unit: MicroUnit
  credits_remaining?: number
  detail?: string
}

type GenerateStreamMessage =
  | { type: 'keepalive' }
  | { type: 'complete'; data: GenerateResponse }
  | { type: 'error'; status?: number; detail?: unknown }

function generateErrorMessage(status: number, detail: unknown): string {
  if (typeof detail === 'string' && detail.trim()) return detail
  if (detail && typeof detail === 'object' && 'detail' in detail) {
    const nested = (detail as { detail?: unknown }).detail
    if (typeof nested === 'string' && nested.trim()) return nested
  }
  if (status === 502 || status === 504 || status === 524) {
    return 'Generation timed out before the server finished. Try fewer weeks (6–8) or a simpler topic, then generate again.'
  }
  if (status === 503) {
    return 'Term plan generation is temporarily unavailable. Please try again in a moment.'
  }
  if (status === 401) {
    return 'Sign in required.'
  }
  return `Unit generation failed (${status || 'network error'}). Please try again.`
}

async function readGenerateNdjsonStream(res: Response): Promise<GenerateResponse> {
  if (!res.body) {
    throw new Error('Generation failed before the server returned a response.')
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.trim()) continue
      const message = JSON.parse(line) as GenerateStreamMessage
      if (message.type === 'keepalive') continue
      if (message.type === 'complete' && message.data) {
        return message.data
      }
      if (message.type === 'error') {
        throw new Error(generateErrorMessage(message.status ?? 500, message.detail))
      }
    }
  }

  throw new Error('Generation ended before the server returned a term plan.')
}

export async function generateMicroUnit(payload: {
  topic: string
  year_level: string
  subject: string
  lesson_count: number
  school_name: string
  pedagogy_focus: string
  class_context: string
  descriptor_ids: string[]
  cross_curriculum_priorities?: string[]
  general_capabilities?: string[]
}) {
  const res = await fetchWithTimeout(
    '/api/unit/generate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    },
    GENERATE_TIMEOUT_MS,
  )
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('ndjson')) {
    try {
      return await readGenerateNdjsonStream(res)
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error(generateErrorMessage(res.status, null))
      }
      throw err
    }
  }

  // Fallback for non-stream responses (e.g. early HTTP errors before the stream starts).
  try {
    const data = await parseJsonResponse<GenerateResponse>(res)
    if (!res.ok) {
      throw new Error(generateErrorMessage(res.status, data))
    }
    return data
  } catch (err) {
    if (err instanceof Error && /web page instead of API data/i.test(err.message)) {
      throw new Error(generateErrorMessage(res.status || 502, null))
    }
    throw err
  }
}

export async function refineUnitSection(payload: {
  unit: MicroUnit
  section_path: string
  instruction: string
}) {
  const res = await fetchWithTimeout(
    '/api/unit/refine',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    REFINE_TIMEOUT_MS,
  )
  const data = await parseJsonResponse<{
    value?: string
    values?: string[]
    credits_remaining?: number
    detail?: string
  }>(res)
  if (!res.ok) {
    throw new Error(data.detail ?? 'Refinement failed')
  }
  return data
}

export async function exportMicroUnit(payload: {
  unit: MicroUnit
  school_name: string
  format: 'zip' | 'docx' | 'pdf' | 'txt'
}) {
  const res = await fetchWithTimeout(
    '/api/unit/export',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    EXPORT_TIMEOUT_MS,
  )
  if (!res.ok) {
    const data = await parseJsonResponse<{ detail?: string }>(res).catch(() => ({
      detail: 'Export failed',
    }))
    throw new Error(data.detail ?? 'Export failed')
  }
  const disposition = res.headers.get('Content-Disposition') ?? ''
  const match = disposition.match(/filename="([^"]+)"/)
  const filename = match?.[1] ?? 'term-plan.zip'
  const blob = await res.blob()
  return { blob, filename }
}

export async function sendAssistantMessage(messages: AssistantChatMessage[]) {
  const res = await fetchWithTimeout(
    '/api/assistant/chat',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    },
    ASSISTANT_TIMEOUT_MS,
  )
  const data = await parseJsonResponse<{ reply: string; detail?: string }>(res)
  if (!res.ok) {
    throw new Error(data.detail ?? 'Assistant request failed')
  }
  return data
}
