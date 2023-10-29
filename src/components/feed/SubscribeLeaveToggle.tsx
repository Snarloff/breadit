'use client'

import { Button } from '@/components/ui/Button'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean
  subredditId: string
  subredditName: string
}

export function SubscribeLeaveToggle({ isSubscribed, subredditId, subredditName }: SubscribeLeaveToggleProps): JSX.Element {
  const { loginToast } = useCustomToast()
  const { refresh } = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      }

      const { data } = await axios.post('/api/subreddit/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 401) {
          return loginToast()
        }
      }

      return toast.error('Erro ao se inscrever na comunidade', { description: 'Por favor, tente novamente mais tarde' })
    },
    onSuccess: () => {
      startTransition(() => {
        refresh()
      })

      return toast.success('Inscrição realizada com sucesso', {
        description: `Você agora está inscrito na comunidade r/${subredditName}`,
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      }

      const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 401) {
          return loginToast()
        }
      }

      return toast.error('Erro ao sair da comunidade', { description: 'Por favor, tente novamente mais tarde' })
    },
    onSuccess: () => {
      startTransition(() => {
        refresh()
      })

      return toast.success('Você deixou a comunidade', {
        description: `Agora você não pertence mais a comunidade r/${subredditName}`,
      })
    },
  })

  return isSubscribed ? (
    <Button className="mb-4 mt-1 w-full" onClick={() => unsubscribe()} isLoading={isUnsubLoading}>
      Sair da comunidade
    </Button>
  ) : (
    <Button className="mb-4 mt-1 w-full" onClick={() => subscribe()} isLoading={isSubLoading}>
      Junte-se para publicar
    </Button>
  )
}
