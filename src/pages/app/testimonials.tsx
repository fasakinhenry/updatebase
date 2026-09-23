import { Confetti } from '@phosphor-icons/react'
import { ComingSoon } from '@/components/app/ComingSoon'

export default function Page() {
  return (
    <ComingSoon
      icon={Confetti}
      title="testimonials"
      description="stories from people who got the thing, always quoting the update that led there."
      path="/app/testimonials"
    />
  )
}
