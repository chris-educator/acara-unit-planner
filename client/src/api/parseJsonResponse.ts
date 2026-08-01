export async function parseJsonResponse<T = Record<string, unknown>>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') ?? ''
  const text = await res.text()
  const trimmed = text.trimStart()

  if (
    trimmed.startsWith('<!') ||
    trimmed.startsWith('<html') ||
    (!contentType.includes('json') && trimmed.startsWith('<'))
  ) {
    throw new Error(
      'The app returned a web page instead of API data. Start the API with npm run dev:api (port 8028) and npm run dev:client (port 5202).',
    )
  }

  if (!text) return {} as T

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(res.ok ? 'Unexpected server response.' : `Request failed (${res.status}).`)
  }
}
