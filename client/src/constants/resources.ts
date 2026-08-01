export const RESOURCE_KIND_OPTIONS = [
  'video',
  'website',
  'text',
  'interactive',
  'book',
] as const

export const RESOURCE_PORTAL_OPTIONS = [
  '',
  'ABC Education',
  'eSafety',
  'ACARA',
  'Scootle',
  'National Museum of Australia',
  'Geoscience Australia',
  'Australian War Memorial',
  'Museum of Australian Democracy',
  'CSIRO',
  'Bureau of Meteorology',
  'National Library of Australia',
] as const

export const RESOURCE_SEARCH_DISCLAIMER =
  'Resource searches are starting points — check suitability for your year level.'

/** Deterministic Google search link built from a search_query (never model-invented). */
export function resourceSearchUrl(searchQuery: string): string {
  const q = searchQuery.trim()
  if (!q) return ''
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`
}
