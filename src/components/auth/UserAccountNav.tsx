'use client'

import { UserAvatar } from '@/components/shared/UserAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

import { User } from 'next-auth'
import { signOut } from 'next-auth/react'

import Link from 'next/link'

interface UserAccountNavProps {
  user: Omit<User, 'id'>
}

export function UserAccountNav({ user }: UserAccountNavProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar className="h-8 w-8" user={{ image: user.image ?? null, name: user.name ?? null }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:border-zinc-700 dark:bg-zinc-800" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium dark:text-slate-200">{user.name}</p>}
            {user.email && <p className="w-[200px] truncate text-sm text-zinc-700 dark:text-slate-400">{user.email}</p>}
          </div>
        </div>

        <DropdownMenuSeparator className="dark:bg-zinc-700" />

        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/r/create">Criar comunidade</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Configurações</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="dark:bg-zinc-700" />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault()
            signOut({ callbackUrl: `${window.location.origin}/sign-in` })
          }}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
