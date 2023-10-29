import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { UsernameValidator } from '@/lib/validators/username'
import { ZodError } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Sem Autorização', { status: 401 })
    }

    const body = await req.json()
    const { name } = UsernameValidator.parse(body)

    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    })

    if (username) {
      return new Response('Usuário já existe', { status: 409 })
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    })

    return new Response('Usuário atualizado com sucesso', { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response('Os dados passados são inválidos', { status: 422 })
    }

    return new Response('Não foi possível atualizar o nome de usuário', { status: 500 })
  }
}
