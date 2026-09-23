import { ChatCircleDots } from '@phosphor-icons/react'
import { ComingSoon } from '@/components/app/ComingSoon'

export default function Page() {
  return (
    <ComingSoon
      icon={ChatCircleDots}
      title="messages"
      description="encrypted direct messages, voice notes and shared updates."
      path="/app/messages"
    />
  )
}
