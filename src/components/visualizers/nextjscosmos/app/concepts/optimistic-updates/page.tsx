import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="optimistic-updates"
      title="Optimistic Updates"
      category="Interactions"
      description="Optimistic updates allow your UI to respond instantly to user actions, assuming the server request will succeed before it actually finishes."
      mentalModel="It's like checking an item off your to-do list immediately. You don't wait for the pen to finish drying to know you've done it!"
      whyExists="To make applications feel incredibly fast and responsive. Users hate waiting for 'loading spinners' after clicking a simple button."
      visualizerType="optimistic"
      visualizerProps={{
        initialMode: 'SSR',
        title: "Optimistic Lifecycle",
        steps: ["User Clicks Like", "UI Updates Instantly", "Action Runs in BG", "Server Confirms Success", "UI Stays Updated"]
      }}
      codeExample={`import { useOptimistic } from 'react'

export function LikeButton({ initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state, newLike) => state + 1
  )

  return (
    <button onClick={() => addOptimisticLike(1)}>
      {optimisticLikes} Likes
    </button>
  )
}`}
    />
  )
}
