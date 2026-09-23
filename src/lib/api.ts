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

  /** copy a user can actually act on, never a raw status code. */
  get friendlyMessage() {
    if (this.status === 0) return 'you look offline. check your connection and try again.'
    if (this.status === 429) return 'that was a lot at once. give it a moment and try again.'
    if (this.status >= 500) return 'something broke on our side. try again in a moment.'
    return this.message
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  /** ms before the request is aborted. defaults to 20s. */
  timeout?: number
}

const DEFAULT_TIMEOUT = 20_000

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, timeout = DEFAULT_TIMEOUT, headers, signal, ...rest } = options

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true })

  try {
    const response = await fetch(`${env.VITE_API_URL}${path}`, {
      ...rest,
      // refresh token lives in an httpOnly cookie, so credentials are required
      credentials: 'include',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

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

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
