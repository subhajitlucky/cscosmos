import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="streaming"
      title="Streaming with Suspense"
      category="Rendering"
      description="Streaming allows the server to send the page in small pieces. You see the fast parts immediately while the slow parts are still being prepared."
      mentalModel="It's like going to a restaurant: the waiter brings the breadsticks (the shell) immediately so you can start eating while the pizza (the main data) is still in the oven."
      whyExists="To eliminate the 'all-or-nothing' rendering problem where one slow API call blocks the entire page from showing up."
      visualizerType="streaming"
      codeExample={`import { Suspense } from 'react'

export default function Page() {
  return (
    <section>
      <h1>My Store</h1>
      <Suspense fallback={<p>Loading Products...</p>}>
        <ProductList />
      </Suspense>
    </section>
  )
}`}
    />
  )
}
