import { PostFeed } from '@/components/post/PostFeed'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import { Session } from 'next-auth'

interface CustomProps {
  session: Session | null
}

export async function CustomFeed({ session }: CustomProps) {
  const followedCommnuties = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  })

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommnuties.map(({ subreddit }) => subreddit.id),
        },
      },
    },
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
