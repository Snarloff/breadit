import { Icons } from '@/components/Icons'
import { UserAuthForm } from '@/components/UserAuthForm'

import Link from 'next/link'

export function SignIn(): JSX.Element {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.Logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Boas vindas</h1>
        <p className="mx-auto max-w-xs text-sm">
          Ao continuar, você está configurando uma conta Breadit e concorda com nosso Contrato de Usuário e Política de
          Privacidade.
        </p>

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
          Novo no Breadit?{' '}
          <Link href="/sign-up" className="text-sm underline-offset-4 hover:text-zinc-800">
            Crie sua Conta
          </Link>
        </p>
      </div>
    </div>
  )
}
