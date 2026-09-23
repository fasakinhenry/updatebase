import { create } from 'zustand'

export type ThemeChoice = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'updatebase:theme'

function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStored(): ThemeChoice {
  if (typeof window === 'undefined') return 'light'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // private mode or blocked storage, fall through to the default
  }
  return 'light'
}

function apply(choice: ThemeChoice): ResolvedTheme {
  const resolved = choice === 'system' ? systemTheme() : choice
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = resolved
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolved === 'dark' ? '#0a0f19' : '#ffffff')
  }
  return resolved
}

interface ThemeState {
  choice: ThemeChoice
  resolved: ResolvedTheme
  setTheme: (choice: ThemeChoice) => void
  toggle: () => void
  /** re-resolve after the OS preference changes while on `system` */
  syncSystem: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // light is the default and the priority mode
  choice: 'light',
  resolved: 'light',

  setTheme: (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // nothing to do, the choice still applies for this session
    }
    set({ choice, resolved: apply(choice) })
  },

  toggle: () => {
    const next = get().resolved === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },

  syncSystem: () => {
    if (get().choice !== 'system') return
    set({ resolved: apply('system') })
  },
}))

/** called once on the client to adopt whatever the blocking script already set. */
export function hydrateTheme() {
  const choice = readStored()
  useThemeStore.setState({ choice, resolved: apply(choice) })
}
