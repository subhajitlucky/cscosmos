import Link from "next/link";

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 md:flex-row md:items-center md:pt-20">
      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] shadow-sm">
          Visual Go, explained like a story — open source & free
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold leading-[1.1] text-[var(--foreground)] md:text-5xl">
            Learn Go faster with interactive visual debuggers.
          </h1>
          <p className="max-w-2xl text-lg text-[var(--muted)]">
            See stack/heap, pointers, channels, and goroutines animate as you step through code.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/golangviz/playground"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white !text-white shadow-md transition hover:-translate-y-0.5"
            aria-label="Open playground"
          >
            <span className="text-white drop-shadow-sm">Open playground</span>
          </Link>
          <Link
            href="/golangviz/path"
            className="inline-flex items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
            aria-label="View concepts"
          >
            View concepts
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Step-through execution
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Memory + channels + scheduler views
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Beginner-friendly storytelling
          </div>
        </div>
      </div>
      <div className="relative flex-1">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -right-4 top-24 h-24 w-24 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative surface rounded-2xl p-6 shadow-2xl shadow-blue-500/20 backdrop-blur">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>Stack</span>
            <span>Heap</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
              <div className="flex items-center justify-between text-blue-800 [color-scheme:light] dark:text-blue-100">
                <span>x</span>
                <span className="font-mono">10</span>
              </div>
              <div className="flex items-center justify-between text-blue-800 [color-scheme:light] dark:text-blue-100">
                <span>p</span>
                <span className="font-mono">&addr;x</span>
              </div>
            </div>
            <div className="space-y-2 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">
              <div className="flex items-center justify-between text-emerald-800 [color-scheme:light] dark:text-emerald-100">
                <span>slice data</span>
                <span className="font-mono">[0 1 2 3]</span>
              </div>
              <div className="flex items-center justify-between text-emerald-800 [color-scheme:light] dark:text-emerald-100">
                <span>cap</span>
                <span className="font-mono">8</span>
              </div>
            </div>
          </div>
          <div className="mt-6 surface-ghost rounded-xl p-4 text-xs text-[var(--foreground)]">
            <div className="font-mono text-[11px] leading-5 text-[var(--foreground)]">
              <div>
                <span className="text-blue-600 dark:text-blue-200">x</span> := 10
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-200">p</span> := &amp;x
              </div>
              <div>
                <span className="text-emerald-600 dark:text-emerald-200">go</span> worker()
              </div>
              <div>
                <span className="text-amber-600 dark:text-amber-200">ch</span> := make(chan int, 2)
              </div>
            </div>
            <p className="mt-3 text-[var(--muted)]">
              See each line update the visual model in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

