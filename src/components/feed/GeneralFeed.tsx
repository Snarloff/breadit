import { PostFeed } from '@/components/post/PostFeed'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import { Session } from 'next-auth'

interface GeneralFeedProps {
  session: Session | null
}

export async function GeneralFeed({ session }: GeneralFeedProps) {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  })

  return <PostFeed initialPosts={posts} session={session} />
}
