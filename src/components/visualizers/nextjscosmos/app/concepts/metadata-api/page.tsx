import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="metadata-api"
      title="Metadata API"
      category="Layouts & Metadata"
      description="The Metadata API allows you to define your application's SEO and social sharing info (title, description, icons) using a declarative API."
      mentalModel="A business card for your page. It tells Google and social media sites what this page is about before they even look at the content."
      whyExists="To provide a robust, type-safe way to manage <head> elements that works seamlessly with Server Components and Streaming."
      visualizerType="metadata"
      visualizerProps={{
        initialMode: 'SSR',
        title: "Metadata Generation Flow",
        steps: ["Resolve Dynamic Parameters", "Run generateMetadata()", "Compute SEO Tags", "Inject into <head>", "Stream Shell to Browser"]
      }}
      codeExample={`// Static Metadata
export const metadata = {
  title: 'Home',
  description: 'Welcome to my site'
}

// Dynamic Metadata
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)
  return { title: product.name }
}`}
    />
  )
}
