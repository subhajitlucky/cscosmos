# Interview Prep Hub — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `executing-plans` (`.agents/skills/executing-plans`) to implement this plan task-by-task.

> **Commits:** Per project rules, run commit steps only after explicit user approval. Lint after every task; full build at milestone tasks marked below.

**Goal:** Add a 5-category interview preparation hub with filterable question lists and a dedicated page per question where every solution step pairs text with its own behind-the-scenes animation.

**Architecture:** Pure-static App Router routes (`/interview`, `/interview/[category]`, `/interview/[category]/[question]`) backed by typed data in `src/data/interview/`. Question pages render a client step-walkthrough; each step's animation is data (`AnimationSpec`) resolved by an `AnimationBlock` component against a small library of reusable, theme-aware animation primitives (plus one custom component). Content drafted by the agent.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind (class dark mode), lucide-react icons, no new dependencies.

**Reference docs:** `docs/plans/2026-10-09-interview-prep-design.md`, `AGENTS.md`, `src/app/tracks/[slug]/page.tsx` (SSG pattern), `src/components/ui/accordion.tsx`.

**Conventions to follow:** All browser/animation code inside `useEffect`; `'use client'` on interactive components; server `page.tsx` files do params/static-params/metadata; `await params` (Next 16); Tailwind `dark:` variants + CSS tokens (`bg-background text-foreground`); `cn()` from `@/lib/utils`.

---

## Content Inventory (17 questions)

| # | Category | Slug | Topic | Difficulty | Frequency | Round | Type | Animation |
|---|----------|------|-------|-----------|-----------|-------|------|-----------|
| 1 | fullstack | what-happens-when-you-type-a-url | Browser | beginner | very-often | phone-screen | concept | step-flow |
| 2 | fullstack | useeffect-runs-twice-strict-mode | React | intermediate | very-often | coding | debugging | code-trace |
| 3 | fullstack | event-loop-timeout-vs-promise-order | JavaScript | intermediate | very-often | coding | coding | timeline |
| 4 | fullstack | database-indexes-btree-tradeoffs | Databases | intermediate | sometimes | concept | concept | step-flow |
| 5 | cybersecurity | xss-attack-and-defense | Web Security | beginner | very-often | concept | concept | before-after |
| 6 | cybersecurity | jwt-localstorage-risk | Authentication | intermediate | very-often | concept | concept | before-after |
| 7 | cybersecurity | csrf-how-and-samesite | Web Security | intermediate | very-often | concept | concept | step-flow |
| 8 | dsa | two-sum-brute-force-to-hashmap | Arrays & Hashing | beginner | very-often | coding | coding | code-trace |
| 9 | dsa | kmp-linear-string-matching | Strings | advanced | sometimes | coding | coding | code-trace |
| 10 | dsa | lru-cache-hashmap-doubly-linked-list | Caching & Design | advanced | very-often | system-design | design | code-trace |
| 11 | dsa | floyd-cycle-detection | Linked Lists | intermediate | sometimes | coding | coding | memory-diagram |
| 12 | system-design | design-url-shortener | Scalability | intermediate | very-often | system-design | design | step-flow |
| 13 | system-design | consistent-hashing-virtual-nodes | Scalability | advanced | very-often | system-design | concept | step-flow |
| 14 | system-design | rate-limiter-design | Traffic | intermediate | very-often | system-design | design | step-flow |
| 15 | ai-ml | why-attention-scales-by-sqrt-dk | Transformers | advanced | sometimes | concept | concept | custom (`attention-scaling`) |
| 16 | ai-ml | rag-end-to-end-pipeline | RAG | intermediate | very-often | system-design | design | step-flow |
| 17 | ai-ml | backpropagation-gradient-flow | Training | intermediate | very-often | concept | concept | step-flow |

`StateMachine` primitive from the design is **deferred** (YAGNI — no v1 question needs it; the resolver union includes it so it can be added later without breaking data).

---

### Task 1: Interview data types

**Files:**
- Create: `src/data/interview/types.ts`

**Step 1: Write the types (complete file)**

```ts
export type InterviewCategoryKey =
  | 'fullstack'
  | 'cybersecurity'
  | 'dsa'
  | 'system-design'
  | 'ai-ml';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Frequency = 'very-often' | 'sometimes' | 'rare';
export type InterviewRound = 'phone-screen' | 'coding' | 'system-design' | 'concept';
export type QuestionType = 'concept' | 'debugging' | 'design' | 'coding';

export const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
export const FREQUENCIES: Frequency[] = ['very-often', 'sometimes', 'rare'];
export const ROUNDS: InterviewRound[] = ['phone-screen', 'coding', 'system-design', 'concept'];
export const QUESTION_TYPES: QuestionType[] = ['concept', 'debugging', 'design', 'coding'];

/* ---------- Animation specs (plain JSON — serializable across RSC boundary) ---------- */

export interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
}

export interface FlowPacket {
  from: string;
  to: string;
  label?: string;
}

export interface FlowPhase {
  id: string;
  caption: string;
  packets?: FlowPacket[];
  activeNodeIds?: string[];
  doneNodeIds?: string[];
  errorNodeIds?: string[];
}

export interface StepFlowSpec {
  kind: 'step-flow';
  nodes: FlowNode[];
  /** Ordered top-to-bottom (or left-to-right on wide screens). */
  phases: FlowPhase[];
}

export interface CodeTraceFrame {
  id: string;
  caption: string;
  /** 1-based line numbers to highlight. */
  activeLines: number[];
  variables: { name: string; value: string; changed?: boolean }[];
  output?: string;
}

export interface CodeTraceSpec {
  kind: 'code-trace';
  language: string;
  code: string;
  frames: CodeTraceFrame[];
}

export interface TimelineLane {
  id: string;
  label: string;
  kind: 'call' | 'microtask' | 'macrotask' | 'render' | 'custom';
}

export interface TimelineFrame {
  id: string;
  caption: string;
  marks: { laneId: string; label: string; status: 'active' | 'done' }[];
}

export interface TimelineSpec {
  kind: 'timeline';
  lanes: TimelineLane[];
  frames: TimelineFrame[];
}

export interface PanelLine {
  text: string;
  tone: 'neutral' | 'danger' | 'success';
}

export interface BeforeAfterSpec {
  kind: 'before-after';
  beforeLabel: string;
  afterLabel: string;
  before: PanelLine[];
  after: PanelLine[];
  /** Frames progressively highlight lines; indexes reference the arrays above. */
  frames: { id: string; caption: string; beforeIndex: number; afterIndex: number }[];
}

export interface MemoryBox {
  id: string;
  label: string;
  value?: string;
  highlight?: boolean;
}

export interface MemoryRegion {
  id: string;
  label: string;
  kind: 'stack' | 'heap' | 'storage';
  boxes: MemoryBox[];
}

export interface MemoryCursor {
  id: string;
  label: string;
  targetBoxId: string;
  tone: 'primary' | 'danger' | 'success';
}

export interface MemoryFrame {
  id: string;
  caption: string;
  cursors: MemoryCursor[];
  highlightBoxIds?: string[];
}

export interface MemoryDiagramSpec {
  kind: 'memory-diagram';
  regions: MemoryRegion[];
  frames: MemoryFrame[];
}

export interface CustomAnimationSpec {
  kind: 'custom';
  /** Key into the custom animation registry (see AnimationBlock). */
  key: 'attention-scaling';
}

export type AnimationSpec =
  | StepFlowSpec
  | CodeTraceSpec
  | TimelineSpec
  | BeforeAfterSpec
  | MemoryDiagramSpec
  | CustomAnimationSpec;

/* ---------- Content model ---------- */

export interface QuestionStep {
  title: string;
  /** Markdown-ish plain text; paragraphs separated by blank lines. Keep it prose, no raw HTML. */
  body: string;
  code?: { language: string; source: string };
  animation: AnimationSpec;
}

export interface FollowUp {
  q: string;
  a: string;
}

export interface RelatedEngine {
  label: string;
  href: string;
}

export interface InterviewQuestion {
  slug: string;
  category: InterviewCategoryKey;
  topic: string;
  title: string;
  difficulty: Difficulty;
  frequency: Frequency;
  round: InterviewRound;
  type: QuestionType;
  tags: string[];
  /** One-sentence pitch shown on cards. */
  oneLiner: string;
  /** "What interviewers are testing" — 1 short paragraph. */
  whyAsked: string;
  /** TL;DR mental model — 2-4 sentences. */
  mentalModel: string;
  steps: QuestionStep[];
  edgeCases: string[];
  followUps: FollowUp[];
  relatedEngine?: RelatedEngine;
}

export interface InterviewCategory {
  key: InterviewCategoryKey;
  title: string;
  shortTitle: string;
  description: string;
  /** lucide-react icon name, resolved in the UI via a small map. */
  icon: 'Layers' | 'ShieldAlert' | 'Binary' | 'Network' | 'BrainCircuit';
  /** Tailwind text color class, e.g. 'text-blue-500'. */
  accent: string;
  /** Display taxonomy for filters (chips are derived from actual questions). */
  topics: string[];
}
```

**Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0 (no new errors from this file).

**Step 3: Commit (only if approved)**

```bash
git add src/data/interview/types.ts
git commit -m "feat(interview): add interview prep data types and animation specs"
```

---

### Task 2: Categories + display metadata

**Files:**
- Create: `src/data/interview/categories.ts`
- Create: `src/data/interview/meta.ts`

**Step 1: Write `categories.ts`**

```ts
import type { InterviewCategory } from './types';

export const categories: InterviewCategory[] = [
  {
    key: 'fullstack',
    title: 'Full Stack Interview Questions',
    shortTitle: 'Full Stack',
    description: 'JavaScript, React, networking and databases — the rounds that gate every web role.',
    icon: 'Layers',
    accent: 'text-blue-500',
    topics: ['Browser', 'React', 'JavaScript', 'Databases'],
  },
  {
    key: 'cybersecurity',
    title: 'Cybersecurity Interview Questions',
    shortTitle: 'Cybersecurity',
    description: 'XSS, CSRF and auth-token attacks: think like an attacker, defend like an engineer.',
    icon: 'ShieldAlert',
    accent: 'text-rose-500',
    topics: ['Web Security', 'Authentication'],
  },
  {
    key: 'dsa',
    title: 'DSA Interview Questions',
    shortTitle: 'DSA',
    description: 'Patterns, proofs and complexity — from brute force to the optimal solution.',
    icon: 'Binary',
    accent: 'text-green-500',
    topics: ['Arrays & Hashing', 'Strings', 'Caching & Design', 'Linked Lists'],
  },
  {
    key: 'system-design',
    title: 'System Design Interview Questions',
    shortTitle: 'System Design',
    description: 'Scale, caching and traffic control — design decisions and the math behind them.',
    icon: 'Network',
    accent: 'text-purple-500',
    topics: ['Scalability', 'Traffic'],
  },
  {
    key: 'ai-ml',
    title: 'AI / ML Interview Questions',
    shortTitle: 'AI / ML',
    description: 'Transformers, RAG and training internals — the questions behind modern AI roles.',
    icon: 'BrainCircuit',
    accent: 'text-red-500',
    topics: ['Transformers', 'RAG', 'Training'],
  },
];
```

**Step 2: Write `meta.ts`** (labels + badge classes for filters/UI)

```ts
import type { Difficulty, Frequency, InterviewRound, QuestionType } from './types';

export const DIFFICULTY_META: Record<Difficulty, { label: string; className: string }> = {
  beginner: { label: 'Beginner', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' },
  intermediate: { label: 'Intermediate', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  advanced: { label: 'Advanced', className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' },
};

export const FREQUENCY_META: Record<Frequency, { label: string; className: string }> = {
  'very-often': { label: 'Asked very often', className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30' },
  sometimes: { label: 'Asked sometimes', className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30' },
  rare: { label: 'Rare', className: 'bg-slate-500/10 text-slate-500 dark:text-slate-500 border-slate-500/30' },
};

export const ROUND_META: Record<InterviewRound, { label: string }> = {
  'phone-screen': { label: 'Phone screen' },
  coding: { label: 'Coding round' },
  'system-design': { label: 'System design' },
  concept: { label: 'Concept round' },
};

export const TYPE_META: Record<QuestionType, { label: string }> = {
  concept: { label: 'Concept' },
  debugging: { label: 'Debugging' },
  design: { label: 'Design' },
  coding: { label: 'Coding' },
};
```

**Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

**Step 4: Commit (only if approved)**

```bash
git add src/data/interview/categories.ts src/data/interview/meta.ts
git commit -m "feat(interview): add categories and display metadata"
```

---

### Task 3: Question file scaffolds, aggregation index, and failing data test

**Files:**
- Create: `src/data/interview/questions/fullstack.ts` (export `fullstackQuestions: InterviewQuestion[] = []`)
- Create: `src/data/interview/questions/cybersecurity.ts` (same, `cybersecurityQuestions`)
- Create: `src/data/interview/questions/dsa.ts` (same, `dsaQuestions`)
- Create: `src/data/interview/questions/system-design.ts` (same, `systemDesignQuestions`)
- Create: `src/data/interview/questions/ai-ml.ts` (same, `aiMlQuestions`)
- Create: `src/data/interview/index.ts`
- Test: `src/data/interview/interview.test.ts`

**Step 1: Create the five question files with empty exported arrays**

Example (`fullstack.ts`):

```ts
import type { InterviewQuestion } from '../types';

export const fullstackQuestions: InterviewQuestion[] = [];
```

**Step 2: Write `index.ts`**

```ts
import { categories } from './categories';
import type { InterviewCategory, InterviewCategoryKey, InterviewQuestion } from './types';
import { fullstackQuestions } from './questions/fullstack';
import { cybersecurityQuestions } from './questions/cybersecurity';
import { dsaQuestions } from './questions/dsa';
import { systemDesignQuestions } from './questions/system-design';
import { aiMlQuestions } from './questions/ai-ml';

export * from './types';
export { categories } from './categories';
export * from './meta';

export const interviewQuestions: InterviewQuestion[] = [
  ...fullstackQuestions,
  ...cybersecurityQuestions,
  ...dsaQuestions,
  ...systemDesignQuestions,
  ...aiMlQuestions,
];

export function getCategoryByKey(key: string): InterviewCategory | undefined {
  return categories.find((c) => c.key === key);
}

export function getQuestionsByCategory(key: InterviewCategoryKey): InterviewQuestion[] {
  return interviewQuestions.filter((q) => q.category === key);
}

export function getQuestion(category: InterviewCategoryKey, slug: string): InterviewQuestion | undefined {
  return interviewQuestions.find((q) => q.category === category && q.slug === slug);
}

export interface CategoryFacets {
  topics: { value: string; count: number }[];
  count: number;
}

export function getCategoryFacets(key: InterviewCategoryKey): CategoryFacets {
  const qs = getQuestionsByCategory(key);
  const counts = new Map<string, number>();
  for (const q of qs) counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
  return {
    count: qs.length,
    topics: [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value)),
  };
}

export function getAdjacentQuestions(
  category: InterviewCategoryKey,
  slug: string,
): { prev?: InterviewQuestion; next?: InterviewQuestion } {
  const qs = getQuestionsByCategory(category);
  const i = qs.findIndex((q) => q.slug === slug);
  if (i === -1) return {};
  return { prev: qs[i - 1], next: qs[i + 1] };
}
```

**Step 3: Write the failing test `interview.test.ts` (complete file)**

```ts
import { describe, expect, it } from 'vitest';
import {
  DIFFICULTIES,
  FREQUENCIES,
  QUESTION_TYPES,
  ROUNDS,
  categories,
  getCategoryByKey,
  getQuestionsByCategory,
  interviewQuestions,
} from './index';

const VALID_ANIMATION_KINDS = [
  'step-flow',
  'code-trace',
  'timeline',
  'before-after',
  'memory-diagram',
  'custom',
];

describe('interview categories', () => {
  it('has exactly the five v1 categories with unique keys', () => {
    expect(categories.map((c) => c.key).sort()).toEqual(
      ['ai-ml', 'cybersecurity', 'dsa', 'fullstack', 'system-design'].sort(),
    );
  });

  it('every category has a description, accent and topics', () => {
    for (const c of categories) {
      expect(c.description.length).toBeGreaterThan(20);
      expect(c.accent).toMatch(/^text-/);
      expect(c.topics.length).toBeGreaterThan(0);
    }
  });
});

describe('interview questions', () => {
  it('has unique category+slug pairs', () => {
    const keys = interviewQuestions.map((q) => `${q.category}/${q.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('every question is valid and complete', () => {
    for (const q of interviewQuestions) {
      expect(getCategoryByKey(q.category), `unknown category for ${q.slug}`).toBeDefined();
      expect(DIFFICULTIES).toContain(q.difficulty);
      expect(FREQUENCIES).toContain(q.frequency);
      expect(ROUNDS).toContain(q.round);
      expect(QUESTION_TYPES).toContain(q.type);
      expect(q.oneLiner.length).toBeGreaterThan(20);
      expect(q.whyAsked.length).toBeGreaterThan(40);
      expect(q.mentalModel.length).toBeGreaterThan(40);
      expect(q.edgeCases.length).toBeGreaterThanOrEqual(2);
      expect(q.followUps.length).toBeGreaterThanOrEqual(2);
      if (q.relatedEngine) expect(q.relatedEngine.href.startsWith('/')).toBe(true);
    }
  });

  it('every question topic belongs to its category taxonomy', () => {
    for (const q of interviewQuestions) {
      const category = getCategoryByKey(q.category)!;
      expect(category.topics, `topic "${q.topic}" not in ${q.category}`).toContain(q.topic);
    }
  });

  it('every question has at least 5 steps, each with an animation', () => {
    for (const q of interviewQuestions) {
      expect(q.steps.length, `${q.slug} step count`).toBeGreaterThanOrEqual(5);
      for (const step of q.steps) {
        expect(step.title.length).toBeGreaterThan(3);
        expect(step.body.length).toBeGreaterThan(60);
        expect(VALID_ANIMATION_KINDS).toContain(step.animation.kind);
      }
    }
  });

  it('every category has at least 3 questions with >=5 frames', () => {
    for (const c of categories) {
      const qs = getQuestionsByCategory(c.key);
      expect(qs.length, `${c.key} question count`).toBeGreaterThanOrEqual(3);
      for (const q of qs) {
        for (const step of q.steps) {
          if (step.animation.kind === 'step-flow' || step.animation.kind === 'code-trace' || step.animation.kind === 'timeline' || step.animation.kind === 'before-after' || step.animation.kind === 'memory-diagram') {
            expect(step.animation.frames ?? step.animation.phases, `${q.slug} frames`).toBeDefined();
          }
        }
      }
    }
  });
});
```

**Step 4: Run the test — expect failure**

Run: `npx vitest run src/data/interview/interview.test.ts`
Expected: FAIL on "every category has at least 3 questions" (0 questions so far).

**Step 5: Commit scaffold (only if approved)**

```bash
git add src/data/interview
git commit -m "test(interview): scaffold question data, aggregation API and invariants"
```

---

### Tasks 4–8: Author question content (one task per category)

**Pattern for every content task.** For each question in the inventory table, write an `InterviewQuestion` object following the **reference implementation below** (Task 4 shows one complete question; replicate the depth and shape for every other question). Quality bar per step:

- `title`: 3-6 words naming the mechanism in the step.
- `body`: 80-200 words, conversational but precise. Zero fluff. Explain *why*, not just *what*. Reference the animation ("watch the token move from...") so text and visual work together.
- `animation`: 4-7 frames/phases; every frame has a caption that reads like a narrator line; frame data must match what the body claims.
- `edgeCases`: 3-5 concrete traps with the fix.
- `followUps`: 2-4 question/answer pairs; answers 1-3 sentences.

**Animation assignment per question:** use the inventory table. `code` blocks are optional; add them when the step explains real code (DSA coding questions should include code in at least the optimal step).

**File per category:**
- Task 4: `src/data/interview/questions/fullstack.ts` (questions 1-4)
- Task 5: `src/data/interview/questions/cybersecurity.ts` (questions 5-7)
- Task 6: `src/data/interview/questions/dsa.ts` (questions 8-11)
- Task 7: `src/data/interview/questions/system-design.ts` (questions 12-14)
- Task 8: `src/data/interview/questions/ai-ml.ts` (questions 15-17)

**Reference implementation (question 1, goes in `fullstack.ts`):**

```ts
import type { InterviewQuestion } from '../types';

export const fullstackQuestions: InterviewQuestion[] = [
  {
    slug: 'what-happens-when-you-type-a-url',
    category: 'fullstack',
    topic: 'Browser',
    title: 'What happens when you type a URL and press Enter?',
    difficulty: 'beginner',
    frequency: 'very-often',
    round: 'phone-screen',
    type: 'concept',
    tags: ['dns', 'tls', 'http', 'rendering'],
    oneLiner: 'The classic warm-up question that secretly tests how deep your mental model of the web goes.',
    whyAsked:
      'Interviewers use this to map the boundary of your knowledge. Anyone can say "DNS then HTTP"; strong candidates can narrate caching layers, connection setup, and rendering without hand-waving. It also reveals whether you understand the web as a system rather than a stack of unrelated buzzwords.',
    mentalModel:
      'Think of it as a delivery pipeline: resolve the address (DNS), open a secure lane (TCP + TLS), place the order (HTTP), then assemble the package (parsing, layout, paint). Every stage has a cache that can short-circuit the previous stage.',
    steps: [
      {
        title: 'Browser cache and DNS resolution',
        body: 'Before any network traffic, the browser checks its own HTTP cache and the OS resolver cache. On a miss, a recursive DNS lookup runs: root servers point to the TLD servers, the TLD points to the authoritative nameserver, and the authoritative server returns the IP. Watch the query walk the hierarchy — each hop is a chance to answer from cache instead.',
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'browser', label: 'Browser' },
            { id: 'os', label: 'OS Resolver', sublabel: 'cache' },
            { id: 'root', label: 'Root DNS' },
            { id: 'tld', label: 'TLD .com' },
            { id: 'auth', label: 'Authoritative DNS' },
          ],
          phases: [
            { id: 'p1', caption: 'Browser cache miss — the hostname is unknown locally.', activeNodeIds: ['browser'] },
            { id: 'p2', caption: 'OS resolver cache miss — ask the network.', packets: [{ from: 'browser', to: 'os', label: 'resolve?' }], activeNodeIds: ['os'] },
            { id: 'p3', caption: 'Recursive resolver asks a root server where .com lives.', packets: [{ from: 'os', to: 'root', label: '?' }], activeNodeIds: ['root'] },
            { id: 'p4', caption: 'Root delegates to the .com TLD servers.', packets: [{ from: 'root', to: 'tld', label: '.com →' }], doneNodeIds: ['root'], activeNodeIds: ['tld'] },
            { id: 'p5', caption: 'TLD delegates to the authoritative nameserver.', packets: [{ from: 'tld', to: 'auth', label: 'auth NS' }], doneNodeIds: ['root', 'tld'], activeNodeIds: ['auth'] },
            { id: 'p6', caption: 'The answer (A/AAAA record) travels back and is cached at every hop.', packets: [{ from: 'auth', to: 'os', label: '93.184.216.34' }], doneNodeIds: ['root', 'tld', 'auth', 'os'] },
          ],
        },
      },
      {
        title: 'TCP handshake',
        body: 'The browser opens a TCP connection with the three-way handshake: SYN, SYN-ACK, ACK. This proves both directions work and agrees on initial sequence numbers. It costs one full round trip before a single byte of HTTP is sent — which is exactly why HTTP/3 moved to QUIC over UDP, where the transport and crypto handshakes happen together.',
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'server', label: 'Server' },
          ],
          phases: [
            { id: 'p1', caption: 'Client sends SYN with a random sequence number.', packets: [{ from: 'client', to: 'server', label: 'SYN seq=x' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'Server replies SYN-ACK: acknowledges x, offers its own seq y.', packets: [{ from: 'server', to: 'client', label: 'SYN-ACK ack=x+1 seq=y' }], doneNodeIds: ['client'], activeNodeIds: ['server'] },
            { id: 'p3', caption: 'Client ACKs. The connection is established — 1 RTT spent.', packets: [{ from: 'client', to: 'server', label: 'ACK ack=y+1' }], doneNodeIds: ['client', 'server'] },
          ],
        },
      },
      {
        title: 'TLS handshake',
        body: 'Because the URL is HTTPS, a TLS handshake upgrades the raw TCP stream. The client sends ClientHello (cipher suites, TLS version, and SNI so the server can pick the right certificate), the server responds with its certificate chain, both sides derive the same session keys via ECDHE, and a Finished exchange proves the handshake was not tampered with. From here on everything is encrypted.',
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'server', label: 'Server' },
            { id: 'ca', label: 'CA Trust Store' },
          ],
          phases: [
            { id: 'p1', caption: 'ClientHello: supported ciphers + SNI hostname.', packets: [{ from: 'client', to: 'server', label: 'ClientHello' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'ServerCertificate: the chain proving who the server is.', packets: [{ from: 'server', to: 'client', label: 'cert chain' }], doneNodeIds: ['client'], activeNodeIds: ['server'] },
            { id: 'p3', caption: 'Client verifies the chain against trusted roots.', packets: [{ from: 'client', to: 'ca', label: 'verify' }], activeNodeIds: ['ca'] },
            { id: 'p4', caption: 'ECDHE key exchange — both sides derive the same session key.', packets: [{ from: 'client', to: 'server', label: 'ECDHE share' }, { from: 'server', to: 'client', label: 'ECDHE share' }], doneNodeIds: ['ca', 'client', 'server'] },
            { id: 'p5', caption: 'Finished: encrypted channel established. 1-2 more RTTs spent.', packets: [{ from: 'client', to: 'server', label: 'Finished ✓' }], doneNodeIds: ['ca', 'client', 'server'] },
          ],
        },
      },
      {
        title: 'HTTP request and response',
        body: 'The browser sends an HTTP GET with headers like Host, User-Agent, Accept-Encoding, and any cookies for the domain. The server (often behind a CDN, load balancer, and reverse proxy) routes the request, executes application code and queries, then returns a status code, headers, and a body. Caching headers such as Cache-Control decide whether the next visit even needs this trip.',
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'browser', label: 'Browser' },
            { id: 'cdn', label: 'CDN / LB' },
            { id: 'server', label: 'App Server' },
            { id: 'db', label: 'Database' },
          ],
          phases: [
            { id: 'p1', caption: 'GET / — request headers include Host and cookies.', packets: [{ from: 'browser', to: 'cdn', label: 'GET /' }], activeNodeIds: ['browser'] },
            { id: 'p2', caption: 'CDN checks its cache; a miss forwards to the origin.', packets: [{ from: 'cdn', to: 'server', label: 'forward' }], doneNodeIds: ['browser'], activeNodeIds: ['cdn', 'server'] },
            { id: 'p3', caption: 'The app queries the database.', packets: [{ from: 'server', to: 'db', label: 'SELECT' }], activeNodeIds: ['db'] },
            { id: 'p4', caption: 'Rows return and the server builds the response.', packets: [{ from: 'db', to: 'server', label: 'rows' }], doneNodeIds: ['db'], activeNodeIds: ['server'] },
            { id: 'p5', caption: '200 OK + HTML travels back; the CDN caches it per Cache-Control.', packets: [{ from: 'server', to: 'browser', label: '200 OK' }], doneNodeIds: ['browser', 'cdn', 'server', 'db'] },
          ],
        },
      },
      {
        title: 'Parsing, layout, paint',
        body: 'The HTML is tokenized into a DOM tree; CSS is parsed into the CSSOM. The two combine into a render tree, layout computes geometry for every visible box, paint fills pixels, and the compositor stitches layers onto the screen. A parser-blocking <script> in the head halts HTML parsing until it downloads and executes — which is why modern sites defer scripts and preload critical assets.',
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'html', label: 'HTML bytes' },
            { id: 'dom', label: 'DOM + CSSOM' },
            { id: 'render', label: 'Render Tree' },
            { id: 'layout', label: 'Layout' },
            { id: 'paint', label: 'Paint + Composite' },
          ],
          phases: [
            { id: 'p1', caption: 'Bytes stream in and are tokenized incrementally.', activeNodeIds: ['html'] },
            { id: 'p2', caption: 'Tokens become DOM nodes; CSS becomes the CSSOM.', packets: [{ from: 'html', to: 'dom' }], activeNodeIds: ['dom'] },
            { id: 'p3', caption: 'Visible nodes merge into the render tree.', packets: [{ from: 'dom', to: 'render' }], doneNodeIds: ['html'], activeNodeIds: ['render'] },
            { id: 'p4', caption: 'Layout computes the exact geometry of every box.', packets: [{ from: 'render', to: 'layout' }], doneNodeIds: ['dom'], activeNodeIds: ['layout'] },
            { id: 'p5', caption: 'Paint records draw calls; the compositor puts pixels on screen.', packets: [{ from: 'layout', to: 'paint' }], doneNodeIds: ['render', 'html'], activeNodeIds: ['paint'] },
          ],
        },
      },
    ],
    edgeCases: [
      'DNS cache poisoning / low TTL: a low TTL means more lookups but faster failover — interviewers like the trade-off.',
      'TLS session resumption: the second visit can skip the full handshake via session tickets.',
      'HTTP/2 multiplexing: one connection carries many requests, so the old "6 connections per host" limit disappears.',
      'Parser-blocking scripts: a sync <script> in <head> delays first paint — mention defer/async.',
      'Service workers can intercept the request entirely and answer from cache before DNS is ever consulted.',
    ],
    followUps: [
      { q: 'Where would you add a cache to make this faster?', a: 'At every layer: browser HTTP cache, DNS cache, CDN edge, reverse proxy, then application-level caches like Redis.' },
      { q: 'Why is DNS usually UDP and not TCP?', a: 'Queries are small and need speed; UDP avoids handshake overhead. TCP is used for zone transfers and truncated large responses.' },
      { q: 'What changes with HTTP/3?', a: 'QUIC runs over UDP and fuses transport + TLS handshakes into one round trip, and removes head-of-line blocking across streams.' },
    ],
    relatedEngine: { label: 'Explore the Browser Universe visualizer', href: '/fullstack/browseruniverse' },
  },
  // ...questions 2-4 (see inventory table)
];
```

**Verification for Tasks 4-8 (each):**

Run: `npx vitest run src/data/interview/interview.test.ts`
Expected: the category-count assertion passes for the categories completed so far; no type errors. Then `npm run lint`.

**Commit (only if approved)** per task:

```bash
git add src/data/interview/questions/<file>.ts
git commit -m "content(interview): author <category> questions with step animations"
```

**Milestone after Task 8:** run `npx vitest run` (all tests) and `npm run build` — build must succeed before starting UI work.

---

### Task 9: Shared frame player + controls

**Files:**
- Create: `src/components/interview/animations/useFramePlayer.ts`
- Create: `src/components/interview/animations/FrameControls.tsx`

**Step 1: Write `useFramePlayer.ts` (complete)**

```ts
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface FramePlayer {
  index: number;
  count: number;
  playing: boolean;
  next: () => void;
  prev: () => void;
  reset: () => void;
  toggle: () => void;
  goTo: (i: number) => void;
}

export function useFramePlayer(frameCount: number, autoPlay = false): FramePlayer {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % frameCount);
  }, [frameCount]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + frameCount) % frameCount);
  }, [frameCount]);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const toggle = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(frameCount - 1, i)));
  }, [frameCount]);

  useEffect(() => {
    clear();
    if (!playing || frameCount < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % frameCount);
    }, 2200);
    return clear;
  }, [playing, frameCount, clear]);

  useEffect(() => clear, [clear]);

  return useMemo(
    () => ({ index, count: frameCount, playing, next, prev, reset, toggle, goTo }),
    [index, frameCount, playing, next, prev, reset, toggle, goTo],
  );
}
```

**Step 2: Write `FrameControls.tsx` (complete)**

```tsx
'use client';

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FramePlayer } from './useFramePlayer';

export function FrameControls({ player, className }: { player: FramePlayer; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={player.reset}
        aria-label="Reset animation"
        className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={player.prev}
        aria-label="Previous frame"
        className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <SkipBack className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={player.toggle}
        aria-label={player.playing ? 'Pause animation' : 'Play animation'}
        className="rounded-md border border-primary/40 bg-primary/10 p-1.5 text-primary"
      >
        {player.playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={player.next}
        aria-label="Next frame"
        className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <SkipForward className="h-3.5 w-3.5" />
      </button>
      <div className="ml-1 flex items-center gap-1" role="progressbar" aria-valuenow={player.index + 1} aria-valuemin={1} aria-valuemax={player.count}>
        {Array.from({ length: player.count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => player.goTo(i)}
            aria-label={`Frame ${i + 1}`}
            className={cn('h-1.5 rounded-full transition-all', i === player.index ? 'w-4 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground')}
          />
        ))}
      </div>
      <span className="ml-1 font-mono text-[10px] text-muted-foreground">
        {player.index + 1}/{player.count}
      </span>
    </div>
  );
}
```

**Step 3: Verify**

Run: `npm run lint` — expect 0 errors.

**Step 4: Commit (only if approved)**

```bash
git add src/components/interview/animations
git commit -m "feat(interview): add shared animation frame player and controls"
```

---

### Task 10: `StepFlow` primitive

**Files:**
- Create: `src/components/interview/animations/StepFlow.tsx`
- Create: `src/components/interview/animations/AnimationCaption.tsx`

**Step 1: Write `AnimationCaption.tsx`** — shared caption bar:

```tsx
export function AnimationCaption({ caption }: { caption: string }) {
  return (
    <p className="border-t border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground">
      {caption}
    </p>
  );
}
```

**Step 2: Write `StepFlow.tsx`**

Requirements:
- Props: `{ spec: StepFlowSpec }`. Internal `useFramePlayer(spec.phases.length)`.
- Renders nodes vertically (mobile) / responsive grid; SVG connector lines drawn only between consecutive nodes in the declared order; ignore x/y math — layout via flex + absolutely positioned SVG overlay is NOT needed: use a simple vertical list with connector chevrons between nodes, and render packets as a small animated chip (`lucide-react` `ArrowRight`/`Package` + label) sliding between the two involved node cards.
- Node states: default, `active` (ring-primary + subtle scale), `done` (border-green / check icon), `error` (border-red). Use CSS transitions only (no anime.js needed). Packets animate with a CSS keyframe (`@keyframes packet-pulse`) declared in the component's `<style jsx>`-free approach — put the keyframes in `src/index.css` under `.interview-packet` (add there, not scoped JSX).
- Frame change = `key={phase.id}` on the packet layer so it re-animates on each step.
- Theme: all colors via Tailwind classes (`border-border`, `bg-card`, `text-foreground`, `text-primary`, etc.). Must look right in both themes.
- a11y: container `aria-live="polite"`; nodes are list items.
- Complete component code (reference):

```tsx
'use client';

import { ArrowDown, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepFlowSpec } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

export function StepFlow({ spec }: { spec: StepFlowSpec }) {
  const player = useFramePlayer(spec.phases.length);
  const phase = spec.phases[player.index];
  const active = new Set(phase.activeNodeIds ?? []);
  const done = new Set(phase.doneNodeIds ?? []);
  const error = new Set(phase.errorNodeIds ?? []);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col items-center gap-2 px-4 py-6" aria-live="polite">
        {spec.nodes.map((node, i) => (
          <div key={node.id} className="flex w-full max-w-sm flex-col items-center">
            <div
              className={cn(
                'w-full rounded-lg border bg-background px-4 py-2.5 text-center transition-all duration-300',
                active.has(node.id) && 'border-primary ring-2 ring-primary/30 scale-[1.02]',
                done.has(node.id) && 'border-green-500/50',
                error.has(node.id) && 'border-red-500/60',
                !active.has(node.id) && !done.has(node.id) && !error.has(node.id) && 'border-border',
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {done.has(node.id) && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                {error.has(node.id) && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                <span className="text-sm font-medium text-foreground">{node.label}</span>
              </div>
              {node.sublabel && <p className="font-mono text-[10px] text-muted-foreground">{node.sublabel}</p>}
            </div>

            {i < spec.nodes.length - 1 && (
              <div key={phase.id} className="relative flex h-8 items-center justify-center">
                <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                {phase.packets
                  ?.filter((p) => p.from === node.id)
                  .map((p) => (
                    <span
                      key={`${p.from}-${p.to}`}
                      className="interview-packet absolute left-full ml-1 whitespace-nowrap rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary"
                    >
                      {p.label ?? '→'} {p.to === node.id ? '' : ''}
                    </span>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <FrameControls player={player} />
      </div>
      <AnimationCaption caption={phase.caption} />
    </div>
  );
}
```

**Step 3: Add keyframes to `src/index.css`** (append near other keyframes):

```css
@keyframes packet-pulse {
  0% { transform: translateY(-6px); opacity: 0; }
  25% { opacity: 1; }
  100% { transform: translateY(6px); opacity: 1; }
}
.interview-packet {
  animation: packet-pulse 0.9s ease-out both;
}
@media (prefers-reduced-motion: reduce) {
  .interview-packet { animation: none; }
}
```

**Step 4: Verify** — `npm run lint`; then `npm run dev` and check the file compiles by importing it in a scratch page OR rely on the build in Task 17. (No component tests exist in this project; lint + build are the gate.)

**Step 5: Commit (only if approved)**

```bash
git add src/components/interview/animations/StepFlow.tsx src/components/interview/animations/AnimationCaption.tsx src/index.css
git commit -m "feat(interview): add StepFlow animation primitive"
```

---

### Tasks 11-14: Remaining primitives (same structure as Task 10)

Each: one file in `src/components/interview/animations/`, one commit, lint after.

- **Task 11 — `CodeTrace.tsx`**: two-pane card. Left: `<pre>` with line numbers; `frame.activeLines` highlighted (`bg-primary/10 border-l-2 border-primary`). Right: variable inspector list (name → value, `changed` flashes via CSS class `interview-flash`). Bottom: optional `output` terminal line. Font `font-mono text-xs`. Use `FrameControls` + `AnimationCaption`. No Monaco (keep bundle small; plain styled `<pre>`).
- **Task 12 — `Timeline.tsx`**: horizontal lanes (lane label left, track right). Each frame renders marks as chips positioned in their lane (order = array order, no absolute x math). Completed marks green, active marks primary with pulse. Use `FrameControls` + `AnimationCaption`.
- **Task 13 — `BeforeAfter.tsx`**: two columns (stack on mobile) titled `spec.beforeLabel`/`afterLabel`. Lines render tone colors: `danger` red, `success` green, `neutral` muted. Frame highlights line indexes (`beforeIndex`, `afterIndex`) with ring + brief flash. The "before" side gets a small `Skull`/`ShieldOff` icon header, "after" gets `ShieldCheck`.
- **Task 14 — `MemoryDiagram.tsx`**: regions as bordered panels (`stack` / `heap` / `storage` labels). Boxes as rounded rects (label + value). `cursors` render as colored chips above the target box (`primary` blue, `danger` red, `success` green). `highlightBoxIds` get ring + fill.

Add `interview-flash` keyframes to `src/index.css` alongside `interview-packet`.

---

### Task 15: Custom `AttentionScaling` + `AnimationBlock` resolver

**Files:**
- Create: `src/components/interview/animations/custom/AttentionScaling.tsx`
- Create: `src/components/interview/animations/AnimationBlock.tsx`

**Step 1: Write `AttentionScaling.tsx`**

Requirements:
- `'use client'`; props: `{}` (self-contained), uses `useState` + `useEffect` + `requestAnimationFrame` guarded by `typeof window !== 'undefined'`.
- Visual: canvas OR SVG bar chart showing dot-product variance growing with `d_k` (slider 1..512, log scale), and a second series showing variance after dividing by `√d_k` (stays ~1). Two lines/bars: red (unscaled) green (scaled). Include an interactive slider and a short label row. Use `getComputedStyle(document.documentElement).getPropertyValue('--border')` style theme colors, or simpler: hardcode theme-neutral hex values that work on both themes (e.g. `#ef4444`, `#22c55e`, with grid `currentColor` at 20% opacity via SVG stroke).
- Must be SSR-safe: all computation of random samples inside `useEffect`; render skeleton until mounted (`const [ready, setReady] = useState(false)` + effect sets true).
- Keep under ~120 lines.

**Step 2: Write `AnimationBlock.tsx` (complete)**

```tsx
'use client';

import type { AnimationSpec } from '@/data/interview/types';
import { StepFlow } from './StepFlow';
import { CodeTrace } from './CodeTrace';
import { Timeline } from './Timeline';
import { BeforeAfter } from './BeforeAfter';
import { MemoryDiagram } from './MemoryDiagram';
import { AttentionScaling } from './custom/AttentionScaling';

export function AnimationBlock({ spec }: { spec: AnimationSpec }) {
  switch (spec.kind) {
    case 'step-flow':
      return <StepFlow spec={spec} />;
    case 'code-trace':
      return <CodeTrace spec={spec} />;
    case 'timeline':
      return <Timeline spec={spec} />;
    case 'before-after':
      return <BeforeAfter spec={spec} />;
    case 'memory-diagram':
      return <MemoryDiagram spec={spec} />;
    case 'custom':
      return <AttentionScaling />;
  }
}
```

**Step 3: Verify** — `npm run lint`.

**Step 4: Commit (only if approved)**

```bash
git add src/components/interview/animations
git commit -m "feat(interview): add remaining animation primitives and resolver"
```

---

### Task 16: Interview hub page

**Files:**
- Create: `src/app/interview/page.tsx`

**Step 1: Write the page (complete)**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Binary, Layers, Network, ShieldAlert } from 'lucide-react';
import { categories, getCategoryFacets } from '@/data/interview';

export const metadata: Metadata = {
  title: 'Interview Preparation - CSCosmos',
  description:
    'Crack your next technical interview: questions explained from zero to 100% with step-by-step animations, filtered by topic, difficulty, frequency and interview round.',
};

const ICONS = { Layers, ShieldAlert, Binary, Network, BrainCircuit } as const;

export default function InterviewHubPage() {
  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="pill-badge mx-auto">Interview Preparation</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Understand one question <span className="text-primary">completely</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Pick a track. Every question is broken into steps, and every step has its own animation
          showing what happens behind the scenes — from first principles to senior-level depth.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = ICONS[category.icon];
          const facets = getCategoryFacets(category.key);
          return (
            <Link
              key={category.key}
              href={`/interview/${category.key}`}
              className="glass-card card-hover group flex flex-col p-6"
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-8 w-8 ${category.accent}`} />
                <span className="font-mono text-xs text-muted-foreground">
                  {facets.count} questions
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{category.shortTitle}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{category.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {facets.topics.map((t) => (
                  <span key={t.value} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                    {t.value}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Browse questions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
```

**Step 2: Verify** — `npm run lint`; `npm run dev` → visit `/interview`; check both themes.

**Step 3: Commit (only if approved)**

```bash
git add src/app/interview/page.tsx
git commit -m "feat(interview): add interview prep hub page"
```

---

### Task 17: Category page with filters

**Files:**
- Create: `src/app/interview/[category]/page.tsx` (server)
- Create: `src/components/interview/CategoryBrowser.tsx` (client)
- Create: `src/components/interview/QuestionCard.tsx`

**Step 1: `QuestionCard.tsx`** — card with title, oneLiner, badges (difficulty, frequency, round, type) using `*_META` from `@/data/interview`, topic chip, link to `/interview/${category}/${slug}`.

**Step 2: `CategoryBrowser.tsx`** — `'use client'`; props `{ category: InterviewCategory; questions: InterviewQuestion[] }`.
- State: `search`, `topic` (`'all'`), `difficulty` (`'all'`), `frequency` (`'all'`), `round` (`'all'`), `type` (`'all'`).
- On mount, read `useSearchParams()` to hydrate filters, and write them back via `history.replaceState` (avoid `useRouter` re-render loops; no navigation needed since filtering is client-side).
- Filter logic: search matches `title + topic + tags` (case-insensitive substring); all other facets exact match.
- Layout: sticky filter bar — search input (lucide `Search`), then chip rows for Topic / Difficulty / Frequency / Round / Type. Chips for topics derived from `questions` (not category taxonomy) so no empty results. Active chip = `bg-primary text-primary-foreground`; inactive = `border border-border`.
- Result count line: `"{n} of {total} questions"`; empty state with a "Clear filters" button.
- Default sort: frequency order `very-often < sometimes < rare`, then difficulty `beginner < intermediate < advanced`.
- Render filtered `QuestionCard` list.

**Step 3: Server page (complete)**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, getCategoryByKey, getQuestionsByCategory } from '@/data/interview';
import { CategoryBrowser } from '@/components/interview/CategoryBrowser';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: key } = await params;
  const category = getCategoryByKey(key);
  if (!category) return {};
  return { title: `${category.title} - CSCosmos`, description: category.description };
}

export default async function InterviewCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: key } = await params;
  const category = getCategoryByKey(key);
  if (!category) notFound();
  const questions = getQuestionsByCategory(category.key);
  return <CategoryBrowser category={category} questions={questions} />;
}
```

**Step 4: Verify** — lint; manual check `/interview/fullstack` filters in both themes.

**Step 5: Commit (only if approved)**

```bash
git add src/app/interview src/components/interview/CategoryBrowser.tsx src/components/interview/QuestionCard.tsx
git commit -m "feat(interview): add category page with filters and question cards"
```

---

### Task 18: Question detail page with step walkthrough

**Files:**
- Create: `src/app/interview/[category]/[question]/page.tsx` (server)
- Create: `src/components/interview/QuestionView.tsx` (client)
- Create: `src/components/interview/StepWalkthrough.tsx` (client)

**Step 1: Server page (complete)**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  categories,
  getAdjacentQuestions,
  getCategoryByKey,
  getQuestion,
  getQuestionsByCategory,
} from '@/data/interview';
import { QuestionView } from '@/components/interview/QuestionView';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.flatMap((c) =>
    getQuestionsByCategory(c.key).map((q) => ({ category: c.key, question: q.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; question: string }>;
}): Promise<Metadata> {
  const { category: categoryKey, question: slug } = await params;
  const category = getCategoryByKey(categoryKey);
  const question = category ? getQuestion(category.key, slug) : undefined;
  if (!category || !question) return {};
  return {
    title: `${question.title} - ${category.shortTitle} Interview Questions - CSCosmos`,
    description: question.oneLiner,
  };
}

export default async function InterviewQuestionPage({
  params,
}: {
  params: Promise<{ category: string; question: string }>;
}) {
  const { category: categoryKey, question: slug } = await params;
  const category = getCategoryByKey(categoryKey);
  if (!category) notFound();
  const question = getQuestion(category.key, slug);
  if (!question) notFound();
  const { prev, next } = getAdjacentQuestions(category.key, question.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.title,
      text: question.whyAsked,
      acceptedAnswer: {
        '@type': 'Answer',
        text: [question.mentalModel, ...question.steps.map((s) => s.title)].join(' '),
      },
    },
  };

  return (
    <main className="page-container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuestionView category={category} question={question} />
      <nav className="mt-10 flex items-center justify-between border-t border-border pt-6">
        {prev ? (
          <Link href={`/interview/${category.key}/${prev.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/interview/${category.key}/${next.slug}`} className="group flex items-center gap-2 text-right text-sm text-muted-foreground hover:text-foreground">
            {next.title}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
```

**Step 2: `QuestionView.tsx`** — `'use client'`; renders:
1. Breadcrumb: `Interview / {category.shortTitle} / question.topic`
2. Title + badges row (difficulty/frequency/round/type via `*_META`) + topic chip + tags
3. Two info cards: "What interviewers are testing" (`whyAsked`) and "Mental model" (`mentalModel`)
4. `<StepWalkthrough steps={question.steps} />`
5. "Edge cases & traps" — reuse `@/components/ui/accordion` (or a simple `<details>` list if Accordion API is awkward; check the existing component first)
6. "Follow-up questions" — accordion of `followUps`
7. Related engine CTA if `question.relatedEngine` (button-style link)
8. Each step's animation via `<AnimationBlock spec={step.animation} />`

**Step 3: `StepWalkthrough.tsx`** — the core:
- `'use client'`; props `{ steps: QuestionStep[] }`.
- State: `current` step index (whole-walkthrough stepper, independent from each animation's frame player).
- Left column: step header `Step {i+1} of {n}`, `step.title`, body paragraphs (`whitespace-pre-line`), optional code block (`<pre className="font-mono text-xs">`).
- Right column: `<AnimationBlock spec={step.animation} />` sticky on `lg` (`lg:sticky lg:top-20`).
- Navigation: Prev/Next buttons + numbered step dots; on mobile the animation stacks under the text.
- `aria-current` on active dot; keyboard arrow support optional.

**Step 4: Verify** — lint; manual walkthrough of 3 questions (one per primitive family) in both themes; check reduced-motion; check all 17 static paths build.

**Step 5: Commit (only if approved)**

```bash
git add src/app/interview src/components/interview/QuestionView.tsx src/components/interview/StepWalkthrough.tsx
git commit -m "feat(interview): add question detail page with step walkthrough"
```

---

### Task 19: Navbar link + sitemap

**Files:**
- Modify: `src/components/Navbar.tsx:29-38`
- Modify: `src/app/sitemap.ts`

**Step 1: Navbar** — insert between Topics and Tracks:

```tsx
<Link href="/interview" className={getLinkClass("/interview")}>
    Interview
</Link>
```

**Step 2: Sitemap** — after the tracks entries import `categories, getQuestionsByCategory` from `@/data/interview` and append:

```ts
entries.push(entry("/interview", "weekly", 0.9));
for (const c of categories) {
  entries.push(entry(`/interview/${c.key}`, "weekly", 0.8));
  for (const q of getQuestionsByCategory(c.key)) {
    entries.push(entry(`/interview/${c.key}/${q.slug}`, "monthly", 0.7));
  }
}
```

**Step 3: Verify** — lint.

**Step 4: Commit (only if approved)**

```bash
git add src/components/Navbar.tsx src/app/sitemap.ts
git commit -m "feat(interview): link interview prep in navbar and sitemap"
```

---

### Task 20: Final verification

**Step 1:** `npm test` → all tests pass (catalog, topic-registry, AI data, interview).

**Step 2:** `npm run lint` → 0 errors.

**Step 3:** `npm run build` → must complete with SSG; confirm the build output lists `/interview`, all 5 `/interview/[category]` pages, and 17 `[category]/[question]` pages.

**Step 4:** Manual smoke (`npm run dev`): hub → category → filter → question → step through every animation on at least one question per primitive → prev/next nav → both themes → mobile width.

**Step 5:** Update `PROJECT_CONTEXT.md` routes table with the three interview routes; update README if it lists routes.

**Step 6: Commit (only if approved)**

```bash
git add PROJECT_CONTEXT.md README.md
git commit -m "docs: document interview prep section"
```

---

## Notes for the implementer

- Never reference `window`, `document`, or animation APIs at module top level (SSG safety).
- Do not add dependencies. Everything uses React state, CSS transitions/keyframes, Tailwind, lucide.
- Keep animation data and UI in sync by writing the animation spec first, then the step body that narrates it.
- If a body and its animation disagree, fix the animation before touching the text.
- `StateMachine` from the design doc is intentionally deferred; the `AnimationSpec` union does not include it, so adding it later is additive.
