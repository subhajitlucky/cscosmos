import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="caching-revalidation"
      title="Caching and Revalidation"
      category="Performance & Caching"
      description="Next.js has a multi-layered caching system that stores everything from API responses to rendered component trees."
      mentalModel="A memory palace. Next.js tries to remember every piece of work it has done so it doesn't have to do it again next time."
      whyExists="To make your application incredibly fast. Fetching from cache is thousands of times faster than fetching from a remote database."
      visualizerType="advanced-caching"
      visualizerProps={{
        initialMode: 'ISR',
        title: "Data Cache Lifecycle",
        steps: ["Fetch API Response", "Store in Server-side Cache", "Serve Subsequent Requests", "Data Becomes Stale", "Revalidate & Store Fresh Data"]
      }}
      codeExample={`// On-demand revalidation (e.g., in a webhook)
import { revalidatePath } from 'next/cache'

export async function updateAction() {
  await db.update()
  revalidatePath('/dashboard') // Clears cache for this route
}`}
      misconception="Cache is only on the browser. Next.js has a powerful 'Data Cache' that exists on the server (or CDN)."
    />
  )
}
