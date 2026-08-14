import { Footer } from "@/components/visualizers/golangviz/components/footer";
import { Navigation } from "@/components/visualizers/golangviz/components/navigation";
import { Section } from "@/components/visualizers/golangviz/components/section";
import { ConceptNavigation } from "@/components/visualizers/golangviz/components/concept-navigation";
import { QuizCards, Quiz } from "@/components/visualizers/golangviz/components/quiz-cards";
import Link from "next/link";

const installQuizzes: Quiz[] = [
  {
    id: 1,
    question: "What is the purpose of the 'go env' command?",
    choices: [
      "To install a new Go environment",
      "To list all Go-related environment variables",
      "To delete temporary build files",
      "To update the Go compiler"
    ],
    answer: 1,
    explanation: "'go env' prints Go environment information, such as GOPATH, GOROOT, and target OS/architecture."
  },
  {
    id: 2,
    question: "Which environment variable points to the Go SDK installation directory?",
    choices: [
      "GOPATH",
      "GOWORK",
      "GOROOT",
      "GOBIN"
    ],
    answer: 2,
    explanation: "GOROOT points to the directory where the Go SDK is installed. It's usually set automatically by the installer."
  },
  {
    id: 3,
    question: "Where do binaries installed via 'go install' usually land?",
    choices: [
      "/usr/local/bin",
      "$GOPATH/bin",
      "./bin",
      "$GOROOT/bin"
    ],
    answer: 1,
    explanation: "By default, 'go install' places executable binaries in the bin subdirectory of the directory named by the GOPATH environment variable."
  }
];

export default function InstallationAndSetup() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 space-y-6 pb-16">
        <Section
          id="download"
          kicker="Step 1"
          title="Download and Install"
          description="Getting the Go binary onto your machine."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="surface rounded-2xl p-5 shadow-md shadow-blue-500/10 space-y-3">
              <h3 className="text-lg font-semibold">Official Installer</h3>
              <p className="text-sm text-[var(--muted)]">
                The easiest way to install Go is by downloading the official installer for your operating system.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li>Go to <Link href="https://go.dev/dl" className="text-[var(--accent)] underline">go.dev/dl</Link>.</li>
                <li>Download the package for Windows (.msi), macOS (.pkg), or Linux (.tar.gz).</li>
                <li>Follow the prompts to complete the installation.</li>
              </ul>
            </div>

            <div className="surface rounded-2xl p-5 shadow-md shadow-emerald-500/10 space-y-3">
              <h3 className="text-lg font-semibold">Package Managers</h3>
              <p className="text-sm text-[var(--muted)]">
                If you prefer using the command line:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li><strong>macOS (Homebrew):</strong> <code className="font-mono">brew install go</code></li>
                <li><strong>Linux (Ubuntu/Debian):</strong> <code className="font-mono">sudo apt install golang-go</code></li>
                <li><strong>Windows (Chocolatey):</strong> <code className="font-mono">choco install golang</code></li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="verify"
          kicker="Step 2"
          title="Verify Installation"
          description="Ensuring everything is working correctly."
        >
          <div className="surface rounded-2xl p-5 shadow-md shadow-blue-500/10 space-y-4">
            <p className="text-sm text-[var(--muted)]">
              Open your terminal or command prompt and run the following commands:
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
                <div className="font-semibold text-sm mb-1">Check Version</div>
                <code className="block font-mono text-sm text-[var(--foreground)]">go version</code>
                <p className="mt-1 text-xs text-[var(--muted)]">Should output something like: <code className="font-mono">go version go1.22.0 linux/amd64</code></p>
              </div>
              <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
                <div className="font-semibold text-sm mb-1">Check Environment</div>
                <code className="block font-mono text-sm text-[var(--foreground)]">go env</code>
                <p className="mt-1 text-xs text-[var(--muted)]">Shows all Go-related environment variables.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="editor"
          kicker="Step 3"
          title="Set Up Your Editor"
          description="Configure your development environment for the best experience."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <h4 className="font-semibold mb-2">VS Code (Recommended)</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li>Install the <strong>Go</strong> extension by Google.</li>
                <li>Run <kbd className="rounded bg-gray-200 px-1 dark:bg-gray-700">Ctrl+Shift+P</kbd> and type "Go: Install/Update Tools".</li>
                <li>Select all tools and click OK to enable linting, formatting, and intellisense.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <h4 className="font-semibold mb-2">JetBrains GoLand</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li>A powerful, dedicated IDE for Go.</li>
                <li>Comes with built-in support for all Go tools.</li>
                <li>Excellent for large projects and deep refactoring.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="env"
          kicker="Step 4"
          title="Environment Variables"
          description="Understanding GOROOT and GOPATH."
        >
          <div className="surface rounded-2xl p-5 shadow-md shadow-orange-500/10 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">$GOROOT</h4>
                <p className="text-sm text-[var(--muted)]">
                  Points to where the Go SDK is installed. You rarely need to change this.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">$GOPATH</h4>
                <p className="text-sm text-[var(--muted)]">
                  The root of your workspace (legacy) and where dependencies are downloaded.
                  By default, it is <code className="font-mono">~/go</code>.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-blue-500/5 p-4 border border-blue-500/20">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                <strong>Pro Tip:</strong> Add <code className="font-mono">$GOPATH/bin</code> to your system <code className="font-mono">PATH</code> so you can run tools installed via <code className="font-mono">go install</code> from anywhere.
              </p>
            </div>
          </div>
        </Section>
        <QuizCards quizzes={installQuizzes} />
        <ConceptNavigation />
      </main>
      <Footer />
    </div>
  );
}
