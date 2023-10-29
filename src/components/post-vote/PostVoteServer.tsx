import { PostVoteClient } from '@/components/post-vote/PostVoteClient'
import { getAuthSession } from '@/lib/auth'
import { Post, Vote, VoteType } from '@prisma/client'
import { notFound } from 'next/navigation'

interface PostVoteServerProps {
  postId: string
  initialVotesAmount?: number
  initialVote?: VoteType | null
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function PostVoteServer({ postId, initialVote, initialVotesAmount, getData }: PostVoteServerProps) {
  const session = await getAuthSession()

  let _votesAmout = 0
  let _currentVote: VoteType | null | undefined

  if (getData) {
    await wait(2000)

    const post = await getData()
    if (!post) return notFound()

    _votesAmout = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0)

    _currentVote = post.votes.find((vote) => vote.userId === session?.user.id)?.type
  } else {
    _votesAmout = initialVotesAmount ?? 0
    _currentVote = initialVote
  }

  return <PostVoteClient postId={postId} initialVotesAmount={_votesAmout} initialVote={_currentVote} />
}
