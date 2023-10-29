import { z } from 'zod'

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter mais de 3 caracteres' })
    .max(128, { message: 'O título deve ter menos de 128 caracteres' }),
  subredditId: z.string(),
  content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>
