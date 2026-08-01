import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="ssg"
      title="Static Site Generation (SSG)"
      category="Rendering"
      description="SSG pre-renders pages at build time. The resulting HTML is stored and served instantly from a CDN for every user."
      mentalModel="Like a pre-packaged snack. It's already made and ready on the shelf. You don't have to wait for anyone to cook it."
      whyExists="For performance and cost. Serving a static file is the fastest possible way to deliver a page and requires minimal server resources."
      visualizerType="ssg"
      visualizerProps={{
        initialMode: 'SSG',
        title: "SSG: Build-time Optimization",
        steps: ["Build Command Run", "Pre-rendering HTML", "Deploy to CDN", "User Requests Page", "Instant Load from CDN"]
      }}
      codeExample={`// Default behavior in App Router
export default async function Page() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  )
}`}
      misconception="Static pages are boring. No! Static pages can still be highly interactive once they 'hydrate' on the client."
    />
  )
}
