import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="ssr"
      title="Server-Side Rendering (SSR)"
      category="Rendering"
      description="SSR renders a page on the server for every single request, ensuring that the data is always fresh when the user visits."
      mentalModel="Like a chef cooking a fresh meal the moment you place an order. It's custom-made for that specific request."
      whyExists="To handle highly dynamic data (like a user's bank balance or search results) that changes too frequently to be pre-rendered."
      visualizerType="ssr"
      visualizerProps={{
        initialMode: 'SSR',
        title: "SSR: Dynamic Lifecycle",
        steps: ["User Clicks", "Server Fetches Data", "Server Renders HTML", "Streaming to Browser", "Hydration Complete"]
      }}
      codeExample={`// In App Router, a component is dynamic (SSR) 
// if it uses dynamic functions or headers.
import { headers } from 'next/headers'

export default async function Page() {
  const headerList = await headers()
  const userAgent = headerList.get('user-agent')
  
  return <div>Your browser: {userAgent}</div>
}`}
      misconception="SSR and RSC are the same. Not quite. SSR is the *process* of turning components into HTML for the initial paint. RSC is a *type* of component that can be used during that process but never executes on the client."
    />
  )
}
