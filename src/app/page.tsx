import { CustomFeed } from '@/components/feed/CustomFeed'
import { GeneralFeed } from '@/components/feed/GeneralFeed'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { HomeIcon } from 'lucide-react'

import Link from 'next/link'

export default async function Home() {
  const session = await getAuthSession()

  return (
    <>
      <h1 className="text-3xl font-bold dark:text-slate-200 md:text-4xl">Seu feed</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        {/* @ts-expect-error server component */}
        {session ? <CustomFeed session={session} /> : <GeneralFeed session={session} />}

        <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700 md:order-last">
          <div className="bg-emerald-100 px-6 py-4 dark:bg-emerald-600">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 dark:divide-y-0">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500 dark:text-slate-500">
                Sua página pessoal do Breadit. Venha aqui para verificar com suas comunidades favoritas.
              </p>
            </div>

            <Link href="/r/create" className={buttonVariants({ className: 'w-full mt-4 mb-6', variant: 'default' })}>
              Criar Comunidade
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
