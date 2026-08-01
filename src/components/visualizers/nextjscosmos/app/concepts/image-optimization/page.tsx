import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="image-optimization"
      title="Image Optimization"
      category="Performance & Caching"
      description="The Next.js Image component extends the HTML <img> element with features for automatic optimization."
      mentalModel="An automatic photo editor. It resizes your images, converts them to modern formats (WebP), and prevents layout shifts."
      whyExists="To solve the #1 cause of slow websites: unoptimized images. It ensures users only download exactly what they need for their screen size."
      visualizerType="image"
      visualizerProps={{
        initialMode: 'SSR',
        title: "Image Request Lifecycle",
        steps: ["Browser Requests Image", "Next.js Optimizer Checks Cache", "Resize & Convert to WebP", "Cache Optimized Asset", "Deliver Pixel-Perfect Image"]
      }}
      codeExample={`import Image from 'next/image'
import profilePic from './me.png'

export default function Profile() {
  return (
    <Image
      src={profilePic}
      alt="Me"
      placeholder="blur" // Optional
    />
  )
}`}
    />
  )
}
