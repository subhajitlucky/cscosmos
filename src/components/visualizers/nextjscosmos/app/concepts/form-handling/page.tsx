import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="form-handling"
      title="Form Handling"
      category="Interactions"
      description="Next.js simplifies forms by using Server Actions. You can handle submissions directly in your components without manual API endpoints."
      mentalModel="Think of a mailbox. You put your letter (data) in the box, and the postman (Next.js) takes it straight to the server for you."
      whyExists="To provide a seamless way to handle user input that works even if JavaScript is slow to load, improving accessibility and developer experience."
      visualizerType="form-handling"
      visualizerProps={{
        initialMode: 'SSR',
        title: "Form Submission Flow",
        steps: ["User Fills Form", "Click Submit", "Action Validates Data", "Server Processes Request", "UI Reflects Status"]
      }}
      codeExample={`export default function ContactForm() {
  async function handleSubmit(formData: FormData) {
    'use server'
    const email = formData.get('email')
    // Send email...
  }

  return (
    <form action={handleSubmit}>
      <input type="email" name="email" />
      <button type="submit">Contact Me</button>
    </form>
  )
}`}
    />
  )
}
