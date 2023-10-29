import { Editor } from '@/components/post/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface RedditSlugSubmitPageProps {
  params: {
    slug: string
  }
}

export default async function RedditSlugSubmitPage({ params: { slug } }: RedditSlugSubmitPageProps) {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
  })

  if (!subreddit) return notFound()

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900 dark:text-slate-100">Criar publicação</h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500 dark:text-slate-200">em r/{slug}</p>
        </div>
      </div>

      <Editor subredditId={subreddit.id} />

      <div className="flex w-full justify-end">
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Publicar
        </Button>
      </div>
    </div>
  )
}
