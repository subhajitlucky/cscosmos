import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="app-router-overview"
      title="App Router Overview"
      category="Routing"
      description="The App Router is Next.js's modern system for building applications where every component is a Server Component by default."
      mentalModel="Think of the App Router as a unified tree where every folder is a URL segment, and components are 'Server-First'. You only 'opt-out' to the client when you need a browser-only feature."
      whyExists="To provide a high-performance foundation. By making everything a Server Component initially, you minimize the JavaScript sent to the user while keeping the ease of React development."
      visualizerType="routing"
      visualizerProps={{
        title: "App Router Hierarchy",
        data: [
          { name: "app", type: "folder", highlight: true, children: [
            { name: "layout.tsx", type: "file", label: "Global UI (Persistent)", highlight: true },
            { name: "page.tsx", type: "file", label: "Home Page (Server by default)", highlight: true },
            { name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file", label: "Dashboard Page" }
            ]}
          ]}
        ]
      }}
      codeExample={`// app/page.tsx - This is a SERVER COMPONENT by default
export default async function Page() {
  // You can fetch data directly here!
  return <h1>Hello, Next.js!</h1>
}

// app/layout.tsx - This UI persists and DOES NOT re-render on navigation
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}
      misconception="Many think Layouts re-render when you change pages. They don't! This is why state inside a Layout's Client Component is preserved during navigation."
    />
  )
}
