'use client'

import { CommentVotes } from '@/components/comments/CommentVotes'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { formatTimeToNow } from '@/lib/utils'
import { CommentRequest } from '@/lib/validators/comment'
import { Comment, CommentVote, User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import axios from 'axios'
import { Session } from 'next-auth'
import { toast } from 'sonner'

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface PostCommentProps {
  comment: ExtendedComment
  currentVote?: CommentVote | undefined
  session: Session | null
  votesAmount: number
  postId: string
}

export function PostComment({ comment, votesAmount, currentVote, postId, session }: PostCommentProps): JSX.Element {
  const commentRef = useRef<HTMLDivElement>(null)
  const { push, refresh } = useRouter()

  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      }

      const { data } = await axios.patch(`/api/subreddit/post/comment`, payload)
      return data
    },
    onError: () => {
      return toast.error('Erro ao criar o comentário na publicação', { description: 'Por favor, tente novamente mais tarde' })
    },
    onSuccess: () => {
      refresh()
      setIsReplying(false)
    },
  })

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar className="h-6 w-6" user={{ name: comment.author.name || null, image: comment.author.image || null }} />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900 dark:text-slate-400">u/{comment.author.name}</p>
          <p className="max-h-40 truncate text-xs text-zinc-500">{formatTimeToNow(new Date(comment.createdAt))}</p>
        </div>
      </div>

      <p className="mt-2 text-sm text-zinc-900 dark:text-slate-200">{comment.text}</p>

      <div className="flex flex-wrap items-center gap-2">
        <CommentVotes commentId={comment.id} initialVotesAmount={votesAmount} initialVote={currentVote} />
        <Button
          className="dark:text-slate-200"
          variant="ghost"
          size="xs"
          aria-label="responder comentário"
          onClick={() => {
            if (!session) return push('/sign-in')
            setIsReplying(true)
          }}
        >
          <MessageSquare className="mr-1.5 h-4 w-4" />
          Responder
        </Button>

        {isReplying && (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Seu comentário</Label>
            <div className="mt-2">
              <Textarea
                id="comment"
                placeholder="O que você acha sobre?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
              />

              <div className="mt-2 flex justify-end gap-2">
                <Button tabIndex={-1} variant="subtle" onClick={() => setIsReplying(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (!input) return
                    postComment({ postId, text: input, replyToId: comment.replyToId ?? comment.id })
                  }}
                  isLoading={isLoading}
                  disabled={input.length === 0}
                >
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
