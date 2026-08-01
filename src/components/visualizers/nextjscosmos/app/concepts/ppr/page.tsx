import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="ppr"
      title="Partial Prerendering (PPR)"
      category="Interactions"
      description="PPR is an optimization that allows you to combine static and dynamic rendering in the same route. It renders a static shell immediately and streams dynamic parts as they finish."
      mentalModel="Think of a photo frame. The frame (Navbar, Sidebar) is always there (Static), but the photo inside (User Profile, Cart) is dynamic and appears as soon as it's ready."
      whyExists="To provide the 'best of both worlds': the instant load speed of a static site with the personalization of a dynamic app, without needing to choose between them."
      visualizerType="ppr"
      visualizerProps={{
        title: "PPR: Static + Dynamic",
        shellLabel: "Serving pre-rendered shell...",
        contentLabel: "Streaming dynamic holes...",
        sidebarLabel: "Static sidebar ready"
      }}
      codeExample={`// next.config.ts
const nextConfig = {
  experimental: {
    ppr: true,
  },
};

// app/page.tsx
export default function Page() {
  return (
    <main>
      <StaticHeader /> 
      
      <Suspense fallback={<Loading />}>
        <DynamicCart /> {/* Streams in later */}
      </Suspense>
      
      <StaticFooter />
    </main>
  );
}`}
      misconception="PPR is just another name for Suspense. No. While it uses Suspense boundaries, PPR fundamentally changes how Next.js generates the initial HTML at build-time vs request-time."
    />
  )
}
