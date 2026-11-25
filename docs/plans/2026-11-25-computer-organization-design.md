# Design: Computer Fundamentals topic-sites in CSCosmos

Date: 2026-11-25
Status: Approved — implementation planning follows

## Goal

Add a new family of **independent, concept-first topic-sites** to CSCosmos under the
`corecs` domain. These are deep learning sites, not practice drills: each topic gets
its own homepage, `/learn`, `/learn/[chapter]`, `/lab`, and `/problems` pages with a
visual and pedagogical identity native to its subject.

This first release builds the flagship topic, **Computer Organization & Block
Diagram**. Five more topics (`memory-storage`, `number-systems`, `boolean-algebra`,
`microprocessors`, `software-fundamentals`) are planned as drop-in registrations.
**MS Office is explicitly out of scope.** No content is ported from pragya — pragya
is a practice app; CSCosmos is a concept site.

## Architecture

### Six independent topic-sites

| # | topicSlug | Title | Canonical root |
|:--|:----------|:------|:---------------|
| 1 | `computer-organization` | Computer Organization & Block Diagram | `/corecs/computer-organization` |
| 2 | `memory-storage` | Memory, Storage & Peripherals | `/corecs/memory-storage` |
| 3 | `number-systems` | Number Systems & Data Representation | `/corecs/number-systems` |
| 4 | `boolean-algebra` | Boolean Algebra & Logic Circuits | `/corecs/boolean-algebra` |
| 5 | `microprocessors` | 8086/8088 & Microprocessor Families | `/corecs/microprocessors` |
| 6 | `software-fundamentals` | Software, Algorithms & Languages | `/corecs/software-fundamentals` |

Approach chosen: **six registered `TopicModule`s**, not standalone absorbed engines.

### Plumbing

- Each topic is added to `src/data/topics.ts` with `status: 'active'`. There is **no**
  `engine-routes.ts` entry: these are module-backed, not engine-backed.
- Registration lives in per-topic files under `src/lib/modules/`, imported and
  registered from `src/lib/module-registry.ts` (which grows from 2 to 8 modules).
- The existing universal catch-all route,
  `src/app/[domain]/[topicSlug]/[[...segments]]/page.tsx`, already generates Home,
  `/learn`, `/learn/[subtopicSlug]`, `/lab`, `/problems`, metadata, and all SSG
  params from `TopicModule.subtopics`. **No new route files or Next.js config changes.**
- Each topic owns a component folder, e.g. `src/components/visualizers/computerorganization/`
  with `data/chapters.ts`, `pages/{Home,Learn,Topic,Lab,Problems}.tsx`, interactives,
  and scoped styles. No shared visible templates: only invisible infrastructure
  (routing, theme, progress, notes, SEO) is reused. This satisfies AGENTS.md §6.

### Data flow and safety

Static, SSR-safe chapter data → `TopicModule` registration → universal route →
pre-rendered pages. Browser-only interactivity is isolated in `'use client'`
components using `useEffect`; no top-level `window`/`document`/canvas/Monaco access.
Unknown subtopic slugs hit `notFound()`; domain mismatches fall back to the catalog
development landing. Light and dark themes use Tailwind dark variants / CSS variables.

## Flagship: Computer Organization & Block Diagram

### Chapters (`TopicModule.subtopics`)

1. `digital-computer-block-diagram` — functional blocks and the main data path
2. `functional-units` — ALU, CU, registers (PC, IR, ACC, GPRs), clock
3. `buses-and-interconnection` — data/address/control buses, width, arbitration
4. `instruction-cycle` — fetch, decode, execute, store; MAR/MDR/PC/IR roles
5. `memory-organization` — address space, byte/word addressing, memory map
6. `io-and-interrupts` — device controllers, memory-mapped I/O, polling/interrupt/DMA
7. `architecture-variants` — von Neumann vs Harvard, stored-program concept
8. `classification-and-performance` — micro/mini/mainframe/supercomputer, clock/CPI/MIPS

### Page designs

- **Home** (`/corecs/computer-organization`) — bespoke copper/amber circuit-board
  identity, animated block-diagram hero, chapter path, outcome list, start CTA.
- **Learn** (`/learn`) — prerequisite concept map between the 8 chapters, local
  progress, depth indicators, level filters. Not a copied grid.
- **Topic** (`/learn/[chapter]`) — deep article: *Intuition → Formal model →
  Annotated diagram → Worked example → Misconceptions → Try-it interactive → Key
  takeaways*. Every chapter has at least one bespoke interactive: block-diagram
  builder, CPU-unit signal tracer, bus-width calculator, fetch–decode–execute stepper
  (tiny LOAD/ADD/STORE/JMP ISA), address-space explorer, polling-vs-interrupt-vs-DMA
  simulator, von Neumann vs Harvard compare, classification/performance calculator.
- **Lab** (`/lab`) — signature **Digital Computer Workbench**: assemble a computer
  from functional blocks on an SVG canvas, wire its buses, load a tiny program,
  step the instruction cycle, watch signals, inject faults (bus-width mismatch,
  address overflow) and diagnose them.
- **Problems** (`/problems`) — concept challenges that teach: diagram labeling,
  bus-width math, instruction ordering, interrupt-vs-DMA scenarios, classification
  reasoning — each with hint, explanation, and a link back to the chapter.
  Deliberately not a bulk MCQ drill bank.

## Scope of this release

One fully built topic-site plus the registration structure for the other five.
Files touched: `src/data/topics.ts` (one entry), `src/lib/module-registry.ts` +
`src/lib/modules/computerOrganization.ts`, a new visualizer folder (data, 5 pages,
interactives, scoped styles), and one Vitest invariant test. No `engine-routes.ts`
or Next.js config changes.

## Verification

- Vitest invariant test: unique chapter slugs, required content fields, valid interactive keys.
- `npm run lint` (0 errors), `npm run build` (SSG pre-render), `npm run test:e2e`.
- Manual light/dark pass on all five new views.

Known constraint: the universal route imports `aicosmos/styles.css` globally, so new
topic pages use a scoped class prefix to preserve a distinct identity without
regressing the two AI modules.

## Rollout

Each remaining topic is a new component folder + one registration call — no routing
or config work.
