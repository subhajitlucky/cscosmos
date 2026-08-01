import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="server-client-boundary"
      title="Server vs Client Boundary"
      category="React Server Components"
      description="The boundary is the point where you transition from a Server Component to a Client Component. It defines the 'edge' of your client-side JavaScript bundle."
      mentalModel="Think of the boundary as a gate. You can pass data (props) through the gate from Server to Client, but the Client cannot reach back inside the Server to fetch code."
      whyExists="To keep your client-side bundle lean. By clearly defining where interactivity starts, Next.js knows exactly which code needs to be sent to the browser and which can stay securely on the server."
      visualizerType="boundary"
      codeExample={`// THE COMPOSITION PATTERN (Critical Architect Tip)
// This is how you render a Server Component INSIDE a Client Component:

// app/client-parent.tsx
'use client'
export default function ClientParent({ children }) {
  return <div>{children}</div>
}

// app/page.tsx (Server)
import ClientParent from './client-parent'
import ServerChild from './server-child'

export default function Page() {
  return (
    <ClientParent>
      <ServerChild /> {/* This stays a Server Component! */}
    </ClientParent>
  )
}`}
      misconception="You can't have a Server Component inside a Client Component. You CAN, but only if you pass it as 'children' or props. You cannot import a Server Component directly into a 'use client' file."
    />
  )
}
