import { Footer } from "@/components/visualizers/golangviz/components/footer";
import { Navigation } from "@/components/visualizers/golangviz/components/navigation";
import { Section } from "@/components/visualizers/golangviz/components/section";
import { ConceptNavigation } from "@/components/visualizers/golangviz/components/concept-navigation";
import { QuizCards, Quiz } from "@/components/visualizers/golangviz/components/quiz-cards";
import Link from "next/link";

const variableQuizzes: Quiz[] = [
  {
    id: 1,
    question: "Where can the short declaration operator (:=) be used?",
    choices: [
      "Anywhere in the file",
      "Only at the package level",
      "Only inside function bodies",
      "Only for constant values"
    ],
    answer: 2,
    explanation: "The short declaration operator (:=) is only available inside functions. At the package level, you must use the 'var' keyword."
  },
  {
    id: 2,
    question: "What is the 'zero value' for a numeric type in Go?",
    choices: [
      "nil",
      "null",
      "0",
      "undefined"
    ],
    answer: 2,
    explanation: "Numeric types in Go are initialized to 0 by default if no value is provided."
  },
  {
    id: 3,
    question: "What happens if you declare a local variable but don't use it?",
    choices: [
      "It stays in memory until GC runs",
      "The program runs but with a warning",
      "The code fails to compile",
      "It is automatically deleted"
    ],
    answer: 2,
    explanation: "Go enforces a strict rule where all local variables must be used, or the compiler will throw an error."
  }
];

export default function Variables() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 space-y-6 pb-16">
        <Section
          id="declaration"
          kicker="Concept"
          title="Declaring Variables"
          description="How to store and label data in Go."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="surface rounded-2xl p-5 shadow-md shadow-blue-500/10 space-y-3">
              <h3 className="text-lg font-semibold">The <code>var</code> Keyword</h3>
              <p className="text-sm text-[var(--muted)]">
                Used to declare one or more variables. If a type is provided, the variable is initialized to its zero value.
              </p>
              <pre className="rounded bg-[var(--panel)] p-2 font-mono text-xs text-[var(--foreground)]">
{`var message string = "Hello"
var a, b int = 1, 2
var c = true // Type inferred`}
              </pre>
            </div>

            <div className="surface rounded-2xl p-5 shadow-md shadow-emerald-500/10 space-y-3">
              <h3 className="text-lg font-semibold">Short Declaration <code>:=</code></h3>
              <p className="text-sm text-[var(--muted)]">
                Inside functions, you can use the <code>:=</code> operator to declare and initialize a variable in one go without specifying the type.
              </p>
              <pre className="rounded bg-[var(--panel)] p-2 font-mono text-xs text-[var(--foreground)]">
{`func main() {
    count := 10 // inferred as int
    name := "Go" // inferred as string
}`}
              </pre>
            </div>
          </div>
        </Section>

        <Section
          id="zero-values"
          kicker="Initialization"
          title="Zero Values"
          description="Go ensures every variable has a predictable starting state."
        >
          <div className="surface rounded-2xl p-5 shadow-md shadow-orange-500/10">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-3 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)]">
                <div className="font-mono text-[var(--accent)] font-bold">0</div>
                <div className="text-xs text-[var(--muted)]">Numeric types</div>
              </div>
              <div className="text-center p-3 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)]">
                <div className="font-mono text-[var(--accent)] font-bold">false</div>
                <div className="text-xs text-[var(--muted)]">Booleans</div>
              </div>
              <div className="text-center p-3 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)]">
                <div className="font-mono text-[var(--accent)] font-bold">""</div>
                <div className="text-xs text-[var(--muted)]">Strings</div>
              </div>
              <div className="text-center p-3 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)]">
                <div className="font-mono text-[var(--accent)] font-bold">nil</div>
                <div className="text-xs text-[var(--muted)]">Pointers/Slices/etc</div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="rules"
          kicker="Rules"
          title="Variable Constraints"
          description="Things to keep in mind."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-sm text-[var(--muted)]">
              <div className="font-semibold text-[var(--foreground)] mb-1">Unused Variables</div>
              <p>Go does not allow unused local variables. If you declare a variable inside a function, you <strong>must</strong> use it, or the code won't compile.</p>
            </div>
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-sm text-[var(--muted)]">
              <div className="font-semibold text-[var(--foreground)] mb-1">Scope</div>
              <p>Variables are block-scoped. A variable declared inside a function is not accessible outside of it.</p>
            </div>
          </div>
        </Section>
        <QuizCards quizzes={variableQuizzes} />
        <ConceptNavigation />
      </main>
      <Footer />
    </div>
  );
}
