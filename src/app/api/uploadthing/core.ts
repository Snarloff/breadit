/* eslint-disable @typescript-eslint/no-unused-vars */

import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const auth = (req: Request) => ({ id: 'fakeId' })

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    // @ts-expect-error - This is a fake auth function
    .middleware(async ({ req }) => {
      const user = await auth(req)

      if (!user) throw new Error('Unauthorized')

      return { userId: user.id }
    })
    .onUploadComplete(async () => {
      // Do something after upload is complete
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
