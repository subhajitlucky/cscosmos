import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="rsc"
      title="React Server Components (RSC)"
      category="React Server Components"
      description="React Server Components (RSC) are special components that execute exclusively on the server and never travel to the user's browser."
      mentalModel="Direct execution. Instead of sending code to the browser to be executed, the server handles the logic and data fetching, sending only the resulting UI structure."
      whyExists="To significantly reduce the amount of JavaScript the user has to download, resulting in near-instant page loads and superior performance on low-power devices."
      visualizerType="rsc"
      visualizerProps={{ mode: 'concept' }}
      codeExample={`// This component runs ONLY on the server
import { db } from './db'

export default async function UserProfile() {
  const user = await db.user.findFirst()
  // ❌ useState, useEffect, etc. are NOT allowed here!
  return <div>Welcome, {user.name}</div>
}`}
      misconception="Server Components are just SSR. No! SSR sends HTML; RSC sends a serialized format that allows React to preserve client state without losing the user's focus or scroll position."
    />
  )
}
