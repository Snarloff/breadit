import { UserNameForm } from '@/components/auth/UserNameForm'
import { authOptions, getAuthSession } from '@/lib/auth'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Configurações',
  description: '',
}

export default async function SettingsPage() {
  const session = await getAuthSession()

  if (!session) {
    redirect(authOptions.pages?.signIn || '/sign-in')
  }

  return (
    <div className="mx-auto max-w-4xl py-12">
      <div className="grid items-start gap-8">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Configurações</h1>
      </div>

      <div className="grid gap-10">
        <UserNameForm
          user={{
            id: session?.user.id,
            username: session?.user.username || '',
          }}
        />
      </div>
    </div>
  )
}
