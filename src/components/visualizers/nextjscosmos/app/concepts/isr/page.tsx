import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="isr"
      title="Incremental Static Regeneration (ISR)"
      category="Rendering"
      description="ISR allows you to update static pages after you've built your site, without needing to rebuild the entire application."
      mentalModel="A vending machine that periodically refills itself with fresh items. Most of the time it's static, but it updates on a schedule."
      whyExists="To get the benefits of static (speed) with the flexibility of dynamic (fresh data) for sites with thousands of pages."
      visualizerType="isr"
      visualizerProps={{
        initialMode: 'ISR',
        title: "ISR: Background Regeneration",
        steps: ["Serve Stale Version", "Trigger Revalidation", "Server Re-renders in BG", "Update CDN Cache", "Serve Fresh Version"]
      }}
      codeExample={`// Revalidate every 60 seconds
export const revalidate = 60 

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  // ...
}`}
    />
  )
}
