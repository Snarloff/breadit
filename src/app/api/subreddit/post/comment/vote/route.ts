import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentVoteValidator } from '@/lib/validators/votes'
import { ZodError } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Sem Autorização', { status: 401 })
    }

    const body = await req.json() // body is a JSON
    const { commentId, voteType } = CommentVoteValidator.parse(body)

    const existingVote = await db.commentVote.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    })

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
        })

        return new Response('OK', { status: 200 })
      }

      await db.commentVote.update({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId,
          },
        },
        data: {
          type: voteType,
        },
      })

      return new Response('OK', { status: 200 })
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    })

    return new Response('OK', { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response('Os dados passados são inválidos', { status: 422 })
    }

    return new Response('Não foi possível registrar seu voto', { status: 500 })
  }
}
