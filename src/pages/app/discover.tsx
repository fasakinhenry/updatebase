import { Compass } from '@phosphor-icons/react'
import { ComingSoon } from '@/components/app/ComingSoon'

export default function Page() {
  return (
    <ComingSoon
      icon={Compass}
      title="discover"
      description="find communities and people posting what you care about, with search that understands plain language."
      path="/app/discover"
    />
  )
}
