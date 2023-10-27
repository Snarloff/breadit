import { MiniCreatePost } from '@/components/MiniCreatePost'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface RedditSlugPage {
  params: {
    slug: string
  }
}

export default async function page({ params: { slug } }: RedditSlugPage) {
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

        take: 2,
      },
    },
  })

  if (!subreddit) notFound()

  return (
    <>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">r/{subreddit.name}</h1>

      <MiniCreatePost session={session} />
    </>
  )
}
