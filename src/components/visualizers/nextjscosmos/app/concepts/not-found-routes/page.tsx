import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="not-found-routes"
      title="Not Found Routes"
      category="Routing"
      description="The 'not-found.tsx' file allows you to customize the 404 page for a specific route segment or the entire application."
      mentalModel="A specialized error page that specifically says: 'I know what you're looking for, but it doesn't exist here.'"
      whyExists="To handle missing data gracefully. When a dynamic product ID doesn't exist in the database, you can manually trigger this UI."
      visualizerType="not-found"
      codeExample={`// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return <p>Blog post not found!</p>
}

// In page.tsx:
import { notFound } from 'next/navigation'
if (!post) notFound()`}
    />
  )
}
