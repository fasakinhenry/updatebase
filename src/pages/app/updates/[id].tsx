import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { WarningCircle, ChatCircle, PaperPlaneTilt } from '@phosphor-icons/react'
import { api } from '@/lib/api'
import { relativeTime } from '@/lib/time'
import { cn } from '@/lib/cn'
import { toast } from '@/stores/toast'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Textarea } from '@/components/ui/Textarea'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/app/EmptyState'
import { InfiniteSentinel } from '@/components/app/InfiniteSentinel'
import { UpdateCard } from '@/components/app/UpdateCard'
import type { Paginated, Update, Comment } from '@/types/api'

export default function UpdateDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  
  const { data: update, isLoading: isLoadingUpdate, isError: isErrorUpdate } = useQuery({
    queryKey: ['update', id],
    queryFn: () => api.get<Update>(`/api/updates/${id}`),
    enabled: !!id,
  })

  const { data: commentsData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['comments', id],
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams()
      if (pageParam) searchParams.set('cursor', pageParam as string)
      return api.get<Paginated<Comment>>(`/api/updates/${id}/comments?${searchParams.toString()}`)
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: !!id,
  })
  
  const comments = commentsData?.pages.flatMap((page) => page.items) || []
  
  const postCommentMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/api/updates/${id}/comments`, { body, parent: replyTo || undefined })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', id] })
      setBody('')
      setReplyTo(null)
      toast.success('comment posted', '')
    },
    onError: () => {
      toast.error('failed to post comment', 'please try again.')
    }
  })
  
  const handlePost = () => {
    if (!body.trim()) return
    postCommentMutation.mutate()
  }

  const handleReply = (comment: Comment) => {
    setReplyTo(comment._id)
    setBody(`@${comment.author.username} `)
  }

  if (isLoadingUpdate) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner label="loading update" />
      </div>
    )
  }

  if (isErrorUpdate || !update) {
    return (
      <div className="py-20">
        <EmptyState
          icon={WarningCircle}
          title="update not found"
          description="it may have been removed."
          action={<Button to="/app/feed" icon={null}>back to feed</Button>}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full pb-20">
      <Seo 
        title={update.header} 
        description={update.body.slice(0, 160)} 
        path={`/app/updates/${id}`} 
        noindex 
      />
      
      <div className="border-b border-hairline">
        <UpdateCard update={update} expanded />
      </div>
      
      <div className="px-4 py-6">
        <h2 className="text-display-xs text-ink font-semibold font-heading mb-4">
          conversation
        </h2>
        
        <div className="mb-8 flex flex-col gap-3">
          <Textarea 
            label="add a comment" 
            rows={3} 
            maxLength={1000} 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            showCount
          />
          <div className="self-end">
            <Button 
              onClick={handlePost} 
              loading={postCommentMutation.isPending} 
              disabled={!body.trim()}
              icon={<PaperPlaneTilt size={15} weight="fill" aria-hidden="true" />}
            >
              post comment
            </Button>
          </div>
        </div>
        
        {comments.length === 0 ? (
          <EmptyState 
            icon={ChatCircle} 
            title="be the first to comment" 
            description="share a thought or ask a question." 
          />
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => {
              const depth = comment.depth || 0 // Use depth if available
              return (
                <div 
                  key={comment._id} 
                  className={cn(
                    "flex flex-col gap-2", 
                    depth > 0 && "ml-10 border-l border-hairline pl-4"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar 
                      seed={comment.author.avatarSeed} 
                      src={comment.author.avatarMode === 'photo' ? comment.author.photoUrl : undefined} 
                      size={34} 
                      alt={comment.author.name ?? comment.author.username ?? ''}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-ink text-body-sm">{comment.author.name}</span>
                        <span className="text-ink-muted text-caption">@{comment.author.username}</span>
                        <span className="text-ink-muted text-caption">&middot;</span>
                        <span className="text-ink-muted text-caption">{relativeTime(comment.createdAt)}</span>
                      </div>
                      <div className="text-ink text-body mt-1 whitespace-pre-wrap">
                        {comment.body}
                      </div>
                      <div className="mt-2">
                        <button 
                          onClick={() => handleReply(comment)} 
                          className="text-caption font-semibold text-ink-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            
            <InfiniteSentinel
              hasMore={Boolean(hasNextPage)}
              loading={isFetchingNextPage}
              onReach={() => {
                if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
