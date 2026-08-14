type SectionProps = {
  id?: string;
  kicker?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Section({
  id,
  kicker,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="mb-8 flex flex-col gap-2">
        {kicker ? (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            {kicker}
          </span>
        ) : null}
        <h2 className="text-3xl font-semibold leading-tight text-[var(--foreground)] md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-3xl text-base text-[var(--foreground)] dark:text-[var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

