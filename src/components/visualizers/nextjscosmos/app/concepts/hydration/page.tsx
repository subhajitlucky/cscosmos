import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="hydration"
      title="Hydration"
      category="Rendering"
      description="Hydration is the process where React attaches event listeners to the static HTML sent by the server, making the page interactive."
      mentalModel="Think of a dry sponge (HTML). It has the shape of a sponge but isn't 'active'. Adding water (React/JS) makes it flexible and usable."
      whyExists="To provide the best of both worlds: fast initial SEO-friendly HTML from the server, and rich interactivity from React in the browser."
      visualizerType="hydration"
      codeExample={`'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  // Hydration makes this button work
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}`}
      misconception="Hydration is a second render. It's actually a process of 'reconciling' the existing DOM with the React component tree."
    />
  )
}
