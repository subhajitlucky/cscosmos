import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="server-fetching"
      title="Data Fetching on the Server"
      category="Data Fetching"
      description="Next.js recommends fetching data on the server using async components, which simplifies the code and improves performance."
      mentalModel="Direct access. Instead of calling an API from the browser, the component just 'waits' for the database or external service on the server."
      whyExists="To eliminate the 'Waterfall' effect where the browser waits for JS, then the JS calls an API, then the API returns data."
      visualizerType="data-flow"
      visualizerProps={{ mode: "server" }}
      codeExample={`// Simple async component
export default async function Page() {
  const data = await fetch('https://api.com/data')
  const json = await data.json()
  
  return <pre>{JSON.stringify(json)}</pre>
}`}
      misconception="Server fetching is less secure. Actually, it's MORE secure. Since the fetch happens on your server, API keys and secrets are never exposed to the client's network tab."
    />
  )
}
