'use client'

import { Button } from '@/components/ui/Button'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { cn } from '@/lib/utils'
import { PostVoteRequest } from '@/lib/validators/votes'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import axios, { AxiosError } from 'axios'

interface PostVoteClientProps {
  postId: string
  initialVotesAmount: number
  initialVote?: VoteType | null
}

export function PostVoteClient({ postId, initialVotesAmount, initialVote }: PostVoteClientProps): JSX.Element {
  const { loginToast } = useCustomToast()

  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState(initialVote)

  const prevVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      }

      const { data } = await axios.patch('/api/subreddit/post/vote', payload)
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
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)

        if (type === 'UP') setVotesAmount((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmount((prev) => prev + 1)
      } else {
        setCurrentVote(type)
        if (type === 'UP') setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN') setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className="flex gap-4 pb-4 pr-6 sm:w-20 sm:flex-col sm:gap-0 sm:pb-0">
      <Button size="sm" variant="ghost" aria-label="upvote" onClick={() => vote('UP')}>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700 dark:text-slate-400', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP',
          })}
        />
      </Button>

      <p className="py-2 text-center text-sm font-medium text-zinc-900 dark:text-slate-200">{votesAmount}</p>

      <Button size="sm" variant="ghost" aria-label="downvote" onClick={() => vote('DOWN')}>
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700 dark:text-slate-400', {
            'text-red-500 fill-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}
