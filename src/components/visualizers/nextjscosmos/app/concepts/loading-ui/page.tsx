import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="loading-ui"
      title="Loading UI"
      category="Routing"
      description="Next.js provides a built-in 'loading.tsx' file that allows you to show an instant loading state using React Suspense while content is being fetched."
      mentalModel="It's a placeholder that sits in the exact spot your content will eventually appear, ensuring the user feels the app is responding immediately."
      whyExists="To improve perceived performance. Instead of a blank screen, users see a skeleton or spinner while the server renders the heavy parts of the page."
      visualizerType="streaming"
      visualizerProps={{
        title: "Loading State Lifecycle",
        shellLabel: "Sending instant shell...",
        contentLabel: "Displaying loading.tsx fallback...",
        sidebarLabel: "Static Nav ready"
      }}
      codeExample={`// app/dashboard/loading.tsx
export default function Loading() {
  return <SkeletonCard />
}

// Next.js automatically wraps 'page.tsx' 
// with a Suspense boundary using this component.`}
      misconception="You don't need to manually import the loading component. Next.js automatically applies it to the corresponding page and its children."
    />
  )
}
