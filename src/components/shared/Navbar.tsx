import { UserAccountNav } from '@/components/auth/UserAccountNav'
import { ChangeTheme } from '@/components/shared/ChangeTheme'
import { Icons } from '@/components/shared/Icons'
import { SearchBar } from '@/components/shared/SearchBar'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import Link from 'next/link'

export async function Navbar() {
  const session = await getAuthSession()

  return (
    <div className="fixed inset-x-0 top-0 z-10 h-fit border-b border-zinc-300 bg-zinc-100 py-2 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Icons.Logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-medium text-zinc-700 dark:text-slate-200 md:block">Breadit</p>
        </Link>

        <SearchBar />

        <div className="flex items-center gap-5">
          <ChangeTheme />
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Entrar
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
