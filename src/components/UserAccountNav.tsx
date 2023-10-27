'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

import { UserAvatar } from '@/components/UserAvatar'
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
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && <p className="w-[200px] truncate text-sm text-zinc-700">{user.email}</p>}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/r/create">Criar comunidade</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Configurações</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

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
