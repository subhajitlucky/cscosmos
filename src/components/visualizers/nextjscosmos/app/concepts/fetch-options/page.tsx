import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="fetch-options"
      title="fetch Cache Options"
      category="Performance & Caching"
      description="Next.js extends the native 'fetch' API to include specific caching and revalidation options."
      mentalModel="Instructions for the 'fetcher'. You can tell it to 'always remember', 'never remember', or 'remember for 10 minutes'."
      whyExists="To give developers granular control over data freshness on a per-request basis."
      visualizerType="fetch-options"
      codeExample={`// 1. Force Cache (Static)
fetch('url', { cache: 'force-cache' })

// 2. No Cache (Dynamic)
fetch('url', { cache: 'no-store' })

// 3. Revalidate (ISR)
fetch('url', { next: { revalidate: 3600 } })`}
    />
  )
}
