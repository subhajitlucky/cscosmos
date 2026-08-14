import { Footer } from "@/components/visualizers/golangviz/components/footer";
import { Navigation } from "@/components/visualizers/golangviz/components/navigation";
import { Section } from "@/components/visualizers/golangviz/components/section";
import { ConceptNavigation } from "@/components/visualizers/golangviz/components/concept-navigation";
import { QuizCards, Quiz } from "@/components/visualizers/golangviz/components/quiz-cards";
import Link from "next/link";

const introQuizzes: Quiz[] = [
  {
    id: 1,
    question: "What happens when you run 'go build'?",
    choices: [
      "It interprets the code line by line",
      "It creates a standalone static binary",
      "It generates a Java-like bytecode file",
      "It only checks for syntax errors"
    ],
    answer: 1,
    explanation: "Go is a compiled language that produces a single, statically-linked binary with no external dependencies."
  },
  {
    id: 2,
    question: "Which tool is used to automatically format Go code?",
    choices: [
      "go lint",
      "go format",
      "go fmt",
      "go vet"
    ],
    answer: 2,
    explanation: "'go fmt' is the standard tool that enforces a consistent coding style across all Go projects."
  },
  {
    id: 3,
    question: "What is the primary purpose of Go Modules?",
    choices: [
      "To organize code into folders",
      "To manage external dependencies and versions",
      "To speed up the compiler",
      "To enable goroutines"
    ],
    answer: 1,
    explanation: "Go Modules (go.mod) provide a robust way to manage project dependencies and ensure reproducible builds."
  }
];

export default function IntroToGo() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 space-y-6 pb-16">
        <Section
          id="intro"
          kicker="Concept"
          title="Introduction to Go"
          description="Why Go exists, what problems it solves, and how to get your toolchain ready."
        >
          <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="surface rounded-2xl p-5 shadow-md shadow-blue-500/10 space-y-3">
              <h3 className="text-lg font-semibold">What & Why</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li>Compiled, statically-typed language built for simplicity and fast builds.</li>
                <li>First-class concurrency (goroutines, channels) and a lean runtime with GC.</li>
                <li>Excellent tooling: format, vet, test, build are batteries-included.</li>
              </ul>
              <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-sm">
                <div className="font-semibold mb-1">Mental model</div>
                <p className="text-[var(--muted)]">
                  Prefer clarity over cleverness. Small binaries, fast compiles, easy deployment.
                </p>
              </div>
            </div>

            <div className="surface rounded-2xl p-5 shadow-md shadow-emerald-500/10 space-y-3">
              <h3 className="text-lg font-semibold">Toolchain setup</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li>Install from <Link href="https://go.dev/dl" className="text-[var(--accent)] underline">go.dev/dl</Link>.</li>
                <li>Verify: <code className="font-mono">go version</code>, <code className="font-mono">go env</code>.</li>
                <li>Editors: VSCode (Go extension) or GoLand.</li>
                <li>Know your paths: <code className="font-mono">$GOROOT</code>, <code className="font-mono">$GOPATH</code>.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="workspace"
          kicker="Workspace"
          title="Modules vs GOPATH"
          description="Modern Go uses modules; GOPATH is legacy but still matters for caches."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <h4 className="font-semibold">Modules (use these)</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li><code className="font-mono">go mod init example.com/hello</code></li>
                <li><code className="font-mono">go mod tidy</code> to resolve deps.</li>
                <li>Per-project dependencies, semantic import versioning.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <h4 className="font-semibold">GOPATH (legacy)</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li>Default workspace and module/download cache.</li>
                <li>Bins often land in <code className="font-mono">$GOPATH/bin</code>.</li>
                <li>Set PATH to include <code className="font-mono">$GOPATH/bin</code>.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="hello"
          kicker="Syntax"
          title="Hello, Go"
          description="Minimal program structure."
        >
          <div className="surface rounded-2xl p-5 shadow-md shadow-blue-500/10">
            <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--foreground)]">
{`package main

import "fmt"

func main() {
    fmt.Println("hello, Go")
}`}
            </pre>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Run with <code className="font-mono">go run .</code> or build with <code className="font-mono">go build</code>.
            </p>
          </div>
        </Section>

        <Section
          id="behavior"
          kicker="Behavior"
          title="What happens under the hood?"
          description="Compilation, binary, memory, and GC at a glance."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-sm text-[var(--muted)]">
              <div className="font-semibold text-[var(--foreground)] mb-1">Compile → binary</div>
              <ul className="list-disc space-y-1 pl-5">
                <li>Static binary by default; no VM.</li>
                <li>Fast builds, linker does DCE (dead code elimination).</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-sm text-[var(--muted)]">
              <div className="font-semibold text-[var(--foreground)] mb-1">Memory & runtime</div>
              <ul className="list-disc space-y-1 pl-5">
                <li>GC managed heap; stack is per-goroutine and grows.</li>
                <li>Escape analysis decides heap vs stack allocation.</li>
                <li>Scheduler (G/M/P) runs goroutines; channels sync work.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="next"
          kicker="Do this next"
          title="Quick tasks"
          description="Take 10 minutes to solidify the basics."
        >
          <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
            <li>Install Go; ensure <code className="font-mono">go version</code> works.</li>
            <li>Create a folder; <code className="font-mono">go mod init example.com/hello</code>; run the Hello program.</li>
            <li>Run <code className="font-mono">go fmt ./...</code>, <code className="font-mono">go test ./...</code>, <code className="font-mono">go vet ./...</code>.</li>
            <li>Open the homepage mini-playground and paste Hello Go; step through.</li>
          </ul>
        </Section>
        <QuizCards quizzes={introQuizzes} />
        <ConceptNavigation />
      </main>
      <Footer />
    </div>
  );
}

