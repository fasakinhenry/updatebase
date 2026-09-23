import { useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowBendUpLeft,
  At,
  Bell,
  ChatCircle,
  Confetti,
  Coins,
  Heart,
  Megaphone,
  Repeat,
  UserPlus,
  Users,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { Avatar } from '@/components/ui/Avatar'
import { SmartLink } from '@/components/ui/SmartLink'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/app/EmptyState'
import { InfiniteSentinel } from '@/components/app/InfiniteSentinel'
import { api } from '@/lib/api'
import { relativeTime } from '@/lib/time'
import { cn } from '@/lib/cn'
import type { AppNotification, NotificationKind, Paginated } from '@/types/api'

const icons: Record<NotificationKind, Icon> = {
  new_update: Megaphone,
  follow: UserPlus,
  comment: ChatCircle,
  comment_reply: ArrowBendUpLeft,
  mention: At,
  reaction: Heart,
  repost: Repeat,
  quote: Repeat,
  testimonial_quote: Confetti,
  testimonial_comment: ChatCircle,
  org_invite: Users,
  org_invite_accepted: Users,
  tip_received: Coins,
  feedback_received: ChatCircle,
}

const tones: Partial<Record<NotificationKind, string>> = {
  reaction: 'text-danger',
  testimonial_quote: 'text-primary',
  tip_received: 'text-success',
  repost: 'text-success',
  quote: 'text-success',
}

/** what the line actually says. the actor's name is rendered separately. */
function verb(kind: NotificationKind): string {
  switch (kind) {
    case 'new_update':
      return 'posted a new update'
    case 'follow':
      return 'started following you'
    case 'comment':
      return 'commented on your update'
    case 'comment_reply':
      return 'replied to your comment'
    case 'mention':
      return 'mentioned you'
    case 'reaction':
      return 'loved your update'
    case 'repost':
      return 'reshared your update'
    case 'quote':
      return 'quoted your update'
    case 'testimonial_quote':
      return 'shared a testimonial about your update'
    case 'testimonial_comment':
      return 'commented on your testimonial'
    case 'org_invite':
      return 'invited you to their organization'
    case 'org_invite_accepted':
      return 'accepted your invite'
    case 'tip_received':
      return 'tipped your update'
    case 'feedback_received':
      return 'left feedback'
  }
}

function Row({ notification }: { notification: AppNotification }) {
  const Icon = icons[notification.kind]
  const actor = notification.actor
  const org = notification.actorOrganization
  const unread = !notification.readAt

  const name = org?.name ?? actor?.name ?? actor?.username ?? 'someone'

  return (
    <li>
      <SmartLink
        to={notification.link ?? '/app/feed'}
        className={cn(
          'flex gap-3 border-b border-hairline px-4 py-4 transition-colors duration-fast hover:bg-surface/50 sm:px-6',
          unread && 'bg-primary-soft/40',
        )}
      >
        <span className="relative shrink-0">
          <Avatar src={org?.logoUrl} seed={org?.handle ?? actor?.avatarSeed ?? 'updatebase'} alt="" size={38} />
          <span
            aria-hidden="true"
            className={cn(
              'absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-canvas bg-surface',
              tones[notification.kind] ?? 'text-ink-soft',
            )}
          >
            <Icon size={11} weight="fill" />
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-body text-ink">
            <span className="font-semibold">{name}</span> {verb(notification.kind)}
          </span>

          {notification.preview && (
            <span className="mt-1 block truncate text-body-sm text-ink-soft">
              {notification.preview}
            </span>
          )}

          <time
            dateTime={notification.createdAt}
            className="mt-1 block text-caption text-ink-muted"
          >
            {relativeTime(notification.createdAt)}
          </time>
        </span>

        {unread && (
          <span
            aria-label="unread"
            className="mt-2 size-2 shrink-0 self-start rounded-full bg-primary"
          />
        )}
      </SmartLink>
    </li>
  )
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const client = useQueryClient()

  const query = useInfiniteQuery({
    queryKey: ['notifications', filter],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      api.get<Paginated<AppNotification>>('/api/notifications', {
        cursor: pageParam,
        filter,
        limit: 25,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  const markRead = useMutation({
    mutationFn: () => api.post('/api/notifications/read'),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const notifications = query.data?.pages.flatMap((p) => p.items) ?? []
  const hasUnread = notifications.some((item) => !item.readAt)

  return (
    <>
      <Seo
        title="activity"
        description="everything happening around you on updatebase."
        path="/app/notifications"
        noindex
      />

      <div className="mx-auto max-w-2xl">
        <div className="sticky top-14 z-30 border-b border-hairline bg-canvas/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:top-0">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-display-sm text-ink">activity</h1>

            {hasUnread && (
              <button
                type="button"
                onClick={() => markRead.mutate()}
                disabled={markRead.isPending}
                className="text-caption font-medium text-primary hover:underline disabled:opacity-60"
              >
                mark all read
              </button>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            {(['all', 'unread'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={cn(
                  'rounded-pill border px-3.5 py-1.5 text-caption transition-colors duration-fast',
                  filter === option
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-hairline bg-canvas text-ink-soft hover:border-hairline-strong hover:text-ink',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {query.isPending && (
          <div className="flex justify-center py-16">
            <Spinner label="loading your activity" />
          </div>
        )}

        {query.isSuccess && notifications.length === 0 && (
          <EmptyState
            icon={Bell}
            title={filter === 'unread' ? 'all caught up' : 'nothing yet'}
            description={
              filter === 'unread'
                ? 'you have read everything. nice.'
                : 'when people follow you, reply to you or tip your updates, it shows up here.'
            }
          />
        )}

        <ul>
          {notifications.map((notification) => (
            <Row key={notification._id} notification={notification} />
          ))}
        </ul>

        <InfiniteSentinel
          hasMore={Boolean(query.hasNextPage)}
          loading={query.isFetchingNextPage}
          onReach={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage()
          }}
        />
      </div>
    </>
  )
}
