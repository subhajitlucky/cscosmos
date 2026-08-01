import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="use-client"
      title="'use client' Directive"
      category="React Server Components"
      description="The 'use client' directive is a convention to declare a boundary between a Server and Client Component module."
      mentalModel="It's a flag at the top of a file that says: 'Everything in this file needs to be sent to the browser because it uses interactive features.'"
      whyExists="In the App Router, everything is a Server Component by default. You need a way to opt-in to the client when you need interactivity."
      visualizerType="rsc"
      codeExample={`"use client" // This must be at the very top

import { useState } from 'react'

export function Interactive() {
  // useState is only allowed here!
}`}
      misconception="Adding 'use client' means the whole page is client-rendered. No, only that component and its children become client-side."
    />
  )
}
