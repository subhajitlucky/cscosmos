# CSCosmos — Full Stack Domain Audit

**Date:** 2026-10-18
**Scope:** all 33 topics in the `fullstack` domain (`src/data/topics.ts` ids 1–33) — 32 `active`, 1 `coming-soon`
**Subject:** the 32 absorbed visualizer engines behind those topics, their routes, SSG pre-rendering, theming, and pedagogical uniqueness
**Commit:** `cf17ccf` (branch `main`, clean tree at audit start)

---

## Method & confidence

| Layer | How it was produced |
|:---|:---|
| Catalog & route wiring | Direct inspection of `src/data/topics.ts`, `next.config.ts`, `src/app/**`, and the built `.next` output |
| Build/lint gate | `npm run lint` and `npm run build` executed on this commit |
| Per-engine review | 32 engines reviewed by 16 paired domain-group agents (each engine's route, home page, main labs, data and theming files); raw per-engine reports in `scratch/audit/<slug>.md` |
| Independent verification | The systemic and highest-severity claims were re-checked by hand against source and built output. Findings are labelled **[verified]** or **[reported]** accordingly. |

**Confidence note:** per-engine review is useful but not uniformly calibrated — two claims it made ("byte-identical `Home.tsx`" in lldcosmos/microservicesviz, and a systemic contrast bug) were re-tested here; the clone claim was **overstated** (see §3.6 for measured similarity). Treat individual per-engine defect severities as leads, and the **[verified]** findings as fact.

---

## 1. Bottom line

The full stack domain is **broad but uneven**. Its catalog and routing layer is sound and the build is green, but the interactive layer that the product's whole pitch rests on is frequently inert, and the light theme is broken or marginal across most of the domain.

- **32 active engines · 56 high / 139 medium / 69 low** findings reported by per-engine review.
- **Verdicts:** 1 solid · 28 needs-work · 3 shallow.
- **Theming:** 8 ok · 19 partial · 5 broken.
- **Lint/build:** `npm run lint` = **0 errors**, 45 warnings (all `no-explicit-any`); `npm run build` = **exit 0**, 1,982 static pages.
- **Catalog integrity:** 33/33 fullstack topics resolve to a real route; the one `coming-soon` topic correctly renders the in-development page.

The three findings that matter most:

1. **The "run my code" promise is largely unfulfilled.** At least **9 engines** ship an execute/compile/run control that never runs the learner's input — it substring-matches the text, sleeps, and prints canned output. One of these (`nodecosmos`) was verified line by line.
2. **The light theme is the weak mode.** ~12 engines render invisible or near-invisible content in light mode: `text-white` (or a `-200`/`-300` tint) over a surface that resolves to white, or `bg-primary` where `--primary` resolves near-white. Verified on `lldcosmos`.
3. **A whole class of Tailwind classes generates no CSS at all.** Opacity modifiers applied to arbitrary `var()` colours (`bg-[var(--x-bg)]/80`) emit zero rules — **98 usages across 6 engines**, plus 59 undefined token classes in `browseruniverse`. Verified in the compiled CSS.

---

## 2. Catalog & wiring — verified healthy

- **Topic count:** 245 catalog entries; **33 fullstack** (ids 1–33), 32 `active`, 1 `coming-soon` (`testing-and-quality-engineering-tdd-bdd-property-based`).
- **Canonical URL scheme works as designed.** Every topic's `url` is `/<domain>/<slug>`. `next.config.ts` installs **150 `beforeFiles` rewrites** (`/fullstack/program-cosmos` → `/program-cosmos`, the real engine) and **141 redirects** (`/program-cosmos` → `/fullstack/program-cosmos`, 308). Both are present in `.next/routes-manifest.json`, so the "LIVE" badge on a topic card leads to the real visualizer, not a placeholder. **[verified]**
- **One alias is wired:** `dockercosmos` is cross-listed into `devops`; rewrites are generated for the alias too.
- **SSG at module scope is clean.** A mechanical sweep for module-top-level `window`/`document` across all 32 engines returned 2 hits, and **both are false positives** — teaching snippets inside template strings (`tsviz/content/concept-content.ts:329`, `authviz/components/SessionVsTokenVisualizer.tsx:92`). No engine violates AGENTS.md rule 1 at module scope. **[verified]**
- **Sitemap** is generated at `src/app/sitemap.ts` (not a static file) and emits canonical `/<domain>/<slug>` URLs. `public/robots.txt` points at `/sitemap.xml`, which the route serves — so the README's claim of a `public/sitemap.xml` is stale, but the behaviour is correct.
- **Docs housekeeping:** `README.md` route list (lines 127–134) names 8 of the 70 catch-all routes; `public/llms.txt` says "244 modules" against a catalog of 245.

---

## 3. Systemic findings

### 3.1 Fake execution — the flagship interactions do not run learner input ★ most damaging

Nine engines present an editor plus a Run/Compile/Execute control whose output is predetermined. This is the single largest gap between what the UI claims and what it does, and it is exactly the "explaining its core subject" contract in AGENTS.md §5 that fails.

| Engine | Where | What actually happens |
|:---|:---|:---|
| `nodecosmos` | `components/NodePlayground.tsx:35` | `handleRun` branches on `code.includes('nextTick') && code.includes('Promise')` and pushes canned log lines; reported exec time is `Math.random()` (:51) **[verified]** |
| `golangviz` | `components/LiveGoRunner.tsx:158`, `app/labs/page.tsx:30` | "Run Program" prints the preset's `expectedOutput` and claims "Go 1.24+ Compiler Runtime" / "Exit Code: 0"; `runTests()` sleeps 600 ms then prints hardcoded PASS |
| `reactcosmos` | `pages/topics/TopicWrapper.tsx:38` | "Execute Code" only flips `isExecuting` for 2 s; no `eval`/`new Function` anywhere in the 59-file engine |
| `nextjscosmos` | `components/concept-layout.tsx:89` | `isExecuting` is spread into all 33 visualizers but no visualizer reads it (0 grep hits) |
| `sveltecosmos` | `pages/CompilerLab.tsx:139-144` | Editable `Component.svelte` textarea; all three compiler outputs are hardcoded constants |
| `sqlcosmos` | `components/SqlPlayground.tsx:42-73` | "In-Browser Relational Engine" only substring-matches table names; the preset `WHERE role = 'developer'` returns all 4 rows including `admin` |
| `redisviz` | `components/visualizers/ClusterSimulator.tsx:13-19` | `getHashSlot` is labelled "CRC16" but is a 31-multiplier Java string hash, contradicting the CRC16 lesson at `Cluster.tsx:66` |
| `aicosmos` | `pages/RagLab.tsx:30` | Dense and hybrid retrieval return hardcoded arrays; the synthesized answer is a constant; "Re-Rank Score" is derived from list index |
| `tailwindcosmos` | `pages/Playground.tsx:120` | The "real-time" class editor cannot generate new utilities — `tailwind.config.js:4-7` scans build-time literals, so an unseen class like `gap-7` produces no CSS |

### 3.2 Light-mode invisibility ★ verified

The pattern repeats: a fixed white/near-white foreground over a background that resolves light in light mode.

- **Verified:** `lldcosmos/pages/SolidLab.tsx:262` renders violation code as `text-rose-200` over `--lld-surface`, which `styles.css:37` sets to **`#ffffff`** in light mode (vs `#0d1222` at :14) — ≈1.3:1 contrast. Same file family: `PatternsLab.tsx:227` (`text-white` on `--lld-bg` = `#f8fafc`), `PatternsLab.tsx:122`.
- **Reported, same pattern:** `microservicesviz` `SagaLab.tsx:165` / `CircuitLab.tsx:114`; `fastapicosmos` `DiGraph.tsx:137` (`text-white` on `bg-emerald-500/10` ≈ `#e8f8f2`); `synccosmos` `CrdtLab.tsx:188`; `redisviz` `Architecture.tsx:60-64` (SVG `fill-white` inside `fill-background` rects); `jsviz` `Problem.jsx:88` (white-on-white title); `mongocosmos` `Playground.tsx:98` (black-on-black, inverse case); `css-cosmos` `Home.tsx:44,49`; `webprotocols` `Home.tsx:52`; `xrcosmos` `HandTracker.tsx:155` (1.20:1).
- **The inverse case in dark mode:** `aicosmos/styles.css:4` sets `--ai-primary: hsl(var(--foreground))`, which is near-white in dark mode, while the CTA label is `text-white` (`pages/Home.tsx:106`) — so the primary call-to-action is illegible for **every first-time visitor**, since dark is the default theme.

### 3.3 Dead CSS: opacity modifiers on `var()` colours ★ verified

Tailwind v3 generates `bg-[var(--twc-bg)]` but **not** `bg-[var(--twc-bg)]/80`. Confirmed against the compiled output: the only `bg-base`/`bg-base\/60|70|80|90` rules in the entire bundle come from a single **light-mode-scoped** block, and no `/80` class of any `var()` colour is emitted.

| Engine | Usages | Consequence |
|:---|--:|:---|
| `tailwindcosmos` | 14 | `components/Navbar.tsx:21` is the sticky header's **only** background class → transparent header, content bleeds through **[verified]** |
| `mqviz` | 25 | `components/Navbar.tsx:21` — same |
| `wasmcosmos` | 18 | `components/Navbar.tsx:21` — same, 35 dead utility classes in all |
| `xrcosmos` | 16 | — |
| `lldcosmos` | 13 | — |
| `synccosmos` | 12 | — |
| `browseruniverse` | 39 + 20 | `bg-base/60|70|80|90` (39) plus `text-accentSoft` (20) — `base` and `accentSoft` are not colours in `tailwind.config.js`, so the navbar, hero panels and toolbar render transparent in dark mode (the default); `text-accentSoft` emits nothing in **either** mode **[verified]** |

### 3.4 Teaching content that is wrong or unreachable

Worse than an inert control is a confident wrong answer.

- `xrcosmos` `SpatialLab.tsx:236`: the "4×4 Model Transform Matrix (M = T × R × S)" is not a valid rotation matrix (mixes `cY/sY` with `cX/sX`) and omits scale and rotZ — it teaches incorrect math. `SpatialLab.tsx:220`: Cube/Torus/Pyramid all render the identical rounded `div`; `Home.tsx:106`: `perspective-[600px]` is not a Tailwind v3 class, so both 3D viewports render flat and the Z-depth sliders do nothing.
- `css-cosmos` `CssSpecificityCalculator.tsx:21-23`: the ":where() Reset (0 Specificity)" button computes `(0,0,4,1)` for `:where(.card, .modal) > p.text`; `SelectorsLab.tsx:19-27` counts class/id names as element selectors (`.card .title` → `(0,2,2)`); `CssChallengeArena.tsx:70-82` grades `flex-direction` on a challenge whose solution and controls ignore it.
- `systemdesignviz` `ConsistentHashingVisualizer.tsx:25`: key→server targets are hardcoded and never recomputed, so after "Remove Server" the ring still maps a key to the deleted server — inverting the minimal-remapping lesson.
- `webprotocols`: the HTTPS/TLS lesson is declared `visualizationType: 'validation'`, so it displays the ETag/304 caching animation instead of a handshake; and large authored content (every `analogy`, `syntax`, request/response `example`, and `subItems` list) is never rendered because `TopicLesson.tsx:70-84` only reads `definition` and `detailedSections`.
- `mongocosmos` `pages/TopicDetail.tsx:15-31`: only `btree` has a visualizer — the other 9 topics render a "Diagnostic_Sim_Loading" placeholder, with an identical hardcoded tradeoffs array on every page.

### 3.5 Broken routes & content that never ships

- `golangviz` `components/footer.tsx:7`: footer hrefs lost their `/golangviz` prefix (`/playground`, `/path#roadmap`, `/#start`, `/concepts/introduction-to-go`) — each resolves to `[domain]` and 404s.
- `authviz` `pages/Flashcards.tsx:44`: the "Authorization & Access Control" chip filters to 0 cards → `currentCard` undefined → render throws, and there is no `error.tsx` in `src/app`.
- `html-cosmos` `src/app/html-cosmos/[[...slug]]/page.tsx:21-23`: `generateStaticParams` emits only `problems/1-3` while `ProblemList.jsx:55` links all 50 problems — 47 challenge routes are never pre-rendered.
- `dockercosmos` `pages/Concepts.tsx:29`: filter tabs `k8s-advanced` and `security` match zero `DOCKER_TOPICS` entries and there is no empty state, so clicking them renders a blank curriculum.
- `apiviz`: all 15 topics are pre-rendered even though `pages/LearningPath.tsx:55,60` marks 8 as LOCKED (grayscale, `href="#"`) — the locked lessons are fully reachable.
- `crossplatformviz` `pages/BridgeSim.tsx:124`: the headline "Gesture Sample Frequency" slider only feeds `sentPackets`, a field rendered nowhere, so 30–120 Hz changes nothing visible.

### 3.6 Template cloning — an AGENTS.md §5 violation

AGENTS.md states plainly: *"Every topic MUST have its own unique page set, learning method, interactions, and tools. Sameness across topics is a bug, not a virtue."* Several sibling pairs are shared templates with names swapped.

- **`lldcosmos` ↔ `microservicesviz`** — measured with a normalised diff (engine names and numerals stripped): `components/Navbar.tsx` **~94%** identical (97/103 lines), `components/Footer.tsx` **~82%**, `pages/About.tsx` **~80%**, `pages/Home.tsx` **~50%**. **[verified — note the per-engine review called Home.tsx "byte-identical", which is false; the raw diff is 421 lines. The chrome files are the genuine clones.]**
- `vuecosmos`: `pages/Topic.tsx:244` shows the same state→track→effect diagram for **51 of 52** topics; `Topic.tsx:93` gives **49 of 52** topics an identical definition, analogy, five steps and three mistakes (`data/topics.ts:132-158` has only 3 real entries).
- `reactcosmos`: 35 of 36 topic pages repeat one layout and one interaction; all 10 `components/visualizers/specific` files have **0 `useState` and 0 `onClick`**; all 35 pages render the same three hardcoded takeaways, discarding the per-topic `takeaways`/`commonPitfall` in `data/topics.ts`.
- `apiviz` `pages/TopicDetail.tsx:16-75`: an identical trace for every topic (only `topic.name` and `topic.slug` change) with the same 2 hardcoded tradeoff bullets in all 15 pre-rendered pages.
- `mongocosmos`: 9 of 10 topics are placeholders.

### 3.7 False scope claims

- `dockercosmos`: "Explore 20 Concepts" / "20 In-Depth Lessons" / "Back to 20 Concepts" (`pages/Home.tsx:83`, `Concepts.tsx:23`, `ConceptDetail.tsx:26`) against **8** entries in `DOCKER_TOPICS`.
- `golangviz`: "Go 1.24+ Compiler Runtime" and "Exit Code: 0" over canned output.
- `reactcosmos` `About.tsx:30`: claims real Fiber logic while `TopicWrapper.tsx:98` only animates.
- `webprotocols`: declares 14 lesson routes; only **4** resolve to real content.

### 3.8 One engine in eight is untyped JavaScript

`html-cosmos` (21 files) and `jsviz` (82 files) are **100% `.js`/`.jsx`** — 103 of the 804 files in the fullstack engines (12.8%) sit entirely outside TypeScript in a project whose `next.config.ts` sets `typescript: { ignoreBuildErrors: false }`. The other 30 engines are 100% TS/TSX. These two were absorbed as plain JavaScript and never migrated, so no type checking, no IDE assistance and no lint coverage applies to the two largest curricula by sub-route count (`jsviz` 50 topics, `html-cosmos` 55 subtopics).

---

## 4. Per-topic verdicts

| # | Topic (slug) | Engine dir | Verdict | Theme | high/med/low | loc · subroutes |
|--:|:---|:---|:---|:---|:---|:---|
| 1 | `webprotocols` | `webprotocolsviz` | needs-work | broken | 4/4/0 | 1769 · 14 |
| 2 | `xrcosmos` | `xrcosmos` | needs-work | partial | 4/4/1 | 1711 · 12 |
| 3 | `css-cosmos` | `cssviz` | needs-work | partial | 4/3/1 | 3758 · 40 |
| 4 | `lldcosmos` | `lldcosmos` | needs-work | partial | 4/3/1 | 1830 · 10 |
| 5 | `vuecosmos` | `vuecosmos` | shallow | broken | 4/3/1 | 1727 · 56 |
| 6 | `apiviz` | `apiviz` | shallow | broken | 3/4/0 | 3250 · 19 |
| 7 | `golangviz` | `golangviz` | needs-work | ok | 3/4/1 | 9443 · 77 |
| 8 | `reactcosmos` | `reactcosmos` | needs-work | partial | 3/4/1 | 5378 · 39 |
| 9 | `microservicesviz` | `microservicesviz` | needs-work | partial | 3/1/4 | 1776 · 10 |
| 10 | `aicosmos` | `aicosmos` | needs-work | broken | 2/5/1 | 10818 · 122 |
| 11 | `jsviz` | `jsviz` | needs-work | partial | 2/5/3 | 8480 · 104 |
| 12 | `tailwindcosmos` | `tailwindcosmos` | needs-work | partial | 2/5/2 | 1770 · 14 |
| 13 | `mongocosmos` | `mongocosmos` | shallow | broken | 2/4/3 | 1100 · 14 |
| 14 | `redisviz` | `redisviz` | needs-work | partial | 2/4/2 | 6086 · 11 |
| 15 | `dockercosmos` | `dockercosmos` | needs-work | ok | 2/2/4 | 2450 · 8 |
| 16 | `crossplatformviz` | `crossplatformviz` | needs-work | partial | 1/6/2 | 1671 · 11 |
| 17 | `fastapicosmos` | `fastapicosmos` | needs-work | partial | 1/6/1 | 1612 · 9 |
| 18 | `sveltecosmos` | `sveltecosmos` | needs-work | ok | 1/6/2 | 2067 · 16 |
| 19 | `wasmcosmos` | `wasmcosmos` | needs-work | partial | 1/6/1 | 1874 · 14 |
| 20 | `authviz` | `authviz` | needs-work | ok | 1/5/2 | 2477 · 28 |
| 21 | `mqviz` | `mqviz` | needs-work | partial | 1/5/2 | 1950 · 4 |
| 22 | `nextjscosmos` | `nextjscosmos` | needs-work | partial | 1/5/3 | 8793 · 39 |
| 23 | `sqlcosmos` | `sqlcosmos` | needs-work | ok | 1/5/2 | 2537 · 18 |
| 24 | `synccosmos` | `synccosmos` | needs-work | partial | 1/5/2 | 1667 · 10 |
| 25 | `systemdesignviz` | `systemdesignviz` | needs-work | partial | 1/5/2 | 2918 · 30 |
| 26 | `html-cosmos` | `htmlviz` | needs-work | partial | 1/4/3 | 2194 · 63 |
| 27 | `nodecosmos` | `nodecosmos` | needs-work | ok | 1/4/3 | 2460 · 20 |
| 28 | `browseruniverse` | `browseruniverse` | needs-work | partial | 0/6/2 | 2771 · 18 |
| 29 | `websecurity` | `websecureviz` | needs-work | ok | 0/5/3 | 1891 · 9 |
| 30 | `rustviz` | `rustviz` | needs-work | partial | 0/4/4 | 4218 · 21 |
| 31 | `tsviz` | `tsviz` | needs-work | partial | 0/4/5 | 4256 · 75 |
| 32 | `program-cosmos` | `programviz` | solid | ok | 0/3/5 | 2329 · 8 |

**Totals:** 56 high, 139 medium, 69 low.

---

## 5. Documentation drift (repo-wide, found while auditing)

| Claim | Reality |
|:---|:---|
| `README.md:3` "245 curated topics" | ✅ 245 entries in `src/data/topics.ts` |
| `README.md:14` "55 live visualizer topics powered by 47 natively absorbed interactive engines" | ❌ **72** topics `status: 'active'`; **70** engine dirs under `src/components/visualizers/` |
| `README.md:127-134` lists 8 catch-all routes | ❌ 70 routes use the `[[...slug]]` pattern |
| `README.md` tech stack + `AGENTS.md:9` + `PROJECT_CONTEXT.md:5` say **Next.js 15** | ❌ `package.json` pins `next@^16.3.1` |
| `PROJECT_CONTEXT.md:6` "172+ topics" | ❌ 245 |
| `PROJECT_CONTEXT.md:91` "All 34 Complete" | ❌ the list beneath it runs to 47 |
| `PROJECT_CONTEXT.md:73` `/learn/[slug]` = "Universal player loading native visualizers" | ❌ see below |
| `README.md:144` "public/sitemap.xml" | ❌ generated by `src/app/sitemap.ts`; no static file exists |
| `public/llms.txt` "244 curriculum modules" | ❌ 245 |

**`/learn/[slug]` is a dead subsystem. [verified]** It is described as the universal player, but `src/app/learn/[slug]/page.tsx:39` unconditionally renders `VisualizerRegistry`, and `VisualizerRegistry.tsx` contains **no engine lookup at all** — it imports only React, the `Topic` type and two lucide icons. It renders a decorative panel reading "Engine Status: Active & Native" and "Initializing visual canvas for {slug}…". Its output is statically pre-rendered for every active topic: `.next/server/app/learn/program-cosmos.html` (16,783 bytes) contains the placeholder text and no visualizer. Nothing in the UI links to it (the `/<engine>/learn/<id>` links in wasmcosmos/mqviz/crossplatformviz are a different, nested route), and canonicals point at the real URLs, so the SEO damage is contained — but the route, its 72 pre-rendered pages, and the docs describing it are all misleading.

**`sitemap.ts` emits `/interview` twice** (line 31 and line 46).

---

## 6. What is genuinely good

- **`program-cosmos` is the reference implementation** — the only `solid` verdict, and it earns it: 7 cumulative lesson units, each with a purpose-built simulator (a real 8-bit machine stepper executing a 5-instruction program, a 64-cell RAM grid with bit-level decomposition, an animated LIFO call stack, a blocking/non-blocking I/O timeline); per-route metadata plus a working dynamic OG image at `src/app/program-cosmos/og/route.tsx`; zero hardcoded hex; `Math.random`/`Date.now` count of 0, with `MemoryBasics.tsx:18-26` documenting *"so SSG and hydration agree"*; persisted resumable progress; and `MotionConfig reducedMotion="user"` (`Layout.tsx:34`).
- **`websecurity`** has the cleanest infrastructure in the domain: 8 routes, a 7-step learning path, five custom attack/defense walkthroughs, an explicit `mounted` hydration guard (`LearningPathNavigator.tsx:19,31`), and a real CSP builder — despite the two defects noted in §4.
- **`browseruniverse`** owns the one tool no sibling has: a Monaco split editor feeding an actually instrumented sandboxed iframe whose `MutationObserver`, `addEventListener` wrapper and console/error hooks stream real telemetry back over `postMessage` (`SandboxPage.tsx:24-43, 206-221`).
- **Engine-level build discipline is genuinely good.** Every one of the 32 engines is free of module-scope browser APIs, and the build pre-renders 1,982 pages with 0 type errors. The failures are inside components, not in the architecture.
- **Deep, subject-native work exists.** `aicosmos` (10,818 LOC), `golangviz` (77 sub-routes), `html-cosmos` (55 subtopics), `nextjscosmos` (35 concepts) and `jsviz` (50 topics) are substantial curricula whose *structure* is right — what they need is the inert-simulation and theming defects fixed, not redesign.

---

## 7. Recommended remediation order

1. **Stop the lying controls (highest value/effort ratio).** For the nine engines in §3.1: either wire the control to a real evaluator (a Web Worker; `browseruniverse` already ships one for the HTML tokenizer) or relabel it honestly as a canned walkthrough. Shipping "Run Program" that ignores input and reports a `Math.random()` execution time is worse than shipping no control.
2. **Fix the theme-hydration root cause once.** `src/context/ThemeContext.tsx:17-23` reads `localStorage` inside the `useState` initializer, so the server always renders the `dark` default while the client's first render uses the stored value. **35 component files across ≥10 fullstack engines branch on `theme` during render** (`programviz` alone has 8, `browseruniverse` 3), so any user who has chosen light gets a React hydration mismatch. Verified: `.next/server/app/program-cosmos.html` contains `bg-slate-950`. Fixing this one file removes the whole class. The pre-paint script at `src/app/layout.tsx:24` already sets the DOM attribute — read from there instead of storage.
3. **Repair the dead-CSS class of bugs** (§3.3): replace `bg-[var(--x-bg)]/80` with a solid token class plus `backdrop-blur`, and define or remove `base`/`accentSoft` in `browseruniverse`. This is a mechanical sweep of ~157 usages.
4. **Fix light-mode contrast** (§3.2) — a lint-style sweep for `text-white`/`text-*-200|300` on token or translucent backgrounds, and correct `--ai-primary`/`--primary` so `bg-primary` never resolves near-white behind a white label.
5. **Correct the teaching errors** (§3.4) — the wrong specificity calculations, the invalid XR transform matrix, the mislabelled CRC16 hash and the stale consistent-hashing ring are small patches with outsized credibility impact.
6. **Repair route/content gaps** (§3.5): the `golangviz` footer prefixes, the `authviz` flashcard category, the 47 un-pre-rendered `html-cosmos` challenges, the `dockercosmos` empty filter tabs, and the `webprotocols` `generateStaticParams` list (**verified**: 7 of 11 entries name topics that do not exist, `cors-security` among them, while 10 real topics are missing — and because `TopicLesson.tsx:17-29` resolves its topic inside `useEffect` behind `if (!topic) return null`, **all 11 lesson pages pre-render with zero `<h1>`**, verified against the build output).
7. **Enforce uniqueness deliberately where it is cheapest** (§3.6): the `lldcosmos`/`microservicesviz` shared chrome (Navbar ~94%) and the `vuecosmos`/`reactcosmos`/`apiviz` generated topic bodies are the clearest §5 violations. Deepening those per-topic bodies is real work; the shared chrome should simply be made invisible infrastructure per AGENTS.md, not duplicated per engine.
8. **Then** the long tail: 45 lint warnings, `/learn/[slug]`, the duplicated sitemap entry, and the documentation drift in §5.

---

## Appendix — artifacts

- Per-engine raw reports (32 files): `scratch/audit/<slug>.md` (gitignored).
- Verification evidence used in this report: `.next/routes-manifest.json` (rewrite/redirect counts), `.next/prerender-manifest.json` (1,981 routes; only `/fullstack` and the `coming-soon` topic under `/fullstack/*`), `.next/server/app/**` (h1 counts and placeholder text), the compiled CSS chunks (class-generation checks), and `/tmp/cscosmos_build.log`.
