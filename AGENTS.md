# AGENTS.md — Instructions for AI Coding Assistants

Welcome agent! This file defines the guidelines, architecture conventions, and verification steps for working on the **CSCosmos** codebase.

---

## 📌 Project Overview
- **Repository**: CSCosmos (Computer Science Learning & Visualizer Hub)
- **Tech Stack**: Next.js 15 (App Router), TypeScript, React 19, Tailwind CSS, Radix UI, Lucide Icons, Framer Motion, Monaco Editor, Anime.js, D3.js.
- **Main Goal**: Absorb 30+ interactive computer science microsites into native Next.js routes within CSCosmos with full Dark/Light theme support, SSG static pre-rendering, and seamless client-side routing.

---

## 📂 Key File Locations

| Path | Purpose |
| :--- | :--- |
| [`src/data/topics.ts`](file:///home/subhajit/project/cscosmos/src/data/topics.ts) | Authoritative topic list (id, name, domain, slug, status, url) |
| [`src/data/domains.ts`](file:///home/subhajit/project/cscosmos/src/data/domains.ts) | 8 CS domain definitions, routes, icons & color accents |
| [`src/app/`](file:///home/subhajit/project/cscosmos/src/app) | App Router pages & catch-all routes for absorbed visualizers |
| [`src/components/visualizers/`](file:///home/subhajit/project/cscosmos/src/components/visualizers) | Native visualizer engine implementations (`jsviz`, `cssviz`, etc.) |
| [`PROJECT_CONTEXT.md`](file:///home/subhajit/project/cscosmos/PROJECT_CONTEXT.md) | Progress blueprint of absorbed sites & upcoming roadmap |

---

## 🛠️ Architecture Rules & Conventions

### 1. SSR & SSG Pre-Rendering Safety
- Next.js pre-renders routes on the server during build.
- **NEVER** reference `window`, `document`, or browser animation APIs (`anime.js`, `canvas`, `Monaco`) directly in module top-level scope.
- Wrap browser-only side effects in `useEffect` or check `if (typeof window === 'undefined') return;`.

### 2. Layout & Theme Consistency
- All pages and visualizers MUST support both **Light Mode** and **Dark Mode**.
- Use Tailwind dark variants (`dark:bg-slate-900`, `dark:text-slate-100`) or theme CSS variables (`bg-background text-foreground`).
- Ensure high text contrast ratio in both themes.

### 3. Absorbing External Microsites
When integrating a new standalone visualizer microsite:
1. Place source components in `src/components/visualizers/<site_name>/`.
2. Create the route in `src/app/<site_name>/[[...slug]]/page.tsx`.
3. Provide `generateStaticParams()` returning all sub-routes to enable static pre-rendering.
4. Update `src/data/topics.ts` for matching topic IDs: set `status: 'active'`.

---

## 🧪 Verification Commands

Before ending any task or declaring completion, ALWAYS run:

```bash
# 1. Check for TypeScript or ESLint errors
npm run lint

# 2. Verify static build and SSG pre-rendering
npm run build
```

---

## 🔗 Related Documentation
- [`README.md`](file:///home/subhajit/project/cscosmos/README.md)
- [`PROJECT_CONTEXT.md`](file:///home/subhajit/project/cscosmos/PROJECT_CONTEXT.md)
- [`goal.json`](file:///home/subhajit/project/cscosmos/goal.json)
