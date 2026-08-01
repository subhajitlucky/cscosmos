import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="layouts-and-templates"
      title="Layouts and Templates"
      category="Routing"
      description="Layouts preserve state and remain interactive during navigation, while Templates create a new instance for every child on navigation."
      mentalModel="Layouts are 'sticky' UI (persistent). Templates are 'fresh' UI (resetting every time)."
      whyExists="To provide a choice between performance (layouts) and resetting state/animations (templates) when navigating between routes."
      visualizerType="layout-template"
      codeExample={`// layout.tsx - Preserves state
export default function Layout({ children }) {
  return <main>{children}</main>
}

// template.tsx - Resets state
export default function Template({ children }) {
  return <div className="animate-in">{children}</div>
}`}
    />
  )
}
