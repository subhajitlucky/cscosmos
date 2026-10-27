"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background print:hidden"
    >
      <Printer className="h-3.5 w-3.5" aria-hidden="true" />
      Print or save PDF
    </button>
  );
}
