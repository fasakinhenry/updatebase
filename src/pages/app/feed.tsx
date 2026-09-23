import { Seo } from '@/components/seo/Seo'
import { useSession } from '@/stores/session'
import { Container } from '@/components/ui/Container'
import { Avatar } from '@/components/ui/Avatar'

export default function FeedPage() {
  const user = useSession((s) => s.user)

  return (
    <>
      <Seo title="your feed" description="opportunities from the communities you follow." path="/app/feed" noindex />

      <Container className="py-12">
        <div className="flex items-center gap-4">
          <Avatar
            seed={user?.avatarSeed}
            src={user?.avatarMode === 'photo' ? user?.photoUrl : undefined}
            alt=""
            size={56}
            priority
          />
          <div className="min-w-0">
            <h1 className="text-display-md text-ink">you are in, {user?.name?.split(' ')[0]}</h1>
            <p className="mt-1 text-body text-ink-soft">@{user?.username}</p>
          </div>
        </div>

        {user?.bio && (
          <p className="measure mt-6 text-body-lg text-ink-soft">{user.bio}</p>
        )}

        <p className="mt-10 rounded-xl border border-hairline bg-surface p-5 text-body text-ink-soft">
          the feed lands next. your interests and location are saved, so it will have something to
          rank with the moment it does.
        </p>
      </Container>
    </>
  )
}
