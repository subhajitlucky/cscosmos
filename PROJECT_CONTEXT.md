# CSCosmos Project Blueprint & Technical Reference

## 📌 Overview
CSCosmos is an interactive computer science visualizer hub and learning platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **React 19**.

The platform organizes 172+ topics across 8 core domains and natively embeds interactive visualization engines directly into client-side routes.

---

## 🏗️ Architecture & Data Model

### Data Schemas
- **Domains**: Defined in `src/data/domains.ts`. Represents 8 CS fields (`fullstack`, `dsa`, `web3`, `ai`, `corecs`, `devops`, `advanced`).
- **Topics**: Defined in `src/data/topics.ts`.
  ```ts
  type Topic = {
    id: number;
    name: string;
    domain: DomainKey;
    shortDescription: string;
    slug: string;
    status: 'coming-soon' | 'active';
    url?: string;
  };
  ```

---

## 🌐 Routes & Native Visualizers Status

| Route | Status | Description / Visualizer |
| :--- | :--- | :--- |
| `/` | Live | Main Landing Page (Hero, Search, Domain Grid, Featured Deep-Dives) |
| `/topics` | Live | Catalog of all 172+ topics with domain filters & search |
| `/[domain]` | Live | Domain specific topic lists (e.g. `/fullstack`, `/ai`, `/dsa`) |
| `/program-cosmos` | **Absorbed** | Program execution visualizer (CPU, Memory, Instruction Cycle) |
| `/html-cosmos` | **Absorbed** | HTML & Accessibility visualizer (53 pre-rendered topic pages) |
| `/css-cosmos` | **Absorbed** | CSS Box Model, Flexbox, Grid visualizers |
| `/jsviz` | **Absorbed** | JavaScript Event Loop, Call Stack, Scope Chain & Memory visualizer |
| `/webprotocols` | **Absorbed** | HTTP, DNS, TCP/IP web protocols visualizers |
| `/websecurity` | **Absorbed** | XSS, CSRF, CSP, CORS security visualizers |
| `/reactcosmos` | **Absorbed** | React Fiber, Virtual DOM, Reconciliation & Hooks visualizers |
| `/nextjscosmos` | **Absorbed** | Next.js 15 App Router concepts, RSC, SSG/SSR/ISR, Error Debugger |
| `/golangviz` | **Absorbed** | Go GMP Scheduler, Channels, Slice Memory Header, Stepper |
| `/learn/[slug]` | Active | Universal player loading native visualizers or fallback registry |

---

## 🔄 Roadmap & Absorption Progress

### Absorbed Sites (Native App Router):
- ✅ Site 1: `programviz` -> `/program-cosmos`
- ✅ Site 2: `htmlviz` -> `/html-cosmos`
- ✅ Site 3: `cssviz` -> `/css-cosmos`
- ✅ Site 4: `webprotocolsviz` -> `/webprotocols`
- ✅ Site 5: `websecureviz` -> `/websecurity`
- ✅ Site 6: `jsviz` -> `/jsviz` (Completed: sticky sidebar layout, SSR safety, dark/light theme, Cpu icon bugfix)
- ✅ Site 7: `reactcosmos` -> `/reactcosmos` (Completed: 35 pre-rendered React topics, Fiber visualizer, Hooks simulator, lab playground)
- ✅ Site 8: `nextjscosmos` -> `/nextjscosmos` (Completed: 35 pre-rendered Next.js 15 App Router modules, RSC visualizer, SSG/SSR/ISR engine, Error debugger & Interactive lab)
- ✅ Site 9: `golangviz` -> `/golangviz` (Completed: Go GMP Scheduler, Channels, Slice Memory Lab, Stepper & Concepts)

### Planned Next Absorptions:
- ⏳ Site 10: `redisviz` (Redis In-Memory Engine & Data Structures visualizer)
- ⏳ Site 11: `apiviz` (API Architecture: REST, GraphQL, gRPC visualizer)
- ⏳ Site 12: `tsviz` (TypeScript type checker & compiler visualizer)
- ⏳ Site 13: `dockercosmos` & `k8scosmos` (Container & Orchestration visualizers)
- ⏳ Site 14: `sqlcosmos` (SQL queries & Index visualizer)
- ⏳ Site 15: `blockchainviz` & `evminternals`

---

## 🛠️ Verification & Quality Standards

1. **Lint & Build Checks**:
   - `npm run lint` must exit with 0 errors.
   - `npm run build` must verify static pre-rendering and SSR compatibility (ensure no window / browser global leaks during static generation).
2. **Theme Compatibility**:
   - Every visualizer component must support both Light and Dark mode using Tailwind CSS dark classes and CSS variables.
