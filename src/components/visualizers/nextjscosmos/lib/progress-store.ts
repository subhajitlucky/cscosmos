"use client"

import { useState, useEffect } from "react"

export function useProgress() {
  const [completed, setCompleted] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("nextjs-cosmos-progress")
    if (saved) {
      try {
        setCompleted(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load progress", e)
      }
    }
    setIsLoaded(true)
  }, [])

  const toggleComplete = (slug: string) => {
    const newCompleted = completed.includes(slug)
      ? completed.filter((s) => s !== slug)
      : [...completed, slug]
    
    setCompleted(newCompleted)
    localStorage.setItem("nextjs-cosmos-progress", JSON.stringify(newCompleted))
  }

  const isCompleted = (slug: string) => completed.includes(slug)

  return { completed, toggleComplete, isCompleted, isLoaded }
}
