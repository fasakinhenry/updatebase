import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Copy,
  Crown,
  DotsThree,
  Link as LinkIcon,
  PaperPlaneTilt,
  ShieldCheck,
  UserPlus,
  X,
} from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Spinner } from '@/components/ui/Spinner'
import { Dialog } from '@/components/ui/Dialog'
import { Avatar } from '@/components/ui/Avatar'
import { ChannelPicker } from '@/features/composer/ChannelPicker'
import { useOrganization } from '@/features/organizations/useOrganizations'
import { CHANNEL_META } from '@/lib/channels'
import { api, ApiError } from '@/lib/api'
import { toast } from '@/stores/toast'
import { env } from '@/lib/env'
import { relativeTime } from '@/lib/time'
import type { Channel, OrgRole, Paginated, UserCard } from '@/types/api'
import { cn } from '@/lib/cn'

interface Member {
  _id: string
  user: UserCard & { email?: string }
  role: OrgRole
  channels: Channel[]
  updateCount: number
  joinedAt: string
}

interface Invite {
  _id: string
  code: string
  role: OrgRole
  email?: string
  username?: string
  phone?: string
  maxUses: number
  useCount: number
  invitee?: UserCard | null
  createdAt: string
  expiresAt: string
}

const roleIcons: Record<OrgRole, typeof Crown> = {
  owner: Crown,
  admin: ShieldCheck,
  delegate: PaperPlaneTilt,
}

type InviteBy = 'email' | 'username' | 'phone' | 'link'

export default function MembersPage() {
  const { handle } = useParams<{ handle: string }>()
  const client = useQueryClient()
  const { data: organization } = useOrganization(handle)
  const organizationId = organization?._id

  const myRole = organization?.viewer?.role
  const canManage = myRole === 'owner' || myRole === 'admin'

  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteBy, setInviteBy] = useState<InviteBy>('email')
  const [invite, setInvite] = useState({
    email: '',
    username: '',
    phone: '',
    role: 'delegate' as OrgRole,
    message: '',
  })
  const [inviteChannels, setInviteChannels] = useState<Channel[]>(['updatebase'])

  const members = useQuery({
    queryKey: ['members', organizationId],
    queryFn: () =>
      api.get<Paginated<Member>>(`/api/organizations/${organizationId}/members`, { limit: 100 }),
    enabled: Boolean(organizationId),
  })

  const invites = useQuery({
    queryKey: ['invites', organizationId],
    queryFn: () => api.get<Invite[]>(`/api/organizations/${organizationId}/invites`),
    enabled: Boolean(organizationId) && canManage,
  })

  const sendInvite = useMutation({
    mutationFn: () =>
      api.post<Invite>(`/api/organizations/${organizationId}/invites`, {
        role: invite.role,
        channels: inviteChannels,
        message: invite.message || undefined,
        shareable: inviteBy === 'link',
        email: inviteBy === 'email' ? invite.email : undefined,
        username: inviteBy === 'username' ? invite.username : undefined,
        phone: inviteBy === 'phone' ? invite.phone : undefined,
      }),
    onSuccess: async (created) => {
      await client.invalidateQueries({ queryKey: ['invites', organizationId] })
      setInviteOpen(false)
      setInvite({ email: '', username: '', phone: '', role: 'delegate', message: '' })

      if (inviteBy === 'link') {
        const url = `${env.VITE_SITE_URL}/invite/${created.code}`
        try {
          await navigator.clipboard.writeText(url)
          toast.success('link copied', 'anyone who opens it can join as a delegate')
        } catch {
          toast.success('link created', url)
        }
      } else {
        toast.success('invite sent', 'they will see it the moment they open updatebase')
      }
    },
    onError: (error) => {
      toast.error(
        'could not send that',
        error instanceof ApiError ? error.friendlyMessage : 'try again in a moment',
      )
    },
  })

  const revokeInvite = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/organizations/${organizationId}/invites/${id}`),
    onSuccess: () => client.invalidateQueries({ queryKey: ['invites', organizationId] }),
  })

  const removeMember = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/organizations/${organizationId}/members/${id}`),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['members', organizationId] })
      toast.success('removed', 'they can no longer post for you')
    },
    onError: (error) => {
      toast.error(
        'could not remove them',
        error instanceof ApiError ? error.friendlyMessage : 'try again in a moment',
      )
    },
  })

  if (members.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="loading your team" />
      </div>
    )
  }

  const copyInviteLink = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`${env.VITE_SITE_URL}/invite/${code}`)
      toast.success('link copied')
    } catch {
      toast.error('could not copy', 'your browser blocked clipboard access')
    }
  }

  return (
    <>
      <Seo
        title="your team"
        description="the people who post for your community."
        path="/app/org/members"
        noindex
      />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-display-md text-ink">your team</h1>
            <p className="mt-2 text-body-lg text-ink-soft">
              the people who can post under {organization?.name}.
            </p>
          </div>

          {canManage && (
            <Button
              onClick={() => setInviteOpen(true)}
              icon={<UserPlus size={16} weight="bold" />}
              iconPosition="left"
            >
              invite someone
            </Button>
          )}
        </header>

        <ul className="mt-8 flex flex-col gap-2">
          {members.data?.items.map((member) => {
            const RoleIcon = roleIcons[member.role]

            return (
              <li
                key={member._id}
                className="flex items-center gap-3 rounded-xl border border-hairline bg-canvas p-4"
              >
                <Avatar
                  seed={member.user.avatarSeed}
                  src={member.user.avatarMode === 'photo' ? member.user.photoUrl : undefined}
                  alt=""
                  size={40}
                />

                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-label text-ink">
                    {member.user.name ?? member.user.username}
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-medium',
                        member.role === 'owner'
                          ? 'bg-warning-soft text-warning'
                          : member.role === 'admin'
                            ? 'bg-primary-soft text-primary'
                            : 'bg-surface text-ink-muted',
                      )}
                    >
                      <RoleIcon size={10} weight="fill" aria-hidden="true" />
                      {member.role}
                    </span>
                  </p>

                  <p className="mt-0.5 truncate text-caption text-ink-muted">
                    @{member.user.username} · {member.updateCount}{' '}
                    {member.updateCount === 1 ? 'update' : 'updates'}
                  </p>

                  {member.channels.length > 0 && (
                    <ul className="mt-1.5 flex flex-wrap gap-1">
                      {member.channels.map((channel) => (
                        <li
                          key={channel}
                          className="rounded-pill bg-surface px-2 py-0.5 text-[11px] text-ink-muted"
                        >
                          {CHANNEL_META[channel].label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {canManage && member.role !== 'owner' && (
                  <button
                    type="button"
                    onClick={() => removeMember.mutate(member._id)}
                    aria-label={`remove ${member.user.username} from the organization`}
                    className="shrink-0 rounded-lg p-1.5 text-ink-muted transition-colors duration-fast hover:bg-danger-soft hover:text-danger"
                  >
                    <DotsThree size={18} weight="bold" aria-hidden="true" />
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        {canManage && invites.data && invites.data.length > 0 && (
          <section className="mt-10">
            <h2 className="text-display-xs text-ink">waiting on a reply</h2>

            <ul className="mt-4 flex flex-col gap-2">
              {invites.data.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center gap-3 rounded-xl border border-dashed border-hairline-strong p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink-muted">
                    {item.maxUses > 1 ? (
                      <LinkIcon size={16} weight="bold" aria-hidden="true" />
                    ) : (
                      <PaperPlaneTilt size={16} weight="bold" aria-hidden="true" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-label text-ink">
                      {item.maxUses > 1
                        ? 'shareable link'
                        : (item.email ?? item.username ?? item.phone ?? 'someone')}
                    </p>
                    <p className="mt-0.5 text-caption text-ink-muted">
                      {item.role} · sent {relativeTime(item.createdAt)}
                      {item.maxUses > 1 && ` · used ${item.useCount} times`}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => void copyInviteLink(item.code)}
                      aria-label="copy the invite link"
                      className="rounded-lg p-1.5 text-ink-muted transition-colors duration-fast hover:bg-surface hover:text-ink"
                    >
                      <Copy size={15} weight="bold" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => revokeInvite.mutate(item._id)}
                      aria-label="cancel this invite"
                      className="rounded-lg p-1.5 text-ink-muted transition-colors duration-fast hover:bg-danger-soft hover:text-danger"
                    >
                      <X size={15} weight="bold" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="invite someone to post"
        description="they get their own login and post under your name. you decide where they can publish."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>
              cancel
            </Button>
            <Button
              onClick={() => sendInvite.mutate()}
              loading={sendInvite.isPending}
              icon={<PaperPlaneTilt size={15} weight="fill" />}
              iconPosition="left"
            >
              {inviteBy === 'link' ? 'create the link' : 'send the invite'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <fieldset>
            <legend className="text-label text-ink">how do you want to reach them?</legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {(['email', 'username', 'phone', 'link'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setInviteBy(option)}
                  aria-pressed={inviteBy === option}
                  className={cn(
                    'rounded-pill border px-3.5 py-2 text-caption transition-colors duration-fast',
                    inviteBy === option
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-hairline-strong text-ink-soft hover:border-primary hover:text-primary',
                  )}
                >
                  {option === 'link' ? 'a link anyone can use' : option}
                </button>
              ))}
            </div>
          </fieldset>

          {inviteBy === 'email' && (
            <Field
              label="their email"
              type="email"
              placeholder="them@example.com"
              value={invite.email}
              onChange={(event) => setInvite((c) => ({ ...c, email: event.target.value }))}
              hint="if they are not on updatebase yet we email them an invite"
            />
          )}

          {inviteBy === 'username' && (
            <Field
              label="their username"
              placeholder="henqsoft"
              autoCapitalize="none"
              value={invite.username}
              onChange={(event) => setInvite((c) => ({ ...c, username: event.target.value }))}
              hint="they get it as a notification straight away"
            />
          )}

          {inviteBy === 'phone' && (
            <Field
              label="their phone number"
              type="tel"
              placeholder="+234"
              value={invite.phone}
              onChange={(event) => setInvite((c) => ({ ...c, phone: event.target.value }))}
            />
          )}

          {inviteBy === 'link' && (
            <p className="rounded-lg border border-hairline bg-surface px-4 py-3 text-body-sm text-ink-soft">
              we create a link you can drop anywhere. anyone who opens it can make an account and
              join as a delegate. you can cancel it whenever you like.
            </p>
          )}

          <Select
            label="role"
            options={
              myRole === 'owner'
                ? [
                    { value: 'delegate', label: 'delegate, they post' },
                    { value: 'admin', label: 'admin, they post and manage' },
                  ]
                : [{ value: 'delegate', label: 'delegate, they post' }]
            }
            value={invite.role}
            onChange={(event) =>
              setInvite((c) => ({ ...c, role: event.target.value as OrgRole }))
            }
          />

          <div>
            <p className="text-label text-ink">where they can publish</p>
            <ChannelPicker
              available={organization?.connectedChannels ?? ['updatebase']}
              allowed={organization?.connectedChannels ?? ['updatebase']}
              viewerRole="admin"
              selected={inviteChannels}
              onChange={setInviteChannels}
              className="mt-2.5"
            />
          </div>

          {inviteBy !== 'link' && (
            <Textarea
              label="a note"
              rows={3}
              maxLength={400}
              value={invite.message}
              placeholder="optional, but it helps them know why you asked"
              onChange={(event) => setInvite((c) => ({ ...c, message: event.target.value }))}
            />
          )}
        </div>
      </Dialog>
    </>
  )
}
