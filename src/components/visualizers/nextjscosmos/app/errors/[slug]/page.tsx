import { commonErrors } from "@/components/visualizers/nextjscosmos/lib/errors-data"
import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"
import { notFound } from "next/navigation"

export default async function ErrorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const error = commonErrors.find(e => e.slug === slug)

  if (!error) notFound()

  const getErrorCode = () => {
    switch(slug) {
      case 'hydration-mismatch': return `// ❌ WRONG: Value changes between server & client\nexport default function Page() {\n  return <p>{new Date().toLocaleTimeString()}</p>\n}\n\n// ✅ CORRECT: Wrap in useEffect\nexport default function Page() {\n  const [time, setTime] = useState(null)\n  useEffect(() => setTime(new Date().toLocaleTimeString()), [])\n  return <p>{time}</p>\n}`
      case 'missing-use-client': return `// ❌ ERROR: useState in Server Component\nimport { useState } from 'react'\n\nexport default function Counter() {\n  const [c, setC] = useState(0) // THROWS ERROR\n}\n\n// ✅ FIX: Add directive\n'use client'\nimport { useState } from 'react'`
      case 'unserializable-props': return `// ❌ ERROR: Function across boundary\nexport default function ServerPage() {\n  return <ClientComp onAction={() => {}} />\n}\n\n// ✅ FIX: Pass data, not logic\nexport default function ServerPage() {\n  return <ClientComp id={123} />\n}`
      case 'static-bailout': return `// ❌ ERROR: headers() in static page\nimport { headers } from 'next/headers'\n\nexport default function Page() {\n  const h = headers()\n}\n\n// ✅ FIX: Mark as dynamic\nexport const dynamic = 'force-dynamic'`
      case 'async-params': return `// ❌ NEXT.js 15 ERROR: Sync access\nexport default function Page({ params }) {\n  const id = params.id // THROWS ERROR\n}\n\n// ✅ FIX: Await params\nexport default async function Page({ params }) {\n  const { id } = await params\n}`
      default: return `// Diagnostic Blueprint for ${error.name}`
    }
  }

  return (
    <ConceptLayout
      slug={error.slug}
      title={error.name}
      category={error.category}
      description={error.description}
      mentalModel={error.solution}
      whyExists="To protect the integrity of the rendering lifecycle and ensure your application remains stable across different environments."
      codeExample={getErrorCode()}
      visualizerType={error.simulationType as any}
      misconception="Errors in Next.js aren't just bugs; they are often the framework enforcing strict architectural safety rules to prevent security leaks or performance regressions."
      isErrorPage={true}
    />
  )
}

export async function generateStaticParams() {
  return commonErrors.map((error) => ({
    slug: error.slug,
  }))
}
