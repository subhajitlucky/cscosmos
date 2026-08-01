import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="client-fetching"
      title="Data Fetching on the Client"
      category="Data Fetching"
      description="Client-side fetching is used when you need to update UI based on user interaction or when data doesn't need to be SEO-indexed."
      mentalModel="Fetching in the 'background'. The page loads first, then the data arrives later and fills in the gaps."
      whyExists="For private, user-specific data (like a profile dashboard) or for real-time updates (like a chat or a stock ticker)."
      visualizerType="data-flow"
      visualizerProps={{ mode: "client",
        title: "Client-side Lifecycle",
        shellLabel: "Page shell loads instantly...",
        contentLabel: "Client-side 'useEffect' fetching...",
        sidebarLabel: "React state ready"
      }}
      codeExample={`"use client"
import useSWR from 'swr' // Popular library

export function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)
  
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  return <div>Hello {data.name}!</div>
}`}
      misconception="Client fetching is 'bad' for performance. Not true! It's actually better for high-frequency data (like chat) or user-specific dashboards that don't need to block the initial page load."
    />
  )
}
