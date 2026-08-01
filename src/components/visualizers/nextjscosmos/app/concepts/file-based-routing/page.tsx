import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="file-based-routing"
      title="File-based Routing"
      category="Routing"
      description="In Next.js, the filesystem is the source of truth for your routes. Every folder represents a segment of the URL."
      mentalModel="Your file explorer is a direct map of your website's navigation. Moving a file literally moves a page on your site."
      whyExists="To make routing intuitive and predictable. You don't need a centralized 'routes.js' file; the structure of your project is your configuration."
      visualizerType="routing"
      codeExample={`// File structure:
// app/
//   dashboard/
//     settings/
//       page.tsx  ->  /dashboard/settings

export default function SettingsPage() {
  return <section>Settings UI</section>
}`}
      misconception="Files like 'component.tsx' inside a route folder do not become routes. Only 'page.tsx' files are publicly accessible."
    />
  )
}
