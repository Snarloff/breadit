import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ZodError, z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const session = await getAuthSession()

  let followedComunnitiesIds: string[] = []
  let whereclause = {}

  if (session) {
    followedComunnitiesIds = (
      await db.subscription.findMany({ where: { userId: session.user.id }, include: { subreddit: true } })
    ).map(({ subreddit }) => subreddit.id)
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      })

    if (subredditName) {
      whereclause = {
        subreddit: {
          name: subredditName,
        },
      }
    } else if (session) {
      whereclause = {
        subreddit: {
          id: {
            in: followedComunnitiesIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: parseInt(limit) * (parseInt(page) - 1),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereclause,
    })

    return new Response(JSON.stringify(posts), { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response('Os dados passados são inválidos', { status: 422 })
    }

    return new Response('Não foi possível carregar seu feed', { status: 500 })
  }
}
