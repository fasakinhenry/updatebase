import { create } from 'zustand'
import { api, ApiError, setAccessTokenGetter } from '@/lib/api'
import type { OnboardingStep, SessionPayload, User } from '@/types/api'

type Status = 'unknown' | 'loading' | 'authenticated' | 'anonymous'

interface SessionState {
  status: Status
  user: User | null
  accessToken: string | null
  nextStep: OnboardingStep

  /** called once on boot: trades the refresh cookie for a session, quietly. */
  restore: () => Promise<void>
  adopt: (payload: SessionPayload) => void
  patchUser: (patch: Partial<User>) => void
  signOut: () => Promise<void>
}

export const useSession = create<SessionState>((set, get) => ({
  status: 'unknown',
  user: null,
  accessToken: null,
  nextStep: 'app',

  restore: async () => {
    if (get().status === 'loading') return
    set({ status: 'loading' })

    try {
      const payload = await api.post<SessionPayload>('/api/auth/refresh')
      set({
        status: 'authenticated',
        user: payload.user,
        accessToken: payload.accessToken,
        nextStep: payload.nextStep,
      })
    } catch (error) {
      // no cookie, or an expired one. both simply mean signed out.
      if (!(error instanceof ApiError)) throw error
      set({ status: 'anonymous', user: null, accessToken: null, nextStep: 'app' })
    }
  },

  adopt: (payload) =>
    set({
      status: 'authenticated',
      user: payload.user,
      accessToken: payload.accessToken,
      nextStep: payload.nextStep,
    }),

  patchUser: (patch) =>
    set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),

  signOut: async () => {
    try {
      await api.post('/api/auth/logout')
    } finally {
      set({ status: 'anonymous', user: null, accessToken: null, nextStep: 'app' })
    }
  },
}))

// the api client needs the token but must not import the store, or the two
// would depend on each other. it asks through this instead.
setAccessTokenGetter(() => useSession.getState().accessToken)
