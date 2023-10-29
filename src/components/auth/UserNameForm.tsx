'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { UsernameRequest, UsernameValidator } from '@/lib/validators/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { Label } from '@radix-ui/react-label'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UserNameFormProps {
  user: Pick<User, 'id' | 'username'>
}

export function UserNameForm({ user }: UserNameFormProps): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || '',
    },
  })

  const { loginToast } = useCustomToast()
  const { refresh } = useRouter()

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = {
        name,
      }

      const { data } = await axios.patch('/api/username', payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 409) {
          return toast.error('Nome de usuário já existente', { description: 'Por favor, escolha um nome de subreddit diferente' })
        }

        if (err?.response?.status === 422) {
          return toast.error('Nome de usuário inválido', { description: 'Por favor, escolha um nome entre 3 a 32 caracteres' })
        }

        if (err?.response?.status === 401) {
          return loginToast()
        }
      }

      return toast.error('Erro ao atualizar seu nome de usuário', { description: 'Por favor, tente novamente mais tarde' })
    },
    onSuccess: () => {
      toast.success('Nome de usuário atualizado com sucesso', { description: 'Seu nome de usuário foi atualizado com sucesso' })
      refresh()
    },
  })

  return (
    <form onSubmit={handleSubmit((e) => updateUsername(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Nome de usuário</CardTitle>
          <CardDescription>Digite um nome de exibição com o qual você se sinta confortável</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input id="name" className="w-[400px] pl-6" size={32} {...register('name')} />
            {errors?.name && <p className="px-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Alterar nome</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
