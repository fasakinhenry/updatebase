import {
  ArrowBendUpRight,
  ChatCircle,
  Confetti,
  Repeat,
  BookmarkSimple,
  ShareNetwork,
} from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar } from '@/components/ui/Avatar'
import { SmartLink } from '@/components/ui/SmartLink'
import { api } from '@/lib/api'
import { relativeTime } from '@/lib/time'
import { toast } from '@/stores/toast'
import { celebrate } from '@/lib/confetti'
import { env } from '@/lib/env'
import { cn } from '@/lib/cn'
import type { Testimonial } from '@/types/api'

/**
 * the quoted update, shown small. this is the bit that makes a testimonial
 * more than a status: you can always see what it came from.
 */
function QuotedUpdate({ update }: { update: Testimonial['quotedUpdates'][number] }) {
  return (
    <SmartLink
      to={`/app/updates/${update.id}`}
      className="block rounded-xl border border-hairline bg-surface p-3.5 transition-colors duration-fast hover:border-hairline-strong"
    >
      <div className="flex items-center gap-2">
        <ArrowBendUpRight
          size={12}
          weight="bold"
          aria-hidden="true"
          className="shrink-0 text-ink-muted"
        />
        {update.organization && (
          <>
            <Avatar
              src={update.organization.logoUrl}
              seed={update.organization.handle}
              alt=""
              size={18}
            />
            <span className="truncate text-caption font-medium text-ink-soft">
              {update.organization.name}
            </span>
          </>
        )}
      </div>

      {/* keeps its own casing, it is the community's voice */}
      <p className="mt-2 text-body-sm font-semibold text-ink">{update.header}</p>
      {update.number && (
        <p className="tabular mt-0.5 text-caption text-primary">✅ {update.number}</p>
      )}
    </SmartLink>
  )
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const client = useQueryClient()
  const author = testimonial.author

  const patch = (changes: Partial<Testimonial>) => {
    client.setQueriesData<{ pages: { items: Testimonial[] }[] }>(
      { queryKey: ['testimonials'] },
      (data) => {
        if (!data) return data
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item._id === testimonial._id ? { ...item, ...changes } : item,
            ),
          })),
        }
      },
    )
  }

  const toggleCelebrate = useMutation({
    mutationFn: () =>
      testimonial.viewer.celebrated
        ? api.delete(`/api/testimonials/${testimonial._id}/celebrate`)
        : api.post(`/api/testimonials/${testimonial._id}/celebrate`),

    onMutate: () => {
      const next = !testimonial.viewer.celebrated
      patch({
        viewer: { ...testimonial.viewer, celebrated: next },
        celebrateCount: testimonial.celebrateCount + (next ? 1 : -1),
      })
      // celebrating someone's win should feel like it
      if (next) void celebrate()
    },

    onError: () => {
      patch({
        viewer: testimonial.viewer,
        celebrateCount: testimonial.celebrateCount,
      })
      toast.error('that did not go through', 'try again in a moment')
    },
  })

  const toggleBookmark = useMutation({
    mutationFn: () =>
      testimonial.viewer.bookmarked
        ? api.delete(`/api/testimonials/${testimonial._id}/bookmark`)
        : api.post(`/api/testimonials/${testimonial._id}/bookmark`),

    onMutate: () => {
      patch({
        viewer: { ...testimonial.viewer, bookmarked: !testimonial.viewer.bookmarked },
      })
    },

    onError: () => patch({ viewer: testimonial.viewer }),
    onSettled: () => client.invalidateQueries({ queryKey: ['bookmarks'] }),
  })

  const reshare = useMutation({
    mutationFn: () => api.post(`/api/testimonials/${testimonial._id}/repost`),
    onSuccess: () => {
      patch({ repostCount: testimonial.repostCount + 1 })
      toast.success('reshared', 'your network sees it now')
    },
  })

  const share = async () => {
    const url = `${env.VITE_SITE_URL}/app/testimonials/${testimonial._id}`
    const data = {
      title: `${author.name ?? author.username} on updatebase`,
      text: testimonial.body.slice(0, 120),
      url,
    }

    if (navigator.share && navigator.canShare?.(data)) {
      try {
        await navigator.share(data)
      } catch {
        // dismissed, which is not a failure
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success('link copied')
    } catch {
      toast.error('could not copy', 'your browser blocked clipboard access')
    }
  }

  return (
    <article className="border-b border-hairline px-4 py-5 sm:px-6">
      <div className="flex items-start gap-3">
        <SmartLink to={`/u/${author.username}`} aria-label={author.name ?? author.username ?? ''}>
          <Avatar
            seed={author.avatarSeed}
            src={author.avatarMode === 'photo' ? author.photoUrl : undefined}
            alt=""
            size={42}
          />
        </SmartLink>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-body-sm">
            <SmartLink
              to={`/u/${author.username}`}
              className="truncate font-semibold text-ink hover:underline"
            >
              {author.name ?? author.username}
            </SmartLink>
            <span aria-hidden="true" className="text-ink-muted">
              ·
            </span>
            <time dateTime={testimonial.publishedAt} className="shrink-0 text-ink-muted">
              {relativeTime(testimonial.publishedAt)}
            </time>
          </div>

          <SmartLink to={`/app/testimonials/${testimonial._id}`} className="mt-2 block">
            <p className="whitespace-pre-wrap text-body text-ink">{testimonial.body}</p>
          </SmartLink>

          {testimonial.media && testimonial.media.length > 0 && (
            <ul
              className={cn(
                'mt-3 grid gap-1.5',
                testimonial.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
              )}
            >
              {testimonial.media.slice(0, 4).map((item) => (
                <li key={item.url} className="overflow-hidden rounded-lg bg-surface-2">
                  {item.kind === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.alt ?? ''}
                      width={item.width ?? 800}
                      height={item.height ?? 600}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      controls
                      preload="metadata"
                      width={item.width ?? 800}
                      height={item.height ?? 600}
                      className="h-full w-full"
                    >
                      <source src={item.url} />
                      {item.captionsUrl && (
                        <track
                          kind="captions"
                          src={item.captionsUrl}
                          srcLang="en"
                          label="english"
                          default
                        />
                      )}
                    </video>
                  )}
                </li>
              ))}
            </ul>
          )}

          <ul className="mt-3 flex flex-col gap-2">
            {testimonial.quotedUpdates.map((update) => (
              <li key={update.id}>
                <QuotedUpdate update={update} />
              </li>
            ))}
          </ul>

          <div className="-ml-2 mt-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleCelebrate.mutate()}
              aria-pressed={testimonial.viewer.celebrated}
              aria-label={
                testimonial.viewer.celebrated ? 'remove celebration' : 'celebrate this'
              }
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-caption transition-colors duration-fast',
                testimonial.viewer.celebrated
                  ? 'text-primary hover:bg-primary-soft'
                  : 'text-ink-muted hover:bg-surface hover:text-ink',
              )}
            >
              <Confetti
                size={17}
                weight={testimonial.viewer.celebrated ? 'fill' : 'regular'}
                aria-hidden="true"
              />
              {testimonial.celebrateCount > 0 && (
                <span className="tabular">{testimonial.celebrateCount}</span>
              )}
            </button>

            <SmartLink
              to={`/app/testimonials/${testimonial._id}`}
              aria-label={`${testimonial.commentCount} comments`}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-caption text-ink-muted transition-colors duration-fast hover:bg-surface hover:text-ink"
            >
              <ChatCircle size={17} aria-hidden="true" />
              {testimonial.commentCount > 0 && (
                <span className="tabular">{testimonial.commentCount}</span>
              )}
            </SmartLink>

            <button
              type="button"
              onClick={() => reshare.mutate()}
              aria-label="reshare to your network"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-caption text-ink-muted transition-colors duration-fast hover:bg-surface hover:text-ink"
            >
              <Repeat size={17} aria-hidden="true" />
              {testimonial.repostCount > 0 && (
                <span className="tabular">{testimonial.repostCount}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => toggleBookmark.mutate()}
              aria-pressed={testimonial.viewer.bookmarked}
              aria-label={testimonial.viewer.bookmarked ? 'remove bookmark' : 'save for later'}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-caption transition-colors duration-fast',
                testimonial.viewer.bookmarked
                  ? 'text-primary hover:bg-primary-soft'
                  : 'text-ink-muted hover:bg-surface hover:text-ink',
              )}
            >
              <BookmarkSimple
                size={17}
                weight={testimonial.viewer.bookmarked ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={() => void share()}
              aria-label="share this testimonial"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-caption text-ink-muted transition-colors duration-fast hover:bg-surface hover:text-ink"
            >
              <ShareNetwork size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
