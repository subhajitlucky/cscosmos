export interface ErrorItem {
  name: string;
  slug: string;
  category: string;
  description: string;
  solution: string;
  simulationType: string;
}

export const commonErrors: ErrorItem[] = [
  {
    name: "Hydration Mismatch",
    slug: "hydration-mismatch",
    category: "Runtime",
    description: "The server-rendered HTML doesn't match the client-rendered output (e.g., using new Date() or Math.random()).",
    solution: "Use 'useEffect' to set state after hydration, or use 'suppressHydrationWarning' for specific elements.",
    simulationType: "hydration-error"
  },
  {
    name: "Missing 'use client'",
    slug: "missing-use-client",
    category: "Build / Compilation",
    description: "Attempting to use browser-only hooks like 'useState' or 'useEffect' inside a Server Component.",
    solution: "Add the 'use client' directive at the very top of the file to declare a boundary.",
    simulationType: "missing-directive"
  },
  {
    name: "Unserializable Props",
    slug: "unserializable-props",
    category: "RSC Boundary",
    description: "Trying to pass functions, classes, or private symbols through the Server-to-Client boundary.",
    slug: "unserializable-props",
    solution: "Only pass plain JSON-serializable objects. Functions should be passed as Server Actions if appropriate.",
    simulationType: "serialization-error"
  },
  {
    name: "Static Rendering Bailout",
    slug: "static-bailout",
    category: "Build",
    description: "Using a dynamic function (like headers() or cookies()) in a page that is being pre-rendered statically.",
    solution: "Declare 'export const dynamic = \"force-dynamic\"' or ensure the route is intentionally dynamic.",
    simulationType: "bailout-error"
  },
  {
    name: "Async Params Violation",
    slug: "async-params",
    category: "Next.js 15+ Logic",
    description: "Accessing 'params' or 'searchParams' synchronously in a Page or Layout without awaiting them.",
    solution: "Next.js 15+ requires params to be awaited before use. Use 'async/await' or the 'use' hook.",
    simulationType: "params-error"
  }
];

export function getErrorNavigation(currentSlug: string) {
  const index = commonErrors.findIndex(e => e.slug === currentSlug);
  return {
    prev: index > 0 ? commonErrors[index - 1] : null,
    next: index < commonErrors.length - 1 ? commonErrors[index + 1] : null,
  };
}
