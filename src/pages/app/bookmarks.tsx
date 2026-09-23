import { BookmarkSimple } from '@phosphor-icons/react'
import { ComingSoon } from '@/components/app/ComingSoon'

export default function Page() {
  return (
    <ComingSoon
      icon={BookmarkSimple}
      title="bookmarks"
      description="everything you saved, grouped by month so you can find it again."
      path="/app/bookmarks"
    />
  )
}
