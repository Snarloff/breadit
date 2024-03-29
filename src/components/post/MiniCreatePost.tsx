'use client'

import { UserAvatar } from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageIcon, Link2 } from 'lucide-react'
import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'

interface MiniCreatePostProps {
  session: Session | null
}

export function MiniCreatePost({ session }: MiniCreatePostProps): JSX.Element {
  const { push } = useRouter()
  const pathname = usePathname()

  return (
    <div className="overflow-hidden rounded-md bg-white shadow dark:bg-zinc-800">
      <div className="flex h-full justify-between gap-6 px-6 py-4">
        <div className="relative">
          <UserAvatar user={{ image: session?.user.image ?? null, name: session?.user.name ?? null }} />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white" />
        </div>

        <Input readOnly placeholder="Criar publicação" onClick={() => push(pathname + '/submit')} />
        <Button variant="ghost" onClick={() => push(pathname + '/submit')} />
        <Button variant="ghost" onClick={() => push(pathname + '/submit')}>
          <ImageIcon className="text-zinc-600 dark:text-slate-200" />
        </Button>
        <Button variant="ghost" onClick={() => push(pathname + '/submit')}>
          <Link2 className="text-zinc-600 dark:text-slate-200" />
        </Button>
      </div>
    </div>
  )
}
