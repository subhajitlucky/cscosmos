import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="client-components"
      title="Client Components"
      category="React Server Components"
      description="Client components are traditional React components that run in the browser to provide interactivity (state, effects, event listeners)."
      mentalModel="These are the 'active' parts of your app. Anything the user clicks, types into, or expects to change instantly is a Client Component."
      whyExists="Because the browser is the only place where user interaction happens. You need them for 'useState', 'useEffect', and browser APIs."
      visualizerType="rsc"
      codeExample={`"use client" // This directive is required

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}`}
      misconception="Client Components only run on the browser. False! They are still pre-rendered into static HTML on the server for the initial page load (SEO friendly), then they 'hydrate' in the browser."
    />
  )
}
