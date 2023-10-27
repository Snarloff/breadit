'use client'

import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLoginWithGoogle = async () => {
    setIsLoading(true)

    try {
      await signIn('google')
    } catch (error) {
      toast.error('Ocorreu um problema.', { description: 'Houve um erro ao tentar entrar com o Google.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button size="sm" className="w-full" isLoading={isLoading} onClick={handleLoginWithGoogle}>
        {isLoading ? null : <Icons.Google className="mr-2 h-4 w-4" />}
        Google
      </Button>
    </div>
  )
}
