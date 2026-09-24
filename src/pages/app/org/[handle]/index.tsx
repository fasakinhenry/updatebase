import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Users, SealCheck, Globe, Link as LinkIcon } from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/app/EmptyState'
import { UpdateCard } from '@/components/app/UpdateCard'
import { InfiniteSentinel } from '@/components/app/InfiniteSentinel'
import { UpdateSkeletonList } from '@/components/app/UpdateSkeleton'
import { SmartLink } from '@/components/ui/SmartLink'
import { api } from '@/lib/api'
import { toast } from '@/stores/toast'
import { cn } from '@/lib/cn'
import type { Organization, Update, Paginated } from '@/types/api'

export default function OrgProfilePage() {
  const { handle } = useParams<{ handle: string }>()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'updates' | 'members'>('updates')

  const { data: org, isLoading, isError } = useQuery({
    queryKey: ['org', handle],
    queryFn: () => api.get<Organization>(`/api/organizations/by-handle/${handle}`),
    enabled: Boolean(handle)
  })

  const followMutation = useMutation({
    mutationFn: () => api.post(`/api/follows/organizations/${org?.id ?? org?._id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['org', handle] })
      toast.success('followed', `you are now following ${org?.name}`)
    },
    onError: () => toast.error('error', 'could not follow organization')
  })

  const unfollowMutation = useMutation({
    mutationFn: () => api.delete(`/api/follows/organizations/${org?.id ?? org?._id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['org', handle] })
      toast.success('unfollowed', `you are no longer following ${org?.name}`)
    },
    onError: () => toast.error('error', 'could not unfollow organization')
  })

  const {
    data: updatesData,
    fetchNextPage: fetchNextUpdates,
    hasNextPage: hasNextUpdates,
    isFetchingNextPage: isFetchingNextUpdates,
    isLoading: isUpdatesLoading
  } = useInfiniteQuery({
    queryKey: ['org', handle, 'updates'],
    queryFn: ({ pageParam }) =>
      api.get<Paginated<Update>>(`/api/organizations/${handle}/updates`, {
        limit: 20,
        cursor: pageParam || undefined
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(org) && activeTab === 'updates'
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner label="loading organization" />
      </div>
    )
  }

  if (isError || !org) {
    return (
      <EmptyState 
        icon={Users} 
        title="organization not found" 
        description="this organization may not exist." 
        action={<Button to="/app/feed" icon={null}>back to feed</Button>} 
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl pb-20">
      <Seo 
        title={org.name ?? org.handle ?? 'organization'} 
        description={org.bio ?? org.tagline ?? ''} 
        path={'/app/org/' + handle} 
      />

      <div className="relative">
        {org.bannerUrl ? (
          <img src={org.bannerUrl} alt="banner" className="h-44 w-full object-cover" />
        ) : (
          <div className="h-44 border-b border-hairline bg-surface" />
        )}
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="-mt-9">
          <Avatar src={org.logoUrl} seed={org.handle} alt="" size={72} className="ring-4 ring-canvas" />
        </div>
        <div className="mt-3 flex gap-2">
          {org.viewer?.role ? (
            <Button size="sm" variant="secondary" to={`/app/org/${handle}/setup`} icon={null}>manage</Button>
          ) : org.viewer?.following ? (
            <Button size="sm" variant="secondary" onClick={() => unfollowMutation.mutate()} loading={unfollowMutation.isPending} icon={null}>following</Button>
          ) : (
            <Button size="sm" onClick={() => followMutation.mutate()} loading={followMutation.isPending} icon={null}>follow</Button>
          )}
        </div>
      </div>

      <div className="mt-3 border-b border-hairline px-4 pb-4">
        <div className="flex items-center gap-1.5">
          <h1 className="text-display-sm font-bold text-ink">{org.name}</h1>
          {org.verifiedAt && <SealCheck size={20} weight="fill" className="text-primary" aria-label="verified" />}
        </div>
        <p className="text-body text-ink-muted">@{org.handle}</p>
        
        {(org.bio || org.tagline) && (
          <p className="mt-2 whitespace-pre-wrap text-body-sm text-ink">{org.bio ?? org.tagline}</p>
        )}

        {org.categories && org.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {org.categories.map((cat: string) => (
              <span key={cat} className="inline-flex items-center rounded-pill border border-hairline bg-surface px-2.5 py-0.5 text-caption text-ink-soft">
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-4 text-body-sm text-ink-soft">
          <span><strong className="font-medium text-ink">{org.followerCount ?? 0}</strong> followers</span>
          <span>{org.updateCount ?? 0} updates</span>
          <span>{org.memberCount ?? 0} members</span>
        </div>
        
        {(org.website || org.communityLink) && (
          <div className="mt-3 flex gap-4">
            {org.website && (
              <SmartLink to={org.website} className="flex items-center gap-1 text-body-sm text-ink-muted hover:text-ink">
                <Globe size={16} aria-hidden="true" /> website
              </SmartLink>
            )}
            {org.communityLink && (
              <SmartLink to={org.communityLink} className="flex items-center gap-1 text-body-sm text-ink-muted hover:text-ink">
                <LinkIcon size={16} aria-hidden="true" /> community
              </SmartLink>
            )}
          </div>
        )}
      </div>

      {org.viewer?.role && (
        <div className="mt-4 px-4">
          <Button to="/app/compose" block icon={null}>post an update</Button>
        </div>
      )}

      <div className="mt-4 flex gap-6 border-b border-hairline px-4 pt-2">
        <button
          onClick={() => setActiveTab('updates')}
          className={cn(
            'border-b-2 pb-3 text-body-sm font-medium transition-colors',
            activeTab === 'updates' ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
          )}
        >
          updates
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={cn(
            'border-b-2 pb-3 text-body-sm font-medium transition-colors',
            activeTab === 'members' ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
          )}
        >
          members
        </button>
      </div>

      <div className="mt-2">
        {activeTab === 'updates' && (
          <>
            {isUpdatesLoading ? (
              <UpdateSkeletonList count={3} />
            ) : updatesData?.pages[0].items.length === 0 ? (
              <EmptyState icon={Users} title="no updates" description={`${org.name} hasn't posted any updates yet.`} />
            ) : (
              <div className="flex flex-col">
                {updatesData?.pages.map((page, i) => (
                  <div key={i}>
                    {page.items.map(update => (
                      <div key={update.id} className="border-b border-hairline">
                        <UpdateCard update={update} />
                      </div>
                    ))}
                  </div>
                ))}
                <InfiniteSentinel
                  hasMore={Boolean(hasNextUpdates)}
                  loading={isFetchingNextUpdates}
                  onReach={() => {
                    if (hasNextUpdates && !isFetchingNextUpdates) void fetchNextUpdates()
                  }}
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'members' && (
          <div className="p-8 text-center">
            {org.viewer?.role ? (
              <p className="text-body text-ink-soft">manage members from the dashboard</p>
            ) : (
              <p className="text-body text-ink-soft">this organization has {org.memberCount ?? 0} members</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
