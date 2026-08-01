"use client"

import { useState, useEffect } from "react"
import { Search, Command as CommandIcon } from "lucide-react"
import { allConceptsFlat } from "@/components/visualizers/nextjscosmos/lib/concepts-data"
import { useRouter } from "next/navigation"
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/visualizers/nextjscosmos/components/ui/command"

export function TopicSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-muted-foreground text-xs hover:bg-muted transition-all"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search topics...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all Next.js concepts..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Concepts">
            {allConceptsFlat.map((concept) => (
              <CommandItem
                key={concept.slug}
                onSelect={() => {
                  router.push(`/nextjscosmos/concepts/${concept.slug}`)
                  setOpen(false)
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                   <CommandIcon className="h-3 w-3 text-primary" />
                </div>
                <span>{concept.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
