'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomCodeRenderer } from '@/components/renderers/CustomCodeRenderer'
import { CustomImageRenderer } from '@/components/renderers/CustomImageRenderer'

import dynamic from 'next/dynamic'

const Output = dynamic(async () => (await import('editorjs-react-renderer')).default, { ssr: false })

interface EditorOutputProps {
  content: any
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}

export function EditorOutput({ content }: EditorOutputProps): JSX.Element {
  return <Output className="text-sm" renderers={renderers} style={style} data={content} />
}
