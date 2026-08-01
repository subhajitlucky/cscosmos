export interface ConceptItem {
  name: string;
  slug: string;
}

export interface Phase {
  number: string;
  title: string;
  description: string;
  color: string;
  items: ConceptItem[];
}

export const masteryPath: Phase[] = [
  {
    number: "01",
    title: "The Foundations",
    description: "Master the essential building blocks of the App Router and component architecture.",
    color: "bg-blue-500",
    items: [
      { name: "App Router Overview", slug: "app-router-overview" },
      { name: "File-based Routing", slug: "file-based-routing" },
      { name: "Nested Routes", slug: "nested-routes" },
      { name: "Dynamic Routes", slug: "dynamic-routes" },
      { name: "Route Groups", slug: "route-groups" },
      { name: "Client Components", slug: "client-components" },
      { name: "use client Directive", slug: "use-client" },
    ],
  },
  {
    number: "02",
    title: "Core Architecture",
    description: "Deep dive into how Next.js renders and fetches data on the modern web.",
    color: "bg-purple-500",
    items: [
      { name: "React Server Components", slug: "rsc" },
      { name: "Server vs Client boundary", slug: "server-client-boundary" },
      { name: "SSR (Server-Side)", slug: "ssr" },
      { name: "SSG (Static)", slug: "ssg" },
      { name: "Hydration Process", slug: "hydration" },
      { name: "Fetching on Server", slug: "server-fetching" },
      { name: "Fetching on Client", slug: "client-fetching" },
    ],
  },
  {
    number: "03",
    title: "Advanced Routing & UI",
    description: "Complex UI patterns, layouts, and robust error handling.",
    color: "bg-amber-500",
    items: [
      { name: "Layouts & Templates", slug: "layouts-and-templates" },
      { name: "Loading UI", slug: "loading-ui" },
      { name: "Error Boundaries", slug: "error-boundaries" },
      { name: "Not Found Routes", slug: "not-found-routes" },
      { name: "Parallel Routes", slug: "parallel-routes" },
      { name: "Intercepting Routes", slug: "intercepting-routes" },
      { name: "Middleware", slug: "middleware" },
      { name: "Route Handlers", slug: "route-handlers" },
    ],
  },
  {
    number: "04",
    title: "Optimization & Delivery",
    description: "Polish your application for maximum performance and global scale.",
    color: "bg-emerald-500",
    items: [
      { name: "Streaming Architecture", slug: "streaming" },
      { name: "ISR (Incremental)", slug: "isr" },
      { name: "Caching & Revalidation", slug: "caching-revalidation" },
      { name: "fetch Cache Options", slug: "fetch-options" },
      { name: "Metadata API", slug: "metadata-api" },
      { name: "Image Optimization", slug: "image-optimization" },
      { name: "Font Optimization", slug: "font-optimization" },
      { name: "Deployment Model", slug: "deployment-model" },
    ],
  },
  {
    number: "05",
    title: "Modern Interactions",
    description: "Handle data mutations and advanced hybrid rendering patterns.",
    color: "bg-rose-500",
    items: [
      { name: "Server Actions", slug: "server-actions" },
      { name: "Form Handling", slug: "form-handling" },
      { name: "Optimistic Updates", slug: "optimistic-updates" },
      { name: "Partial Prerendering", slug: "ppr" },
      { name: "Server-only Packages", slug: "server-only" },
    ],
  },
];

export const allConceptsFlat = masteryPath.flatMap(phase => phase.items);

export function getConceptBySlug(slug: string) {
  return allConceptsFlat.find(c => c.slug === slug);
}

export function getNavigation(currentSlug: string) {
  const index = allConceptsFlat.findIndex(c => c.slug === currentSlug);
  return {
    prev: index > 0 ? allConceptsFlat[index - 1] : null,
    next: index < allConceptsFlat.length - 1 ? allConceptsFlat[index + 1] : null,
  };
}