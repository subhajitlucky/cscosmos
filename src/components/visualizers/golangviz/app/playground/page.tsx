import { Footer } from "@/components/visualizers/golangviz/components/footer";
import { Navigation } from "@/components/visualizers/golangviz/components/navigation";
import { Section } from "@/components/visualizers/golangviz/components/section";
import { Playground } from "@/components/visualizers/golangviz/components/playground";
import { ChannelVisualizer } from "@/components/visualizers/golangviz/components/visualizers/channel-visualizer";
import { SchedulerVisualizer } from "@/components/visualizers/golangviz/components/visualizers/scheduler-visualizer";
import { SliceLab } from "@/components/visualizers/golangviz/components/visualizers/slice-lab";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navigation />
      <main className="space-y-6 pb-16">
        <Section
          id="playground"
          kicker="Playground"
          title="Live visuals for memory, channels, and scheduler"
          description="Step through code, watch stack/heap, channel queues, and goroutine scheduling. Use these presets or paste your own snippets."
        >
          <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="surface rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                <span className="font-semibold text-[var(--foreground)]">Mini Playground</span>
                <span>Topic: stack vs heap, pointers</span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Step through a snippet; see variables and channels change frame by frame.
              </p>
              <div className="mt-3 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-3 transition hover:-translate-y-1 hover:shadow-lg">
                <Playground />
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Visual tips</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                  <li>Watch stack vs heap allocations: pointers that escape move to heap.</li>
                  <li>Look for len/cap changes in slices; sharing happens until a resize.</li>
                  <li>Channels: blocked sends/receives light up; buffered vs unbuffered behavior differs.</li>
                  <li>Scheduler: goroutines move runnable → running → waiting; Ps own run queues.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Try these snippets</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                  <li>Pointer + escape: take address of a local; see heap allocation.</li>
                  <li>Slice growth: append in a loop; watch cap double.</li>
                  <li>Channel buffering: make(chan int, 2); send thrice; see blocked send.</li>
                  <li>Goroutine scheduling: start multiple goroutines; observe run queues.</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="channels"
          kicker="Channels"
          title="Channel debugger"
          description="Visualize buffered vs unbuffered channels, blocking sends/receives, and event timeline."
        >
          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="text-sm text-[var(--muted)] mb-2">
              Topic: channel queues, blocking, select readiness
            </div>
            <ChannelVisualizer />
          </div>
        </Section>

        <Section
          id="scheduler"
          kicker="Scheduler"
          title="G/M/P scheduler view"
          description="See goroutines across Ps, run queues, and waiting states. Dispatch, spawn, and park to watch transitions."
        >
          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="text-sm text-[var(--muted)] mb-2">
              Topic: goroutines, work stealing, runnable vs waiting
            </div>
            <SchedulerVisualizer />
          </div>
        </Section>

        <Section
          id="slices"
          kicker="Slices"
          title="Slice growth lab"
          description="Append and watch len/cap, generation changes, and sharing behavior."
        >
          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="text-sm text-[var(--muted)] mb-2">
              Topic: slice header, backing array, reallocation
            </div>
            <SliceLab />
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

