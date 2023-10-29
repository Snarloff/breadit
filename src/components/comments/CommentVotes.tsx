'use client'

import { Button } from '@/components/ui/Button'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { cn } from '@/lib/utils'
import { CommentVoteRequest } from '@/lib/validators/votes'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import axios, { AxiosError } from 'axios'

type CommentType = Pick<CommentVote, 'type'>

interface CommentVoteProps {
  commentId: string
  initialVotesAmount: number
  initialVote?: CommentType | null
}

export function CommentVotes({ commentId, initialVotesAmount, initialVote }: CommentVoteProps): JSX.Element {
  const { loginToast } = useCustomToast()

  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState(initialVote)

  const prevVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      }

      const { data } = await axios.patch('/api/subreddit/post/comment/vote', payload)
      return data
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmount((prev) => prev - 1)
      else setVotesAmount((prev) => prev + 1)

      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err?.response?.status === 401) {
          return loginToast()
        }
      }

      return toast.error('Ocorreu um erro ao votar', { description: 'Seu voto não foi registrado, tente novamente' })
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined)

        if (type === 'UP') setVotesAmount((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmount((prev) => prev + 1)
      } else {
        setCurrentVote({ type })
        if (type === 'UP') setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN') setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className="flex gap-1">
      <Button size="sm" variant="ghost" aria-label="upvote" onClick={() => vote('UP')}>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700 dark:text-slate-400', {
            'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
          })}
        />
      </Button>

      <p className="py-2 text-center text-sm font-medium text-zinc-900 dark:text-slate-200">{votesAmount}</p>

      <Button size="sm" variant="ghost" aria-label="downvote" onClick={() => vote('DOWN')}>
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700 dark:text-slate-400', {
            'text-red-500 fill-red-500': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}
