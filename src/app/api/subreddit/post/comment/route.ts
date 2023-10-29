import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentValidator } from '@/lib/validators/comment'
import { ZodError } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Sem Autorização', { status: 401 })
    }

    const body = await req.json() // body is a JSON
    const { postId, text, replyToId } = CommentValidator.parse(body)

    await db.comment.create({
      data: {
        text,
        postId,
        replyToId,
        authorId: session.user.id,
      },
    })

    return new Response('Comentário criado com sucesso', { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response('Os dados passados são inválidos', { status: 422 })
    }

    return new Response('Não foi possível criar o comentário na publicação', { status: 500 })
  }
}
