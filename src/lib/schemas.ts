import { z } from 'zod'

/**
 * shared shapes. the backend validates the same fields, this is the copy the
 * user sees while they type.
 */
export const waitlistSchema = z.object({
  email: z.email('that does not look like an email address'),
  role: z.enum(['organization', 'member']),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>
