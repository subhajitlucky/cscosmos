import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="parallel-routes"
      title="Parallel Routes"
      category="Routing"
      description="Parallel routing allows you to simultaneously render one or more pages in the same layout."
      mentalModel="A split-screen view. You can have a dashboard with a '@team' section and an '@analytics' section that load independently."
      whyExists="To create highly complex layouts like dashboards where different sections have their own loading and error states."
      visualizerType="parallel"
      visualizerProps={{
        title: "Parallel Slot Structure",
        data: [
          { name: "app", type: "folder", children: [
            { name: "dashboard", type: "folder", children: [
              { name: "@analytics", type: "folder", highlight: true, label: "Slot A", children: [{ name: "page.tsx", type: "file" }]},
              { name: "@team", type: "folder", highlight: true, label: "Slot B", children: [{ name: "page.tsx", type: "file" }]},
              { name: "layout.tsx", type: "file", label: "Defines Slots" },
              { name: "page.tsx", type: "file", label: "Dashboard Main" }
            ]}
          ]}
        ]
      }}
      codeExample={`// app/dashboard/layout.tsx
export default function Layout({ 
  children, 
  analytics, 
  team 
}) {
  return (
    <div className="flex">
      {children}
      {analytics}
      {team}
    </div>
  )
}`}
      misconception="Parallel routes share the same state. No, each slot maintains its own state and can be navigated independently, but refreshing the page will always attempt to match the current URL for all slots."
    />
  )
}