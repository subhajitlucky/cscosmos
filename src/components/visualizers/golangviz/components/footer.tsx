import Link from "next/link";

const footerLinks = [
  {
    title: "Product",
    items: [
      { label: "Playground", href: "/playground" },
      { label: "Concept map", href: "/path" },
      { label: "Roadmap", href: "/path#roadmap" },
    ],
  },
  {
    title: "Learn",
    items: [
      { label: "Start here", href: "/#start" },
      { label: "Features", href: "/#features" },
      { label: "Intro to Go", href: "/concepts/introduction-to-go" },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "Issues", href: "https://github.com/issues" },
      { label: "Twitter / X", href: "https://x.com" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-[var(--panel-border)] bg-[color-mix(in srgb, var(--panel) 85%, var(--background) 15%)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="text-lg font-semibold">GolangViz</div>
            <p className="max-w-xl text-sm text-[var(--muted)]">
              Visual, interactive Go lessons built by the community. Learn how
              goroutines, channels, and the scheduler really behave.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/golangviz/playground"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white !text-white shadow-md transition hover:-translate-y-0.5"
            >
              Open playground
            </Link>
            <Link
              href="/golangviz/path"
              className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
            >
              View concepts
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Open source
            </div>
            <p className="text-sm text-[var(--muted)]">
              Built to stay free for learners. Star the repo and help shape new
              visualizers.
            </p>
            <a
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] underline underline-offset-4 hover:text-[var(--foreground)]"
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <span aria-hidden>↗</span>
            </a>
          </div>
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                {column.title}
              </div>
              <ul className="space-y-2 text-sm text-[var(--foreground)]">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition hover:text-[var(--accent)]"
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-xs text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <span>© {year} GolangViz. MIT licensed.</span>
          <span>Made for learners who think best in pictures.</span>
        </div>
      </div>
    </footer>
  );
}


