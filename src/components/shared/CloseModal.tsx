'use client'

import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CloseModal(): JSX.Element {
  const { back } = useRouter()

  return (
    <Button
      variant="subtle"
      className="h-6 w-6 rounded-md p-0 dark:bg-zinc-700"
      aria-label="button to close modal"
      onClick={() => back()}
    >
      <X className="h-4 w-4 dark:text-slate-200" />
    </Button>
  )
}
