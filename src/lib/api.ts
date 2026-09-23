import { env } from './env'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  /** copy a user can act on, never a raw status code. */
  get friendlyMessage() {
    if (this.status === 0) return 'you look offline. check your connection and try again.'
    if (this.status === 429) return 'that was a lot at once. give it a moment and try again.'
    if (this.status >= 500 && this.code === 'internal_error') {
      return 'something broke on our side. try again in a moment.'
    }
    return this.message
  }

  /** field level messages from a validation failure, keyed by field name. */
  get fieldErrors(): Record<string, string> {
    if (!Array.isArray(this.details)) return {}
    const entries = this.details as { field?: string; message?: string }[]
    return Object.fromEntries(
      entries
        .filter((entry) => entry.field && entry.message)
        .map((entry) => [entry.field!, entry.message!]),
    )
  }
}

// the session store registers a getter here rather than being imported, so the
// two modules do not depend on each other
let readAccessToken: () => string | null = () => null

export function setAccessTokenGetter(getter: () => string | null) {
  readAccessToken = getter
}

let onSessionLost: (() => void) | null = null

export function setSessionLostHandler(handler: () => void) {
  onSessionLost = handler
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  timeout?: number
  /** internal: stops a refresh loop if the refresh call itself 401s */
  skipRefresh?: boolean
}

const DEFAULT_TIMEOUT = 20_000

/**
 * one refresh at a time. if five requests 401 together they all wait on the
 * same refresh rather than firing five rotations and invalidating each other.
 */
let refreshInFlight: Promise<boolean> | null = null

async function refreshSession(): Promise<boolean> {
  refreshInFlight ??= (async () => {
    try {
      const response = await fetch(`${env.VITE_API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) return false

      const payload = await response.json()
      const { useSession } = await import('@/stores/session')
      useSession.getState().adopt(payload.data ?? payload)
      return true
    } catch {
      return false
    } finally {
      // let the next 401 try again rather than caching a stale failure
      setTimeout(() => {
        refreshInFlight = null
      }, 0)
    }
  })()

  return refreshInFlight
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, timeout = DEFAULT_TIMEOUT, headers, signal, skipRefresh, ...rest } = options

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true })

  try {
    const token = readAccessToken()

    const response = await fetch(`${env.VITE_API_URL}${path}`, {
      ...rest,
      // the refresh token lives in an httpOnly cookie, so this is required
      credentials: 'include',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    // an expired access token is invisible to the user: refresh and retry once
    if (response.status === 401 && !skipRefresh && !path.startsWith('/api/auth/')) {
      clearTimeout(timer)
      if (await refreshSession()) {
        return request<T>(path, { ...options, skipRefresh: true })
      }
      onSessionLost?.()
    }

    if (response.status === 204) return undefined as T

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      throw new ApiError(
        response.status,
        payload?.error?.code ?? 'unknown_error',
        payload?.error?.message ?? 'something went wrong, please try again',
        payload?.error?.details,
      )
    }

    return (payload?.data ?? payload) as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(0, 'timeout', 'that took too long. try again.')
    }
    throw new ApiError(0, 'network_error', 'you look offline. check your connection and try again.')
  } finally {
    clearTimeout(timer)
  }
}

function withQuery(path: string, query?: Record<string, unknown>) {
  if (!query) return path
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }
  const search = params.toString()
  return search ? `${path}?${search}` : path
}

export const api = {
  get: <T>(path: string, query?: Record<string, unknown>, options?: RequestOptions) =>
    request<T>(withQuery(path, query), { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
