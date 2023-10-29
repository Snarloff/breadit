/* eslint-disable tailwindcss/migration-from-tailwind-2 */
'use client'

import { PostVoteClient } from '@/components/post-vote/PostVoteClient'
import { EditorOutput } from '@/components/post/EditorOutput'
import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import { useRef } from 'react'

interface PostProps {
  subredditName: string
  commentAmount: number
  votesAmount: number
  currentVote?: Pick<Vote, 'type'> | null
  post: Post & {
    author: User
    votes: Vote[]
  }
}

export function Post({ subredditName, commentAmount, votesAmount, currentVote, post }: PostProps): JSX.Element {
  const pRef = useRef<HTMLDivElement>(null)

  return (
    <div className="rounded-md bg-white shadow dark:bg-zinc-800">
      <div className="flex justify-between px-6 py-4">
        <PostVoteClient initialVotesAmount={votesAmount} postId={post.id} initialVote={currentVote?.type} />

        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-xs text-gray-500 dark:text-slate-200">
            {subredditName && (
              <>
                <a
                  className="text-sm text-zinc-900 underline underline-offset-2 dark:text-slate-400"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>

                <span className="px-1">•</span>
              </>
            )}
            <span className="mr-0.5">Publicado por u/{post.author.name}</span> {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900 dark:text-slate-100">{post.title}</h1>
          </a>

          <div className="relative max-h-40 w-full overflow-clip text-sm" ref={pRef}>
            <EditorOutput content={post.content} />
            {/* h-40 = 160 */}
            {pRef.current?.clientHeight === 160 && (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent dark:from-zinc-800" />
            )}
          </div>
        </div>
      </div>

      <div className="z-20 bg-gray-50 p-4 text-sm dark:bg-zinc-700 sm:px-6">
        <a className="flex w-fit items-center gap-2" href={`/r/${subredditName}/post/${post.id}`}>
          <MessageSquare className="h-4 w-4" /> {commentAmount} comentários
        </a>
      </div>
    </div>
  )
}
