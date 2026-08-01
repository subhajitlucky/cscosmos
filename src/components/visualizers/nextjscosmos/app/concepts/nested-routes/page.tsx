import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="nested-routes"
      title="Nested Routes"
      category="Routing"
      description="Nested routing allows you to create UI that shares common layouts while specific segments of the page change based on the URL."
      mentalModel="Imagine a set of Russian nesting dolls. Each layout 'wraps' the child below it, preserving state and UI as you navigate deeper."
      whyExists="To avoid re-rendering common UI (like navbars) during navigation and to build complex dashboards where only parts of the screen update."
      visualizerType="routing"
      visualizerProps={{
        title: "Nested Route Structure",
        data: [
          { name: "app", type: "folder", children: [
            { name: "layout.tsx", type: "file", label: "Root Layout" },
            { name: "dashboard", type: "folder", highlight: true, children: [
              { name: "layout.tsx", type: "file", label: "Dashboard Shell", highlight: true },
              { name: "settings", type: "folder", highlight: true, children: [
                { name: "page.tsx", type: "file", label: "Settings Page", highlight: true }
              ]},
              { name: "analytics", type: "folder", children: [
                { name: "page.tsx", type: "file", label: "Analytics Page" }
              ]}
            ]}
          ]}
        ]
      }}
      codeExample={`// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}

// app/dashboard/settings/page.tsx
// Renders inside the DashboardLayout children prop`}
      misconception="When navigating between /dashboard/settings and /dashboard/analytics, the DashboardLayout stays mounted and does not re-render. Only the children change."
    />
  )
}
