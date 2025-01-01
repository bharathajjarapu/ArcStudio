"use client"

import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { useDebouncedCallback } from "use-debounce"

export function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    router.push(`/?${params.toString()}`)
  }, 300)

  return (
    <Input
      type="search"
      placeholder="Search posts..."
      className="w-full bg-zinc-900 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      defaultValue={searchParams.get("search")?.toString()}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}

