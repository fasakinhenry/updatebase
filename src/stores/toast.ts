import { create } from 'zustand'

export type ToastTone = 'info' | 'success' | 'error' | 'warning'

export interface Toast {
  id: string
  tone: ToastTone
  title: string
  description?: string
  duration: number
  action?: { label: string; onClick: () => void }
}

interface ToastState {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id' | 'duration'> & { duration?: number }) => string
  dismiss: (id: string) => void
  clear: () => void
}

const MAX_VISIBLE = 3

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  push: ({ duration = 5000, ...toast }) => {
    const id = Math.random().toString(36).slice(2, 10)
    set((state) => ({ toasts: [...state.toasts, { ...toast, id, duration }].slice(-MAX_VISIBLE) }))
    return id
  },

  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),
}))

/** call from anywhere, including outside react. */
export const toast = {
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'info', title, description }),
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'success', title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'error', title, description, duration: 7000 }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'warning', title, description }),
}
