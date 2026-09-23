import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Category, Paginated, Update } from '@/types/api'

export type FeedTab = 'for-you' | 'following'

export function feedKey(tab: FeedTab, category?: Category) {
  return ['feed', tab, category ?? 'all'] as const
}

export function useFeed(tab: FeedTab, category?: Category) {
  return useInfiniteQuery({
    queryKey: feedKey(tab, category),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      api.get<Paginated<Update>>(`/api/feed/${tab}`, { cursor: pageParam, category, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // a feed that refetches under you while reading is worse than a stale one
    staleTime: 2 * 60_000,
  })
}

type Patch = (update: Update) => Update

/**
 * applies a change to one update everywhere it appears: both feed tabs, the
 * detail page, bookmarks, a profile. without this, loving something in the
 * feed would leave the same card stale in three other places.
 */
function useUpdatePatcher() {
  const client = useQueryClient()

  return (id: string, patch: Patch) => {
    client.setQueriesData<{ pages: Paginated<Update>[]; pageParams: unknown[] }>(
      { queryKey: ['feed'] },
      (data) => {
        if (!data) return data
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => (item.id === id ? patch(item) : item)),
          })),
        }
      },
    )

    client.setQueryData<Update>(['update', id], (update) => (update ? patch(update) : update))
  }
}

export function useLoveUpdate() {
  const client = useQueryClient()
  const patchUpdate = useUpdatePatcher()

  return useMutation({
    mutationFn: ({ id, loved }: { id: string; loved: boolean }) =>
      loved ? api.delete(`/api/updates/${id}/love`) : api.post(`/api/updates/${id}/love`),

    onMutate: async ({ id, loved }) => {
      // the tap should land instantly, the request catches up
      patchUpdate(id, (update) => ({
        ...update,
        viewer: { ...update.viewer, loved: !loved },
        counts: { ...update.counts, love: update.counts.love + (loved ? -1 : 1) },
      }))

      return { id, loved }
    },

    onError: (_error, _variables, context) => {
      // put it back exactly as it was
      if (!context) return
      patchUpdate(context.id, (update) => ({
        ...update,
        viewer: { ...update.viewer, loved: context.loved },
        counts: { ...update.counts, love: update.counts.love + (context.loved ? 1 : -1) },
      }))
    },

    onSettled: () => {
      void client.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })
}

export function useBookmarkUpdate() {
  const client = useQueryClient()
  const patchUpdate = useUpdatePatcher()

  return useMutation({
    mutationFn: ({ id, bookmarked }: { id: string; bookmarked: boolean }) =>
      bookmarked
        ? api.delete(`/api/updates/${id}/bookmark`)
        : api.post(`/api/updates/${id}/bookmark`),

    onMutate: async ({ id, bookmarked }) => {
      patchUpdate(id, (update) => ({
        ...update,
        viewer: { ...update.viewer, bookmarked: !bookmarked },
        counts: { ...update.counts, bookmark: update.counts.bookmark + (bookmarked ? -1 : 1) },
      }))
      return { id, bookmarked }
    },

    onError: (_error, _variables, context) => {
      if (!context) return
      patchUpdate(context.id, (update) => ({
        ...update,
        viewer: { ...update.viewer, bookmarked: context.bookmarked },
        counts: {
          ...update.counts,
          bookmark: update.counts.bookmark + (context.bookmarked ? 1 : -1),
        },
      }))
    },

    onSettled: () => {
      void client.invalidateQueries({ queryKey: ['bookmarks'] })
    },
  })
}

export function useRepostUpdate() {
  const patchUpdate = useUpdatePatcher()

  return useMutation({
    mutationFn: ({ id, reposted, body }: { id: string; reposted: boolean; body?: string }) =>
      reposted && !body
        ? api.delete(`/api/updates/${id}/repost`)
        : api.post(`/api/updates/${id}/repost`, body ? { body } : undefined),

    onMutate: async ({ id, reposted, body }) => {
      // a quote is a new post, not a toggle, so only a plain repost flips state
      if (body) return undefined

      patchUpdate(id, (update) => ({
        ...update,
        viewer: { ...update.viewer, reposted: !reposted },
        counts: { ...update.counts, repost: update.counts.repost + (reposted ? -1 : 1) },
      }))
      return { id, reposted }
    },

    onError: (_error, _variables, context) => {
      if (!context) return
      patchUpdate(context.id, (update) => ({
        ...update,
        viewer: { ...update.viewer, reposted: context.reposted },
        counts: { ...update.counts, repost: update.counts.repost + (context.reposted ? 1 : -1) },
      }))
    },
  })
}
