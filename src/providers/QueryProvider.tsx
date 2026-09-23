import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/lib/api'

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // never retry something the user has to fix themselves
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
          return failureCount < 2
        },
      },
      mutations: { retry: false },
    },
  })
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // one client per mount, so the prerender pass never shares cache between pages
  const [client] = useState(makeClient)
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
