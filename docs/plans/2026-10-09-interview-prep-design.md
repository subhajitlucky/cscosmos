# Interview Prep Hub — Design

Date: 2026-10-09
Status: Approved

## Goal

Add an Interview Preparation section to CSCosmos: a hub where users pick an interview
category (Full Stack, Cybersecurity, DSA, System Design, AI/ML), browse questions with
rich filters, and open a dedicated page per question that teaches it from zero to 100%
through a step-by-step walkthrough where **every solution step pairs text with its own
behind-the-scenes animation**.

## Scope (v1)

- 5 categories, 3-4 fully-built questions each (~17 total). All content drafted by the
  agent, user reviews/edits afterwards.
- All 5 filters working: topic, difficulty, frequency, round/type, search.
- Vertical slice quality bar: every question page fully polished, not thin stubs.

## Routes

| Route | Type | Description |
| :--- | :--- | :--- |
| `/interview` | SSG server page | Hub with 5 category cards (counts, difficulty spread) |
| `/interview/[category]` | SSG + client filters | Filterable question list |
| `/interview/[category]/[question]` | SSG server page | Dedicated question page |

- Categories: `fullstack`, `cybersecurity`, `dsa`, `system-design`, `ai-ml`.
- Topic is a filter, not a URL segment; URLs stay stable.
- `generateStaticParams` + `dynamicParams = false` on both dynamic routes (pure SSG).
- Filters sync to URL query params (client-side, shareable).

## Data Model

Location: `src/data/interview/`

```
src/data/interview/
├── types.ts               # InterviewQuestion, QuestionStep, AnimationSpec union, enums
├── categories.ts          # 5 categories: key, title, description, icon, color, topic taxonomy
├── questions/
│   ├── fullstack.ts
│   ├── cybersecurity.ts
│   ├── dsa.ts
│   ├── system-design.ts
│   └── ai-ml.ts
├── index.ts               # aggregation + helpers (getQuestionBySlug, facet counts, ...)
└── interview.test.ts      # data invariants
```

Enums:

- `difficulty`: `beginner | intermediate | advanced`
- `frequency`: `very-often | sometimes | rare`
- `round`: `phone-screen | coding | system-design | concept`
- `type`: `concept | debugging | design | coding`

`InterviewQuestion` shape (final field names settled during implementation):

```ts
{
  slug, category, topic, title,
  difficulty, frequency, round, type, tags,
  oneLiner, whyAsked, mentalModel,
  steps: [{ title, body, code?, animation: AnimationSpec }],
  edgeCases: string[],
  followUps: { q, a }[],
  relatedEngine?: { label, href }   // e.g. XSS question -> /fullstack/websecurity
}
```

## Page Anatomy

### Hub (`/interview`)

- Hero + 5 category cards: name, description, question count, difficulty spread,
  icon/color from the existing palette.

### Category page (`/interview/[category]`)

- Search box + filter groups: topic chips, difficulty, frequency, round/type.
- Result count, question cards with badges, empty state.
- Filters synced to URL query params, client-side only.

### Question page (`/interview/[category]/[question]`)

1. Breadcrumb + title + badges (difficulty, frequency, round, type, topic)
2. "What interviewers are testing" + mental model TL;DR
3. **Step-by-step walkthrough (core)**: N steps (~5); text left, that step's own
   animation right (sticky); progress dots; shared Play/Next/Reset controls
4. Edge cases & traps (accordion)
5. Follow-up questions with answers (accordion)
6. "Go deeper" CTA linking the related native visualizer
7. Prev/next question navigation

Plus `generateMetadata` and JSON-LD (`QAPage`) per question.

## Animation System (hybrid)

Location: `src/components/interview/animations/`

Six reusable, theme-aware, `'use client'` primitives:

| Primitive | Use |
| :--- | :--- |
| `StepFlow` | Packets moving through nodes/arrows (requests, pipelines, protocols) |
| `CodeTrace` | Line highlight execution + variable inspector |
| `MemoryDiagram` | Stack/heap boxes + pointers |
| `StateMachine` | State/transition animation |
| `BeforeAfter` | Vulnerable vs fixed toggle (security topics) |
| `Timeline` | Sequence/timing diagrams |

- Each step's animation is data: `{ kind: 'step-flow', nodes, edges, phases }`,
  advanced by a shared per-step control bar.
- `AnimationBlock` resolver maps `AnimationSpec` -> primitive; supports
  `{ kind: 'custom', key }` escape hatch for 2-3 flagship questions.
- All animation/drawing inside `useEffect`; no browser globals at module scope
  (SSG-safe). Reduced-motion respected. Light/dark via theme tokens.

## Integration Checklist

- [ ] `src/components/Navbar.tsx`: add "Interview" link between Topics and Tracks.
- [ ] `src/app/sitemap.ts`: add hub + category + question URLs.
- [ ] Per-page `generateMetadata`; JSON-LD `QAPage` on question pages.
- [ ] No `LayoutWrapper` self-contained entry (uses global nav/footer).
- [ ] Data test `src/data/interview/interview.test.ts` (unique slugs, valid enums,
      every step has an animation, >= 5 steps per question, valid category refs).
- [ ] Verification: `npm run lint` and `npm run build` must pass.

## Out of Scope (v1)

- Progress tracking / bookmarks (can reuse `src/lib/track-progress.ts` later).
- Company tags, community answers, AI-generated questions.
- Search across full question text beyond title/topic/tag matching.

## Open Questions

None — design approved 2026-10-09.
