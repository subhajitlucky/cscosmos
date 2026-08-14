type RoadmapItem = {
  title: string;
  description: string;
  time: string;
};

export function Roadmap({ items }: { items: RoadmapItem[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-blue-400/40 via-[var(--panel-border)] to-transparent" />
      <div className="space-y-8">
        {items.map((item, idx) => (
          <div key={item.title} className="relative pl-12">
            <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-sm text-[var(--foreground)]">
              {idx + 1}
            </div>
            <div className="surface rounded-2xl p-5 shadow-lg shadow-blue-500/10">
              <div className="flex items-center justify-between text-[var(--foreground)]">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <span className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
                  {item.time}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

