import { SubscribeLeaveToggle } from '@/components/feed/SubscribeLeaveToggle'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

import Link from 'next/link'
interface RedditSlugLayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export default async function RedditSlugLayout({ children, params: { slug } }: RedditSlugLayoutProps) {
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
        },
      },
    },
  })

  if (!subreddit) notFound()

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      })

  const isSubscribed = !!subscription
  const memberCount = await db.subscription.count({ where: { subreddit: { name: slug } } })

  return (
    <div className="mx-auto h-full max-w-7xl pt-12 sm:container">
      <div>
        <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4 ">
          <div className="col-span-2 flex flex-col space-y-6">{children}</div>
          <div className="order-first hidden h-fit overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700 md:order-last md:block">
            <div className="px-6 py-4 dark:bg-zinc-900/70">
              <p className="py-3 font-semibold">Sobre r/{subreddit.name}</p>
            </div>

            <dl className="divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6 dark:divide-zinc-700 dark:bg-zinc-800">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500 dark:text-slate-200">Criado</dt>
                <dd className="text-gray-700 dark:text-slate-400">
                  <time dateTime={subreddit.createdAt.toDateString()}>{format(subreddit.createdAt, 'MMMM d, yyyy')}</time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500 dark:text-slate-200">Membros</dt>
                <dd className="text-gray-700 dark:text-slate-400">
                  <div className="text-gray-900 dark:text-slate-400">{memberCount}</div>
                </dd>
              </div>

              {subreddit.creatorId === session?.user?.id && (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">Você criou essa comunidade</p>
                </div>
              )}

              {subreddit.creatorId !== session?.user?.id && (
                <SubscribeLeaveToggle subredditId={subreddit.id} subredditName={subreddit.name} isSubscribed={isSubscribed} />
              )}

              <Link href={`/r/${slug}/post/submit`} className={buttonVariants({ variant: 'outline', className: 'w-full mb-6' })}>
                Criar Publicação
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
