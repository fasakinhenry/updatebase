import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MagnifyingGlass, Sparkle, UserCircleMinus } from '@phosphor-icons/react'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'
import { toast } from '@/stores/toast'
import { Seo } from '@/components/seo/Seo'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/app/EmptyState'
import { UpdateCard } from '@/components/app/UpdateCard'
import { TestimonialCard } from '@/components/app/TestimonialCard'
import type { SearchResults, Trending, Suggestions, UserCard, OrganizationCard } from '@/types/api'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

type Intent = 'mixed' | 'updates' | 'people' | 'organizations'
type SuggestionFilter = 'mixed' | 'organizations' | 'people'

const INTENT_LABELS: Record<Intent, string> = {
  mixed: 'everything',
  updates: 'updates',
  people: 'people',
  organizations: 'organizations',
}

const SUGGESTION_FILTER_LABELS: Record<SuggestionFilter, string> = {
  mixed: 'mixed',
  organizations: 'organizations',
  people: 'people',
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 cursor-pointer rounded-pill border px-3 py-1.5 text-caption transition-colors duration-fast',
        active
          ? 'border-primary bg-primary text-on-primary'
          : 'border-hairline bg-canvas text-ink-soft hover:border-hairline-strong hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

function SuggestionCard({
  name,
  handle,
  avatarSrc,
  avatarSeed,
  bio,
  followerCount,
  onFollow,
}: {
  name: string
  handle: string
  avatarSrc?: string
  avatarSeed?: string
  bio?: string
  followerCount?: number
  onFollow: () => void
}) {
  return (
    <div className="flex min-w-[176px] flex-shrink-0 flex-col items-center gap-3 rounded-2xl border border-hairline bg-canvas p-4 text-center">
      <Avatar src={avatarSrc} seed={avatarSeed ?? handle} alt="" size={52} />
      <div className="min-w-0 w-full">
        <p className="truncate text-label text-ink">{name}</p>
        <p className="truncate text-caption text-ink-muted">@{handle}</p>
        {bio && <p className="mt-1 line-clamp-2 text-caption text-ink-soft">{bio}</p>}
        {followerCount !== undefined && (
          <p className="mt-1 text-caption text-ink-muted">
            {followerCount.toLocaleString()} followers
          </p>
        )}
      </div>
      <Button size="sm" block onClick={onFollow} icon={null}>
        follow
      </Button>
    </div>
  )
}

export default function DiscoverPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 400)
  const [intent, setIntent] = useState<Intent>('mixed')
  const [suggestionFilter, setSuggestionFilter] = useState<SuggestionFilter>('mixed')

  const isSearching = Boolean(debouncedQuery.trim())

  const { data: suggestionsData, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['discover', 'suggestions'],
    queryFn: () => api.get<Suggestions>('/api/discover/suggestions'),
    enabled: !isSearching,
    staleTime: 5 * 60_000,
  })

  const { data: trendingData, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['discover', 'trending'],
    queryFn: () => api.get<Trending>('/api/discover/trending'),
    enabled: !isSearching,
    staleTime: 2 * 60_000,
  })

  const { data: searchResults, isLoading: isLoadingSearch } = useQuery({
    queryKey: ['discover', 'search', debouncedQuery, intent],
    queryFn: () =>
      api.get<SearchResults>('/api/discover/search', {
        q: debouncedQuery,
        intent: intent === 'mixed' ? undefined : intent,
      }),
    enabled: isSearching,
    staleTime: 30_000,
  })

  const followOrg = useMutation({
    mutationFn: (id: string) => api.post(`/api/follows/organizations/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['discover'] })
      toast.success('followed', 'organization added to your feed')
    },
    onError: () => toast.error('error', 'could not follow'),
  })

  const followUser = useMutation({
    mutationFn: (id: string) => api.post(`/api/follows/users/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['discover'] })
      toast.success('followed', 'person added to your network')
    },
    onError: () => toast.error('error', 'could not follow'),
  })

  const handleFollowOrg = (org: OrganizationCard) => {
    followOrg.mutate(org.id ?? org._id ?? '')
  }

  const handleFollowUser = (user: UserCard) => {
    followUser.mutate(user.id ?? user._id ?? '')
  }

  const shownOrgs = suggestionFilter === 'people' ? [] : (suggestionsData?.organizations ?? [])
  const shownPeople = suggestionFilter === 'organizations' ? [] : (suggestionsData?.people ?? [])

  return (
    <div className="mx-auto max-w-2xl">
      <Seo
        title="discover"
        description="search for opportunities, communities and people."
        path="/app/discover"
        noindex
      />

      {/* sticky search + intent filter */}
      <div className="sticky top-14 z-30 border-b border-hairline bg-canvas/90 px-4 pb-3 pt-4 backdrop-blur-md sm:px-6 lg:top-0">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-display-sm text-ink">discover</h1>
          <Sparkle size={18} weight="fill" className="text-primary" aria-hidden="true" />
        </div>

        <div className="relative mt-3">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            weight="bold"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="search updatebase"
            placeholder="search people, communities, opportunities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-surface py-2.5 pl-9 pr-4 text-body text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>

        {isSearching && (
          <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">
            {(Object.keys(INTENT_LABELS) as Intent[]).map((type) => (
              <FilterPill key={type} active={intent === type} onClick={() => setIntent(type)}>
                {INTENT_LABELS[type]}
              </FilterPill>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-6 sm:px-6">
        {!isSearching ? (
          <div className="flex flex-col gap-10">
            {/* follow suggestions */}
            <section>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-display-xs text-ink">who to follow</h2>
                <div className="flex gap-1.5">
                  {(Object.keys(SUGGESTION_FILTER_LABELS) as SuggestionFilter[]).map((f) => (
                    <FilterPill
                      key={f}
                      active={suggestionFilter === f}
                      onClick={() => setSuggestionFilter(f)}
                    >
                      {SUGGESTION_FILTER_LABELS[f]}
                    </FilterPill>
                  ))}
                </div>
              </div>

              {isLoadingSuggestions ? (
                <div className="mt-4 flex justify-center py-8">
                  <Spinner label="loading suggestions" />
                </div>
              ) : shownOrgs.length === 0 && shownPeople.length === 0 ? (
                <p className="mt-4 text-body-sm text-ink-muted">
                  nothing to suggest right now. check back later.
                </p>
              ) : (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
                  {shownOrgs.map((org) => (
                    <SuggestionCard
                      key={org.id ?? org._id}
                      name={org.name}
                      handle={org.handle}
                      avatarSrc={org.logoUrl}
                      avatarSeed={org.handle}
                      followerCount={org.followerCount}
                      onFollow={() => handleFollowOrg(org)}
                    />
                  ))}
                  {shownPeople.map((person) => (
                    <SuggestionCard
                      key={person.id ?? person._id}
                      name={person.name ?? person.username ?? ''}
                      handle={person.username ?? ''}
                      avatarSrc={person.avatarMode === 'photo' ? person.photoUrl : undefined}
                      avatarSeed={person.avatarSeed}
                      bio={person.bio}
                      followerCount={person.followerCount}
                      onFollow={() => handleFollowUser(person)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* trending */}
            <section>
              <h2 className="text-display-xs text-ink">trending now</h2>

              {isLoadingTrending ? (
                <div className="mt-4 flex justify-center py-8">
                  <Spinner label="loading trending" />
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-6">
                  {(trendingData?.topics?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {trendingData!.topics.map((topic) => (
                        <button
                          key={topic.tag}
                          type="button"
                          className="cursor-pointer rounded-pill border border-hairline bg-surface px-3 py-1.5 text-caption text-ink-soft transition-colors duration-fast hover:border-primary hover:text-primary"
                        >
                          #{topic.tag}
                        </button>
                      ))}
                    </div>
                  )}
                  {(trendingData?.updates?.length ?? 0) > 0 && (
                    <div className="flex flex-col">
                      {trendingData!.updates.slice(0, 3).map((update) => (
                        <UpdateCard key={update.id} update={update} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        ) : (
          /* search results */
          <div className="flex flex-col gap-6">
            {isLoadingSearch ? (
              <div className="flex justify-center py-12">
                <Spinner label="searching" />
              </div>
            ) : searchResults ? (
              <>
                {!searchResults.updates?.length &&
                !searchResults.people?.length &&
                !searchResults.organizations?.length &&
                !searchResults.testimonials?.length ? (
                  <EmptyState
                    icon={UserCircleMinus}
                    title="no results"
                    description="try different words or adjust your filter."
                  />
                ) : (
                  <div className="flex flex-col gap-8">
                    {(searchResults.people?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="mb-3 text-label font-semibold text-ink-soft">people</h3>
                        <div className="flex flex-col gap-2">
                          {searchResults.people.map((person) => (
                            <div
                              key={person.id ?? person._id}
                              className="flex items-center justify-between rounded-2xl border border-hairline bg-canvas p-3"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src={person.avatarMode === 'photo' ? person.photoUrl : undefined}
                                  seed={person.avatarSeed}
                                  alt=""
                                  size={40}
                                />
                                <div>
                                  <p className="text-label text-ink">
                                    {person.name ?? person.username}
                                  </p>
                                  <p className="text-caption text-ink-muted">@{person.username}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleFollowUser(person)}
                                icon={null}
                              >
                                follow
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(searchResults.organizations?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="mb-3 text-label font-semibold text-ink-soft">
                          organizations
                        </h3>
                        <div className="flex flex-col gap-2">
                          {searchResults.organizations.map((org) => (
                            <div
                              key={org.id ?? org._id}
                              className="flex items-center justify-between rounded-2xl border border-hairline bg-canvas p-3"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar src={org.logoUrl} seed={org.handle} alt="" size={40} />
                                <div>
                                  <p className="text-label text-ink">{org.name}</p>
                                  <p className="text-caption text-ink-muted">@{org.handle}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleFollowOrg(org)}
                                icon={null}
                              >
                                follow
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(searchResults.updates?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="mb-3 text-label font-semibold text-ink-soft">updates</h3>
                        <div className="flex flex-col">
                          {searchResults.updates.map((update) => (
                            <UpdateCard key={update.id} update={update} />
                          ))}
                        </div>
                      </div>
                    )}

                    {(searchResults.testimonials?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="mb-3 text-label font-semibold text-ink-soft">
                          testimonials
                        </h3>
                        <div className="flex flex-col">
                          {searchResults.testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
