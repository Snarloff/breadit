import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

import { ZodError } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Sem Autorização', { status: 401 })
    }

    const body = await req.json() // body is a JSON
    const { subredditId } = SubredditSubscriptionValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return new Response('Você não está inscrito neste subreddit', { status: 400 })
    }

    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    })

    if (subreddit) {
      return new Response('Você não pode sair do seu próprio subreddit', { status: 400 })
    }

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id,
        },
      },
    })

    return new Response(subredditId, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response('Os dados passados são inválidos', { status: 422 })
    }

    return new Response('Não foi possível sair do subreddit', { status: 500 })
  }
}
