import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="error-boundaries"
      title="Error Boundaries"
      category="Routing"
      description="Error boundaries allow you to catch runtime errors in specific segments of your app and display a fallback UI instead of crashing the entire site."
      mentalModel="Think of it as a safety net. If a component 'falls' (errors), the boundary catches it and shows a 'Try Again' button instead of a white screen."
      whyExists="To provide a resilient user experience. One failing component (like a weather widget) shouldn't break the navigation or other parts of the dashboard."
      visualizerType="error"
      codeExample={`"use client" // Error components must be Client Components

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}`}
      misconception="'error.js' boundaries will not catch errors in 'layout.js' of the same segment. They only catch errors in children."
    />
  )
}
