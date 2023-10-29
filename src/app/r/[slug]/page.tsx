import { MiniCreatePost } from '@/components/post/MiniCreatePost'
import { PostFeed } from '@/components/post/PostFeed'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface RedditSlugPageProps {
  params: {
    slug: string
  }
}

export default async function page({ params: { slug } }: RedditSlugPageProps) {
  const session = await getAuthSession()

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },

        orderBy: {
          createdAt: 'desc',
        },

        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  })

  if (!subreddit) return notFound()

  return (
    <>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">r/{subreddit.name}</h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} session={session} />
    </>
  )
}
