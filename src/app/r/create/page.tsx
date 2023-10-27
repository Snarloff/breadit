'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CreateSubredditPayload } from '@/lib/validators/subreddit'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useCustomToast } from '@/hooks/use-custom-toast'

export default function SubRedditCreate(): JSX.Element {
  const [input, setInput] = useState<string>('')

  const { back, push } = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      }

      const { data } = await axios.post('/api/subreddit', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 409) {
          return toast.error('Essa comunidade já existe', { description: 'Por favor, escolha um nome de subreddit diferente' })
        }

        if (err?.response?.status === 422) {
          return toast.error('Nome de subreddit inválido', { description: 'Por favor, escolha um nome entre 3 a 21 caracteres' })
        }

        if (err?.response?.status === 401) {
          return loginToast()
        }
      }

      return toast.error('Erro ao criar comunidade', { description: 'Por favor, tente novamente mais tarde' })
    },
    onSuccess: (data) => {
      push(`/r/${data}`)
    },
  })

  return (
    <div className="container mx-auto flex h-full max-w-3xl items-center">
      <div className="relative h-fit w-full space-y-6 rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Criar uma comunidade</h1>
        </div>

        <hr className="h-px bg-zinc-500" />

        <div>
          <p className="text-lg font-medium">Nome</p>
          <p className="pb-2 text-xs">Os nomes da comunidade, incluindo capitalização, não podem ser alterados</p>

          <div className="relative">
            <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">r/</p>
            <Input className="pl-6" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => back()}>
            Cancelar
          </Button>

          <Button onClick={() => createCommunity()} isLoading={isLoading} disabled={input.length === 0}>
            Criar Comunidade
          </Button>
        </div>
      </div>
    </div>
  )
}
