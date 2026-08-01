import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="route-handlers"
      title="Route Handlers"
      category="Routing"
      description="Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs."
      mentalModel="Your own mini-API. These files (route.ts) don't render UI; they return raw data (JSON, images, etc.)."
      whyExists="To create API endpoints for external tools, handle webhooks, or manage complex data submissions."
      visualizerType="route-handler"
      codeExample={`// app/api/hello/route.ts

export async function GET() {
  return Response.json({ message: 'Hello World' })
}

export async function POST(request: Request) {
  const data = await request.json()
  return Response.json({ success: true })
}`}
      misconception="Route Handlers are the only way to talk to a database. No, Server Components can talk to databases directly!"
    />
  )
}
