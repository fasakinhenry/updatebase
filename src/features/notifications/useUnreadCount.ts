import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useSession } from '@/stores/session'

/**
 * the badge. polled gently rather than through a socket, because on a sleeping
 * free tier a socket that keeps dropping is worse than a quiet poll.
 */
export function useUnreadCount() {
  const authenticated = useSession((s) => s.status === 'authenticated')

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => (await api.get<{ count: number }>('/api/notifications/unread-count')).count,
    enabled: authenticated,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  })
}
