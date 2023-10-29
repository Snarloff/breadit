'use client'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from 'next-themes'

export function ChangeTheme() {
  const { theme, setTheme } = useTheme()
  return (
    <div onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? (
        <Sun className="h-6 w-6 cursor-pointer text-zinc-700 dark:text-slate-200" />
      ) : (
        <Moon className="h-6 w-6 cursor-pointer text-zinc-700 dark:text-slate-200" />
      )}
    </div>
  )
}
