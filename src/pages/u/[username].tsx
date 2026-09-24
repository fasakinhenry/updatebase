import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserCircle } from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/app/EmptyState'
import { UpdateCard } from '@/components/app/UpdateCard'
import { TestimonialCard } from '@/components/app/TestimonialCard'
import { InfiniteSentinel } from '@/components/app/InfiniteSentinel'
import { UpdateSkeletonList } from '@/components/app/UpdateSkeleton'
import { api } from '@/lib/api'
import { toast } from '@/stores/toast'
import { cn } from '@/lib/cn'
import type { Profile, Update, Testimonial, Paginated } from '@/types/api'

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'updates' | 'testimonials'>('updates')

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => api.get<Profile>('/api/profiles/' + username)
  })

  const followMutation = useMutation({
    mutationFn: () => api.post(/api/follows/users/ + profile?.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', username] })
      toast.success('followed', you are now following @ + username)
    },
    onError: () => toast.error('error', 'could not follow user')
  })

  const unfollowMutation = useMutation({
    mutationFn: () => api.delete(/api/follows/users/ + profile?.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', username] })
      toast.success('unfollowed', you are no longer following @ + username)
    },
    onError: () => toast.error('error', 'could not unfollow user')
  })

  const {
    data: updatesData,
    fetchNextPage: fetchNextUpdates,
    hasNextPage: hasNextUpdates,
    isFetchingNextPage: isFetchingNextUpdates,
    isLoading: isUpdatesLoading
  } = useInfiniteQuery({
    queryKey: ['profile', username, 'updates'],
    queryFn: ({ pageParam }) =>
      api.get<Paginated<Update>>(/api/users/ + username + /updates, {
        limit: 20,
        cursor: pageParam || undefined
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(profile) && activeTab === 'updates'
  })

  const {
    data: testimonialsData,
    fetchNextPage: fetchNextTestimonials,
    hasNextPage: hasNextTestimonials,
    isFetchingNextPage: isFetchingNextTestimonials,
    isLoading: isTestimonialsLoading
  } = useInfiniteQuery({
    queryKey: ['profile', username, 'testimonials'],
    queryFn: ({ pageParam }) =>
      api.get<Paginated<Testimonial>>(/api/users/ + username + /testimonials, {
        limit: 20,
        cursor: pageParam || undefined
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(profile) && activeTab === 'testimonials'
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="loading profile" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <EmptyState 
        icon={UserCircle} 
        title="profile not found" 
        description="this person may have deleted their account." 
        action={<Button to="/app/feed" icon={null}>back to feed</Button>} 
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl pb-20">
      <Seo 
        title={profile.name ?? profile.username ?? 'profile'} 
        description={profile.bio?.slice(0, 160) ?? ''} 
        path={'/u/' + username} 
      />

      <div className="relative">
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="banner" className="h-44 w-full object-cover" />
        ) : (
          <div className="h-44 border-b border-hairline bg-surface" />
        )}
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="-mt-10">
          <Avatar 
            src={profile.avatarMode === 'photo' ? profile.photoUrl : undefined} 
            seed={profile.avatarSeed ?? profile.username} 
            alt={profile.name ?? profile.username ?? ''} 
            size={80} 
            className="ring-4 ring-canvas" 
          />
        </div>
        <div className="mt-3 flex gap-2">
          {profile.viewer?.isSelf ? (
            <Button to="/app/settings" variant="secondary" size="sm" icon={null}>edit profile</Button>
          ) : profile.viewer?.following ? (
            <Button size="sm" variant="secondary" onClick={() => unfollowMutation.mutate()} loading={unfollowMutation.isPending} icon={null}>following</Button>
          ) : (
            <Button size="sm" onClick={() => followMutation.mutate()} loading={followMutation.isPending} icon={null}>follow</Button>
          )}
        </div>
      </div>

      <div className="mt-3 border-b border-hairline px-4 pb-4">
        <h1 className="text-display-sm font-bold text-ink">{profile.name || profile.username}</h1>
        {profile.name && <p className="text-body text-ink-muted">@{profile.username}</p>}
        
        {profile.bio && (
          <p className="mt-2 whitespace-pre-wrap text-body-sm text-ink">{profile.bio}</p>
        )}

        <div className="mt-4 flex gap-4 text-body-sm text-ink-soft">
          <span><strong className="font-medium text-ink">{profile.followerCount ?? 0}</strong> followers</span>
          <span>{profile.counts?.updates ?? 0} updates</span>
          <span>{profile.counts?.testimonials ?? 0} testimonials</span>
        </div>
        
        {profile.location && (
          <div className="mt-3 flex flex-col gap-1.5 text-body-sm text-ink-muted">
            <div className="flex items-center gap-1.5">
              <span className="font-medium">from</span>
              <span className="text-ink">{profile.location.city} {profile.location.country}</span>
            </div>
          </div>
        )}
      </div>

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
          onClick={() => setActiveTab('testimonials')}
          className={cn(
            'border-b-2 pb-3 text-body-sm font-medium transition-colors',
            activeTab === 'testimonials' ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
          )}
        >
          testimonials
        </button>
      </div>

      <div className="mt-2">
        {activeTab === 'updates' && (
          <>
            {isUpdatesLoading ? (
              <UpdateSkeletonList count={3} />
            ) : updatesData?.pages[0].items.length === 0 ? (
              <EmptyState icon={UserCircle} title="no updates" description={@ + username +  hasn't posted any updates yet.} />
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

        {activeTab === 'testimonials' && (
          <>
            {isTestimonialsLoading ? (
              <div className="flex justify-center py-10"><Spinner label="loading testimonials" /></div>
            ) : testimonialsData?.pages[0].items.length === 0 ? (
              <EmptyState icon={UserCircle} title="no testimonials" description={@ + username +  hasn't written any testimonials.} />
            ) : (
              <div className="flex flex-col gap-4 px-4 py-2">
                {testimonialsData?.pages.map((page, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    {page.items.map(testimonial => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                  </div>
                ))}
                <InfiniteSentinel
                  hasMore={Boolean(hasNextTestimonials)}
                  loading={isFetchingNextTestimonials}
                  onReach={() => {
                    if (hasNextTestimonials && !isFetchingNextTestimonials) void fetchNextTestimonials()
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
