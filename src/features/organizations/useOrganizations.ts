import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useSession } from '@/stores/session'
import type { MembershipSummary, Organization } from '@/types/api'

/** the organizations this person runs or posts for, for the profile switcher. */
export function useMyOrganizations() {
  const authenticated = useSession((s) => s.status === 'authenticated')

  return useQuery({
    queryKey: ['organizations', 'mine'],
    queryFn: () => api.get<MembershipSummary[]>('/api/organizations/mine'),
    enabled: authenticated,
    staleTime: 5 * 60_000,
  })
}

export function useOrganization(handle: string | undefined) {
  return useQuery({
    queryKey: ['organization', handle],
    queryFn: () => api.get<Organization>(`/api/organizations/by-handle/${handle}`),
    enabled: Boolean(handle),
    staleTime: 60_000,
  })
}
