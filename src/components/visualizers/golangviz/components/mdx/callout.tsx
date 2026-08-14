type CalloutProps = {
  type?: "info" | "warn" | "success";
  title?: string;
  children: React.ReactNode;
};

const palette: Record<NonNullable<CalloutProps["type"]>, string> = {
  info: "border-blue-400/30 bg-blue-500/10 text-blue-100",
  warn: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
};

export function Callout({
  type = "info",
  title = "Note",
  children,
}: CalloutProps) {
  return (
    <div
      className={`mt-4 rounded-xl border px-4 py-3 text-sm ${palette[type]}`}
    >
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-slate-100/90">{children}</div>
    </div>
  );
}

