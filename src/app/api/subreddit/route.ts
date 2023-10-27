import { getAuthSession } from '@/lib/auth'
import { SubredditValidator } from '@/lib/validators/subreddit'
import { db } from '@/lib/db'

import { ZodError } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Sem Autorização', { status: 401 })
    }

    const body = await req.json() // body is a JSON
    const { name } = SubredditValidator.parse(body)

    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    })

    if (subredditExists) {
      return new Response('Subreddit já existe', { status: 409 })
    }

    const { id: subredditId, name: subredditName } = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    })

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId,
      },
    })

    return new Response(subredditName, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Não foi possível criar o subreddit', { status: 500 })
  }
}
