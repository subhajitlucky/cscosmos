import { Footer } from "@/components/visualizers/golangviz/components/footer";
import { Navigation } from "@/components/visualizers/golangviz/components/navigation";
import { Section } from "@/components/visualizers/golangviz/components/section";
import { ConceptNavigation } from "@/components/visualizers/golangviz/components/concept-navigation";
import { QuizCards, Quiz } from "@/components/visualizers/golangviz/components/quiz-cards";
import Link from "next/link";

const syntaxQuizzes: Quiz[] = [
  {
    id: 1,
    question: "In Go, how do you make a function or variable exported (public)?",
    choices: [
      "Use the 'public' keyword",
      "Start the name with an Uppercase letter",
      "Add an export comment",
      "Declare it in a separate file"
    ],
    answer: 1,
    explanation: "Go uses a simple rule for visibility: if a name starts with a capital letter, it is exported from the package."
  },
  {
    id: 2,
    question: "Can multiple files in the same directory belong to different packages?",
    choices: [
      "Yes, as long as they are in different subfolders",
      "No, all files in a directory must share the same package name",
      "Only if they are testing files",
      "Yes, if they use the 'import' keyword"
    ],
    answer: 1,
    explanation: "All Go files within a single directory must declare the same package name."
  },
  {
    id: 3,
    question: "Which naming convention is preferred in Go?",
    choices: [
      "snake_case",
      "PascalCase for everything",
      "MixedCaps (CamelCase)",
      "kebab-case"
    ],
    answer: 2,
    explanation: "Go uses MixedCaps or mixedCaps (CamelCase) for multi-word names, following the visibility rule for the first letter."
  }
];

export default function BasicSyntax() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 space-y-6 pb-16">
        <Section
          id="packages"
          kicker="Concept"
          title="Packages & Imports"
          description="How Go code is organized and shared."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="surface rounded-2xl p-5 shadow-md shadow-blue-500/10 space-y-3">
              <h3 className="text-lg font-semibold">Packages</h3>
              <p className="text-sm text-[var(--muted)]">
                Every Go file starts with a <code>package</code> declaration. Packages are Go's way of organizing and reusing code.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li>Executable programs must use <code>package main</code>.</li>
                <li>Libraries use the name of the directory they are in.</li>
                <li>All files in the same directory must belong to the same package.</li>
              </ul>
            </div>

            <div className="surface rounded-2xl p-5 shadow-md shadow-emerald-500/10 space-y-3">
              <h3 className="text-lg font-semibold">Imports</h3>
              <p className="text-sm text-[var(--muted)]">
                The <code>import</code> keyword is used to include code from other packages.
              </p>
              <pre className="rounded bg-[var(--panel)] p-2 font-mono text-xs text-[var(--foreground)]">
{`import "fmt"

import (
    "math"
    "net/http"
)`}
              </pre>
            </div>
          </div>
        </Section>

        <Section
          id="comments"
          kicker="Documentation"
          title="Comments"
          description="Annotating your code for humans."
        >
          <div className="surface rounded-2xl p-5 shadow-md shadow-orange-500/10 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">Single-line</h4>
                <code className="block font-mono text-sm text-[var(--foreground)]">// This is a comment</code>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Multi-line</h4>
                <code className="block font-mono text-sm text-[var(--foreground)]">/* This is a <br/> block comment */</code>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)]">
              <strong>Fun fact:</strong> Go uses comments to generate documentation automatically via <code>go doc</code>.
            </p>
          </div>
        </Section>

        <Section
          id="naming"
          kicker="Style"
          title="Naming Conventions"
          description="Writing idiomatic Go code."
        >
          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Visibility (Exporting)</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                  <li><strong>Uppercase</strong> starts are exported (public). e.g., <code>fmt.Println</code></li>
                  <li><strong>Lowercase</strong> starts are unexported (private). e.g., <code>myInternalFunc</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Style Rules</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                  <li>Use <code>MixedCaps</code> or <code>mixedCaps</code> (CamelCase), not underscores.</li>
                  <li>Acronyms should be all caps (e.g., <code>ServeHTTP</code>, <code>URL</code>).</li>
                  <li>Keep local variable names short (e.g., <code>r</code> for Reader, <code>i</code> for index).</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>
        <QuizCards quizzes={syntaxQuizzes} />
        <ConceptNavigation />
      </main>
      <Footer />
    </div>
  );
}
