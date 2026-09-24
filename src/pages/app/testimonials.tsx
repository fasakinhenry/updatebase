import { useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Confetti } from '@phosphor-icons/react'
import { api } from '@/lib/api'
import { toast } from '@/stores/toast'
import { celebrate } from '@/lib/confetti'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Textarea } from '@/components/ui/Textarea'
import { Field } from '@/components/ui/Field'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/app/EmptyState'
import { InfiniteSentinel } from '@/components/app/InfiniteSentinel'
import { TestimonialCard } from '@/components/app/TestimonialCard'
import type { Testimonial, Paginated } from '@/types/api'

export default function Testimonials() {
  const [composeOpen, setComposeOpen] = useState(false)
  const [body, setBody] = useState('')
  const [quotedUpdateIds, setQuotedUpdateIds] = useState<string>('')
  const queryClient = useQueryClient()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['testimonials'],
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams({ limit: '20' })
      if (pageParam) searchParams.set('cursor', pageParam as string)
      return api.get<Paginated<Testimonial>>(/api/testimonials? + searchParams.toString())
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  })

  const testimonials = data?.pages.flatMap((page) => page.items) || []

  const postMutation = useMutation({
    mutationFn: async () => {
      const updates = quotedUpdateIds.split(',').map(id => id.trim()).filter(Boolean)
      return api.post('/api/testimonials', { body, quotedUpdates: updates })
    },
    onSuccess: () => {
      celebrate()
      toast.success('posted', 'your story is up')
      setComposeOpen(false)
      setBody('')
      setQuotedUpdateIds('')
      void queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
    onError: () => toast.error('error', 'could not post your story')
  })

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return
    postMutation.mutate()
  }

  return (
    <div className="flex flex-col min-h-full pb-20 mx-auto max-w-2xl">
      <Seo title="testimonials" description="real stories from people who got the thing." path="/app/testimonials" noindex />

      <header className="sticky top-14 lg:top-0 z-20 bg-canvas/90 backdrop-blur border-b border-hairline px-4 py-3 flex items-center justify-between">
        <h1 className="text-display-sm font-semibold text-ink font-heading">testimonials</h1>
        <Button size="sm" onClick={() => setComposeOpen(true)} icon={null}>share your story</Button>
      </header>

      <div className="flex flex-col flex-1 relative">
        {testimonials.length === 0 && !isLoading ? (
          <div className="mt-20">
            <EmptyState
              icon={Confetti}
              title="no stories yet"
              description="the first person to benefit from a community update can share their story here."
            />
          </div>
        ) : (
          <div className="flex flex-col">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="border-b border-hairline">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        )}
        
        <InfiniteSentinel
          hasMore={Boolean(hasNextPage)}
          loading={isFetchingNextPage}
          onReach={() => {
            if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
          }}
        />
      </div>

      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} title="share your story">
        <form onSubmit={handlePost} className="flex flex-col gap-4">
          <Textarea
            label="your story"
            rows={5}
            maxLength={2000}
            showCount
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="how did a community update help you?"
          />
          
          <Field label="tag updates (optional)" description="paste update links or ids, separated by commas">
            <input
              type="text"
              value={quotedUpdateIds}
              onChange={(e) => setQuotedUpdateIds(e.target.value)}
              className="w-full rounded-xl border border-hairline bg-surface py-2 px-3 text-body text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none transition-colors"
              placeholder="e.g. up_123abc, up_456def"
            />
          </Field>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setComposeOpen(false)} icon={null}>cancel</Button>
            <Button type="submit" loading={postMutation.isPending} disabled={!body.trim()} icon={null}>post</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
