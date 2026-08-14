import { Footer } from "@/components/visualizers/golangviz/components/footer";
import { Navigation } from "@/components/visualizers/golangviz/components/navigation";
import { Section } from "@/components/visualizers/golangviz/components/section";
import { Playground } from "@/components/visualizers/golangviz/components/playground";
import { ChannelVisualizer } from "@/components/visualizers/golangviz/components/visualizers/channel-visualizer";
import { SchedulerVisualizer } from "@/components/visualizers/golangviz/components/visualizers/scheduler-visualizer";
import { SliceLab } from "@/components/visualizers/golangviz/components/visualizers/slice-lab";
import { LiveGoRunner } from "@/components/visualizers/golangviz/components/LiveGoRunner";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 space-y-10 pb-20 pt-6">
        {/* Top Feature: In-Browser Live Code Runner */}
        <LiveGoRunner />

        {/* Section 1: Memory & Stepper */}
        <Section
          id="memory-stepper"
          kicker="Step-Through Debugger"
          title="Interactive Stack, Heap &amp; Variable Stepper"
          description="Step through code frame by frame to observe stack allocation, heap escape, pointers, and channel queues in real time."
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="surface rounded-3xl p-6 shadow-md border border-[var(--panel-border)]">
              <div className="flex items-center justify-between text-sm text-[var(--muted)] border-b border-[var(--panel-border)] pb-3 mb-4">
                <span className="font-bold text-[var(--foreground)]">Execution Stepper</span>
                <span className="text-xs font-mono text-blue-500">Topic: Stack vs Heap &amp; Escapes</span>
              </div>
              <Playground />
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-sm space-y-3">
                <div className="text-xs uppercase font-extrabold tracking-wider text-blue-500">Visual Insights</div>
                <ul className="space-y-2 text-xs text-[var(--muted)] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span><strong>Stack vs Heap:</strong> Local variables remain on the stack unless a pointer outlives the creating function frame.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span><strong>Slice Growth:</strong> Appending beyond capacity allocates a new doubled backing array in heap memory.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span><strong>Channels:</strong> Blocked sends and receives light up immediately until rendezvous synchronization.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Section 2: Channel Visualizer */}
        <Section
          id="channels"
          kicker="Concurrency CSP"
          title="Channel Visualizer &amp; Deadlock Detector"
          description="Visualize buffered vs unbuffered channels, blocking sends/receives, and concurrent event pipelines."
        >
          <div className="surface rounded-3xl p-6 shadow-md border border-[var(--panel-border)]">
            <ChannelVisualizer />
          </div>
        </Section>

        {/* Section 3: GMP Scheduler */}
        <Section
          id="scheduler"
          kicker="Runtime Architecture"
          title="Go GMP Runtime Scheduler"
          description="Inspect how Goroutines (G), OS Threads (M), and Logical Processors (P) cooperate with work-stealing queues."
        >
          <div className="surface rounded-3xl p-6 shadow-md border border-[var(--panel-border)]">
            <SchedulerVisualizer />
          </div>
        </Section>

        {/* Section 4: Slice Lab */}
        <Section
          id="slices"
          kicker="Memory Anatomy"
          title="Slice Memory Lab &amp; Doubling Strategy"
          description="Inspect the 24-byte Slice Header struct (pointer, length, capacity) and watch memory growth algorithms."
        >
          <div className="surface rounded-3xl p-6 shadow-md border border-[var(--panel-border)]">
            <SliceLab />
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
