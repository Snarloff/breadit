import { CreateComment } from '@/components/comments/CreateComment'
import { PostComment } from '@/components/comments/PostComment'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

interface CommentsSectionProps {
  postId: string
}

export async function CommentsSection({ postId }: CommentsSectionProps) {
  const session = await getAuthSession()
  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <hr className="my-6 h-px w-full " />

      <CreateComment postId={postId} />

      <div className="mt-4 flex flex-col gap-y-6">
        {comments
          .filter((c) => !c.replyToId)
          .map((comment) => {
            const commentVotesAmount = comment.votes.reduce((acc, vote) => {
              if (vote.type === 'UP') return acc + 1
              if (vote.type === 'DOWN') return acc - 1
              return acc
            }, 0)

            const commentVote = comment.votes.find((vote) => vote.userId === session?.user.id)

            return (
              <div className="flex flex-col" key={comment.id}>
                <div className="mb-2">
                  <PostComment
                    postId={postId}
                    currentVote={commentVote}
                    votesAmount={commentVotesAmount}
                    comment={comment}
                    session={session}
                  />
                </div>

                {comment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmount = reply.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1
                      if (vote.type === 'DOWN') return acc - 1
                      return acc
                    }, 0)

                    const replyVote = reply.votes.find((vote) => vote.userId === session?.user.id)

                    return (
                      <div key={reply.id} className="ml-2 border-l-2 border-zinc-200 py-2 pl-4">
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmount={replyVotesAmount}
                          postId={postId}
                          session={session}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}
