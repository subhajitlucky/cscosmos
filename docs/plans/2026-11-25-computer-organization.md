# Computer Organization Topic-Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the first independent concept-first topic-site in CSCosmos — Computer Organization & Block Diagram — at `/corecs/computer-organization`, with its own Home, Learn, Topic, Lab and Problems pages, eight deep chapters, bespoke interactives, and the registration structure that makes the next five topics drop-in additions.

**Architecture:** The topic is a registered `TopicModule` (`src/lib/modules/computerOrganization.ts` → `src/lib/module-registry.ts`). The existing universal catch-all route `src/app/[domain]/[topicSlug]/[[...segments]]/page.tsx` generates all five views and SSG params, so no new route files or config changes are needed. All visible UI lives in its own folder `src/components/visualizers/computerorganization/` with a scoped `co-` class prefix and distinct copper/amber identity; only invisible infrastructure (routing, theme, progress, SEO) is reused.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 3, Vitest 4, Playwright.

**Before writing code:** read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md` (AGENTS.md warns this Next.js version has breaking changes).

---

### Task 1: Chapter data model + invariant test (TDD)

**Files:**
- Create: `src/components/visualizers/computerorganization/data/chapters.ts`
- Test: `src/components/visualizers/computerorganization/data/chapters.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import {
  computerOrganizationChapters,
  getChapter,
  INTERACTIVE_KEYS,
} from './chapters';

describe('Computer Organization chapter catalog', () => {
  it('contains exactly 8 original chapters', () => {
    expect(computerOrganizationChapters).toHaveLength(8);
  });

  it('has unique chapter ids and sequential numbers 1..8', () => {
    const ids = computerOrganizationChapters.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(computerOrganizationChapters.map((c) => c.number)).toEqual(
      Array.from({ length: 8 }, (_, i) => i + 1),
    );
  });

  it('gives every chapter deep, structured content', () => {
    for (const c of computerOrganizationChapters) {
      expect(c.title.trim().length).toBeGreaterThan(3);
      expect(c.summary.trim().length).toBeGreaterThan(40);
      expect(c.intuition.trim().length).toBeGreaterThan(80);
      expect(c.formalModel.trim().length).toBeGreaterThan(80);
      expect(c.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(c.misconceptions.length).toBeGreaterThanOrEqual(2);
      expect(c.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(INTERACTIVE_KEYS.has(c.interactive)).toBe(true);
    }
  });

  it('retrieves a chapter by id and returns undefined for unknown ids', () => {
    expect(getChapter('instruction-cycle')?.number).toBe(4);
    expect(getChapter('does-not-exist')).toBeUndefined();
  });
});
```

**Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/visualizers/computerorganization/data/chapters.test.ts`
Expected: FAIL — module `./chapters` cannot be resolved.

**Step 3: Write the data module**

```ts
export const INTERACTIVE_KEYS = new Set([
  'block-diagram-builder',
  'cpu-signal-tracer',
  'bus-width-calculator',
  'instruction-cycle-stepper',
  'address-space-explorer',
  'io-mode-simulator',
  'architecture-compare',
  'performance-calculator',
] as const);

export type InteractiveKey = typeof INTERACTIVE_KEYS extends Set<infer K> ? K : never;

export interface WorkedExample {
  title: string;
  steps: string[];
  result: string;
}

export interface ComputerChapter {
  id: string;                 // stable chapter slug used in /learn/[chapter]
  number: number;             // 1..8
  title: string;
  category: 'Architecture' | 'Units & Buses' | 'Execution & I/O' | 'Systems';
  minutes: number;
  summary: string;
  intuition: string;
  formalModel: string;
  diagram: { label: string; blocks: string[]; flow: string[] };
  workedExample: WorkedExample;
  misconceptions: { claim: string; correction: string }[];
  interactive: InteractiveKey;
  takeaways: string[];
}

export const computerOrganizationChapters: ComputerChapter[] = [
  {
    id: 'digital-computer-block-diagram',
    number: 1,
    title: 'The Digital Computer Block Diagram',
    category: 'Architecture',
    minutes: 9,
    summary: 'Input, CPU, memory, output and secondary storage as one data path — the map every later chapter expands.',
    intuition: 'A computer is a loop: data enters through an input unit, the CPU works on it with instructions and data held in memory, and results leave through an output unit. Secondary storage keeps both program and data when the power is off. Every other topic in this site is a zoomed-in view of one box in this picture.',
    formalModel: 'Under the stored-program model, instructions and data share one addressable memory. The CPU exchanges information with memory and I/O over three bus families: address (where), data (what), and control (when and how). The block diagram is therefore a statement about information flow, not about physical box size.',
    diagram: {
      label: 'Classic digital computer block diagram',
      blocks: ['Input unit', 'CPU (ALU + CU + registers)', 'Memory unit', 'Output unit', 'Secondary storage'],
      flow: ['Input → CPU ↔ Memory', 'CPU ↔ Memory → Output', 'Secondary storage ↔ Memory'],
    },
    workedExample: {
      title: 'Typing a character and seeing it on screen',
      steps: [
        'The keyboard controller places a scan code in its device register.',
        'The CPU reads it over the data bus after placing the device address on the address bus.',
        'The program stores the character code in memory, then writes it to the display controller.',
        'The display controller rasterises the glyph and the monitor emits light.',
      ],
      result: 'One full trip around the block diagram, with memory as the shared staging area.',
    },
    misconceptions: [
      { claim: 'The CPU stores programs permanently.', correction: 'Programs live in secondary storage and are copied into memory before the CPU fetches their instructions.' },
      { claim: 'Buses carry only data.', correction: 'Address and control buses are separate channels; their widths decide addressable space and timing respectively.' },
    ],
    interactive: 'block-diagram-builder',
    takeaways: [
      'The block diagram is the map of every later chapter.',
      'Instructions and data share memory in a stored-program machine.',
      'Address, data and control buses answer where, what and when.',
    ],
  },
  // Chapters 2–8: functional-units, buses-and-interconnection, instruction-cycle,
  // memory-organization, io-and-interrupts, architecture-variants,
  // classification-and-performance — same shape, original concept-first prose,
  // each with its own interactive key from INTERACTIVE_KEYS above.
];

export function getChapter(id: string): ComputerChapter | undefined {
  return computerOrganizationChapters.find((chapter) => chapter.id === id);
}
```

**Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/visualizers/computerorganization/data/chapters.test.ts`
Expected: PASS (8 tests).

**Step 5: Commit**

```bash
git add src/components/visualizers/computerorganization/data/
git commit -m "feat(co): add original chapter data and invariant tests"
```

---

### Task 2: Catalog entry + module registration

**Files:**
- Modify: `src/data/topics.ts:302` (insert after the `// Core Computer Science` comment)
- Create: `src/lib/modules/computerOrganization.ts`
- Modify: `src/lib/module-registry.ts:1-71`

**Step 1: Add the catalog topic**

Insert into the Core Computer Science block:

```ts
createTopic("Computer Organization & Block Diagram", "corecs", {
  status: 'active',
  slug: 'computer-organization',
  curriculumTags: ['core', 'foundations'],
}),
```

No `engine-routes.ts` entry: module-backed topics are served by the universal route.

**Step 2: Create the registration object**

```ts
// src/lib/modules/computerOrganization.ts
import type { TopicModule } from '@/lib/topic-module';
import { computerOrganizationChapters } from '@/components/visualizers/computerorganization/data/chapters';
import { ComputerOrganizationHome } from '@/components/visualizers/computerorganization/pages/Home';
import { ComputerOrganizationLearn } from '@/components/visualizers/computerorganization/pages/Learn';
import { ComputerOrganizationTopic } from '@/components/visualizers/computerorganization/pages/Topic';
import { ComputerOrganizationLab } from '@/components/visualizers/computerorganization/pages/Lab';
import { ComputerOrganizationProblems } from '@/components/visualizers/computerorganization/pages/Problems';

export const computerOrganizationModule: TopicModule = {
  topicSlug: 'computer-organization',
  title: 'Computer Organization & Block Diagram',
  domain: 'corecs',
  subtopics: computerOrganizationChapters.map((c) => ({
    slug: c.id,
    number: c.number,
    title: c.title,
    category: c.category,
  })),
  HomePage: ComputerOrganizationHome,
  LearnPage: ComputerOrganizationLearn,
  TopicPage: ComputerOrganizationTopic,
  LabPage: ComputerOrganizationLab,
  ProblemsPage: ComputerOrganizationProblems,
};
```

**Step 3: Wire it into the registry**

```ts
// src/lib/module-registry.ts — add imports
import { computerOrganizationModule } from './modules/computerOrganization';
// ...after the two existing registerModule(...) calls:
registerModule(computerOrganizationModule);
```

**Step 4: Verify types and SSG params**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: FAIL only because the five page files do not exist yet — create minimal stubs in Task 3 before rerunning. Then: `npm run build` should list `/corecs/computer-organization` and its 8 chapter params in the route output.

**Step 5: Commit**

```bash
git add src/data/topics.ts src/lib/modules/computerOrganization.ts src/lib/module-registry.ts
git commit -m "feat(co): register computer organization module in corecs"
```

---

### Task 3: Scoped styles + Home page

**Files:**
- Create: `src/components/visualizers/computerorganization/styles.css`
- Create: `src/components/visualizers/computerorganization/pages/Home.tsx`

**Step 1: Add the scoped stylesheet**

```css
/* src/components/visualizers/computerorganization/styles.css */
.co-root {
  --co-copper: #b45309;
  --co-amber: #d97706;
  --co-ink: #1c1917;
  --co-surface: #fffbeb;
  --co-line: #d6d3d1;
  color: var(--co-ink);
  background: var(--co-surface);
}
.dark .co-root {
  --co-copper: #fbbf24;
  --co-amber: #f59e0b;
  --co-ink: #f5f5f4;
  --co-surface: #1c1917;
  --co-line: #44403c;
}
.co-root a { color: var(--co-copper); text-decoration: underline; }
.co-card { border: 1px solid var(--co-line); border-radius: 0.75rem; padding: 1rem; }
.co-chip { display: inline-flex; border: 1px solid var(--co-line); border-radius: 999px; padding: 0.125rem 0.5rem; font-size: 0.75rem; }
```

Use the `co-` prefix for every new class so the global `aicosmos/styles.css` import in the universal route cannot restyle this topic.

**Step 2: Write the Home page**

```tsx
'use client';
import Link from 'next/link';
import '../styles.css';
import { computerOrganizationChapters } from '../data/chapters';

export function ComputerOrganizationHome({ basePath = '/corecs/computer-organization' }: { basePath?: string }) {
  return (
    <main className="co-root min-h-screen px-6 py-12">
      <section className="mx-auto max-w-5xl">
        <p className="co-chip">Core Computer Science · Concept site</p>
        <h1 className="mt-4 text-4xl font-bold">Computer Organization &amp; Block Diagram</h1>
        <p className="mt-4 max-w-2xl text-lg">
          Start with one diagram, then take it apart: functional units, buses, the
          instruction cycle, memory, I/O and the performance maths behind it.
        </p>
        <div className="mt-8 flex gap-3">
          <Link className="co-card font-semibold" href={`${basePath}/learn`}>Open the 8 chapters →</Link>
          <Link className="co-card font-semibold" href={`${basePath}/lab`}>Enter the workbench →</Link>
        </div>
        <ol className="mt-12 grid gap-3 sm:grid-cols-2">
          {computerOrganizationChapters.map((c) => (
            <li key={c.id} className="co-card">
              <span className="co-chip">{String(c.number).padStart(2, '0')} · {c.category}</span>
              <h2 className="mt-2 font-semibold">{c.title}</h2>
              <p className="mt-1 text-sm">{c.summary}</p>
              <Link href={`${basePath}/learn/${c.id}`}>Read chapter →</Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
```

Replace the placeholder five page stubs with real exports as each task lands. Keep the hero distinct from `FoundationHome` — copper/amber, block-diagram motif, no AI-style phase cards.

**Step 3: Verify visually**

Run: `npm run dev`, visit `http://localhost:3000/corecs/computer-organization` in both themes.
Expected: hero + 8 chapter cards, readable in light and dark, no AI-module styling bleed.

**Step 4: Commit**

```bash
git add src/components/visualizers/computerorganization/
git commit -m "feat(co): add scoped theme and bespoke home page"
```

---

### Task 4: Learn page (concept map + progress)

**Files:**
- Create: `src/components/visualizers/computerorganization/pages/Learn.tsx`

**Step 1: Write the page**

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles.css';
import { computerOrganizationChapters, type ComputerChapter } from '../data/chapters';

const STORAGE_KEY = 'co:completed-chapters';

export function ComputerOrganizationLearn({ basePath = '/corecs/computer-organization' }: { basePath?: string }) {
  const [completed, setCompleted] = useState<string[]>([]);
  // localStorage is a browser API: read it only after mount (SSG safety).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(JSON.parse(raw) as string[]);
    } catch { /* ignore malformed storage */ }
  }, []);

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const byCategory = (['Architecture', 'Units & Buses', 'Execution & I/O', 'Systems'] as const)
    .map((category) => ({
      category,
      chapters: computerOrganizationChapters.filter((c) => c.category === category),
    }));

  return (
    <main className="co-root min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Learning path</h1>
        <p className="mt-2">{completed.length} / {computerOrganizationChapters.length} chapters complete</p>
        <p className="mt-1 text-sm">Each chapter ends with an interactive. Earlier chapters are prerequisites for later ones.</p>
        {byCategory.map(({ category, chapters }) => (
          <section key={category} className="mt-8">
            <h2 className="text-xl font-semibold">{category}</h2>
            <ol className="mt-3 grid gap-3 sm:grid-cols-2">
              {chapters.map((c: ComputerChapter) => (
                <li key={c.id} className="co-card">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`${basePath}/learn/${c.id}`} className="font-semibold">{c.number}. {c.title}</Link>
                    <button type="button" onClick={() => toggle(c.id)} className="co-chip">
                      {completed.includes(c.id) ? 'Completed' : 'Mark done'}
                    </button>
                  </div>
                  <p className="mt-2 text-sm">{c.summary}</p>
                  <p className="co-chip mt-2">{c.minutes} min · {c.interactive.replace(/-/g, ' ')}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
```

**Step 2: Verify**

Run: `npm run lint` and visit `/corecs/computer-organization/learn` in both themes; mark a chapter done, reload, confirm persistence.

**Step 3: Commit**

```bash
git add src/components/visualizers/computerorganization/pages/Learn.tsx
git commit -m "feat(co): add learning path with local chapter progress"
```

---

### Task 5: Topic page + first two interactives

**Files:**
- Create: `src/components/visualizers/computerorganization/pages/Topic.tsx`
- Create: `src/components/visualizers/computerorganization/interactives/BlockDiagramBuilder.tsx`
- Create: `src/components/visualizers/computerorganization/interactives/BusWidthCalculator.tsx`
- Create: `src/components/visualizers/computerorganization/interactives/index.tsx`

**Step 1: Build the interactive registry**

```tsx
// interactives/index.tsx — one key per chapter, no shared visual template
'use client';
import type { InteractiveKey } from '../data/chapters';
import { BlockDiagramBuilder } from './BlockDiagramBuilder';
import { BusWidthCalculator } from './BusWidthCalculator';
// remaining six components are added in Task 6; until then they map to null
export function ChapterInteractive({ kind }: { kind: InteractiveKey }) {
  switch (kind) {
    case 'block-diagram-builder': return <BlockDiagramBuilder />;
    case 'bus-width-calculator': return <BusWidthCalculator />;
    default: return null;
  }
}
```

**Step 2: Implement `BlockDiagramBuilder`**

Client component with `useState` for the selected block and connection list; render an SVG with five labelled blocks (Input, CPU, Memory, Output, Storage) and three bus colours. Clicking a block reveals its role; the learner connects blocks by selecting a source and target and choosing address/data/control. No `window` or `document` at module scope.

**Step 3: Implement `BusWidthCalculator`**

Number inputs for address lines and data lines; derive `addressableBytes = 2 ** addressLines`, display in B/KB/MB/GB, and animate a bus with the selected width. Pure computation in render — no browser APIs at module scope.

**Step 4: Write the Topic page**

```tsx
'use client';
import Link from 'next/link';
import '../styles.css';
import { getChapter } from '../data/chapters';
import { ChapterInteractive } from '../interactives';

export function ComputerOrganizationTopic({ subtopicSlug, basePath = '/corecs/computer-organization' }: { subtopicSlug: string; basePath?: string }) {
  const chapter = getChapter(subtopicSlug);
  if (!chapter) return <main className="co-root p-12">Chapter not found.</main>;
  return (
    <main className="co-root mx-auto max-w-4xl px-6 py-12">
      <p className="co-chip">Chapter {chapter.number} · {chapter.category}</p>
      <h1 className="mt-3 text-3xl font-bold">{chapter.title}</h1>
      <p className="mt-3 text-lg">{chapter.summary}</p>
      <section className="co-card mt-8"><h2>Intuition</h2><p>{chapter.intuition}</p></section>
      <section className="co-card mt-4"><h2>Formal model</h2><p>{chapter.formalModel}</p></section>
      <section className="co-card mt-4"><h2>{chapter.diagram.label}</h2><p>{chapter.diagram.blocks.join(' · ')}</p><p>{chapter.diagram.flow.join(' → ')}</p></section>
      <section className="co-card mt-4"><h2>Worked example: {chapter.workedExample.title}</h2><ol>{chapter.workedExample.steps.map((s) => <li key={s}>{s}</li>)}</ol><p>{chapter.workedExample.result}</p></section>
      <section className="co-card mt-4"><h2>Common misconceptions</h2>{chapter.misconceptions.map((m) => <p key={m.claim}><strong>{m.claim}</strong> — {m.correction}</p>)}</section>
      <section className="co-card mt-4"><h2>Try it</h2><ChapterInteractive kind={chapter.interactive} /></section>
      <section className="co-card mt-4"><h2>Key takeaways</h2><ul>{chapter.takeaways.map((t) => <li key={t}>{t}</li>)}</ul></section>
      <Link className="co-chip mt-8 inline-block" href={`${basePath}/learn`}>← All chapters</Link>
    </main>
  );
}
```

Note: the universal route passes `subtopicSlug` as a prop — do not re-read it from `useParams`.

**Step 5: Verify**

Run: `npx tsc --noEmit -p tsconfig.json`, `npm run lint`, then visit `/corecs/computer-organization/learn/digital-computer-block-diagram` and `/learn/buses-and-interconnection`; exercise both interactives in both themes.

**Step 6: Commit**

```bash
git add src/components/visualizers/computerorganization/
git commit -m "feat(co): add deep chapter pages with first two interactives"
```

---

### Task 6: Remaining six interactives + Lab workbench

**Files:**
- Create: `src/components/visualizers/computerorganization/interactives/{CpuSignalTracer,InstructionCycleStepper,AddressSpaceExplorer,IoModeSimulator,ArchitectureCompare,PerformanceCalculator}.tsx`
- Modify: `src/components/visualizers/computerorganization/interactives/index.tsx`
- Create: `src/components/visualizers/computerorganization/pages/Lab.tsx`

**Step 1: Implement each interactive in its own file**

All are `'use client'` with `useState`/`useEffect`; distinct visuals, no shared template:
- `CpuSignalTracer` — click ALU/CU/PC/IR/ACC and watch a signal path highlight.
- `InstructionCycleStepper` — tiny LOAD/ADD/STORE/JMP program; Next/Reset buttons; PC, IR, ACC panels update per step.
- `AddressSpaceExplorer` — address bus width slider paints a memory map and highlights a selected address.
- `IoModeSimulator` — side-by-side polling / interrupt / DMA lanes with a cost readout; a "device ready" toggle.
- `ArchitectureCompare` — von Neumann vs Harvard animated fetch paths.
- `PerformanceCalculator` — clock, CPI, instruction count → execution time and MIPS.

**Step 2: Register them in `index.tsx`**

Replace each `default: return null` case with its component import and case.

**Step 3: Write the Lab page**

```tsx
'use client';
import { useState } from 'react';
import '../styles.css';
import { InstructionCycleStepper } from '../interactives/InstructionCycleStepper';

const BLOCKS = ['Input', 'CPU', 'Memory', 'Output', 'Storage'] as const;

export function ComputerOrganizationLab({ basePath = '/corecs/computer-organization' }: { basePath?: string }) {
  const [wired, setWired] = useState<string[]>([]);
  const [fault, setFault] = useState<'none' | 'bus-width' | 'address-overflow'>('none');
  return (
    <main className="co-root min-h-screen px-6 py-12">
      <h1 className="text-3xl font-bold">Digital Computer Workbench</h1>
      <p className="mt-2">Wire the blocks, run a program, then break the machine and diagnose it.</p>
      <div className="co-card mt-8">
        <svg viewBox="0 0 600 160" role="img" aria-label="Computer block diagram canvas" className="w-full">
          {BLOCKS.map((b, i) => (
            <g key={b} onClick={() => setWired((w) => w.includes(b) ? w : [...w, b])}>
              <rect x={i * 118} y="50" width="100" height="60" rx="8" fill="var(--co-surface)" stroke="var(--co-copper)" />
              <text x={i * 118 + 50} y="86" textAnchor="middle" fill="var(--co-ink)">{b}</text>
            </g>
          ))}
        </svg>
        <p className="mt-2">Wired: {wired.length ? wired.join(' → ') : 'click blocks to place them'}</p>
      </div>
      <div className="co-card mt-4">
        <label>Fault injection:{' '}
          <select value={fault} onChange={(e) => setFault(e.target.value as typeof fault)}>
            <option value="none">none</option><option value="bus-width">bus-width mismatch</option><option value="address-overflow">address overflow</option>
          </select>
        </label>
        <p className="mt-2">{fault === 'none' ? 'Machine healthy.' : `Diagnose: ${fault === 'bus-width' ? 'data bus too narrow for the word size' : 'address bus cannot reach the requested location'}`}</p>
      </div>
      <section className="co-card mt-4"><h2 className="font-semibold">Program stepper</h2><InstructionCycleStepper /></section>
    </main>
  );
}
```

**Step 4: Verify**

Run: `npx tsc --noEmit -p tsconfig.json`, `npm run lint`, visit all 8 chapter pages and `/lab`; exercise every interactive in both themes.

**Step 5: Commit**

```bash
git add src/components/visualizers/computerorganization/
git commit -m "feat(co): complete interactives and digital computer workbench"
```

---

### Task 7: Problems page (concept challenges)

**Files:**
- Create: `src/components/visualizers/computerorganization/data/challenges.ts`
- Create: `src/components/visualizers/computerorganization/pages/Problems.tsx`

**Step 1: Add challenge data**

`challenges.ts` exports `Challenge[]` with fields `id`, `chapter` (chapter id), `prompt`, `hint`, `answer`, `explanation`, `kind: 'label' | 'calculate' | 'order' | 'scenario'`. Write at least 16 original challenges spanning all 8 chapters — label a block diagram, compute addressable memory for 20 address lines, order fetch/decode/execute/store, choose interrupt over DMA for a slow device, classify a machine by use case, etc. Each `explanation` teaches the reasoning (this is not a bulk MCQ bank).

**Step 2: Write the Problems page**

```tsx
'use client';
import { useState } from 'react';
import '../styles.css';
import { challenges } from '../data/challenges';
import { computerOrganizationChapters } from '../data/chapters';

export function ComputerOrganizationProblems({ basePath = '/corecs/computer-organization' }: { basePath?: string }) {
  const [revealed, setRevealed] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const shown = challenges.filter((c) => filter === 'all' || c.chapter === filter);
  return (
    <main className="co-root mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Concept challenges</h1>
      <p className="mt-2">Reason first, then reveal. Every explanation links back to its chapter.</p>
      <select className="co-card mt-6" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All chapters</option>
        {computerOrganizationChapters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
      <ol className="mt-6 grid gap-4">
        {shown.map((c) => (
          <li key={c.id} className="co-card">
            <span className="co-chip">{c.kind}</span>
            <h2 className="mt-2 font-semibold">{c.prompt}</h2>
            <p className="mt-1 text-sm">Hint: {c.hint}</p>
            {revealed.includes(c.id) ? (
              <div className="mt-3"><p><strong>{c.answer}</strong></p><p>{c.explanation}</p>
                <a href={`${basePath}/learn/${c.chapter}`}>Back to chapter →</a></div>
            ) : (
              <button type="button" className="co-chip mt-3" onClick={() => setRevealed((r) => [...r, c.id])}>Reveal answer</button>
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}
```

**Step 3: Verify**

Run: `npm run lint`, visit `/corecs/computer-organization/problems`, filter by chapter, reveal answers, check links resolve in both themes.

**Step 4: Commit**

```bash
git add src/components/visualizers/computerorganization/
git commit -m "feat(co): add teaching-oriented concept challenges"
```

---

### Task 8: Full verification (AGENTS.md gate)

**Step 1: Unit tests**

Run: `npm test`
Expected: all tests pass, including the new chapter invariants.

**Step 2: Lint**

Run: `npm run lint`
Expected: 0 errors.

**Step 3: Build / SSG**

Run: `npm run build`
Expected: success; the build output includes `/corecs/computer-organization` and its 8 `/learn/[chapter]` params. No `window`/`document` during pre-render.

**Step 4: E2E smoke**

Run: `npm run test:e2e`
Expected: existing Playwright suite passes (no regressions to other modules).

**Step 5: Manual theme + route pass**

Visit all five views plus all 8 chapters in light and dark; confirm no AI-module styling bleed and that `/learn/computer-organization` redirects to the canonical root.

**Step 6: Commit (only if fixes were needed)**

```bash
git add -A && git commit -m "fix(co): address verification findings"
```

---

## Execution handoff

Plan complete. Two execution options:

1. **Subagent-Driven (this session)** — a fresh subagent per task with review between tasks (fast iteration).
2. **Parallel Session (separate)** — open a new session in a worktree using executing-plans with batch checkpoints.

Choose one to begin implementation.
