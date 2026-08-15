import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : defaultValue
    } catch (error) {
      console.error('Failed to read localStorage key', key, error)
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to write localStorage key', key, error)
    }
  }, [key, value])

  return [value, setValue] as const
}

