import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="dynamic-routes"
      title="Dynamic Routes"
      category="Routing"
      description="Dynamic routes allow you to use a single template to render pages for varying data, such as product IDs or user profiles."
      mentalModel="Think of a dynamic route as a wildcard or a placeholder in your URL path that gets filled with real data at runtime."
      whyExists="To enable large-scale applications where you can't manually create a page for every piece of content (e.g., millions of blog posts)."
      visualizerType="routing"
      visualizerProps={{
        title: "Dynamic Segment Mapping",
        data: [
          { name: "app", type: "folder", children: [
            { name: "blog", type: "folder", children: [
              { name: "[slug]", type: "folder", highlight: true, children: [
                { name: "page.tsx", type: "file", label: "Dynamic Post Content", highlight: true }
              ]},
              { name: "page.tsx", type: "file", label: "Blog List" }
            ]}
          ]}
        ]
      }}
      codeExample={`// app/blog/[slug]/page.tsx

export default async function BlogPost({ params }) {
  const { slug } = await params;
  return <h1>Reading: {slug}</h1>
}`}
      misconception="Dynamic routes are always dynamic. You can actually pre-generate them at build time using 'generateStaticParams' for performance."
    />
  )
}
