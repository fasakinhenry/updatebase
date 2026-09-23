import { z } from 'zod'

/**
 * every client env var is declared and validated here, once, at module load.
 * a typo or a missing value fails loudly in dev instead of turning into
 * `undefined` somewhere deep in a fetch call.
 */
const schema = z.object({
  VITE_API_URL: z.url().default('http://localhost:4000'),
  VITE_SITE_URL: z.url().default('http://localhost:5173'),
  VITE_GOOGLE_CLIENT_ID: z.string().default(''),
  VITE_DICEBEAR_URL: z.url().default('https://api.dicebear.com/9.x'),
  VITE_ENABLE_ANALYTICS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
})

const parsed = schema.safeParse(import.meta.env)

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  ${i.path.join('.')}: ${i.message}`)
    .join('\n')
  throw new Error(`invalid client environment variables:\n${issues}`)
}

export const env = parsed.data
export type ClientEnv = typeof env
