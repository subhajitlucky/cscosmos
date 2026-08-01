import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="deployment-model"
      title="Deployment Model (Edge vs Node)"
      category="Deployment & Runtime"
      description="Next.js supports two different runtimes: Node.js (full server features) and Edge (faster, distributed, but limited features)."
      mentalModel="A full kitchen (Node.js) vs a quick-service kiosk (Edge). One can cook anything; the other is everywhere and lightning fast."
      whyExists="To allow developers to choose the best runtime for their specific needs, whether it's full server compatibility or global low-latency."
      visualizerType="deployment"
      codeExample={`// Choosing a runtime
export const runtime = 'edge' // or 'nodejs' (default)

export default function Page() {
  return <div>Running on the Edge!</div>
}`}
      misconception="Edge is always better. No! Edge has limitations on library support (e.g., some database drivers) and smaller memory limits."
    />
  )
}
