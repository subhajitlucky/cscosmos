import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="route-groups"
      title="Route Groups"
      category="Routing"
      description="Route groups allow you to organize your route segments and layouts without affecting the URL structure."
      mentalModel="They are 'invisible' folders. They exist to help the developer group files and share layouts, but the user never sees them in the address bar."
      whyExists="To allow multiple root layouts or to group related routes (like authentication pages) together without adding '/auth/' to the URL."
      visualizerType="routing"
      visualizerProps={{
        title: "Route Groups (Hidden Segments)",
        data: [
          { name: "app", type: "folder", children: [
            { name: "(auth)", type: "folder", highlight: true, label: "No URL segment", children: [
              { name: "login", type: "folder", children: [{ name: "page.tsx", type: "file", label: "/login" }]},
              { name: "register", type: "folder", children: [{ name: "page.tsx", type: "file", label: "/register" }]},
              { name: "layout.tsx", type: "file", label: "Shared Auth UI" }
            ]},
            { name: "dashboard", type: "folder", children: [{ name: "page.tsx", type: "file" }]}
          ]}
        ]
      }}
      codeExample={`// (auth)/login/page.tsx  ->  /login
// (auth)/register/page.tsx -> /register
// (auth)/layout.tsx        -> Shared auth UI

export default function Login() {
  return <form>Login</form>
}`}
      misconception="Naming a folder with parentheses is just a convention. No, it is a specific Next.js feature that excludes the name from the URL path."
    />
  )
}
