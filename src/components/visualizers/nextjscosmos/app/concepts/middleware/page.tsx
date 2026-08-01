import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="middleware"
      title="Middleware"
      category="Routing"
      description="Middleware allows you to run code before a request is completed, letting you modify the response, redirect users, or check auth."
      mentalModel="A gatekeeper. Every request passes through Middleware first. It decides if you can enter or if you need to be sent elsewhere."
      whyExists="For global logic like authentication, internationalization (i18n), and path rewriting."
      visualizerType="middleware"
      visualizerProps={{
        initialMode: 'SSR',
        title: "Middleware Interception",
        steps: ["Incoming Request", "Middleware Runs at Edge", "Check Auth / Redirect", "Forward to Server", "Render & Return"]
      }}
      codeExample={`import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}`}
    />
  )
}
