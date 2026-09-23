import type { Icon } from '@phosphor-icons/react'
import { Seo } from '@/components/seo/Seo'
import { EmptyState } from './EmptyState'
import { Button } from '@/components/ui/Button'

/**
 * a real screen for a surface that is next in the build order. it says what
 * is coming rather than pretending to be finished, and always offers the way
 * back to something that works.
 */
export function ComingSoon({
  icon,
  title,
  description,
  path,
}: {
  icon: Icon
  title: string
  description: string
  path: string
}) {
  return (
    <>
      <Seo title={title} description={description} path={path} noindex />

      <div className="mx-auto max-w-2xl">
        <div className="border-b border-hairline px-4 py-4 sm:px-6">
          <h1 className="text-display-sm text-ink">{title}</h1>
        </div>

        <EmptyState
          icon={icon}
          title="this one is being built"
          description={description}
          action={
            <Button to="/app/feed" icon={null}>
              back to your feed
            </Button>
          }
        />
      </div>
    </>
  )
}
