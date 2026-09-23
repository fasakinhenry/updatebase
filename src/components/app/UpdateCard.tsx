import { useState } from 'react'
import {
  ArrowSquareOut,
  BookmarkSimple,
  ChatCircle,
  Clock,
  DotsThree,
  Heart,
  Repeat,
  SealCheck,
  ShareNetwork,
} from '@phosphor-icons/react'
import { Avatar } from '@/components/ui/Avatar'
import { SmartLink } from '@/components/ui/SmartLink'
import { useBookmarkUpdate, useLoveUpdate, useRepostUpdate } from '@/features/feed/useFeed'
import { relativeTime, deadlineLabel } from '@/lib/time'
import { toast } from '@/stores/toast'
import { env } from '@/lib/env'
import { cn } from '@/lib/cn'
import type { Update } from '@/types/api'

interface UpdateCardProps {
  update: Update
  /** the detail page shows the whole body, a feed card clamps it */
  expanded?: boolean
}

function Action({
  icon: Icon,
  count,
  label,
  active,
  activeClass,
  onClick,
}: {
  icon: typeof Heart
  count?: number
  label: string
  active?: boolean
  activeClass?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-caption transition-colors duration-fast ease-standard',
        active ? activeClass : 'text-ink-muted hover:bg-surface hover:text-ink',
      )}
    >
      <Icon size={17} weight={active ? 'fill' : 'regular'} aria-hidden="true" />
      {count !== undefined && count > 0 && <span className="tabular">{count}</span>}
    </button>
  )
}

export function UpdateCard({ update, expanded = false }: UpdateCardProps) {
  const love = useLoveUpdate()
  const bookmark = useBookmarkUpdate()
  const repost = useRepostUpdate()
  const [showAll, setShowAll] = useState(expanded)

  const org = update.organization
  const deadline = deadlineLabel(update.deadline)

  const share = async () => {
    const url = `${env.VITE_SITE_URL}/app/updates/${update.id}`
    const shareData = { title: update.header, text: update.body.slice(0, 120), url }

    // the native sheet is what people expect on a phone, clipboard is the fallback
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // they dismissed the sheet, which is not a failure worth reporting
        return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success('link copied', 'paste it anywhere you like')
    } catch {
      toast.error('could not copy', 'your browser blocked clipboard access')
    }
  }

  return (
    <article className="border-b border-hairline px-4 py-5 transition-colors duration-fast hover:bg-surface/40 sm:px-6">
      <div className="flex items-start gap-3">
        <SmartLink to={`/o/${org.handle}`} aria-label={org.name} className="shrink-0">
          <Avatar src={org.logoUrl} seed={org.handle} alt="" size={42} />
        </SmartLink>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-body-sm">
            <SmartLink
              to={`/o/${org.handle}`}
              className="truncate font-semibold text-ink hover:underline"
            >
              {org.name}
            </SmartLink>

            {org.verifiedAt && (
              <SealCheck
                size={14}
                weight="fill"
                aria-label="verified"
                className="shrink-0 text-primary"
              />
            )}

            <span aria-hidden="true" className="text-ink-muted">
              ·
            </span>
            <time dateTime={update.publishedAt} className="shrink-0 text-ink-muted">
              {relativeTime(update.publishedAt)}
            </time>

            <button
              type="button"
              aria-label="more options"
              className="ml-auto shrink-0 rounded-lg p-1 text-ink-muted transition-colors duration-fast hover:bg-surface-2 hover:text-ink"
            >
              <DotsThree size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>

          {/* the update itself keeps its own casing. it is the community's voice,
              not our interface copy, so nothing here is lowercased. */}
          <SmartLink to={`/app/updates/${update.id}`} className="mt-2.5 block">
            <h2 className="font-display text-display-xs text-ink">{update.header}</h2>

            <p className="tabular mt-1 text-caption font-semibold text-primary">
              ✅ {update.number}
            </p>

            <p
              className={cn(
                'mt-2 whitespace-pre-wrap text-body text-ink',
                !showAll && 'line-clamp-5',
              )}
            >
              {update.body}
            </p>
          </SmartLink>

          {!expanded && update.body.length > 280 && (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="mt-1 text-caption font-medium text-primary hover:underline"
            >
              {showAll ? 'show less' : 'read more'}
            </button>
          )}

          {update.link && (
            <a
              href={update.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-primary-line bg-primary-soft px-3 py-2 text-caption font-medium text-primary transition-colors duration-fast hover:bg-primary-soft-hover"
            >
              <span className="truncate">apply now</span>
              <ArrowSquareOut size={13} weight="bold" aria-hidden="true" className="shrink-0" />
            </a>
          )}

          {update.media && update.media.length > 0 && (
            <ul
              className={cn(
                'mt-3 grid gap-1.5 overflow-hidden rounded-xl',
                update.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
              )}
            >
              {update.media.slice(0, 4).map((item) => (
                <li key={item.url} className="overflow-hidden rounded-lg bg-surface-2">
                  {item.kind === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.alt ?? ''}
                      // real dimensions mean the box is reserved before it loads
                      width={item.width ?? 800}
                      height={item.height ?? 450}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      controls
                      preload="metadata"
                      className="h-full w-full"
                      width={item.width ?? 800}
                      height={item.height ?? 450}
                    >
                      <source src={item.url} />
                      {/* we can only offer captions the uploader gave us. we
                          never fake a track, since an empty one is worse than
                          none for anyone relying on it. */}
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

          <div className="mt-3 flex flex-wrap items-center gap-2 text-caption">
            <span className="rounded-pill bg-surface px-2.5 py-1 text-ink-muted">
              {update.category}
            </span>

            {deadline && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-pill px-2.5 py-1',
                  deadline.urgent ? 'bg-danger-soft text-danger' : 'bg-surface text-ink-muted',
                )}
              >
                <Clock size={11} weight="bold" aria-hidden="true" />
                {deadline.text}
              </span>
            )}

            {update.author && (
              <span className="text-ink-muted">
                posted by{' '}
                <SmartLink
                  to={`/u/${update.author.username}`}
                  className="font-medium text-ink-soft hover:underline"
                >
                  {update.author.username}
                </SmartLink>
              </span>
            )}
          </div>

          <div className="-ml-2 mt-2 flex items-center gap-1">
            <Action
              icon={Heart}
              count={update.counts.love}
              label={update.viewer.loved ? 'remove love' : 'love this update'}
              active={update.viewer.loved}
              activeClass="text-danger hover:bg-danger-soft"
              onClick={() => love.mutate({ id: update.id, loved: update.viewer.loved })}
            />

            <SmartLink
              to={`/app/updates/${update.id}`}
              aria-label={`${update.counts.comment} comments`}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-caption text-ink-muted transition-colors duration-fast hover:bg-surface hover:text-ink"
            >
              <ChatCircle size={17} aria-hidden="true" />
              {update.counts.comment > 0 && (
                <span className="tabular">{update.counts.comment}</span>
              )}
            </SmartLink>

            <Action
              icon={Repeat}
              count={update.counts.repost + update.counts.quote}
              label={update.viewer.reposted ? 'undo reshare' : 'reshare to your network'}
              active={update.viewer.reposted}
              activeClass="text-success hover:bg-success-soft"
              onClick={() => repost.mutate({ id: update.id, reposted: update.viewer.reposted })}
            />

            <Action
              icon={BookmarkSimple}
              label={update.viewer.bookmarked ? 'remove bookmark' : 'save for later'}
              active={update.viewer.bookmarked}
              activeClass="text-primary hover:bg-primary-soft"
              onClick={() =>
                bookmark.mutate({ id: update.id, bookmarked: update.viewer.bookmarked })
              }
            />

            <Action icon={ShareNetwork} label="share this update" onClick={() => void share()} />
          </div>
        </div>
      </div>
    </article>
  )
}
