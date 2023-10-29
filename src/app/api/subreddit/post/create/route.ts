import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

import { PostValidator } from '@/lib/validators/post'
import { ZodError } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Sem Autorização', { status: 401 })
    }

    const body = await req.json() // body is a JSON
    const { subredditId, title, content } = PostValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return new Response('Você precisa estar inscrito na comunidade', { status: 400 })
    }

    await db.post.create({
      data: {
        subredditId,
        title,
        content,
        authorId: session.user.id,
      },
    })

    return new Response('OK', { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response('Os dados passados são inválidos', { status: 422 })
    }

    return new Response('Não foi possível criar a publicação no subreddit', { status: 500 })
  }
}
