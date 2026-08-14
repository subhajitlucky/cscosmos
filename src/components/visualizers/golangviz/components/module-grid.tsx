type Module = {
  title: string;
  level: "foundation" | "memory" | "concurrency" | "advanced";
  items: string[];
};

const badgeColor: Record<Module["level"], string> = {
  foundation:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-100 dark:border-emerald-400/30",
  memory:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-400/10 dark:text-blue-100 dark:border-blue-400/30",
  concurrency:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-400/10 dark:text-amber-100 dark:border-amber-400/30",
  advanced:
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-400/10 dark:text-purple-100 dark:border-purple-400/30",
};

export function ModuleGrid({ modules }: { modules: Module[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {modules.map((module) => (
        <div
          key={module.title}
          className="surface rounded-2xl p-5 shadow-lg shadow-blue-500/10"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {module.title}
            </h3>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeColor[module.level]}`}
            >
              {module.level}
            </span>
          </div>
          <ul className="space-y-2 text-sm text-[var(--foreground)]">
            {module.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

