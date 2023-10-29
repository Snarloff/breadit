'use client'

import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { uploadFiles } from '@/lib/uploadthing'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type EditorJS from '@editorjs/editorjs'

import axios, { AxiosError } from 'axios'
import TextareaAutosize from 'react-textarea-autosize'

interface EditorProps {
  subredditId: string
}

export function Editor({ subredditId }: EditorProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
    },
  })

  const pathname = usePathname()
  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>()

  const { ref: titleRef, ...rest } = register('title')
  const { push, refresh } = useRouter()
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const { mutate: createPost } = useMutation({
    mutationFn: async ({ title, content, subredditId }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
        subredditId,
      }

      const { data } = await axios.post('/api/subreddit/post/create', payload)
      return data
    },
    onError(err) {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 400) {
          return toast.error('Você precisa se inscrever na comunidade')
        }

        if (err?.response?.status === 422) {
          return toast.error('As informações enviadas são inválidas', { description: 'Por favor, tente novamente' })
        }
      }

      return toast.error('Algo deu errado', { description: 'Sua publicação não foi publicada, tente novamente' })
    },
    onSuccess() {
      const newPathname = pathname.split('/').slice(0, -1).join('/') // Remove the /create from the pathname
      push(newPathname)
      refresh()
      toast.success('Sucesso', { description: 'Sua publicação foi publicada com sucesso' })
    },
  })

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save()

    if (!blocks) {
      toast.error('Algo deu errado', { description: 'Conteúdo do post não encontrado' })
      return
    }

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
    }

    createPost(payload)
  }

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        placeholder: 'Digite aqui para escrever seu post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], 'imageUploader')
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          table: Table,
          embed: Embed,
          inlineCode: InlineCode,
        },
        onReady() {
          ref.current = editor
        },
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      for (const [_key, value] of Object.entries(errors)) {
        toast.error('Algo deu errado', { description: (value as { message: string }).message })
      }
    }
  }, [errors])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()
      setTimeout(() => {
        _titleRef.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init()
      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  if (!isMounted) {
    return <></>
  }

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <form id="subreddit-post-form" className="w-fit" onSubmit={handleSubmit(onSubmit)}>
        <div className="prose prose-stone dark:prose-invert ">
          <TextareaAutosize
            {...rest}
            ref={(e) => {
              titleRef(e)
              // @ts-ignore
              _titleRef.current = e
            }}
            placeholder="Título"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none "
          />

          <div id="editor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  )
}
