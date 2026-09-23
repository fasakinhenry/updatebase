import { env } from './env'

export const AVATAR_STYLES = [
  'notionists',
  'adventurer',
  'avataaars',
  'big-smile',
  'bottts',
  'fun-emoji',
  'lorelei',
  'micah',
  'miniavs',
  'open-peeps',
  'personas',
  'thumbs',
] as const

export type AvatarStyle = (typeof AVATAR_STYLES)[number]

export interface AvatarOptions {
  style?: AvatarStyle
  /** rendered size in css pixels. the url asks for 2x so it stays sharp. */
  size?: number
  backgroundColor?: string
}

/**
 * dicebear renders deterministically from the seed, so the same user always
 * gets the same face and the browser can cache it forever.
 */
export function avatarUrl(seed: string, options: AvatarOptions = {}) {
  const { style = 'notionists', size = 96, backgroundColor = 'eef4ff' } = options

  const params = new URLSearchParams({
    seed,
    size: String(size * 2),
    backgroundColor,
    radius: '50',
  })

  return `${env.VITE_DICEBEAR_URL}/${style}/svg?${params.toString()}`
}

/** a fresh seed for the shuffle button in onboarding. */
export function randomSeed() {
  return Math.random().toString(36).slice(2, 12)
}
