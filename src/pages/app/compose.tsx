import { PencilSimpleLine } from '@phosphor-icons/react'
import { ComingSoon } from '@/components/app/ComingSoon'

export default function Page() {
  return (
    <ComingSoon
      icon={PencilSimpleLine}
      title="post an update"
      description="the composer where you paste an opportunity and get it back branded and numbered."
      path="/app/compose"
    />
  )
}
