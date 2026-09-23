const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

/**
 * short relative time, the way a feed shows it: 4m, 2h, 3d, then a date.
 * anything older than a week is more useful as an actual date.
 */
export function relativeTime(iso: string | Date): string {
  const then = typeof iso === 'string' ? new Date(iso) : iso
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000)

  if (seconds < 45) return 'now'
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m`
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h`
  if (seconds < WEEK) return `${Math.floor(seconds / DAY)}d`

  const sameYear = then.getFullYear() === new Date().getFullYear()
  return then.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

/** the long form, for a detail page or a tooltip. */
export function fullDate(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * a deadline is the thing someone actually acts on, so it says how long is
 * left rather than a date, and flags itself when time is short.
 */
export function deadlineLabel(
  iso: string | Date | null | undefined,
): { text: string; urgent: boolean } | null {
  if (!iso) return null

  const date = typeof iso === 'string' ? new Date(iso) : iso
  const hoursLeft = (date.getTime() - Date.now()) / (1000 * 60 * 60)

  if (hoursLeft < 0) return { text: 'closed', urgent: false }
  if (hoursLeft < 24) return { text: 'closes today', urgent: true }
  if (hoursLeft < 48) return { text: 'closes tomorrow', urgent: true }

  const days = Math.floor(hoursLeft / 24)
  if (days <= 7) return { text: `${days} days left`, urgent: true }
  if (days <= 30) return { text: `${Math.ceil(days / 7)} weeks left`, urgent: false }

  return {
    text: `closes ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
    urgent: false,
  }
}

/** the month heading the bookmarks page groups by. */
export function monthLabel(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  const now = new Date()

  const sameMonth = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  if (sameMonth) return 'this month'

  return date
    .toLocaleDateString('en-GB', {
      month: 'long',
      ...(date.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' }),
    })
    .toLowerCase()
}
