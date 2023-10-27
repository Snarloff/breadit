import '@/styles/globals.css'

import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children, authModal }: { children: React.ReactNode; authModal: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={cn(inter.className, 'light bg-white text-slate-900 antialiased')}>
      <body className="min-h-screen bg-slate-50 pt-12 antialiased">
        <Providers>
          {/* @ts-expect-error server components  */}
          <Navbar />

          {authModal}

          <div className="container mx-auto h-full max-w-7xl pt-12">{children}</div>
          <Toaster visibleToasts={9} position="top-center" richColors />
        </Providers>
      </body>
    </html>
  )
}
