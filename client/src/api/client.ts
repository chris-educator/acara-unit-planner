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

export type UnitLesson = {
  lesson_number: number
  title: string
  learning_objectives: string[]
  materials_needed: string[]
  starter: string
  main_activity: string
  exit_ticket: string
  differentiation_support: string
  differentiation_extension: string
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
  suggested_descriptors: DescriptorRef[]
  lessons: UnitLesson[]
  unit_assessment: UnitAssessment
}

export { FetchTimeoutError }

export async function fetchHealth() {
  const res = await fetchWithTimeout('/api/health', undefined, HEALTH_TIMEOUT_MS)
  return parseJsonResponse<{ gemini_configured?: boolean }>(res)
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

export async function generateMicroUnit(payload: {
  topic: string
  year_level: string
  subject: string
  lesson_count: number
  school_name: string
  pedagogy_focus: string
  class_context: string
  descriptor_ids: string[]
}) {
  const res = await fetchWithTimeout(
    '/api/unit/generate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    GENERATE_TIMEOUT_MS,
  )
  const data = await parseJsonResponse<{ unit: MicroUnit; credits_remaining?: number; detail?: string }>(
    res,
  )
  if (!res.ok) {
    throw new Error(data.detail ?? 'Unit generation failed')
  }
  return data
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
  format: 'zip' | 'docx' | 'txt'
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
