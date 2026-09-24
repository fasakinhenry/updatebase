import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { BookmarkSimple } from '@phosphor-icons/react'
import { api } from '@/lib/api'
import { relativeTime } from '@/lib/time'
import { cn } from '@/lib/cn'
import { Seo } from '@/components/seo/Seo'
import { EmptyState } from '@/components/app/EmptyState'
import { InfiniteSentinel } from '@/components/app/InfiniteSentinel'
import { UpdateCard } from '@/components/app/UpdateCard'
import { TestimonialCard } from '@/components/app/TestimonialCard'
import type { Paginated, BookmarkEntry, Update, Testimonial } from '@/types/api'

type FilterType = 'all' | 'updates' | 'testimonials'
type SortType = 'newest' | 'oldest' | 'most popular'

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

export default function Bookmarks() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('newest')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['bookmarks', filter, sort],
    queryFn: async ({ pageParam }) => {
      const typeParam = filter === 'all' ? '' : filter === 'updates' ? 'update' : 'testimonial'
      const searchParams = new URLSearchParams({
        limit: '20',
      })
      if (pageParam) searchParams.set('cursor', pageParam as string)
      if (typeParam) searchParams.set('type', typeParam)
      
      return api.get<Paginated<BookmarkEntry>>(/api/bookmarks? + searchParams.toString())
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  })

  const entries = data?.pages.flatMap((page) => page.items) || []
  let lastMonthLabel = ''

  return (
    <div className="flex flex-col min-h-full pb-20">
      <Seo title="bookmarks" description="everything you saved, easy to find." path="/app/bookmarks" noindex />

      <header className="sticky top-0 z-20 bg-canvas/90 backdrop-blur border-b border-hairline px-4 py-3 flex items-center justify-between">
        <h1 className="text-display-sm font-semibold text-ink font-heading">bookmarks</h1>
      </header>

      <div className="px-4 py-3 border-b border-hairline flex items-center gap-2 overflow-x-auto no-scrollbar bg-surface/50">
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>
          all
        </FilterPill>
        <FilterPill active={filter === 'updates'} onClick={() => setFilter('updates')}>
          updates
        </FilterPill>
        <FilterPill active={filter === 'testimonials'} onClick={() => setFilter('testimonials')}>
          testimonials
        </FilterPill>
        
        <div className="w-px h-4 bg-hairline-strong mx-2 shrink-0" />
        
        <FilterPill active={sort === 'newest'} onClick={() => setSort('newest')}>
          newest
        </FilterPill>
        <FilterPill active={sort === 'oldest'} onClick={() => setSort('oldest')}>
          oldest
        </FilterPill>
        <FilterPill active={sort === 'most popular'} onClick={() => setSort('most popular')}>
          most popular
        </FilterPill>
      </div>

      <div className="flex flex-col flex-1 relative">
        {entries.length === 0 && !isLoading ? (
          <div className="mt-20">
            <EmptyState
              icon={BookmarkSimple}
              title="nothing saved yet"
              description="tap the bookmark on any update or testimonial and it lands here."
            />
          </div>
        ) : (
          <div>
            {entries.map((entry) => {
              const monthLabel = new Date(entry.bookmarkedAt).toLocaleString('en-GB', {
                month: 'long',
                year: 'numeric',
              }).toLowerCase()

              const showMonth = monthLabel !== lastMonthLabel
              if (showMonth) {
                lastMonthLabel = monthLabel
              }

              return (
                <div key={entry.bookmarkId}>
                  {showMonth && (
                    <div className="sticky top-14 z-10 bg-canvas/90 backdrop-blur px-4 py-2 text-caption font-semibold text-ink-muted border-b border-hairline lg:top-0">
                      {monthLabel}
                    </div>
                  )}

                  <div className="border-b border-hairline">
                    {entry.type === 'update' ? (
                      <UpdateCard update={entry.subject as Update} />
                    ) : entry.type === 'testimonial' ? (
                      <TestimonialCard testimonial={entry.subject as Testimonial} />
                    ) : null}
                    <div className="text-caption text-ink-muted px-4 pb-3 pt-2">
                      bookmarked {relativeTime(entry.bookmarkedAt)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        <InfiniteSentinel
          hasMore={Boolean(hasNextPage)}
          loading={isFetchingNextPage}
          onReach={() => {
            if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
          }}
        />
      </div>
    </div>
  )
}
