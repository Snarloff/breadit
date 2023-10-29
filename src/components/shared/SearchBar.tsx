'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/Command'
import { Prisma, Subreddit } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { Users } from 'lucide-react'

import axios from 'axios'
import debounce from 'lodash.debounce'

export function SearchBar() {
  const commandRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<string>('')
  const { push, refresh } = useRouter()

  const {
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []

      const { data } = await axios.get(`/api/search?q=${input.trim()}`)
      return data as (Subreddit & { _count: Prisma.SubredditCountOutputType })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const request = debounce(async () => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Command ref={commandRef} className="relative z-50 max-w-lg overflow-visible rounded-lg border">
      <CommandInput
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        value={input}
        className="border-none outline-none ring-0 focus:border-none focus:outline-none"
        placeholder="Buscar comunidades..."
      />

      {input.length > 0 && (
        <CommandList className="absolute inset-x-0 top-full rounded-b-md bg-white shadow dark:bg-zinc-800">
          {isFetched && <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 && (
            <CommandGroup heading="Comunidades">
              {queryResults?.map((subreddit) => (
                <CommandItem
                  onSelect={(e) => {
                    push(`/r/${e}`)
                    refresh()
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  )
}
