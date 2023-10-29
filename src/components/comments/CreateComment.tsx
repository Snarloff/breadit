'use client'

import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { CommentRequest } from '@/lib/validators/comment'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { useCustomToast } from '@/hooks/use-custom-toast'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

export function CreateComment({ postId, replyToId }: CreateCommentProps): JSX.Element {
  const [input, setInput] = useState<string>('')

  const { loginToast } = useCustomToast()
  const { refresh } = useRouter()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      }

      const { data } = await axios.patch('/api/subreddit/post/comment', payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 401) {
          return loginToast()
        }
      }

      return toast.error('Erro ao criar o comentário na publicação', { description: 'Por favor, tente novamente mais tarde' })
    },
    onSuccess: () => {
      refresh()
      setInput('')
    },
  })

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Seu comentário</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          placeholder="O que você acha sobre?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
        />

        <div className="mt-2 flex justify-end">
          <Button onClick={() => comment({ postId, text: input, replyToId })} isLoading={isLoading} disabled={input.length === 0}>
            Publicar
          </Button>
        </div>
      </div>
    </div>
  )
}
