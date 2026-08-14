import { Footer } from "@/components/visualizers/golangviz/components/footer";
import { Navigation } from "@/components/visualizers/golangviz/components/navigation";
import { Section } from "@/components/visualizers/golangviz/components/section";
import { ConceptNavigation } from "@/components/visualizers/golangviz/components/concept-navigation";
import { QuizCards, Quiz } from "@/components/visualizers/golangviz/components/quiz-cards";
import Link from "next/link";

const helloQuizzes: Quiz[] = [
  {
    id: 1,
    question: "What is the special name for the entry point package in Go?",
    choices: [
      "start",
      "root",
      "main",
      "init"
    ],
    answer: 2,
    explanation: "Every executable Go program must have a package named 'main' which contains the main() function."
  },
  {
    id: 2,
    question: "How do you run a Go file without creating a permanent binary?",
    choices: [
      "go build",
      "go run",
      "go exec",
      "go start"
    ],
    answer: 1,
    explanation: "'go run' compiles and executes the program in a temporary directory and cleans up afterwards."
  },
  {
    id: 3,
    question: "Which standard library package is used for formatted I/O like printing?",
    choices: [
      "io",
      "print",
      "fmt",
      "log"
    ],
    answer: 2,
    explanation: "The 'fmt' package implements formatted I/O with functions analogous to C's printf and scanf."
  }
];

export default function HelloWorld() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 space-y-6 pb-16">
        <Section
          id="hello"
          kicker="Concept"
          title="Hello World"
          description="Your first Go program, line by line."
        >
          <div className="surface rounded-2xl p-5 shadow-md shadow-blue-500/10">
            <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--foreground)]">
{`package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`}
            </pre>
          </div>
        </Section>

        <Section
          id="explanation"
          kicker="Deep Dive"
          title="What's happening?"
          description="Breaking down the components of a minimal Go program."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <h4 className="font-semibold mb-2">package main</h4>
              <p className="text-sm text-[var(--muted)]">
                Defines the package name. The <code>main</code> package is special: it tells the compiler that this file should compile as an executable rather than a library.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <h4 className="font-semibold mb-2">import "fmt"</h4>
              <p className="text-sm text-[var(--muted)]">
                Includes the <code>fmt</code> (format) package from the standard library, which contains functions for formatting text, including printing to the console.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <h4 className="font-semibold mb-2">func main()</h4>
              <p className="text-sm text-[var(--muted)]">
                The entry point of the program. Execution starts here. It takes no arguments and returns nothing.
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="running"
          kicker="Execution"
          title="Running the program"
          description="How to compile and execute your code."
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <div className="font-semibold text-sm mb-2">Option 1: Run directly</div>
              <code className="block font-mono text-sm text-[var(--foreground)]">go run main.go</code>
              <p className="mt-1 text-xs text-[var(--muted)]">Compiles and runs the program in one step without leaving a binary behind.</p>
            </div>
            <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <div className="font-semibold text-sm mb-2">Option 2: Build a binary</div>
              <code className="block font-mono text-sm text-[var(--foreground)]">go build main.go</code>
              <p className="mt-1 text-xs text-[var(--muted)]">Creates an executable file (e.g., <code>main</code> or <code>main.exe</code>).</p>
            </div>
          </div>
        </Section>
        <QuizCards quizzes={helloQuizzes} />
        <ConceptNavigation />
      </main>
      <Footer />
    </div>
  );
}
