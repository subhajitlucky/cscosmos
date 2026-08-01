import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="intercepting-routes"
      title="Intercepting Routes"
      category="Routing"
      description="Intercepting routes allow you to load a route from another part of your application within the current layout."
      mentalModel="A 'sneak peek' or an overlay. When you click a photo in a feed, it opens in a modal (intercepted), but refreshing the page loads the full photo page."
      whyExists="To create modern UI patterns like modals that have their own URL, allowing them to be shared or bookmarked."
      visualizerType="intercepting"
      codeExample={`// Folder named (.)photo/[id]
// The (.) syntax intercepts the sibling route

export default function PhotoModal() {
  return <Modal>Photo UI</Modal>
}`}
    />
  )
}
