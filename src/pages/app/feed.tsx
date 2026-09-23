import { useRef, useState } from 'react'
import { Compass, WarningCircle } from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { UpdateCard } from '@/components/app/UpdateCard'
import { UpdateSkeletonList } from '@/components/app/UpdateSkeleton'
import { EmptyState } from '@/components/app/EmptyState'
import { InfiniteSentinel } from '@/components/app/InfiniteSentinel'
import { useFeed, type FeedTab } from '@/features/feed/useFeed'
import { CATEGORY_LABELS } from '@/lib/categories'
import type { Category } from '@/types/api'
import { cn } from '@/lib/cn'

const tabs: { id: FeedTab; label: string }[] = [
  { id: 'for-you', label: 'for you' },
  { id: 'following', label: 'following' },
]

export default function FeedPage() {
  const [tab, setTab] = useState<FeedTab>('for-you')
  const [category, setCategory] = useState<Category | undefined>()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const query = useFeed(tab, category)
  const updates = query.data?.pages.flatMap((page) => page.items) ?? []

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next: number | null = null
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    if (next === null) return

    event.preventDefault()
    setTab(tabs[next]!.id)
    tabRefs.current[next]?.focus()
  }

  return (
    <>
      <Seo
        title="your feed"
        description="opportunities from the communities you follow."
        path="/app/feed"
        noindex
      />

      <div className="mx-auto max-w-2xl">
        {/* the tabs stay put while the list scrolls under them */}
        <div className="sticky top-14 z-30 border-b border-hairline bg-canvas/90 backdrop-blur-md lg:top-0">
          <div role="tablist" aria-label="feed" className="flex">
            {tabs.map((item, index) => {
              const selected = tab === item.id
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="feed-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(item.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    'relative flex-1 px-4 py-4 text-label transition-colors duration-fast',
                    selected ? 'text-ink' : 'text-ink-muted hover:bg-surface hover:text-ink',
                  )}
                >
                  {item.label}
                  {selected && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-12 rounded-pill bg-primary"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="-mx-0 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:px-6">
            <button
              type="button"
              onClick={() => setCategory(undefined)}
              aria-pressed={!category}
              className={cn(
                'shrink-0 rounded-pill border px-3 py-1.5 text-caption transition-colors duration-fast',
                !category
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-hairline bg-canvas text-ink-soft hover:border-hairline-strong hover:text-ink',
              )}
            >
              everything
            </button>

            {(Object.keys(CATEGORY_LABELS) as Category[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(category === item ? undefined : item)}
                aria-pressed={category === item}
                className={cn(
                  'shrink-0 rounded-pill border px-3 py-1.5 text-caption transition-colors duration-fast',
                  category === item
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-hairline bg-canvas text-ink-soft hover:border-hairline-strong hover:text-ink',
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div id="feed-panel" role="tabpanel">
          {query.isPending && <UpdateSkeletonList />}

          {query.isError && (
            <EmptyState
              icon={WarningCircle}
              title="we could not load your feed"
              description="that is on us. check your connection and try again."
              action={
                <Button onClick={() => void query.refetch()} icon={null}>
                  try again
                </Button>
              }
            />
          )}

          {query.isSuccess && updates.length === 0 && (
            <EmptyState
              icon={Compass}
              title={tab === 'following' ? 'nothing here yet' : 'give us a moment'}
              description={
                tab === 'following'
                  ? 'you are not following anyone yet. find a few communities and this fills up fast.'
                  : 'we are still learning what you care about. follow a community or two to speed it up.'
              }
              action={
                <Button to="/app/discover" icon={null}>
                  find communities
                </Button>
              }
            />
          )}

          {updates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}

          <InfiniteSentinel
            hasMore={Boolean(query.hasNextPage)}
            loading={query.isFetchingNextPage}
            onReach={() => {
              if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage()
            }}
          />
        </div>
      </div>
    </>
  )
}
