'use client'

import Image from 'next/image'

export function CustomImageRenderer({ data }: any) {
  return (
    <div className="relative min-h-[15rem] w-full">
      <Image className="object-contain" fill alt={data.caption} src={data.file.url} />
    </div>
  )
}
