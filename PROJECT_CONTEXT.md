# CSCosmos Project Blueprint & Technical Reference

## 📌 Overview
CSCosmos is an interactive computer science visualizer hub and learning platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **React 19**.

The platform organizes 245 topics across 8 core domains and natively embeds interactive visualization engines directly into client-side routes.

---

## 🏗️ Architecture & Data Model

### Data Schemas
- **Domains**: Defined in `src/data/domains.ts`. Represents 8 CS fields (`fullstack`, `dsa`, `web3`, `security`, `ai`, `corecs`, `devops`, `advanced`).
- **Topics**: Defined in `src/data/topics.ts`.
  ```ts
  type Topic = {
    catalogId: number;          // internal catalog id; never used in URLs
    name: string;
    domain: DomainKey;
    crossListedDomains?: DomainKey[];
    shortDescription: string;
    slug: string;               // stable public topicSlug
    status: 'coming-soon' | 'active';
    canonicalPath: string;      // /<domain>/<slug>
    difficulty, estimatedMinutes, tags, prerequisites, related
  };
  ```

---

## 🌐 Routes & Engine Status

Canonical topic URLs are always `/[domain]/[topicSlug]`. Each canonical URL is
internally rewritten to the engine implementation at `/[enginePath]`; direct
visits to the engine path 308-redirect back to the canonical URL.

| Route family | Status | Description |
| :--- | :--- | :--- |
| `/` | Live | Main landing page (hero, search, domain grid, featured engines) |
| `/topics` | Live | Catalog of all 245 topics with domain, difficulty, and time filters |
| `/[domain]` | Live | Domain hub (e.g. `/fullstack`, `/ai`, `/dsa`, `/security`) |
| `/[domain]/[topicSlug]` | **Canonical** | Topic page; 72 active topics today |
| `/[domain]/[topicSlug]/learn` | Live (modules) | Curriculum index for registered multi-view modules |
| `/[domain]/[topicSlug]/learn/[subtopicSlug]` | Live (modules) | Module subtopic deep-dive |
| `/[domain]/[topicSlug]/lab` | Live (modules) | Module interactive lab |
| `/[domain]/[topicSlug]/problems` | Live (modules) | Module certification arena |
| `/[enginePath]` | **Engine** | Top-level engine implementation; redirects to canonical |
| `/interview` | Live | Interview prep hub across 5 categories |
| `/interview/[category]` | Live | Filterable question list |
| `/interview/[category]/[questionSlug]` | Live | Animated question walkthrough |
| `/learn/[topicSlug]` | Alias | Permanent redirect to the canonical topic URL |
| `/embed/topic/[topicSlug]` | Live | Chrome-free visualizer embed |

The authoritative mapping is `src/data/engine-routes.ts` (70 absorbed engines).
The two AI curriculum modules are registered in `src/lib/module-registry.ts`.

## 🎯 Interview Prep Section

A dedicated interview-preparation area, separate from the topic catalog.

- **Data**: `src/data/interview/` — `types.ts` (content + animation spec unions), `categories.ts` (5 categories), `questions/<category>.ts` (25 questions), `index.ts` (helpers + facets), `interview.test.ts` (data invariants).
- **Animations**: `src/components/interview/animations/` — reusable primitives `StepFlow`, `CodeTrace`, `Timeline`, `BeforeAfter`, `MemoryDiagram`, plus `custom/AttentionScaling`; `AnimationBlock` resolves each step's `AnimationSpec`. Data-driven: new questions need no new code.
- **Pages**: `src/app/interview/` — hub, `[category]` filterable list (`CategoryBrowser`, filters synced to URL query params), `[category]/[questionSlug]` detail page (`QuestionView` + `StepWalkthrough`, JSON-LD `QAPage`).
- **Template rule**: every question = 5 solution steps; each step pairs 80-200 words of explanation with its own 3-7 frame animation.

---


## 🔄 Roadmap & Absorption Progress

### Current live inventory

- **245 catalog topics** across 8 domains.
- **72 active topics** = 70 absorbed engine routes + 2 registered curriculum modules.
- **70 engine routes** in `src/data/engine-routes.ts`.
- **2 curriculum modules** in `src/lib/module-registry.ts`:
  - `ai-engineering-foundations`
  - `python-for-ai-engineering`
- **25 interview questions** across 5 categories with data-driven animated walkthroughs.

Engine folders live in `src/components/visualizers/<engineDir>/`. The folder name
is not always the same as the topic slug (for example `program-cosmos` uses the
`programviz` engine folder). When that is true, the mapping in
`src/data/engine-routes.ts` is the only place that needs to change.

### Still planned

- Expand DSA (40 topics; 2 live).
- Build the Advanced Engineering & Systems domain (10 topics; 0 live).
- Deepen the two AI curriculum modules and add more multi-view modules.

## 🛠️ Verification & Quality Standards

1. **Lint & Build Checks**:
   - `npm run lint` must exit with 0 errors.
   - `npm run build` must verify static pre-rendering and SSR compatibility (ensure no window / browser global leaks during static generation).
2. **Theme Compatibility**:
   - Every visualizer component must support both Light and Dark mode using Tailwind CSS dark classes and CSS variables.
