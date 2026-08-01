import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="server-only"
      title="Server-only Packages"
      category="Interactions"
      description="The 'server-only' package is a tool that ensures certain modules or functions can ONLY be imported and executed on the server."
      mentalModel="A VIP security guard. If any part of your app tries to take 'secret' code to the browser, the guard stops it immediately."
      whyExists="To prevent sensitive information like API keys or database credentials from accidentally being sent to the user's browser."
      visualizerType="security"
      visualizerProps={{
        title: "Security Boundary"
      }}
      codeExample={`// lib/secrets.ts
import 'server-only'

export const API_KEY = process.env.SECRET_KEY

// If you import this in a Client Component,
// Next.js will throw a build error!`}
    />
  )
}
