'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useCustomToast = () => {
  const { push } = useRouter()

  const loginToast = () => {
    toast.error('Você precisa estar logado para fazer isso', {
      id: 'login-toast',
      action: {
        label: 'Login',
        onClick: () => {
          toast.dismiss('login-toast')
          push('/sign-in')
        },
      },
    })
  }

  return { loginToast }
}
