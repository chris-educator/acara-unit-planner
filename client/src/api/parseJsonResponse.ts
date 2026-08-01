export async function parseJsonResponse<T = Record<string, unknown>>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') ?? ''
  const text = await res.text()
  const trimmed = text.trimStart()

  if (
    trimmed.startsWith('<!') ||
    trimmed.startsWith('<html') ||
    (!contentType.includes('json') && trimmed.startsWith('<'))
  ) {
    const local =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    const where = res.url ? ` (${res.url}, HTTP ${res.status})` : ` (HTTP ${res.status})`
    throw new Error(
      local
        ? `The app returned a web page instead of API data${where}. Open http://127.0.0.1:5202/ (not the API port alone) and keep npm run dev:api running on port 8028.`
        : `The app returned a web page instead of API data${where}. Refresh and try again — if it persists, the API gateway may be blocking or timing out.`,
    )
  }

  if (!text) return {} as T

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(res.ok ? 'Unexpected server response.' : `Request failed (${res.status}).`)
  }
}
