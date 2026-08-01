import { ConceptLayout } from "@/components/visualizers/nextjscosmos/components/concept-layout"

export default function Page() {
  return (
    <ConceptLayout
      slug="font-optimization"
      title="Font Optimization"
      category="Performance & Caching"
      description="Next.js automatically optimizes fonts (including Google Fonts) by hosting them locally and removing external network requests."
      mentalModel="Bringing the fonts home. Instead of the browser asking Google for a font every time, Next.js downloads it once at build time."
      whyExists="To prevent 'Layout Shift' (where text jumps when fonts load) and to speed up page loads by eliminating external font requests."
      visualizerType="rendering"
      visualizerProps={{
        initialMode: 'SSG',
        title: "Font Delivery Pipeline",
        steps: ["Download Fonts at Build", "Self-host on Same Domain", "Pre-render with Font-Face", "Browser Loads CSS+Font", "Zero Layout Shift UI"]
      }}
      codeExample={`import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}`}
    />
  )
}
