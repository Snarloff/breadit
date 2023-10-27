import { buttonVariants } from '@/components/ui/Button'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Seu feed</h1>

      <div className="md:gay-x-4 grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3">
        <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Sua página pessoal do Breadit. Venha aqui para verificar com suas comunidades favoritas.
              </p>
            </div>

            <Link href="/r/create" className={buttonVariants({ className: 'w-full mt-4 mb-6' })}>
              Criar Comunidade
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
