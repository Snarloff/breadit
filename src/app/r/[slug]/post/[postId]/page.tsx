import { CommentsSection } from '@/components/comments/CommentsSection'
import { PostVoteServer } from '@/components/post-vote/PostVoteServer'
import { EditorOutput } from '@/components/post/EditorOutput'
import { buttonVariants } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface RedditPostIdProps {
  params: {
    postId: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function RedditPostId({ params: { postId } }: RedditPostIdProps) {
  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
  }

  if (!post && !cachedPost) return notFound()

  return (
    <div>
      <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component */}

          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: postId,
                },
                include: {
                  votes: true,
                },
              })
            }}
          />
        </Suspense>

        <div className="w-full flex-1 rounded-sm bg-white p-4 dark:bg-zinc-800 sm:w-0">
          <p className="mt-1 max-h-40 truncate text-xs text-gray-500 dark:text-slate-200">
            Postado por u/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="leadind-6 py-2 text-xl font-semibold text-gray-900 dark:text-slate-100">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />
          <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}>
            {/* @ts-expect-error server component */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className="flex w-20 flex-col items-center pr-6">
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      <div className="py-2 text-center text-sm font-medium text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  )
}
