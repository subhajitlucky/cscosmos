import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="server-actions"
      title="Server Actions"
      category="Interactions"
      description="Server Actions are asynchronous functions that run on the server. They can be called from both Client and Server Components to handle data mutations."
      mentalModel="Think of Server Actions as 'RPC' (Remote Procedure Call) functions. Instead of creating a manual API route with fetch, you just call a function and Next.js handles the network request for you."
      whyExists="To eliminate the boilerplate of creating API endpoints for forms and to provide a type-safe way to mutate data that works even without JavaScript."
      visualizerType="server-action"
      visualizerProps={{
        initialMode: 'SSR',
        title: "Action Lifecycle",
        steps: ["User Submits Form", "POST Request to Action", "Server Executes Logic", "Revalidate Path / Cache", "Update UI with Result"]
      }}
      codeExample={`// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createFeedback(formData: FormData) {
  const message = formData.get('message')
  
  // No DB needed: just simulate server-side processing
  console.log('Feedback processed on server:', message)
  
  // Revalidate the cache so the UI updates
  revalidatePath('/concepts')
  
  return { success: true }
}

// app/page.tsx (Server Component)
export default function Form() {
  return (
    <form action={createFeedback}>
      <input name="message" className="border p-2" />
      <button type="submit">Submit to Server</button>
    </form>
  )`}
      misconception="People think Server Actions are only for forms. While they integrate with the 'action' prop, they are just functions you can call anywhere—even in a button's onClick or a useEffect."
    />
  )
}
