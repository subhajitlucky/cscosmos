# Full Stack Domain — Remediation TODO

Companion to [2026-10-18-fullstack-topics-audit.md](./2026-10-18-fullstack-topics-audit.md).
Scope of the audit: the 32 `active` `fullstack` topics and their engines. Several root causes are
repo-wide, so those tasks are marked **[repo-wide]**.

**Sizes:** `S` ≈ under an hour · `M` ≈ half a day · `L` ≈ a day or more.
**Every task closes with the gate in §7** (`npm run lint` + `npm run build`).

---

## 0. Decisions needed before starting

These forks change what the work is. Everything else in this list is mechanical.

| # | Decision | Options | Recommendation |
|:--|:---|:---|:---|
| D1 | **Execute/compile controls** (9 engines) | (a) wire real evaluation, (b) relabel as an honest canned walkthrough, (c) remove the editor | **Relabel first (P0, cheap, stops the deception), then wire real execution where a worker already exists in-repo** — `browseruniverse/workers/htmlTokenizer.worker.ts` proves the pattern; `tailwindcosmos`, `sqlcosmos` and `nodecosmos` are the best candidates for a worker-backed real run |
| D2 | **Theme architecture** — 35 files branch on `theme` in JS during render | (a) patch hydration only, (b) add `mounted` guards everywhere, (c) migrate to `next-themes` + CSS-variable-driven surfaces | **(c), then (b) for stragglers.** The repo already has a pre-paint script (`src/app/layout.tsx:24`) and per-engine `styles.css` variable engines — leaning on those removes the JS branch entirely and kills the flash as well as the mismatch |
| D3 | **`/learn/[slug]`** — 72 pre-rendered pages of a fake player, documented as the universal player | (a) delete route + docs, (b) implement it as a real dispatcher | **(a) delete now**, revisit only if a real dispatcher is wanted. Nothing links to it |
| D4 | **Dark as the default theme** | keep / switch to system | **Keep** — but that makes the dark-mode CTA bug (`aicosmos`) P0, since every first-time visitor sees it |
| D5 | **Uniqueness for shared chrome** (lldcosmos ↔ microservicesviz) | (a) extract to shared invisible infra, (b) differentiate per engine | **(a)** — AGENTS.md §5 permits shared *invisible* infrastructure and forbids shared *visible* experience. Do not duplicate the chrome to look unique |

---

## 1. Workstream 0 — root causes (P0, highest leverage)

- [x] **FS-01 · Fix the theme hydration mismatch at its source** **[repo-wide]**
  - [ ] Replace the hand-rolled provider with `next-themes`, or keep the file and stop reading storage during render.
  - **File:** `src/context/ThemeContext.tsx:17-23` — `useState` initializer calls `localStorage.getItem(storageKey)`.
  - **Why:** the server always renders `defaultTheme="dark"`; a client with `light` stored renders different markup on first pass → React hydration mismatch. **35 component files across ≥10 fullstack engines branch on `theme` during render** (`programviz` 8, `browseruniverse` 3, `websecureviz` 2, plus `reactcosmos`, `vuecosmos`, `golangviz`, `mongocosmos`, `tsviz`, `solidityviz`, `evminternals`, `consensusviz`, `patriciatrie`, `merkletreeviz`, `blockchainviz`).
  - **Verified evidence:** `.next/server/app/program-cosmos.html` contains `bg-slate-950` (dark), so a light-preferring user mismatches.
  - **Acceptance:** with `localStorage['cscosmos-ui-theme']='light'`, load `/fullstack/program-cosmos`, `/fullstack/browseruniverse`, `/fullstack/jsviz` — **zero** hydration warnings in console, and no flash of the wrong theme on hard reload.
  - **Size:** M

- [x] **FS-02 · Give theme-branching components a theme-safe read** **[repo-wide]**
  - [ ] Add a `useResolvedTheme()` that returns `undefined` before mount; components render theme-neutral markup on first pass.
  - [ ] Migrate the 8 `programviz` files and 3 `browseruniverse` files first (biggest surface).
  - **Acceptance:** the grep `theme === 'dark'|theme === 'light'` count in `src/components/visualizers` drops to 0, or every remaining hit is behind a mounted guard.
  - **Size:** M

- [x] **FS-03 · Kill the dead-CSS class family** **[repo-wide]**
  - [ ] `bg-[var(--x-bg)]/80` and friends generate **no CSS at all** — 352 usages across 96 files (181 `bg-`, 166 `border-`, 5 `text-`). Tailwind v3 emits `bg-[var(--x)]` but not `bg-[var(--x)]/80`.
  - [ ] Fix by adding an explicit rgba custom property per engine in `styles.css` (e.g. `--x-bg-glass: rgba(7,9,14,.8)` + light override) and swapping the class, **or** defining the colours with an `<alpha-value>` placeholder in `tailwind.config.js`.
  - [ ] Note: the token colours that *do* exist (`midnight`, `surface`, `glass`) are also bare `var()` values, so `bg-midnight/80` fails the same way.
  - **Start with the 6 known engines:** `tailwindcosmos` (14), `mqviz` (25), `wasmcosmos` (18), `xrcosmos` (16), `lldcosmos` (13), `synccosmos` (12).
  - **Verified evidence:** the compiled bundle contains exactly one `bg-base*` rule block and it is entirely light-mode scoped (`html.light … .browseruniverse-root.light-mode`) — so `tailwindcosmos`/`mqviz`/`wasmcosmos` sticky navbars have **no background in either theme**.
  - **Acceptance:** a scripted check over `.next/static/chunks/*.css` confirms every emitted utility class used in `src/` resolves to at least one rule.
  - **Size:** M (scriptable per token name)

- [x] **FS-04 · Fix the undefined token classes in `browseruniverse`**
  - [ ] `bg-base` / `bg-base/60|70|80|90` (39 uses) — `base` is not a colour in `tailwind.config.js` → transparent panels in dark mode (the default).
  - [ ] `text-accentSoft` (20 uses) and `shadow-inset` — emit nothing in **either** mode.
  - [ ] Either define them or replace with existing tokens (`midnight`, `surface`, `glass`, `body-text`, `muted-text`).
  - **Size:** S

---

## 2. Workstream 1 — stop the misleading UI (P0)

- [x] **FS-05 · Remove every false runtime claim**
  - [ ] `golangviz` — delete "Go 1.24+ Compiler Runtime" (`components/LiveGoRunner.tsx:237`) and "Exit Code: 0" (`:256`); nothing is compiled.
  - [ ] `nodecosmos` — drop the fabricated execution time (`components/NodePlayground.tsx:51`, `Math.random()`).
  - [ ] `reactcosmos` — `pages/About.tsx:30` claims real Fiber logic that does not exist.
  - [ ] `dockercosmos` — "Explore 20 Concepts" / "20 In-Depth Lessons" / "Back to 20 Concepts" (`pages/Home.tsx:83`, `pages/Concepts.tsx:23`, `pages/ConceptDetail.tsx:26`) vs **8** entries in `DOCKER_TOPICS`.
  - **Acceptance:** no UI string claims compilation, execution, or a count that the code does not deliver.
  - **Size:** S

- [x] **FS-06 · Relabel (or wire up) the 9 inert execute/compile controls**
  Per D1. Each needs the label to match behaviour even if real execution lands later.

  - [ ] `nodecosmos` `components/NodePlayground.tsx:35` — substring-matches `nextTick`/`Promise`/`highWaterMark`, prints canned logs **[verified]**
  - [ ] `golangviz` `components/LiveGoRunner.tsx:158` (prints preset `expectedOutput`) and `app/labs/page.tsx:30` (sleeps 600 ms, hardcoded PASS)
  - [ ] `reactcosmos` `pages/topics/TopicWrapper.tsx:38` (flips `isExecuting` for 2 s; no `eval` in 59 files)
  - [ ] `nextjscosmos` `components/concept-layout.tsx:89` (`isExecuting` spread into 33 visualizers, read by none)
  - [ ] `sveltecosmos` `pages/CompilerLab.tsx:139-144` (three hardcoded outputs)
  - [ ] `sqlcosmos` `components/SqlPlayground.tsx:42-73` (substring-matches table names; `WHERE role = 'developer'` returns all 4 rows)
  - [ ] `redisviz` `components/visualizers/ClusterSimulator.tsx:13-19` (a Java string hash labelled "CRC16")
  - [ ] `aicosmos` `pages/RagLab.tsx:30` (hardcoded retrieval arrays; re-rank score from list index)
  - [ ] `tailwindcosmos` `pages/Playground.tsx:120` (cannot generate classes absent from `src/` at build time)
  - **Acceptance:** every such control either executes the input or is labelled as a preset/simulated trace.
  - **Size:** M

---

## 3. Workstream 2 — content correctness (P0, small patches, outsized credibility)

- [ ] **FS-07** `xrcosmos` `pages/SpatialLab.tsx:236` — the "4×4 Model Transform Matrix (M = T × R × S)" is not a valid rotation matrix (mixes `cY/sY` with `cX/sX`) and omits scale and rotZ. **Teaches wrong math.** `S` 
- [ ] **FS-08** `xrcosmos` `pages/SpatialLab.tsx:220` — Cube/Torus/Pyramid all render the identical rounded `div`; `pages/Home.tsx:106` — `perspective-[600px]` is not a Tailwind v3 class, so both 3D viewports are flat and the Z-depth sliders do nothing. `S`
- [x] **FS-09** `css-cosmos` — `components/CssSpecificityCalculator.tsx:21-23` computes `(0,0,4,1)` for `:where(.card, .modal) > p.text` (the ":where() Reset (0 Specificity)" button); `components/visualizers/SelectorsLab.tsx:19-27` counts class/id names as element selectors (`.card .title` → `(0,2,2)`). **Core teaching output is wrong.** `M`
- [x] **FS-10** `css-cosmos` `components/CssChallengeArena.tsx:70-82` — Challenge 3 grades `flex-direction` but the solution, grader and controls ignore it; the state at `:91-92` is never written. `S`
- [x] **FS-11** **CLOSED in block 10 — and the item understated it.** `systemdesignviz` `components/ConsistentHashingVisualizer.tsx:25` — key→server targets are hardcoded and never recomputed, so after "Remove Server" the ring still maps a key to the deleted server, inverting the minimal-remapping lesson. `M`
- [x] **FS-12** `webprotocols` `data/topics.ts:347` — the HTTPS/TLS lesson is `visualizationType: 'validation'`, so it shows the ETag/304 caching animation (its own analogy and Handshake/Certificates sections are never rendered). `S`
- [x] **FS-13** **CLOSED in block 10 — the placeholder was worse than described.** `mongocosmos` `pages/TopicDetail.tsx:15-31` — only `btree` has a visualizer; the other 9 topics render a "Diagnostic_Sim_Loading" placeholder with an identical hardcoded tradeoffs array. `M`
- [x] **FS-14** `webprotocols` `pages/TopicLesson.tsx:70-84` — authored `analogy`, `syntax`, `subItems`, `lessonStructure` and `example` content is never rendered (0 references repo-wide). `S`

---

## 4. Workstream 3 — routes & content that never ships (P1)

- [x] **FS-15** `webprotocols` — **the worst route bug in the domain.** `src/app/webprotocols/[[...slug]]/page.tsx:15-25` pre-renders **7 of 11** topic ids that do not exist (`http-methods`, `headers-deep-dive`, `validation-etags`, `cdns-edge`, `cookies-sessions`, `cors-security`, `performance-http23` — `cors-security` has no topic at all), while **10 real topics** are missing. Separately, `pages/TopicLesson.tsx:17-29` resolves the topic inside `useEffect` behind `if (!topic) return null`, so **all 11 lesson pages pre-render with zero `<h1>`** — client-only rendering behind an SSG claim. **[verified]**
  - [ ] Derive `generateStaticParams` from `data/topics.ts` instead of a hardcoded list.
  - [ ] Move the topic lookup into render (`topics.find(...)` is a static import — safe) and keep `notFound()` for misses.
  - **Acceptance:** every `/webprotocols/topics/*` page has an `<h1>` and lesson body in the **pre-rendered HTML** (assert on `.next/server/app/webprotocols/topics/*.html`).
  - `M`
- [x] **FS-16** **CLOSED in block 10 — and the class was swept.** `golangviz` `components/footer.tsx:7` — footer hrefs lost their `/golangviz` prefix (`/playground`, `/path#roadmap`, `/#start`, `/concepts/introduction-to-go`) → each hits `[domain]` and 404s. `S`
- [x] **FS-17** **CLOSED in block 10.** `authviz` `pages/Flashcards.tsx:44` — the "Authorization & Access Control" chip filters to 0 cards → `currentCard` undefined → **render throws**; no `error.tsx` exists under `src/app/`. Fix the category data and add an `error.tsx`. `S`
- [x] **FS-18** **CLOSED in block 10.** `html-cosmos` `src/app/html-cosmos/[[...slug]]/page.tsx:21-23` — emits only `problems/1-3` while `ProblemList.jsx:55` links all 50; 47 challenge routes are never pre-rendered. `S`
- [x] **FS-19** **CLOSED in block 10 — already fixed earlier, and the class is now swept.** `dockercosmos/pages/Concepts.tsx:11` derives its tabs from the data (`['all', ...new Set(DOCKER_TOPICS.map(t => t.category))]`), so the two zero-match tabs (`k8s-advanced`, `security`) are gone and no chip can be empty; `grep -rn k8s-advanced src` returns nothing. Because FS-17 was the same defect with a crash, I swept **every other hardcoded chip list** against its own data: `golangviz/app/{pitfalls,cheatsheet,flashcards}/page.tsx`, `rustviz/pages/Pitfalls.tsx`, `aicosmos/pages/FoundationProblems.tsx`, `cloudcosmos/pages/ConceptMapPage.tsx` — **0 dead chips**. (`cloudcosmos`'s `All Concepts` looks like one only because it is the show-all pseudo-chip, special-cased at `ConceptMapPage.tsx:48`.) So this class is closed, not merely this instance. `S`
- [x] **FS-20** **CLOSED in block 10 — the lock was the honest half.** All 15 `apiviz` topics were pre-rendered although `pages/LearningPath.tsx:55,60` marks 8 as LOCKED (`href="#"`, grayscale, a "LOCKED" label), and `pages/TopicDetail.tsx` rendered the same interactive template for *every* id. Measured first: the eight `coming-soon` pages and the seven `active` ones render **862–917 visible chars each** — indistinguishable — so "locked" was decorative while the route quietly contradicted it. The data is the authority here (it says those lessons are not written), so the route now honours the lock: a `coming-soon` topic gets an explicit `STATUS::COMING_SOON` panel with its authored description and a link back to the learning path, instead of the generic walkthrough. `S`
- [x] **FS-21** `crossplatformviz` `pages/BridgeSim.tsx:124` — the headline "Gesture Sample Frequency" slider (30–120 Hz) feeds `sentPackets`, a field rendered nowhere. `S`
- [x] **FS-22** **CLOSED in block 10 — it was a wiring bug, not a data gap.** All 35 topics in `reactcosmos/data/topics.ts` already author their own `takeaways: string[]` (three each); `TopicWrapper.tsx:161` simply rendered a hardcoded array instead, so every topic page showed the same Virtual-DOM/reconciliation/batching takeaways. Now renders `topic.takeaways`. `reactcosmos` `pages/topics/TopicWrapper.tsx:161` — all 35 topic pages render the same three hardcoded takeaways, discarding per-topic `takeaways`/`commonPitfall` from `data/topics.ts` (used only in the unreachable `TopicDetail.tsx:163,187`). `S`

---

## 5. Workstream 4 — light-mode legibility (P1)

The pattern: a fixed white/near-white foreground over a background that resolves light in light mode.

- [x] **FS-23** `lldcosmos` — **verified** `pages/SolidLab.tsx:262` renders violation code as `text-rose-200` over `--lld-surface` = **`#ffffff`** in light mode (`styles.css:37`; dark is `#0d1222` at `:14`) ≈1.3:1; `pages/PatternsLab.tsx:227` (`text-white` on `--lld-bg` = `#f8fafc`); `pages/PatternsLab.tsx:122`. `S`
- [x] **FS-24** `aicosmos` — `styles.css:4` sets `--ai-primary: hsl(var(--foreground))`, near-white in **dark** mode (the default), behind a `text-white` CTA (`pages/Home.tsx:106`) → **the primary call-to-action is invisible for every first-time visitor.** P0 within this workstream. `S`
- [x] **FS-25** Remaining instances: `microservicesviz` `SagaLab.tsx:165`, `CircuitLab.tsx:114` · `fastapicosmos` `DiGraph.tsx:137` (`text-white` on `bg-emerald-500/10` ≈ `#e8f8f2`) · `synccosmos` `CrdtLab.tsx:188` · `redisviz` `Architecture.tsx:60-64` (SVG `fill-white` in `fill-background` rects) · `jsviz` `Problem.jsx:88` (white-on-white title) · `mongocosmos` `Playground.tsx:98` (black-on-black, inverse) · `css-cosmos` `Home.tsx:44,49` · `webprotocols` `Home.tsx:52` · `xrcosmos` `HandTracker.tsx:155` (1.20:1). `M`
- **Do not blind-sweep `text-white`** — there are 719 uses in the fullstack engines alone and most sit on genuinely dark terminal surfaces. Fix the enumerated instances, then add a lint/CI rule for the pairing.
- **Acceptance:** each fixed surface measures ≥4.5:1 in **both** modes.

---

## 6. Workstream 5 — uniqueness, hygiene, docs (P2)

- [x] **FS-26** **CLOSED (residual spun out as FS-73).** `lldcosmos` ↔ `microservicesviz` — shared chrome measured at Navbar **~94%**, Footer ~82%, About ~80%, Home ~50% identical after stripping engine names/numerals. Per D5, extract to shared invisible infrastructure or differentiate. *(The per-engine review called `Home.tsx` "byte-identical" — it is not; the raw diff is 421 lines. Trust the measured numbers.)* `M`
- [x] **FS-27** Generated topic bodies that are the same page N times: `vuecosmos` `pages/Topic.tsx:244` (51 of 52 topics share one diagram), `:93` (49 of 52 share one definition — `data/topics.ts:132-158` has only 3 real entries) · `reactcosmos` `TopicWrapper.tsx:103` (35 of 36 pages, all 10 `components/visualizers/specific` files have 0 `useState`/0 `onClick`) · `apiviz` `pages/TopicDetail.tsx:16-75` (identical trace in all 15 pre-rendered pages). Deepen per-topic bodies. `L`
- [ ] **FS-28** Migrate `html-cosmos` (21 files) and `jsviz` (82 files) from `.js`/`.jsx` to TS/TSX — **103 of the 804 fullstack engine files (12.8%)** sit outside type checking in a repo with `typescript.ignoreBuildErrors: false`. The other 30 engines are 100% TS. `L`
- [x] **FS-29** Delete `/learn/[slug]` and its docs (D3). `src/app/learn/[slug]/page.tsx:39` renders `VisualizerRegistry`, which has **no engine lookup** — it prints "Engine Status: Active & Native" and "Initializing visual canvas for {slug}…". Pre-rendered for all 72 active topics. Remove the route, fix `README.md:126` and `PROJECT_CONTEXT.md:73`. `S`
- [x] **FS-30** **CLOSED in block 10.** `sitemap.ts` emitted `/interview` twice (the hub was listed in the static array *and* pushed again in the interview block). The redundant push is gone, and the function now deduplicates by URL as a final step so no future list can reintroduce a duplicate. Verified by `scratch/sitemap.test.ts` (no URL twice; hub appears exactly once; only the site root may end in `/`). `S`
- [x] **FS-31** Documentation drift: `README.md:14` "55 live topics powered by 47 engines" → **72 active / 70 engine dirs**; `README.md:127-134` lists 8 of 70 catch-all routes; `README.md:144` references a non-existent `public/sitemap.xml`; `AGENTS.md:9` + `README.md` + `PROJECT_CONTEXT.md:5` say **Next.js 15** vs `package.json` **16.3.1**; `PROJECT_CONTEXT.md:6` "172+ topics" → 245; `PROJECT_CONTEXT.md:91` "All 34 Complete" vs 47 listed; `public/llms.txt` "244 modules" → 245. `S`
- [ ] **FS-32** Clear the 45 `no-explicit-any` lint warnings across 27 files (or set a ratchet). `M`
- [x] **FS-33** **CLOSED in block 10 — with one correction to the item itself.** Dead code: copy-pasted `hooks/useTheme.ts` in `programviz` and `webprotocolsviz` (byte-identical but unused in the latter) · `programviz/data/learningPath.ts:55-159` unused `topics` export + dead `Progress.currentStep` · `websecureviz/components/mode-toggle.tsx` + `theme-provider.tsx` (unreferenced, and defaults to the shadcn `"vite-ui-theme"` storage key) · `browseruniverse/hooks/useLocalStorage.ts` · `htmlviz`/`webprotocolsviz` unreferenced `assets/react.svg`. `S`
- [x] **FS-34** `websecureviz` `hooks/useProgress.ts:4` — per-instance `useState` means the sidebar checkmarks never update after "Mark as Complete" until reload (consumed independently by `TopicLayout.tsx:26` and `LearningPathNavigator.tsx:16`). `S`
- [x] **FS-35** `websecureviz` `pages/BrowserSecurity.tsx:15` — `prose dark:prose-invert` is dead: `@tailwindcss/typography` is not installed and `tailwind.config.js` has `plugins: []`. `S`
- [x] **FS-36** `programviz` — the whole lesson body ships at `opacity: 0` (framer-motion `initial` is serialized into the pre-rendered HTML, `components/TopicLayout.tsx:49-52`; same at `pages/MemoryLayout.tsx:104,194`), so the no-JS/slow-JS view of every lesson is blank. Also `components/Layout.tsx:62-64` is an icon-only link with no accessible name. `S`

---

## 7. Verification gates

Run after every workstream; both must pass before calling anything done (per `AGENTS.md`).

```bash
npm run lint     # must stay at 0 errors
npm run build    # must stay exit 0 and keep 1,982 static pages
```

Targeted checks worth scripting once and reusing:

```bash
# 1. No lesson page pre-renders empty (FS-15 class of bug)
for f in .next/server/app/**/*.html; do
  grep -q '<h1' "$f" || echo "EMPTY PRERENDER: $f"
done

# 2. Every arbitrary-value utility used in src/ actually emitted CSS (FS-03/FS-04)
#    compile candidates with the repo's tailwindcss and diff against .next/static/chunks/*.css

# 3. No theme branching outside a mounted guard (FS-01/FS-02)
grep -rn "theme === 'dark'\|theme === 'light'" src/components/visualizers | wc -l
```

Manual, once per fix: load with `localStorage['cscosmos-ui-theme']='light'` **and** `'dark'`, check
contrast ≥4.5:1, and confirm no hydration warning in the console.

---

## 8. Suggested first slice

A single focused day that removes three whole bug classes and the worst deception:

1. **FS-01 + FS-02** — theme hydration root cause (kills a mismatch class across ≥10 engines).
2. **FS-24** — `aicosmos` primary CTA invisible to every first-time visitor.
3. **FS-05 + the `nodecosmos`/`golangviz` halves of FS-06** — remove the false "compiler runtime" / "exit code 0" / random execution-time claims.
4. **FS-15** — the `webprotocols` route + content fix (the only place where an entire lesson layer ships empty).
5. **FS-07 + FS-09** — the XR matrix and the CSS specificity calculator: two small patches that stop the product teaching wrong facts.

Then FS-03 (dead CSS sweep, scriptable) and FS-25 (contrast) as the next block.

---

## 9. Progress tracker

| Workstream | Still open |
|:---|:---|
| 0 · Root causes (FS-01…04) | **0 — complete** |
| 1 · Misleading UI (FS-05…06) | **0 — complete** |
| 2 · Content correctness (FS-07…14) | 2 (FS-07, FS-08) |
| 3 · Routes & missing content (FS-15…22) | **0 — complete** |
| 4 · Light-mode legibility (FS-23…25) | **0 — complete** |
| 5 · Uniqueness, hygiene, docs (FS-26…36) | 2 (FS-28, FS-32) |
| 6 · Found during remediation (FS-37…83) | 14 (FS-51, FS-53, FS-54, FS-55, FS-67, FS-69, FS-70, FS-71, FS-72, FS-73, FS-75, FS-78, FS-79, FS-80) |
| opened after FS-83 | 5 (FS-27b, FS-27c, FS-84, FS-86, FS-92) |
| **Checkbox total** | **23 open / 70 closed** |

Three workstreams are now empty, and the block-9 reconciliation plus this block's closures took the checkbox list from a contradictory 40-done-of-83 to a state where every tick is backed by a numbered block section below.

*(Tracker updated in block 9: FS-64, FS-76, FS-77, FS-82, FS-83 and FS-85b closed. Block 9 opened six items — FS-84, FS-85, FS-85b, FS-86, FS-87, FS-88 — and closed FS-85b immediately, so 45 of 89 are done and 44 remain.)*

Change surface so far: **196 files, +1,479 / −729**, including 13 engine `styles.css` files. Two new tracked files (`docs/audits/`, `cssviz/utils/specificity.ts`) and one deletion (`mongocosmos/store/themeStore.ts`, a duplicate theme store).

Block 1 gate — all green:

| Check | Result |
|:---|:---|
| `npm run lint` | **0 errors**, 45 warnings (identical to the pre-work baseline) |
| `npx tsc --noEmit` | **clean** |
| `npm run build` | **exit 0**, **1,985** static pages (was 1,982; +3 from correcting the `webprotocols` params) |
| `webprotocols` lesson pages pre-rendering with an `<h1>` **and** their definition | **14/14** (was 0/14 — 11 generated empty, 3 never generated) |
| Pages with no `<h1>` across all 32 fullstack routes | `webprotocols` **11/13 → 0/14**; remaining are the FS-41 heading gaps |

**FS-12 closed with a real renderer, not a relabel.** `https` was pointing at `visualizationType: 'validation'`, so a lesson on TLS encryption displayed the ETag/304 cache-revalidation animation. Rather than swap it to a generic type, `FlowVisualizer` gained a 9th renderer (`'tls'`) with a four-stage handshake — ClientHello → ServerHello + Certificate → certificate verified & key exchanged → encrypted tunnel — a travelling token, a certificate-verified shield, and a padlock state line. Verified in the build output: `ClientHello` and `Certificate` are in the pre-rendered HTML and the stale `If-None-Match` text is gone.

---

## 10. Block 1 — work completed, and what it uncovered

### Done in this block

| Task | What changed |
|:---|:---|
| **FS-01** | `src/context/ThemeContext.tsx` rewritten: no `localStorage` read during render; `theme` is the stored *preference*, new `resolvedTheme` is the concrete `"light" \| "dark"` painted on `<html>`; `mounted` flag added; `system` now follows the OS via a `matchMedia` listener. `src/context/theme-context.ts` gained `ResolvedTheme` + the two new context fields. |
| **FS-02** | Every consumer of the *shared* provider now branches on `resolvedTheme`: `ThemeToggle`, `programviz/hooks/useTheme.ts` (covers 8 files / 105 branch sites), `cssviz/theme/ThemeProvider.tsx`, `browseruniverse/context/ThemeContext.tsx`, `golangviz`, `tsviz`, `vuecosmos`, `webprotocolsviz`, `reactcosmos`, `websecureviz`, `cloudcosmos`. Three render-time `matchMedia` reads removed. |
| **FS-05** | False runtime claims removed across `golangviz` (compiler-runtime + exit-code + fabricated per-preset metrics), `nodecosmos` (fabricated execution time deleted outright, not randomised), `reactcosmos` (About provenance claim), `dockercosmos` (all counts now derive from `DOCKER_TOPICS.length`; the two impossible filter tabs now derive from the data). |
| **FS-06** (partial) | 4 of 9 engines relabelled honestly: `golangviz` → "Preset Walkthrough"/"not executed"; `nodecosmos` → "Show Preset Trace"; `reactcosmos` (`TopicWrapper` + the `TopicDetail` fallback) → "Animate Update"/"Reference Code Snippet"; `dockercosmos` → "Guided Walkthrough Labs". Remaining: `nextjscosmos`, `sveltecosmos`, `sqlcosmos`, `redisviz`, `aicosmos`, `tailwindcosmos`. |
| **FS-09, FS-10** | New shared `cssviz/utils/specificity.ts` replaces two broken counters. All five verification triples now correct (`.card .title` (0,2,0); `.nav :where(a)` (0,1,0); `:where(.card, .modal) > p.text` (0,1,1); `#app .list li:hover` (1,2,1); `ul > li::before` (0,0,3)). `:is`/`:not`/`:has` take the most specific argument as a whole tuple; `:where()` contributes zero. Challenge 3's controls and grader now match its stated claim, so it is solvable. |
| **FS-14, FS-15** | `src/app/webprotocols/[[...slug]]/page.tsx`: `generateStaticParams` now derives from `data/topics.ts` (was a hand-written list naming 7 non-existent ids and omitting 10 real ones); unknown lesson ids `notFound()`; per-route metadata added. `TopicLesson.tsx`: topic resolved **during render** instead of in an effect, so lessons reach the pre-rendered HTML; the dead `useParams`/`useRouter` fallback and 3 unused imports are gone; `analogy`, `syntax`, the worked request/response `example` and `subItems` are now rendered (they were authored but never displayed). |
| **FS-24** | `aicosmos` `--ai-primary` no longer derives from `--foreground`. Dark CTA contrast 1.04:1 → **4.66:1**; light 6.29:1. Four tinted chips given theme-aware labels. |
| **FS-37** (new) | Site-wide `bg-primary` + fixed white/black label sweep: **35 lines across 26 files**. `--primary` is near-black in light and near-white in dark, so `bg-primary text-white` was white-on-white in dark (the default) and `bg-primary text-black` was black-on-black in light. `text-primary-foreground` is correct in every theme scope, including the blue `--primary` overrides where it resolves to white. One conditional in `webprotocolsviz/components/visualizations/FlowVisualizer.tsx:302` needed the label moved *inside* each branch — a shared label over a `bg-primary`/`bg-slate-400` ternary would have regressed the slate case. |

### New backlog from this block

- [x] **FS-38** **CLOSED in block 10 — 69 sites repointed, 61 correctly left.** `aicosmos` collateral: `--ai-primary` doubles as *brand text* on the dark canvas, which fell from 18.96:1 to ~4.25:1 with the new dark value. One token cannot satisfy both roles. Add `--ai-primary-text` (`#a5b4fc` dark / `#4f46e5` light) and point the ~40 `text-[var(--ai-primary)]` call sites at it. `M`
- [x] **FS-39** Three engines keep a **second, desynced theme preference** under the storage key `'theme'` (the app uses `'cscosmos-ui-theme'`), and all three read it **unguarded during render** — `consensusviz/context/ThemeContext.tsx`, `ptopblockchain/context/ThemeProvider.tsx`, `evminternals/context/ThemeContext.tsx`. No crash today only because their routes are `dynamic(..., { ssr: false })` — which is itself the reason `.next/server/app/{consensusviz,evminternals,ptopblockchain}.html` ship **0 `<h1>`** and ~9.6 KB of shell. Convert them to adapters over the shared provider (as `merkletreeviz` and `browseruniverse` now are) and move them off client-only rendering. `M`
- [x] **FS-40** **CLOSED in block 10 — and my premise for it was wrong.** `loadbalancing/store/useStore.ts` and `k8scosmos/stores/store.ts` also hold theme state in `persist()`ed zustand stores — same desync class as FS-39. `S`
- [x] **FS-41** `tsviz` renders all 50 `problems/pNN` pages with **no heading element at all** (content is present and correct — verified the problem title is in the pre-rendered HTML — but the page has no `<h1>`/`<h2>`). Also `css-cosmos/visualizers`, `css-cosmos/concepts`, `reactcosmos/playground`, `vuecosmos/learn`, `golangviz/playground`. SEO + a11y gap, not the FS-15 empty-page bug. `S`
- [x] **FS-42** **CLOSED in block 10.** `cssviz/utils/specificity.ts` known gaps, pre-existing and unreachable from the UI: `:nth-child(An+B of S)` ignores the `of S` contribution; shadow-DOM functions (`::slotted()`, `:host()`, `::part()`) count as one component; the "Cascade Weight" display heuristic (`ids*100 + classes*10 + elements`) is not true cascade ordering. `S`
- [x] **FS-43** Pre-existing leftovers spotted while fixing the above: 6 unused lucide imports in `cssviz/CssChallengeArena.tsx`; unused `type DockerTopic` import in `dockercosmos/pages/Concepts.tsx`; internal identifiers that no longer match the copy (`LiveGoRunner.tsx:11` `memoryStats`, `app/labs/page.tsx` `passedLabs`, stale "Live Code Execution" comments); unused `Activity`/`Eye`/`Sparkles` in `xrcosmos/pages/SpatialLab.tsx:4`. `S`
- [x] **FS-44** `xrcosmos` hardcoded labels on accent fills, 10 sites (`SpatialLab.tsx:226`, `HandTracker.tsx:155`, `Home.tsx:50,119,131`, `About.tsx:65`, `Learn.tsx:64,76`): measured white on `--xr-primary` **4.24:1**, white on `bg-cyan-600` **3.68:1** — both fail AA at the 10–14 px sizes used, and `HandTracker.tsx:155` is unreadable in light mode. Needs an `--xr-on-primary`/`--xr-on-teal` token decision (or `text-[var(--xr-text)]`). `S`
- [x] **FS-45** **CLOSED in block 10.** `xrcosmos/pages/SpatialLab.tsx`: `rotZ` and `scale` state has **no controls** — only `resetAll` writes them, so they are permanently `0` and `1`. The corrected matrix now teaches their terms symbolically and the UI note says they are held at default, but a lab advertised as 6-DoF wants the two missing sliders. `S`

### Reference patterns established in this block (reuse these)

- **FS-03 dead-CSS fix — copy the `xrcosmos` approach.** `xrcosmos` had 22 dead opacity-modifier utilities. The fix that works is to add explicit pre-mixed custom properties per engine (`--xr-primary-10`, `--xr-teal-20`, `--xr-bg-80`, with light-mode overrides in the engine's `styles.css`) and drop the `/NN` suffix from the class. Side effect worth expecting: `xrcosmos`'s sticky navbar had **no background at all** behind its backdrop-blur; it now has a real tint. Apply the same shape to the other five engines (`tailwindcosmos`, `mqviz`, `wasmcosmos`, `lldcosmos`, `synccosmos`) and to `browseruniverse`'s `bg-base*`/`text-accentSoft`.
- **Verification without the full build.** Scoped Tailwind CLI compile of the edited TSX proves which utilities emit CSS; SSR of the edited components through the repo's own TypeScript + `react-dom/server` catches render-path browser access; headless Chromium against the real compiled CSS catches computed-value bugs (the XR matrix was validated against Chromium's own `getComputedStyle().transform` in 6 probe cases, max error 4.5e-6). Cheaper and more decisive than a board-wide build for single-engine work.

### Note on the audit's severity calibration

The per-engine pass flagged 56 "high" findings. Two claims were re-tested and did not hold as stated: the `lldcosmos`/`microservicesviz` "byte-identical `Home.tsx`" (measured: Navbar ~94%, Footer ~82%, About ~80%, Home ~50% after name normalisation) and the `tsviz` "empty prerender" inference — `tsviz` pages do ship content; what they lack is a heading. Conversely the `webprotocols` empty-page finding was confirmed exactly (the topic definition is provably absent from the pre-rendered HTML), and the `bg-primary` label class was **larger** than any single engine report indicated (26 files).

---

## 11. Block 2 — the dead-CSS class, the heading gaps, and two more empty-page bugs

### The dead-CSS class is now closed repo-wide: 322 → 0

Tailwind v3 cannot apply an opacity modifier to an arbitrary `var()` colour, so `bg-[var(--x-bg)]/80` was emitting **zero CSS** — the element got no background at all. The audit estimated 157 instances in the fullstack domain; the real repo-wide count was **322 across 11 engines**, all now fixed with the reference pattern (explicit pre-mixed custom properties per engine, `/NN` suffix dropped from the class):

| Engine | Before | Engine | Before |
|:---|--:|:---|--:|
| `mqviz` | 48 | `microservicesviz` | 26 |
| `sveltecosmos` | 39 | `synccosmos` | 25 |
| `aicosmos` | 37 | `fastapicosmos` | 24 |
| `wasmcosmos` | 35 | `lldcosmos` | 23 |
| `tailwindcosmos` | 30 | `rustviz` | 4 |
| `crossplatformviz` | 27 | `golangviz` (global `--foreground`) | 4 |

Every engine's sticky navbar had **no background at all** behind its `backdrop-blur`; all now paint a real tint. The last four were a different shape — `text-[var(--foreground)]/90` on the *global* token — and are fixed by using the existing Tailwind colour with its working modifier, `text-foreground/90`.

Each engine was verified by compiling the **real shipped TSX** with the repo's own Tailwind CLI and asserting the new token classes emit rules and zero slash-form selectors remain. That mattered: one agent's first pass silently produced malformed classes (`bg-[var(--rust-surface)]-95)]`) that its synthetic candidate test still passed — only the real-source compile caught it.

### FS-41 split into two different bugs, one of them severe

The heading audit turned out to be hiding something worse. `useSearchParams()` called during render makes Next.js **bail out of static generation for the whole route** and emit the nearest Suspense fallback in place of the page:

- `/tsviz/problems` pre-rendered as a bare `Loading...` — none of the 50 problems in the HTML.
- `/vuecosmos/learn` pre-rendered as `Loading Vue Visualizer...` — no content.

Both are the same severity class as the `webprotocols` bug from block 1, and both are fixed by reading `window.location.search` in an effect after mount, so the deep link still applies on hydration while the page stays statically renderable. The same defect existed **centrally** in `shared/RouterShim.tsx`, which wrapped Next's hook in both `useSearchParams()` and `useLocation()`; that shim is now mount-safe, closing the class for all 20+ engines that import it rather than patching one consumer at a time.

The remaining five were genuine heading gaps (content present, no `<h1>`): `tsviz`'s 50 problem pages (title was a `CardTitle` div → now `h1`, with "Solution" as `h2`), `css-cosmos/visualizers` and `/concepts` (the shared `SectionHeader` gained a `level` prop so page titles can be `h1` while in-page sections stay `h2`), and `golangviz/playground` (had no heading element at all).

### Also closed this block

- **FS-06** — `sveltecosmos` (read-only sample + "not a live compiler"), `tailwindcosmos` ("Utility Sandbox"; it audited all 96 preset class literals and found 95 compile, the 96th being hand-written engine CSS) and `aicosmos` (`RagLab` now states that only keyword mode reads the query, and labels the preset scores as preset). 7 of 9 engines done; `sqlcosmos`, `redisviz`, `nextjscosmos` remain.
- **FS-21** — `crossplatformviz`'s "Gesture Sample Frequency" slider now scales bridge queue depth, latency, FPS and dropped frames; at the default 60 Hz every formula is numerically identical to before, so nothing regressed.
- **FS-23** — `lldcosmos` (22 sites) and `synccosmos` (9 sites) light-mode contrast. Both used the same method: where no single mid-tone can clear AA in both modes the luminance ranges are disjoint (a colour needs L ≤ 0.183 on white but L ≥ 0.209 on the dark surface), so the fix is a shade change plus a `dark:` variant preserving the original dark value — zero dark-mode visual change.
- **FS-50** (new) — `tsconfig.json` now excludes `scratch/`. Agent verification scratch dirs were being typechecked by `tsc --noEmit` because the config includes `**/*.ts`. `scratch/` is gitignored, so it should never have been in the program.

### FS-04 — `browseruniverse`'s undefined tokens, and a regression caught

Three utilities referenced colours that do not exist in `tailwind.config.js`, so they emitted nothing: `bg-base/60|70|80|90` (39 uses), `text-accentSoft` (19) and `shadow-inset` (2), plus three more of the same kind (`text-accentBlue`, `text-accentGreen`, `hover:bg-accentSoft`). The intended colours were recoverable from the engine's **own** pre-existing light-mode remap block, which already mapped `.bg-base*` onto `var(--bu-bg)` — so `base` ≡ `--bu-bg` and the tints are that RGB triple at 60–90 % alpha. The accent tokens already existed and were simply never wired to a utility.

Visible effect in dark mode (the default): the navbar was fully transparent with the ambient gradient blob bleeding through it, and the hero chips, toolbar panels and `live` badges were invisible or rendered in the inherited body colour. Now painted. `shadow-[var(--bu-shadow-inset)]` was probed and **rejected** — Tailwind v3 parses a bare `var()` there as a shadow *colour* and emits no usable shadow — so the working form is `shadow-[inset_0_1px_0_var(--bu-shadow-inset-color)]`.

**This fix introduced a regression that the agent caught and quantified.** Wiring `text-accentBlue`/`text-accentGreen` made two Monaco "live" badges actually render their accent colour — at **3.99:1 and 3.21:1** in light mode, below AA at 12 px, where they previously inherited a 17:1 body colour. Making a dead utility live can *lower* contrast, because the light-mode accent values were never designed to be text. Fixed here with darker shades, ratio-checked by hand: `--bu-accent-blue: #0369a1` (5.8–5.9:1) and `--bu-accent-green: #15803d` (4.9–5.0:1) in the light block only, so dark mode is untouched.

### Block 2 gate — all green

| Check | Result |
|:---|:---|
| `npm run lint` | **0 errors**, 45 warnings (still identical to the pre-work baseline) |
| `npx tsc --noEmit` | **clean** |
| `npm run build` | **exit 0**, **1,985** static pages |
| Pages with no `<h1>` across all 32 fullstack routes | **56 → 0** |
| Dead opacity-on-`var()` utilities repo-wide | **322 → 0** |
| Undefined-token utilities in `browseruniverse` | **61 → 0** |
| `/tsviz/problems` prerendered HTML | **16,402 → 55,609 bytes**, now containing all 50 problems |
| `/vuecosmos/learn` prerendered HTML | **14,931 → 48,928 bytes**, now containing the page |

### New backlog from this block

- [x] **FS-46** `aicosmos` `--ai-card` is **undefined** but referenced 22 times across the `PythonAi*` pages, so those `bg-[var(--ai-card)]` surfaces resolve to nothing. Undefined token, not an opacity modifier — needs a value, not a rewrite. `S`
- [x] **FS-47** `lldcosmos`'s brand tokens all fail AA as *text* on light surfaces (`--lld-primary` 3.52:1, `--lld-emerald` 2.42, `--lld-amber` 2.05, `--lld-cyan` 2.32, `--lld-rose` 3.51, `--lld-purple` 3.78, `--lld-indigo` 4.27 on `--lld-bg`) across ~40 sites including every nav label. Fixing means re-tuning 7 tokens in the light block, which changes this topic's light-mode brand identity — a design decision, not a mechanical fix. `M`
- [x] **FS-48** `tailwindcosmos` still says "JIT Playground" in the nav (`components/Navbar.tsx:15`), `pages/Home.tsx:85` and in `Home.tsx:98,136,150` / `About.tsx:44`. These describe Tailwind's engine rather than claiming typed input compiles, so they were out of the Playground-scoped brief — but the route label is user-facing and worth aligning. `S`
- [x] **FS-49** `crossplatformviz` `BridgeSim.tsx`: the frequency slider is `min=30 max=120 step=30`, so 90 Hz is reachable, but its caption row only labels 30/60/120. `S`
- [x] **FS-25 (duplicate — resolved)** **VERIFIED FIXED in block 10:** `grep -n text-white src/components/visualizers/fastapicosmos/pages/DiGraph.tsx` returns 0 lines; the pending-card labels now use the engine's own tokens. `fastapicosmos/pages/DiGraph.tsx:137` has the same `text-white` on a near-white light surface defect found in its sibling — reported by the synccosmos agent as out of its scope. `S`

---

## 12. Block 3 — the alias route, the doc lies, and two more dead-class families

### FS-29 — `/learn/[slug]` is now an honest alias instead of a fake player

Rather than delete the route (the D3 recommendation), it now `permanentRedirect`s to each topic's canonical `url`. That keeps the old links working, consolidates crawlers, and removes the deceptive surface: the route previously rendered `VisualizerRegistry`, which has **no engine lookup at all** and printed a decorative "Engine Status: Active & Native" panel plus "Initializing visual canvas for {slug}…" for all 72 active topics. `VisualizerShell` and `VisualizerRegistry` are now orphaned (zero references) and are the last dead infrastructure from that subsystem.

### FS-31 — documentation drift brought back in line

Six claims corrected in `README.md`, one in `AGENTS.md`, five in `PROJECT_CONTEXT.md`, one in `public/llms.txt` — each applied with an assertion so a mismatch fails loudly rather than silently skipping. The substantive ones: "55 live topics / 47 engines" → **72 / 70**; "172+ topics" → **245**; "All 34 Complete" → **47**; "Next.js 15" → **Next.js 16** (three files); `public/sitemap.xml` → the generated `src/app/sitemap.ts`; and the `/learn/[slug]` description, which claimed a universal player that never existed. The README routing section also now states the single `/<engine>/[[...slug]]` pattern (70 routes) instead of listing 8 of them. The two remaining "Next.js 15" strings are *subject matter* — the `nextjscosmos` module teaches Next 15 — and are left for a content decision.

### Also closed

- **FS-34** — `websecureviz` progress is now a module-level store read through `useSyncExternalStore`, so `TopicLayout` and `LearningPathNavigator` share one snapshot. Previously each got its own `useState`, so "Mark as Complete" flipped the button while the sidebar checkmarks stayed empty until a reload. (Two self-caught bugs here: the first draft returned a fresh `[]` from `getServerSnapshot`, which makes `useSyncExternalStore` loop during hydration, and hydration now happens in `subscribe` so the snapshot is stable during render.)
- **FS-35** — `websecureviz`'s `prose dark:prose-invert` block replaced with explicit typography. The `@tailwindcss/typography` plugin is **not installed** (`plugins: []`), so it emitted nothing.
- **FS-36** — `programviz` lesson content no longer ships invisible. framer-motion serialises `initial` into the pre-rendered HTML, so `initial={{ opacity: 0 }}` put **five `opacity:0` declarations in every lesson page** and the body only appeared once JS hydrated. The three content-bearing motion elements now use `initial={false}`. Also added the missing accessible name to the icon-only "back to topics" link (`Layout.tsx:62`), which had no text and whose lucide icon is `aria-hidden`.
- **FS-43** — deleted four verified-dead files (`webprotocolsviz/hooks/useTheme.ts`, `websecureviz/components/mode-toggle.tsx`, `websecureviz/components/theme-provider.tsx` — which also carried a stray `"vite-ui-theme"` storage key — and `browseruniverse/hooks/useLocalStorage.ts`); removed an unused `topics` export from `programviz/data/learningPath.ts` (160 → 53 lines) plus the now-orphaned `Topic` import; removed six unused lucide imports from `cssviz/components/CssChallengeArena.tsx` and an unused `type DockerTopic` import from `dockercosmos`.
- **FS-48** — `tailwindcosmos`: nav label and home link now say "Utility Sandbox"; a "zero runtime overhead" claim reworded to what is actually true (classes compile to CSS at build time); "Compiled Class String" → "Applied Class String". The remaining "JIT COMPILATION" chapter title describes Tailwind's engine and stays.
- **FS-49** — `crossplatformviz`'s frequency slider row now labels the reachable 90 Hz stop it was missing.

### Independent verification of block 2 (done by the caller, not an agent)

A single repo-wide Tailwind compile against the real `tailwind.config.js` and the whole `src/` tree:

| Check | Result |
|:---|:---|
| `var()`-based opacity-modifier selectors remaining | **0** |
| Control — valid `var()` utilities still emitted | ✅ (`.bg-[var(--ai-amber-10)]`, …) |
| Distinct pre-mixed token utilities now emitted | **120** — the fixes are live, not just present in source |

The controls matter: a null result from a compile that emitted nothing would be vacuous, which is exactly how one agent's malformed-class bug slipped its first test.

### New findings from this block

- [ ] **FS-51** Two Tailwind plugins whose classes are **already written throughout the codebase** are not installed, so all of them emit zero CSS: `tailwindcss-animate` — `animate-in` / `fade-in` / `slide-in-from-*` used **52 times across 40 files** in ~15 engines — and `@tailwindcss/typography` — `prose` / `prose-invert` used 6 times (including `programviz`'s lesson body, the reference engine). Both verified absent from the compiled output. Adding them is a one-line config change each but **enables 52 latent entrance animations and restyles every `prose` block**, so it changes the look of many pages and is a design decision rather than a mechanical fix. `S` to add, `M` to review the visual delta.
- [x] **FS-52** `redisviz/components/RedisClusterSlotVisualizer.tsx:8-20` contains a **second copy of the fake 31-multiplier hash** under a badge that prints "CRC16(key) % 16384". It is dead code (no importers) but would teach the wrong slot if ever mounted. Delete it or point it at the new `lib/hashSlot.ts`. `S`
- [x] **FS-53** **CLOSED in block 11.** `redisviz/components/visualizers/DiagramCanvas.tsx:77` applies `className={color}` with `bg-blue-500`/`bg-purple-500`/`bg-redis` to an **SVG `<rect>`** — `background-color` does not paint SVG shapes (only `fill` does), so the colour-coding strip is very likely invisible. Not render-verified (no headless browser available in the agent's sandbox). `S`
- [x] **FS-54** **CLOSED in block 11.** `redisviz/components/visualizers/CommandSimulator.tsx:101` hardcodes `bg-slate-900` (a dark terminal skin) while inheriting `text-foreground`, giving **1.11:1 in light mode**; its reset button rest state is `text-slate-400` = 2.56:1. Needs a small restyle of that panel, not a token swap. `S`
- [x] **FS-55** **CLOSED in block 11.** `redisviz` mode-invariant sub-AA items reported but not changed because they are constant across themes and carry the node colour-coding: `ClusterSimulator.tsx:118` white icon on `amber-500` = 2.15:1 (blue-500 3.68, purple-500 3.96), and `ReplicationSimulator.tsx:61` white on `bg-white/20` over redis = 3.75:1. `S`

### FS-47 — `lldcosmos` light palette, and a correction to the audit's own numbers

The light block overrode only the neutral tokens and left **every brand colour at its dark-optimised value**, so all seven failed AA as text on all three light surfaces (worst: `--lld-amber` at **1.96:1** on `--lld-surface-2`). Each was replaced with the *lightest shade of the same Tailwind hue* that clears 4.5:1 on the worst surface **and** on that token's own tinted pill — which is why `blue-600` (4.72 on a plain surface) was rejected: it drops to 4.02 on the `--lld-primary-15` pill. Worst-case ratios after: primary-text 6.12, indigo 5.74, emerald 5.01, amber 6.47, cyan 6.63, purple 6.37, rose 5.74, muted 5.02.

**A token split was necessary, not optional.** `--lld-primary` carries 56 *text* usages but also 8 solid fills behind white labels; darkening it would have changed the brand fill and desynced the `-10/15/20/30` tints. So the fill keeps `#3b82f6` in both themes and all 56 text sites were re-pointed at a new `--lld-primary-text` (dark value identical to the fill, so zero rendered dark change). Verified: 27/27 dark-resolving tokens byte-identical before and after.

Two corrections worth keeping, because both contradict the audit:

1. **The audit's blast radius was wrong.** FS-47 claimed "~40 sites across 7 tokens". Measured: `--lld-indigo`, `--lld-amber` and `--lld-cyan` have **zero** call sites anywhere in the repo — they were only declarations. The real load was `--lld-primary` (56) and `--lld-muted` (66). All 130 text call sites are now on AA-safe tokens. The three unused tokens were still re-tuned so the layer is correct by construction rather than only where it is currently reached.
2. **A missed instance of the same class:** `lldcosmos/data/topics.ts` group badges used bare `text-{emerald,amber,purple,cyan,blue}-400` with no `dark:` variant on a tinted pill — **1.42–2.15:1** in light mode. The earlier pass fixed this exact pattern in `Home.tsx`'s solid cards and missed the data file. Now `-700`/`-800` with `dark:` variants restoring the originals.

A token change cannot reach everything, and the agent correctly reported rather than forced: white on the solid `bg-[var(--lld-primary)]` fill measures **3.68:1** at 8 sites — but that is *identical in both modes*, because the fill is theme-invariant, so it is a brand-palette decision (switching those 8 fills to the already-defined `--lld-primary-hover` at 5.17:1 would fix it) rather than a light-mode defect. Same for white on `bg-emerald-600` (3.77:1).

---

## 13. Block 4 — FS-06 closed, and the redirect verified on a real server

### FS-06 is now complete: 9 of 9 engines

The last three were substantive, not cosmetic.

**`sqlcosmos` got a real evaluator, not a relabel.** The presets and the page's *initial* view both use a JOIN plus `WHERE o.total > 100`, so honest copy alone would have meant deleting presets and still leaving the first screen unverifiable. There is now a dependency-free tokenizer + parser + evaluator (`lib/sqlSubsetEvaluator.ts`, 370 lines) supporting `SELECT * | col | alias.col [AS x]`, `FROM users|orders [alias]`, one `[INNER] JOIN … ON a.x = b.y`, and `WHERE` with `= != <> > < >= <=` joined by `AND`. **Everything outside that subset is refused with an explanation and zero rows**, so it cannot fabricate output — the old `q.includes(...)` heuristic silently returned all four users for any query it did not recognise, including `WHERE role = 'developer'`.

Independently re-verified by the caller against the shipped module (not the agent's harness):

| Query | Rows | Expected |
|:---|--:|:---|
| `SELECT * FROM users WHERE role = 'developer';` | **2** | 2 — and the returned roles are exactly `["developer","developer"]` (was 4, including `admin` and `designer`) |
| `SELECT u.name, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id;` | **4** | 4 |
| `SELECT * FROM orders;` | **4** | 4 |
| default query with `WHERE o.total > 100` | **3** | 3 — the 99 total is correctly excluded |
| `SELECT COUNT(*)`, `DROP TABLE`, unknown table | **0** | refused with a readable note |

7/7 independent checks pass. The hardcoded `Execution Time: 0.042 ms` is now a real `performance.now()` measurement rendered only after mount (avoiding an SSR text mismatch).

**`nextjscosmos`** and **`redisviz`** were covered above; the redisviz hash now reproduces the published `CLUSTER KEYSLOT` vectors.

### FS-29 verified end-to-end on a real production server

The `__next_error__` shell that `/learn/<slug>` pre-renders looked alarming, so rather than trust it I ran `next start` on port 3111 and curled it:

```
GET /learn/program-cosmos -> 308 -> /fullstack/program-cosmos
GET /learn/jsviz          -> 308 -> /fullstack/jsviz
curl -L /learn/jsviz      -> 200 at /fullstack/jsviz
GET /fullstack/jsviz      -> 200 (the real engine)
```

The shell is simply how Next emits a build-time redirect. The fake "Engine Status: Active & Native" placeholder is confirmed gone from the HTML (0 occurrences). The test server was stopped and the DSH GUI checked as unaffected.

### FS-25 closed for the enumerated instances; FS-44 and FS-46 done

- **FS-44** (xrcosmos, 8 sites) and **FS-46** (`--ai-card` undefined across 22 surfaces) are done. `--ai-card` was **never declared in any revision** of the file; the fix is one declaration aliasing the surface the `.ai-card` class already paints, browser-verified: computed `background-color` went `rgba(0,0,0,0)` → `rgb(255,255,255)` light / `rgb(13,13,15)` dark.
- Two token splits were required rather than optional, and both are the same lesson: **one token cannot serve as both a fill and as text**. `xrcosmos`'s `--xr-primary` has 69 `var()` consumers and is *also* used as text; darkening it would have dropped dark text contrast 4.72 → 3.51. So new `--xr-primary-solid` / `--xr-primary-solid-hover` / `--xr-on-accent` tokens carry the fills. On `#8b5cf6` **no** text colour reaches 4.5:1 (near-black gives 4.22, and fails on hover at 3.69), so the fill itself had to move — that is arithmetic, not preference.
- **FS-57** — `SqlJoinsVisualizer`'s inline sample data contradicted `SqlPlayground`'s tables **on the same Home page**: it claimed `order #102 → Bob` (canonical: user 1, Alice), `orders.user_id: [1,1,2,4]` (canonical `[1,1,2,3]`), and "users (Outer Table, 100 rows)" against 4 sample users. All three corrected against `lib/sqlSubsetEvaluator.ts`, which is now the single source of truth for the example data.

### New findings from this block

- [x] **FS-56** `sqlcosmos/components/ExplainPlanVisualizer.tsx` renders hardcoded `EXPLAIN` output — "100,000 Rows Table", "Execution Time: 42.140 / 0.082 / 0.031 / 0.412 ms" — with no query input. Nothing claims the learner's query ran, but the numbers read as measured. Minimal fix: label the plan and the timings as illustrative. `S`
- [x] **FS-58** `fastapicosmos/pages/DiGraph.tsx:113-118` renders pending cards at `opacity-50`, and the lab **loads in that state** — so the best achievable light-mode text contrast on them is **3.79** with pure black. No colour choice can pass; the de-emphasis technique itself (opacity) has to change to a border or dashed treatment. This defeats half of the contrast fix applied to that file. `S`
- [x] **FS-59** 8 sites use white on `bg-[var(--fastapi-primary)]` (`#059669`) = **3.77:1 in both modes** — the identical class fixed in `xrcosmos` under FS-44, left for consistency because it spans 5 files in the sibling engine. Mirroring the FS-44 fix (`--fastapi-primary-solid` + on-accent token) would close it. `S`
- [x] **FS-60** `fastapicosmos`: `--fastapi-teal` used as text is **2.54:1 on white** across **56** `text-[var(--fastapi-teal)]` sites — a token-layer fix in the light block, like FS-47 was for `lldcosmos`. `S`
- [x] **FS-61** `xrcosmos`: **64** `text-[var(--xr-primary)]` sites measure **4.05:1 light / 4.72 dark** — the token is fine as a fill but marginal as text, and (per FS-44) cannot simply be darkened. Needs the same text/fill split applied to the text side. `S`
- [x] **FS-62** `aicosmos`: pre-existing light-mode accent palette failure across ~70 label sites (`blue-400` 2.54:1, `amber-400` 1.67, `emerald-400` 1.92, `cyan-400` 1.81, tinted chips 1.24–2.52). Independent of the `--ai-card` bug; a blanket `-600` swap is also wrong on the `bg-black/30` blocks, so it needs per-context accent tokens. `M`
- [x] **FS-63** `jsviz`: `Problem.jsx:103` uses `bg-brand-lime/10`, which emits no CSS (`brand-lime` exists only as a hand-written class in `index.css`, not as a Tailwind colour) — the badge tint is missing. The same `text-gray-400 hover:text-white`-on-light pairing also remains in `jsviz/pages/Practice.jsx:110` and `pages/Topic.jsx:146` (≈1.06:1 hover in light mode). `S`
- [x] **FS-64** **CLOSED in block 9 — all 37 shells server-render.** **FS-39 is far larger than the three engines first flagged.** Measured across all 1,983 pre-rendered pages: **687 have no `<h1>` at all**, and the fullstack domain is now clean (0) — the remainder is the client-only-shell class, concentrated in ~13 non-fullstack engines (`learn` 72, `solidityviz` 53, `ptopblockchain` 52, `k8scosmos` 52, `merkletreeviz` 40, `stringalgoviz` 37, `aimathviz` 37, `patriciatrie`/`loadbalancing`/`gitcosmos`/`evminternals`/`cryptviz`/`consensusviz`/`cloudcosmos` 36 each) plus the 23 long-named `corecs`/`security` routes at 2 each. These render as ~9.6 KB shells because their routes are `dynamic(..., { ssr: false })`. `L`

---

## 14. Block 5 — FS-64 root cause found, and a working proof-of-concept

### The 687 heading-less pages have one root cause

`grep -rlE "= *dynamic\(" src/app` → **37 shells** wrap their engine in `dynamic(import(...), { ssr: false })`. That is why those pages pre-render as ~9.6 KB shells: the components are never rendered on the server, so there is no content **and** no heading. FS-39 (three engines with a desynced theme key) and FS-64 (687 pages with no `<h1>`) are the same defect seen from two angles.

I measured what actually blocks server rendering per engine, to size the fix honestly:

| Engine | theme storage reads | `document`/`window` | non-determinism |
|:--|--:|--:|--:|
| `patriciatrie` | 6 | 14 | 1 |
| `consensusviz` | 3 | 10 | **18** |
| `aimathviz` | 3 | 20 | **15** |
| `blockchainviz` | 3 | 2 | 10 |
| `cryptviz` | 4 | 7 | 6 |
| `loadbalancing` | 0 | 9 | 2 |
| `cloudcosmos` | 3 | 6 | 3 |
| `merkletreeviz` | 1 | 2 | 5 |

Two of these are worth calling out because they correct an earlier assumption of mine: **`aimathviz` and `gitcosmos` are not hazard-free** — a first scan suggested they were, because a narrow filter hid the hits. `aimathviz` has 20 DOM references and 15 non-deterministic values (including `Math.random()` in a particle simulation and `new Date().getFullYear()` in its footer, a classic hydration mismatch); `gitcosmos` has 7. So `ssr: false` was not pure copy-paste caution — but it also is not needed once the hazards are gone.

### A working proof-of-concept: `gitcosmos` is now server-rendered

`gitcosmos` was the most tractable (7 browser references, 1 `Date.now()` in a store action that only runs from event handlers). Three changes:

1. `context/ThemeProvider.jsx` — rewritten as a thin adapter over the shared provider. It previously held its own `'gitcosmos-theme'` storage key and read `localStorage` + `matchMedia` in a `useState` initialiser, so it both desynced from the site toggle and blocked server rendering. **While doing this I found that nothing in the engine ever mounted its `ThemeProvider`** — `Layout.jsx` and `ConceptPage.jsx` both called `useTheme()` with no provider anywhere, so the old implementation would have thrown. The adapter now reads the shared provider directly and its `ThemeProvider` export is a pass-through, so no mount is required.
2. `pages/ConceptPage.jsx` — the `document.documentElement.classList.contains('dark')` sniff in a `useState` initialiser plus a `MutationObserver` is replaced by the shared `resolvedTheme`. That removes a hydration mismatch as well as the server-render blocker.
3. `src/app/gitcosmos/[[...slug]]/RouteClientShell.tsx` — the four `dynamic(..., { ssr: false })` calls are static imports.

Verified so far: all three files parse clean (TypeScript parser), the engine's render path now has **0** browser-API references (the single remaining grep hit is the word `localStorage` inside a doc comment), and the count of shells with a real `dynamic(...)` call dropped **37 → 36** with `gitcosmos` at 0.

**Verified by building it.** `npm run build` exit 0, and the result is larger than the conversion itself — because removing `ssr: false` exposed a **pre-existing routing bug** that the client-only rendering had been hiding:

| gitcosmos | before | after |
|:---|--:|--:|
| routes pre-rendered | 36 | **128** |
| with an `<h1>` | 0 | **126** |
| rendering "Concept not found" | 32 | **0** |

The route's `generateStaticParams` named **8 ids that do not exist** in the concept data (`git-architecture`, `commits-trees`, `branches-head`, `merge-rebase`, `cherry-pick-revert`, `reset-checkout-restore`, `remote-tracking`, `stash-reflog`) while the data holds **31 completely different** ids (`version-control`, `repository`, `commit`, …). So every concept page rendered "Concept not found" **and the 31 real concepts were never generated at all** — the identical defect class to the `webprotocols` route from block 1. `generateStaticParams` now derives from `allConcepts`. That is exactly the value of server-rendering: the bug was invisible while the page was client-only.

Repo-wide pages with no `<h1>`: **687 → 652** (total pages 1,983 → 2,075, as gitcosmos went from 36 shells to 128 real pages). The fullstack domain remains at **0**.

The remaining 36 routes each need the same three-step treatment before their `ssr: false` can be removed. Sizing above; FS-64 stays `L`.

### New findings from this block

- [x] **FS-65** **CLOSED in block 10.** `xrcosmos`'s sibling brand-text tokens fail light mode worse than `--xr-primary` did, and need the same `*-text` split applied in FS-61: `--xr-teal` `#14b8a6` across **12 sites** measures **2.27–2.49:1** (its own 10 % tint 2.17), `--xr-rose` `#f43f5e` across 3 sites 3.35–3.67:1, `--xr-emerald` `#10b981` across 1 site 2.32–2.54:1. `S`
- [x] **FS-66** **CLOSED in block 10.** `xrcosmos` hard-coded palette text also fails light mode: `text-red/green/blue-400` 1.74–2.77:1 on white (`SpatialLab` slider labels), `text-amber-400` 1.54:1 on its own tint (`Home` "2D Pixels" badge), and `data/topics.ts` `badgeColor` `text-*-400` on 10 % tints 1.58–2.30:1 (`Learn` group badges, 5 groups). Plus `SpatialLab`'s 9 px matrix sublabel at `opacity-75` = 3.40:1. `S`
- [ ] **FS-67** `jsviz` residuals the FS-63 pass found but did not own: `Practice.jsx:121` "NO_DATA_FOUND" 4.40:1 light / 3.66:1 dark, `:62` `placeholder-gray-500` same, `:101-104` difficulty labels ("Easy/Intermediate/…") **2.07–3.42:1 in light mode** (green-500 2.07, orange-500 2.55, blue-500 3.35, red-500 3.42), and `:87` unchecked checkbox border 2.34:1 in dark. Also four more dead `bg-brand-lime/10` tints at `Topic.jsx:98,123,178,226`. `S`
- [x] **FS-68** **CLOSED in block 10 (with a correction to the item's scope).** Root cause behind several of the above, in **shared** `src/index.css`: `--text-muted: #71717a` is 4.83:1 on `--bg-main` (#ffffff) but only **4.40:1 on `--bg-surface`** (#f4f4f5). Darkening it (e.g. zinc-600 `#52525b` → 7.03:1) would fix `jsviz` Practice:62/121, the resting icons just converted to that token, and every other `--text-muted`-on-`--bg-surface` site app-wide in one change. Deliberately not done by an engine-scoped agent because the file is shared — needs an owner. `S`

---

## 15. Block 6 — FS-58/59/60 closed in `fastapicosmos`, and the recurring multi-role-token trap

Three tickets in one engine, all three needing a judgement call rather than a swap.

**FS-60** — `--fastapi-teal` is **multi-role**: 56 text sites *plus* 6 non-text consumers (3 `border-`, 1 `bg-`, 1 `ring-`, 1 `accent-`). So it was split rather than re-tuned: new `--fastapi-teal-text`, re-tuned to `#047857` in the light block and **pinned to `#10b981` in the dark block** so dark resolves byte-identically. Light went from 2.32–2.54:1 to **5.01–5.48:1**; dark unchanged at 4.92–7.70:1. The chosen `#047857` is already this engine's own `--fastapi-primary-hover`, so no new hue entered the palette.

**FS-59** — the 8 white-on-`--fastapi-primary` sites failed **in both modes** (3.77:1), so no `dark:` guard was appropriate — the fill itself had to move. Mirrored the `xrcosmos` shape: `--fastapi-primary-solid` / `--fastapi-primary-solid-hover` / `--fastapi-on-accent`, theme-invariant. Now 5.48:1 rest / 7.68:1 hover in both modes. Consumer counts were checked first: 8 `bg-`, 5 `hover:bg-`, **0** text, **0** border.

**FS-58** — the real find. `DiGraph.tsx` de-emphasised pending cards with `opacity-50`, and the lab **loads in that state**, capping achievable light-mode text contrast at 3.79 even with pure black — so no colour choice could ever pass. The technique was replaced with `border-dashed` (pending) vs `border-solid` (resolved), which de-emphasises without multiplying the card's alpha. Border-style-only was deliberate: `node.color` owns the card's `bg-*`/`border-*`, and overriding a same-property utility from a ternary is not deterministic in Tailwind (source order decides, not class-string order).

Two things that fix uncovered:
- The **resolved** state was also failing — `opacity-90` still measured 4.15–4.44:1 in light. Both states now clear AA.
- The **pending status text was failing in dark too** (3.28–3.66:1), which the light-mode framing of the ticket had hidden. Now 9.11–10.63:1.

Dark-mode summary for the block: FS-60 byte-identical; FS-59 and FS-58 improve in dark because both defects existed there as well.

Emit sweep was done the thorough way: all **38** distinct `[var(--fastapi-*)]` utility classes in the engine were compiled — **38 emit, 0 dead** — which also confirms the earlier `/10 → -10` conversions left no invalid `bg-[var(--x)]/30` behind.

### New findings from this engine

- [x] **FS-69** **CLOSED in block 11.** `fastapicosmos` `--fastapi-muted` (`#64748b`) is used as text at **59 sites** and measures **4.34:1 on `--fastapi-surface-2`** in light mode — below AA for normal text (4.55 on bg, 4.76 on surface). This is the same value `lldcosmos` already fixed to `#5b6a80`, so the precedent exists. One-line light-block change. `S`
- [x] **FS-70** **CLOSED in block 11.** `fastapicosmos` sibling brand tokens used as text, same class as FS-60: `--fastapi-sky` (`#38bdf8`) at **6 sites**, 1.90–2.14:1 light; `--fastapi-purple` 1 site 3.61 light / 3.70 dark; `--fastapi-rose` 1 site 3.35 / 3.98. The last two fail in **both** modes. `S`
- [x] **FS-71** **CLOSED in block 11.** `fastapicosmos` unguarded Tailwind-palette text with no `dark:` restore, ~22 occurrences: `text-emerald-400` ×11 (worst 1.75:1), `text-amber-300` ×3 (1.32), `text-sky-400` ×2, `text-rose-400` ×2, `text-amber-400` ×2, `text-emerald-300` ×2. The engine's `DiGraph` node cards already had this fixed; the rest of the engine did not. `S`
- [x] **FS-72** **CLOSED in block 11.** `fastapicosmos` `disabled:opacity-40` on the two solid primary buttons composites the white label to ≈1.84:1 in light mode. Disabled controls are WCAG-exempt, so this is cosmetic rather than a failure — recorded so it is not re-discovered as a bug. `S`

---

## 16. FS-27a — the ten reactcosmos visualizers are no longer static diagrams

The audit's measurement was blunt: all ten per-topic visualizer components had **0 `useState` and 0 `onClick`**, so 35 of the engine's 36 topic pages offered the learner nothing to do but watch. They are now interactive, and — the part that matters for AGENTS.md §5 — **each uses a mechanism native to its own concept rather than a shared stepper**.

Independently re-measured by the caller:

| file | useState | onClick | lines |
|:--|--:|--:|--:|
| `WhatIsReactVisualizer` | 0 → **3** | 0 → **1** | 100 → 189 |
| `DeclarativeUIVisualizer` | 0 → **7** | 0 → **4** | 82 → 232 |
| `VirtualDOMVisualizer` | 0 → **6** | 0 → **6** | 81 → 406 |
| `StateUpdatesVisualizer` | 0 → **7** | 0 → **5** | 74 → 258 |
| `EventHandlingVisualizer` | 0 → **6** | 0 → **16** | 66 → 257 |
| `ControlledUncontrolledVisualizer` | 0 → **5** | 0 → **3** | 65 → 183 |
| `ConditionalRenderingVisualizer` | 0 → **7** | 0 → **3** | 63 → 233 |
| `PropsFlowVisualizer` | 0 → **6** | 0 → **3** | 63 → 194 |
| `JSXCompilationVisualizer` | 0 → **2** | 0 → **1** | 62 → 311 |
| `CompositionVisualizer` | 0 → **4** | 0 → **5** | 56 → 244 |

**The differentiation is auditable, not asserted.** I extracted the state shape of each file and no two share a feedback model — `WhatIsReact` tracks `energy`/`handEdit`; `DeclarativeUI` tracks `manualWrites`/`derivedWrites`/`dom`; `VirtualDOM` tracks `tree`/`prevTree`/`keyed`/`selectedId`; `StateUpdates` tracks `queue`/`batched`/`renders`/`lastFlush`; `EventHandling` tracks `handlers`/`stops`/`trace`; `ControlledUncontrolled` tracks `digits`/`refused`/`probe`; `ConditionalRendering` tracks `cleared`/`authed`/`strategy`/`epoch`; `PropsFlow` tracks `illegal`/`frozen`/`user`; `JSXCompilation` tracks `source`; `Composition` tracks `placements`/`target`/`api`.

The strongest of these are the ones that make an abstract claim *observable* rather than stated:
- **Virtual DOM** runs a real recursive diff and reports walked-vs-written node counts, with a `key={id}` switch — a keyed insert costs 1 mount while the unkeyed case costs 3 text rewrites plus a mount. The learner sees *why* keys matter instead of being told.
- **State Updates** builds an update queue: three `setCount(count+1)` calls fold to nothing (stale capture) while three `setCount(c => c+1)` calls fold to 3, and a batching toggle changes renders-per-update.
- **Conditional Rendering** proves unmount-vs-`display:none` with a stateful child: its cleared counter survives a hide and dies on unmount (the instance number bumps).
- **Props Flow** lets the learner attempt `props.user = "Hacked"` and watch the next render silently erase it, with the legal route being the `onRename` callback prop.
- **JSX Compilation** is a real recursive-descent compiler over an editable textarea, emitting `_jsx(...)` calls, tag/prop counts and parse errors — not a canned string.

**SSG safety re-verified:** grep for `window`, `document`, `Math.random`, `Date.now`, `localStorage`, `navigator` across all ten files returns **zero matches**; the only browser-touching code is inside handlers (`ref.current.value` read/write, `(e.target).closest(...)`) and one `useEffect`. All initial state is constant, so the server HTML matches the first client render — no mount guards needed. The agent additionally proved it with a temporary server-render smoke test (12 assertions, both `isExecuting` values) and then deleted the file, so the engine directory gained no test scaffolding. New colours are Tailwind `-700`/`-400` pairs with computed ratios (worst case 4.57:1 on `bg-muted`).

### Remaining parts of FS-27

- [ ] **FS-27b** `vuecosmos` — **~52 topics** render through one `makeDetail()` fallback: the same state→track→effect diagram for 51 of 52, and an identical definition/analogy/five-steps/three-mistakes body for 49 of 52 (`data/topics.ts` holds only 3 real entries). This is content writing, not a mechanical fix. `L`
- [ ] **FS-27c** `apiviz` — all **15** pre-rendered topic pages render one template: the same request/response trace with only `topic.name` and `topic.slug` substituted, plus the same two hardcoded tradeoff bullets. `M`
- [x] **FS-27d** **CLOSED in block 10 — I checked, and the item's premise does not hold.** The claim was that the page-level "Animate Update" button in `reactcosmos/pages/topics/TopicWrapper.tsx` is "ambient rather than load-bearing (the ten visualizers above no longer depend on it)". Measured: **all ten** visualizers consume `isExecuting` and use it to drive markup — `WhatIsReactVisualizer` rotates an element and reveals a panel only while it is true (`animate={isExecuting ? { rotate: 360 } : { rotate: 0 }}`, plus an `isExecuting &&` reveal), `JSXCompilationVisualizer` references it 5 times with 4 conditionals, and the other eight each have at least one conditional on it. The fallback panel used by the remaining ~26 topic pages flips its state/effect rows and status labels on the same boolean. So the control is not inert and not redundant: with `isExecuting` false those pages are static. The genuine residual is smaller and different — the animation is cut off by a hard-coded `setTimeout(…, 2000)` rather than the animation's own completion, so a visitor sees it stop mid-flight. That is a polish issue, not a fake control, and it is recorded here rather than re-opened. `S`

---

## 17. FS-64 progress — the recipe now scales

The gitcosmos proof-of-concept was repeated on two more engines, and the same recipe worked unchanged: remove render-path browser access and non-determinism, then replace `dynamic(..., { ssr: false })` with static imports.

| engine | pages before | pages after | with `<h1>` | avg page size |
|:--|--:|--:|--:|--:|
| `gitcosmos` | 36 shells | **128** | **128** | 20,650 B |
| `stringalgoviz` | 37 shells | **105** | **103** | 26,919 B |
| `merkletreeviz` | 40 shells | **40** | **40** | 29,046 B |

Shells using `dynamic(..., { ssr: false })`: **37 → 34** (two more engines in progress at the time of writing). The conversion is mechanical once the hazards are gone — the recipe is three steps and has now been applied four times without variation.

Two more engines gained content, and `stringalgoviz` went from 37 routes to 105 — the same signature as gitcosmos, where removing `ssr: false` exposed a `generateStaticParams` list that did not match the data, so the real items had never been generated.

**Repo-wide pages with no `<h1>`: 687 → 573** (out of 2,143 pages; the total grew as the converted engines began emitting their real routes). The fullstack domain remains at **0**.

One clarification on that number: **72 of the 573 are `/learn/<slug>` redirect stubs**, which correctly contain no heading — a redirect has no content to head. Excluding them, the genuine remaining gap is **501**, concentrated in `solidityviz` 53, `ptopblockchain` 52, `k8scosmos` 52, `aimathviz` 37, `patriciatrie` 36, `loadbalancing` 36 and `evminternals` 36 — the engines still on `ssr: false`.

---

## 18. FS-26 — chrome differentiated, and the residual named

The two engines' cloned chrome was rewritten so each is its own, and the measurement moved accordingly (normalised similarity, engine identifiers and digits stripped):

| pair | before | after |
|:--|--:|--:|
| `components/Navbar.tsx` | 94.7% | **43.8%** |
| `components/Footer.tsx` | 83.7% | **28.7%** |
| `pages/About.tsx` | 77.8% | **36.7%** |
| `pages/Home.tsx` | 46.0% | **33.2%** |

I spot-checked the result independently rather than trusting the harness: the file line counts now diverge (`Navbar` 269 vs 292, `Footer` 146 vs 160, `About` 251 vs 291, `Home` 350 vs 445) and the shared-literal-string count — a blunt clone tell — is down to **2** in the navbar and **0** in the footer.

Crucially, **the chrome was not extracted into shared infrastructure.** That was my earlier recommendation (D5) and it was wrong: a navbar is *visible experience*, and AGENTS.md §5 permits sharing only *invisible* infrastructure. Extracting it would have made the sameness structural and permanent — the opposite of the rule. Each engine's chrome now speaks its own subject's language, drawn from content the engine already had: `lldcosmos` groups modules by responsibility with a "responsibility ledger" that classifies the current route, a Design Ladder ordered principles → GoF families → case study, and About as CRC cards; `microservicesviz` renders routes as mesh hops in an incident lifecycle, an Architecture path where each node names the failure mode it owns, and About as a reliability drill sheet with a blast-radius matrix.

**Residual, flagged honestly by the agent and confirmed by me:** `pages/Learn.tsx` (**151 vs 151 lines**) and `pages/TopicDetail.tsx` (**188 vs 188 lines**) are still clones at ~92.7% / 92.4%. They were outside the five enumerated items. Recorded as FS-73.

### The insight worth carrying forward

The `solidityviz`/`evminternals` agent proved empirically, in an isolated throwaway Next app, that **both engines pre-rendered correctly with static imports even before their theme hazards were removed.** Their theme providers are mounted only in the engines' `App.tsx`, and `App.tsx` has **no importers anywhere** — so those `localStorage`/`matchMedia` calls never execute during SSR, and `ssr: false` was over-cautious rather than load-bearing.

That is a cheap triage step for the remaining shells:

```bash
grep -rn "ThemeProvider\|useTheme" src/components/visualizers/<engine>/
# then check whether the provider is reachable from the shell's import graph —
# most absorbed engines have an unused App.tsx that mounts it while the shell
# imports only pages/*
```

If the provider is unreachable, the shell conversion alone ships pre-rendered content; the theme adapter is still worth doing because it fixes the engine/site theme desync, but it is not what blocks SSR.

### Third instance of the phantom-id bug

`stringalgoviz`'s `generateStaticParams` listed 8 ids, 3 of which do not exist (`naive-search`, `trie-structures`, `suffix-array` — the real ids are `naive-matching`, `trie-search`, `suffix-arrays`), and **20 of its 25 authored topics were never generated at all**. Proven by rendering: `/learn/naive-search` produced exactly **87 bytes** — `<div class="min-h-screen w-full bg-background text-foreground transition-colors"></div>` — because `TopicDetail` bounces unknown ids through `<Navigate>`, which renders null. Routes went **38 → 106**. `merkletreeviz` was checked programmatically and has **no** such bug (9/9 ids resolve).

That is now three confirmed instances of the same defect (`webprotocols`, `gitcosmos`, `stringalgoviz`), all found only because these routes had to render on the server. It is worth a repo-wide audit of every hand-written `generateStaticParams` id list against its data source — recorded as FS-74.

### New findings

- [ ] **FS-73** `lldcosmos`/`microservicesviz` residual clones: `pages/Learn.tsx` (151 vs 151 lines, ~92.7% identical) and `pages/TopicDetail.tsx` (188 vs 188, ~92.4%). The chrome is differentiated; these two content pages are not. `M`
- [x] **FS-74** Audit **every** hand-written `generateStaticParams` id list against its data source. Three confirmed instances so far (`webprotocols` 7 phantom ids, `gitcosmos` 8, `stringalgoviz` 3) each silently hid real content — in `stringalgoviz`'s case 20 of 25 topics. A script that cross-checks each list against the engine's exported data would find the rest in one pass. `M`
- [ ] **FS-75** Four decorative swatches in `microservicesviz` (emerald/amber status dots and breaker states) measure 2.0–2.5:1 in **light mode only**, because they reuse dark-tuned `--ms-emerald`/`--ms-amber`. They are `aria-hidden`, never the sole carrier of state (each sits beside a `--ms-text` label), and re-tuning them was correctly judged out of a chrome-differentiation scope. One-line light-mode shades would close it. `S`
- [x] **FS-76** **CLOSED in block 9.** `stringalgoviz` `/playground` and `/lab` pre-render 41.9 KB of real content but have **no authored `<h1>`** — the page's top heading is a small `<h2>` section label. Pre-existing content gap, flagged rather than invented. `S`

---

## 19. Block 7 — five engines converted, and the phantom-id bug is systemic

### FS-64 progress: five engines now server-render

| engine | pages | with `<h1>` | "not found" | avg page |
|:--|--:|--:|--:|--:|
| `gitcosmos` | 128 | **128/128** | 0 | 20,650 B |
| `stringalgoviz` | 105 | **103/105** | 0 | 26,919 B |
| `merkletreeviz` | 40 | **40/40** | 0 | 29,046 B |
| `solidityviz` | 101 | **99/101** | 0 | 29,257 B |
| `evminternals` | 48 | **48/48** | 0 | 25,479 B |

Shells using `dynamic(..., { ssr: false })`: **37 → 32**. Repo-wide pages with no `<h1>`: **687 → 484** (of 2,203; 72 of those are `/learn` redirect stubs, which correctly have no heading, so the genuine gap is **412**).

### The phantom-id bug is systemic — five confirmed instances

| engine | ids listed | phantom | real items never generated |
|:--|--:|--:|:--|
| `webprotocols` | 11 | 7 | 10 of 14 |
| `gitcosmos` | 8 | 8 | **31 of 31** |
| `stringalgoviz` | 8 | 3 | **20 of 25** |
| `solidityviz` | 12 | **10** | **22 of 24** |
| `evminternals` | 8 | 7 | **10 of 11** |

Thirty-five phantom ids and **93 real pages that were never generated at all**, each hidden behind a route that was client-only so nobody could see the HTML was empty. The symptom is always the same: hand-written `generateStaticParams` id lists that drifted from their data source. `stringalgoviz`'s `/learn/naive-search` rendered exactly **87 bytes** — a single empty `<div>` — because the page bounces unknown ids through `<Navigate>`, which renders `null`.

This is FS-74 and it is now the highest-value remaining item: every other engine with a hand-written id list is a candidate.

### A cheaper triage for the remaining 32 shells

Both conversion agents independently established that **`ssr: false` was over-cautious, not load-bearing**, for these engines: their theme providers are mounted only by each engine's `App.tsx`, and **nothing imports `App.tsx`**. The providers' `localStorage`/`matchMedia` initialisers therefore never execute during SSR at all. One agent proved it empirically by building the pre-fix code with static imports in an isolated throwaway Next app and watching it pre-render correctly.

That gives a two-minute triage per shell:

```bash
grep -rn "ThemeProvider\|useTheme" src/components/visualizers/<engine>/
# Is the provider reachable from the shell's import graph? Most absorbed engines
# have an unused App.tsx mounting it while the shell imports only pages/*.
```

If it is unreachable, the shell conversion alone ships pre-rendered content; the theme adapter is still worth doing because it fixes the engine/site theme desync (and in `solidityviz`'s case a dead `"system"` branch was pinning Monaco to `vs-dark` even on a light page), but it is not what blocks SSR.

### FS-62 — `aicosmos` light palette, and a premise of mine that was wrong

I had assumed some pastel labels sat on `bg-black/NN` blocks that are dark in **both** modes, which would make a blanket darkening wrong. The agent checked instead of assuming and **inverted the premise**: `bg-black/20|30|40` composites to *light* greys in light mode (`#ccc` / `#b3b3b3` / `#999`), so labels inside those blocks were failing in **light** — `blue-400` in `black/30` = **1.21:1**, `emerald-400` in `black/40` = **1.48:1**, exactly the FS-62 numbers. It used the safe shape anyway (shade change + `dark:` variant restoring the original), so dark cannot break regardless.

Result: **103** light-mode `-400` sites classified into buckets (48 on light surfaces, 53 on accent tints, **0** genuinely dark-in-both-modes, 2 on mode-split overlays), plus **72** more sites at `-500`/`-300`/`-200`/`-100` and **34** accent-token text sites found and fixed — **208 lines across 22 files**. Typical moves: `emerald-400` 1.92 → **5.48:1**, `amber-400` 1.67 → **5.02**, `cyan-400` 1.81 → **5.36**. Three per-context text tokens were added (`--ai-emerald-text`, `--ai-cyan-text`, `--ai-amber-text`) because those accents double as **solid fills** (`bg-[var(--ai-amber)] text-black`), so the fills could not be re-tuned — the same multi-role-token trap, now for the fourth time.

Verified independently: 168 light accent classes ≥600 paired with 162 `dark:` restores, and the three new tokens defined in both the light and dark blocks. The agent also ran the dead-utility check in reverse (reconstructing the pre-edit tree) and confirmed **0 dead utilities in the baseline**, so nothing was silently "made live" by this change.

### New findings

- [x] **FS-77** **CLOSED in block 9.** `aicosmos/pages/Home.tsx:169` uses `bg-[var(--bu-bg)]` — a **browseruniverse-scoped** variable referenced inside `aicosmos`, where it is undefined. The class emits, so it looks fine in source, and paints nothing. Exactly the `--ai-card` bug again, and a reminder that `--<engine>-*` tokens are not namespaced by anything but convention. Worth a repo-wide scan for cross-engine token references. `S`
- [x] **FS-78** **CLOSED in block 11 — and the item understated the class.** `aicosmos` `--ai-muted` and `text-muted-foreground` on accent tints: 4.25–4.47:1 on `/10`–`/20` chips, **3.23:1** on `bg-emerald-950/20` (the PythonAiProblems completion banner), 4.63:1 on `--ai-surface-2`, against 4.83:1 on white. Neutral rather than pastel, so outside the FS-62 brief — needs a tint-scoped muted token. `S`
- [x] **FS-79** **CLOSED in block 11 — and the enumeration found more than the item did.** `aicosmos` white labels on solid accent fills: `bg-emerald-600 text-white` 3.77:1 (7 sites), `bg-amber-600 text-white` **3.19:1** (2), `bg-emerald-500/80 text-white` 2.13 light / 3.71 dark, `bg-rose-500/80 text-white` 2.97 light. The same fill-vs-label class already fixed in `xrcosmos` and `fastapicosmos`. `S`
- [ ] **FS-80** `aicosmos` dark-mode residuals left byte-identical by design: `--ai-cyan-text` 4.18:1 on `cyan-10` chips and 4.74:1 on cards, `--ai-rose` 4.13:1 on cards. Pre-existing, now recorded so they are not re-discovered. `S`
- [x] **FS-81** **CLOSED in block 10.** `evminternals/hooks/useTheme.ts` still **throws** if no provider is mounted, and its `Navbar` is not rendered by the route shell. The conversion agent documented the landmine in `context/ThemeContext.tsx:22-26` rather than changing the hook or the shell layout, correctly treating that as a routing/design change. Either mount the provider or make the hook resilient. `S`

---

## 20. Block 8 — FS-74 is bigger than five instances, and a mislabelled hash in `mqviz`

### FS-74 audit: 31 more phantom ids across 6 routes

I wrote a repo-wide check: for every route that declares `generateStaticParams`, extract its kebab-case string literals and test whether each id appears **anywhere** in its own engine directory. An id that exists only in the route file is phantom by construction. Result:

| route | phantom / literals | phantom ids |
|:--|--:|:--|
| `k8scosmos` | 11 / 12 | worker-nodes, pods-lifecycle, replicasets-deployments, services-kube-proxy, ingress-controllers, configmaps-secrets, persistent-volumes, statefulsets-daemonsets, hpa-autoscaling, network-policies, crds-operators |
| `aimathviz` | 7 / 8 | linear-algebra, calculus-gradients, statistics-inference, matrix-decomposition, vector-spaces, optimization-methods, information-theory |
| `cloudcosmos` | 6 / 8 | regions-zones, compute-autoscaling, vpc-subnets, caching-cdn, database-replication, serverless-edge |
| `patriciatrie` | 5 / 6 | radix-trie, hex-nibbles, hp-encoding, state-trie, storage-trie |
| `loadbalancing` | 1 / 8 | layer4-vs-layer7 |
| `systemdesignviz` | 1 / 6 | cap-lab |

Fixed so far (three routes), each derived from its engine's own data and validated against the lookup the component actually uses:

| route | derived from | validated against | params |
|:--|:--|:--|:--|
| `k8scosmos` | `Object.values(concepts)` | `ConceptPage.tsx:13` `concepts[conceptId]` — sets identical, 28/28 | 53 → **117** |
| `aimathviz` | `getAllTopics()` | `TopicPage.jsx:55` `getTopicById(id)` — 30/30 | 38 → **126** |
| `cloudcosmos` | `concepts` | `ConceptDetailPage.tsx:54` `concepts.find(c => c.id === id)` — 29/29 | 37 → **121** |

Real topics that had **never been pre-rendered**: 27 of 28 (`k8scosmos`), 29 of 30 (`aimathviz`), 27 of 29 (`cloudcosmos`).

### A correction to how I framed this bug

The agent pushed back on my "real content unreachable" phrasing, and it is right to. `next.config.ts` sets no `output: 'export'`, and these routes do not set `dynamicParams`, which **defaults to `true`** — so the real topics were never *statically pre-rendered*, but Next still renders them on demand at request time. They were not hard-404s.

The two halves of the bug therefore have different severities, and I had conflated them:

- **The phantom half is unconditional.** Those ids *were* pre-rendered, and they rendered "Concept not found" (or an empty shell) in the shipped HTML. That is a real, visible defect on every one of the ~35 phantom routes.
- **The "never generated" half is conditional** on the deployment mode — it bites SSG/static-export and hurts crawlability, but it is not a 404 in this deployment.

I overstated the second half in the previous block's write-up. The fix is right either way; the framing was wrong.

The agent also corrected a smaller thing: I had guessed `cloudcosmos`'s route was "a partial derivation attempt" because it referenced `concepts`/`topicIds` twice. It was not — both references were the stale local array's own declaration and `forEach`. No partial derivation existed.

### FS-52 — the second fake hash, and a third mislabelled algorithm

`redisviz/components/RedisClusterSlotVisualizer.tsx` (193 lines, **unmounted**) carried the same fake `getCrc16HashSlot` already removed from `ClusterSimulator`. Rather than delete 193 lines of usable work, it now delegates to the real `keyHashSlot` from `lib/hashSlot.ts`, with a comment recording what the old function actually was. Its default key `{user:100}.profile` now resolves to the genuine Redis slot, and the published `somekey` → 11058 vector reproduces.

**While verifying that, I found the same class of bug a third time.** Searching for the 31-multiplier hash (`hash << 5 - hash + c`) across the repo returned four more engines — and the question for each is not "is a hash used" but "does it claim to be something it is not":

| site | verdict |
|:--|:--|
| `loadbalancing/engine/algorithms.ts:42` | **Correct.** Labelled "DJB2-like", and seed 5381 with `hash * 33 + c` is exactly DJB2. |
| `aicosmos/pages/TransformerAttentionLab.tsx:84` | **Correct.** Labelled "Seeded pseudo-embedding generation" — no claim to be a standard hash. |
| `consensusviz/utils/hash.ts:5` | **Honest.** The comment says "Return a longer string to simulate a real hash". |
| **`mqviz`** | **Mislabelled.** `StreamLab.tsx:170` printed "**Murmur2 Hash Target**" and line 121 promised "observe partition **Murmur2 hash** distributions", while `hashKey` computed the 31× hash. |

Kafka's partitioner hashes the key bytes with **MurmurHash2** and takes `toPositive(murmur2(keyBytes)) % numPartitions`. The lesson text in `mqviz/data/topics.ts:109` states that correctly and stays; only the demo's false label was wrong. **I did not implement MurmurHash2**: no reference implementation is available in the repo or `node_modules` (`imurmurhash` is MurmurHash**3**, a different algorithm), and shipping an unverified hash under a correct-sounding label would repeat the original sin. The three UI labels now describe what the code does, and the real implementation is recorded as FS-82 with its verification requirement.

### New findings

- [x] **FS-82** **CLOSED in block 9.** Implement Kafka's **MurmurHash2** partitioner in `mqviz` and restore the Murmur2 labels. Algorithm: seed `0x9747b28c`, `m = 0x5bd1e995`, `r = 24`, little-endian 4-byte blocks, tail switch, `h ^= h >>> 13; h *= m; h ^= h >>> 15`; then `(murmur2(keyBytes) & 0x7fffffff) % numPartitions`. **Must be verified against Apache Kafka's own `Utils.murmur2` unit-test vectors, not asserted** — that is why this is a task rather than a commit. `S`
- [x] **FS-83** **CLOSED in block 9.** Replace the FS-74 audit script with the runtime method. `tmp/fs74.cjs` has three confirmed defects: it (a) **false-positives on base/lab route segments** (`cap-lab` is a real `<CapLab />` route, not a topic id — it reported a false finding on `systemdesignviz`, which was never broken), (b) **skips single-word ids** because its regex requires a hyphen (`intro`, `proofs` were missed in `patriciatrie`), and (c) **treats "appears somewhere in the engine" as proof of validity** (`loadbalancing`'s `ip-hash` is an `LBAlgorithm` id, not a concept slug — the real slug is `hash-based`). The sound method, used by the batch-2 agent: compile the real data modules and route files, **call the exported `generateStaticParams()`**, and diff its id slots against the lookup expression the page actually performs. `M`

### Verified by building, and a coupling worth knowing about

The three fixed routes were verified against the build: `k8scosmos/learn/what-is-kubernetes`, `k8scosmos/learn/pod`, `aimathviz/learn/dot-product` and `cloudcosmos/learn/subnets` now generate, and the phantom routes (`k8scosmos/learn/pods-lifecycle`, `aimathviz/learn/linear-algebra`, `cloudcosmos/learn/regions-zones`) are gone.

**But the repo-wide "pages with no `<h1>`" count went *up*, from 484 to 796** (of 2,515 pages). That is not a regression — it is the two bugs interacting, and it is worth stating plainly:

- FS-74 (phantom ids) and FS-64 (`ssr: false`) are **coupled**. Fixing the ids generates the *correct* routes; because those three engines are still client-only, the new routes are correct-but-empty shells. The count rose because ~238 previously-missing pages now exist and have no content yet.
- So the ordering matters: **converting a route is what turns an id fix into visible content.** Fixing ids without converting trades "wrong pages" for "empty pages" — better, but not done.

That reframes the remaining work: the **26 remaining shells** are the higher-leverage item, and each conversion should be paired with the FS-74 check for that engine (which the conversion makes visible in the first place). Both of the conversion agents found their engines' phantom ids only *because* they converted them.

Gate for this block: `npm run build` **exit 0** (2,515 pages), `npm run lint` **0 errors / 44 warnings**, `npx tsc --noEmit` **clean**.

### FS-74 batch 2, and three corrections to my own audit

| route | derived from | validated against | params |
|:--|:--|:--|:--|
| `patriciatrie` | `Object.keys(topicData)` | `TopicPage.tsx:50` `topicData[topicId]` — 10/10 | 37 → **45** |
| `loadbalancing` | `concepts.map(c => c.slug)` | `ConceptDetail.tsx:18` `concepts.findIndex(c => c.slug === slug)` — 25/25 | 37 → **105** |
| `systemdesignviz` | **no change needed** | `ConceptDetail.tsx:10` | 30 → 30 |

Verified in the build: `patriciatrie/learn/why-trie`, `loadbalancing/learn/layer-4` and `/learn/what-is-load-balancing` now generate; `patriciatrie/radix-trie`, `patriciatrie/intro` and `loadbalancing/layer4-vs-layer7` are gone.

**My `/tmp/fs74.cjs` audit had three defects, and the last one produced a false finding.**

1. **False positive — `systemdesignviz` was never broken.** Its route has derived from `SYSTEM_DESIGN_TOPICS` since the absorbing commit, and it is **already server-rendered** (29 pages, **29/29 with an `<h1>`**, avg 28.6 KB — the only one of the three with content). `cap-lab` is not a phantom topic id: it is a **base lab route** handled at `page.tsx:62` as `<CapLab />`, and deleting it would 404 the CAP-theorem lab. My script diffs route literals against engine data and has no concept of "base route segments are not topic ids". It also asserted a four-slug shape that this route does not use — forcing it would have manufactured 60 unhandleable params.
2. **False negative — single-word ids were skipped.** My id regex required at least one hyphen, so `patriciatrie`'s `intro` and `proofs` never entered the candidate set. The real count is 7 phantom of 8 literals, not the 5 of 6 I reported, and **9 of 10** real topics had never been generated.
3. **False negative — "exists somewhere in the engine" is necessary but not sufficient.** `loadbalancing`'s `ip-hash` does appear in the engine, so my test passed it — but it is an `LBAlgorithm` id (`engine/types.ts:31`), not a concept slug; the real concept is `hash-based`, and `ConceptDetail`'s `algoMap` bridges the two. A route id has to match **the lookup the page performs**, not merely appear in the directory.

That third point is the general lesson: the audit I wrote asks "is this id known to the engine", when the question that matters is "does this id resolve through the page's own lookup". Batch 2's agent used the stronger method — compiling the real data modules and route files and **calling the exported `generateStaticParams()`**, then diffing its id slots against the lookup expression. That is the method FS-83 should prescribe, and it is why the agent found two phantoms I had missed.

### The coupling, restated with numbers

Repo-wide pages with no `<h1>`: **796 of 2,515** — up from 484 of 2,203 before this block's fixes, because the corrected params generated ~238 more pages in engines that are still client-only. Genuine gap (excluding the 72 `/learn` redirect stubs): **724**.

Content status of the three engines just fixed makes the same point:

| engine | pages | with `<h1>` | avg page | still `ssr: false` |
|:--|--:|--:|--:|:--|
| `patriciatrie` | 44 | **0/44** | 18,289 B | yes (4 calls) |
| `loadbalancing` | 104 | **0/104** | 9,714 B | yes (4 calls) |
| `systemdesignviz` | 29 | **29/29** | 28,579 B | **no — already converted** |

So FS-74 without FS-64 converts "wrong pages" into "empty pages". The correct routes now exist; the content needs the shell conversion. **Convert first, then audit the params** — the conversion is what makes the bug visible, and both conversion agents found their engines' phantom ids only after converting.

---

## 21. Block 9 — FS-64 closed: every shell server-renders, and the repo-wide gap is now zero

FS-64 is done. `grep -rl "from 'next/dynamic'" src/app` → **0**; live `ssr: false` → **0**; `= dynamic(` → **0**. All 37 route shells import their engine's pages statically, and the built HTML proves it:

| measure | before block 9 | after block 9 |
|:--|--:|--:|
| pre-rendered pages | 2,515 | **2,535** (HTML files; Next's own counter says 2,537 — the extra two are `sitemap.xml` and its route entry, which are not `.html`) |
| pages with **no `<h1>`** | 796 | **72** |
| …of those, `/learn/<slug>` redirect stubs (no heading by design) | 72 | 72 |
| **genuine heading gap** | **724** | **0** |
| contentless pages (<600 visible chars) | 975 | **239** |
| — `/learn` redirect stubs | 72 | 72 |
| — text-light tool/problem pages **with** an `<h1>` | — | 163 |
| — pages with no `<h1>` | — | 4 → **0** after the heading fixes below |
| pages that gained content | — | **704** |
| pages that **lost** content | — | **0** |
| newly generated pages | — | **52** (none contentless) |

The 239 remaining "contentless" pages are not shells. On inspection every one is either a redirect stub (72) or a page whose visible text is genuinely short because the substance is an interactive editor/canvas/HUD (163 — e.g. `tsviz/problems/p01` at 458 chars with an `<h1>`, `jsviz/problem/adv-1` at 430, `html-cosmos/learn/a` at 518, `gitcosmos/lab` at 283). The 600-character threshold sits just above them; I did not invent copy to cross it.

### How the 32 shells were converted

Six agents, each owning disjoint engines, applied the three-step recipe from §17 (triage render-path browser access → remove it → replace `dynamic(..., { ssr: false })` with static imports). The conversions divide into two shapes:

| shape | engines | what conversion buys |
|:--|--:|:--|
| **A** — 4–5 `dynamic()` page imports, routed by `slug` | 10 | every route gains its real page: **643 pages** |
| **B** — one `dynamic()` wrapping the engine's whole `App`, `<Workshop key={slug.join('/')} />` | 22 | 3 routes per engine gain content: **66 pages** |

Shape-B engines' `App` takes no props and reads no route params (verified by grep for `useParams|useLocation|usePathname|useSearchParams|next/navigation|window.location` across all 22 engine dirs — zero hits), so their `['learn']` and `['playground']` params render **byte-identical HTML to the index**. Expanding those params would manufacture duplicate pages, so the param shape was deliberately left alone. Recorded as FS-86.

### The hazards were real, and most were *nondeterminism*, not `window`

A recurring surprise: for most engines the browser-API triage came back clean, because the `localStorage`/`matchMedia` offenders sat in theme providers mounted only by an **unreachable** `App.tsx`. What actually blocked or would have broken SSR was **render-path nondeterminism** — values computed during render that differ between the build machine and the visitor:

| engine | hazard | fix |
|:--|:--|:--|
| `aimathviz` | `CovarianceViz` called `Math.random()` during render (proved: two renders gave 12,980 vs 12,977 bytes) | 50-point scatter generated in an effect |
| `cloudcosmos` | `CloudLabPage` rendered `new Date(log.timestamp).toLocaleTimeString()`; the store stamps its first log with `Date.now()` **at module evaluation** (proved: `21:34:43` vs `22:16:44` across module loads) | mount-gated time element |
| `ptopblockchain` | `Playground` rendered `new Date().toLocaleTimeString()`; `useNetwork` built `NetworkManager` during render and its constructor appends a `Date.now()`-stamped log the page renders | both moved into effects |
| `ptopblockchain` | `context/ThemeContext.ts` — FS-39 private `'theme'` key read on the render path | adapter over `@/context/useTheme` |
| `patriciatrie` | `Tooltip` evaluated `createPortal(..., document.body)` **during render** (server `ReferenceError`); `useProgress` read `localStorage` in a `useState` initialiser; `hooks/useTheme.tsx` was a second `'theme'` preference **mounted by the shell** | mounted gate, effect, adapter |
| `consensusviz` | `context/ThemeContext.tsx` was the FS-39 offender; `ConsensusIntroViz` read `window.innerWidth` during render; `DifficultyAdjustmentViz` scattered 150 `Math.random()` particles; `MiningViz` stamped `Date.now()` into the block header whose hash is displayed | adapter, resize-effect state, effect fill, fixed demo timestamp |
| `blockchainviz` | genesis `Date.now()` (rendered hash), `BlockHeaderViz` `Date.now()`, `BlockVisualizer` `toLocaleTimeString()` | fixed constants / explicit UTC |
| `cryptviz` (pilot) | `ThemeToggle` read `localStorage.getItem('theme')` in a `useState` initialiser and wrote the app's key from a second preference | adapter over the shared provider |
| `jvmviz`, `dnaviz`, `bioviz`, `sdrviz`, `riscviz`, `qubitviz`, `linkerviz`, `tcpviz`, `tocviz` | **none** — every browser call is inside an effect or handler | no engine source change |
| `mallocviz`, `malwareviz`, `linkerviz`, `sidechanviz`, `gpuviz`, `tlaviz` (and the rest of the Shape-B set) | **none** — each engine is only `App.tsx` + `data.ts` with no theme module at all | shell-only change |

### FS-74, paired: one more instance, and the biggest yet

Conversion was performed with the FS-74 check, and it paid off again on `consensusviz`: its `generateStaticParams` listed **8 ids that all were phantom** (`pow`, `pos`, `dpos`, `poa`, `pbft`, `raft`, `nakamoto`, `byzantine` — these are *visualization* kinds, not topic ids), producing 32 phantom params while **13 real topics were never generated**. It now derives from `Object.keys(topicContent)`: **37 → 57 params**. Verified independently in the build: pages 37 → 57, all with content.

`ptopblockchain` (12/12), `blockchainviz` (11/11), `threatmodelviz` (5/5) and `patriciatrie` (10/10) were verified correct with no change needed; `aimathviz` (30/30), `cloudcosmos` (29/29), `k8scosmos` (28/28) and `loadbalancing` (25/25) likewise. `cryptviz`'s hand-written list named the right 8 ids, but it was converted to derive from `TOPICS` anyway so it cannot drift.

### FS-82 — Kafka's real MurmurHash2, verified against Kafka

`mqviz` now ships `lib/murmur2.ts`, a direct port of `Utils.murmur2` (seed `0x9747b28c`, `m = 0x5bd1e995`, little-endian 4-byte blocks, falling-through tail switch, `Math.imul` everywhere because JS `*` does not wrap like a Java `int`), plus `partitionForKey = toPositive(murmur2(keyBytes)) % numPartitions`. The three UI labels that had been downgraded to honest-but-vague are "Murmur2" again.

Verification went further than asserting the six published vectors:

1. **Kafka's own vectors** are in `lib/murmur2.test.ts` — `21` → −973932308, `foobar` → −790332482, `a-little-bit-long-string` → −985981536, `a-little-bit-longer-string` → −1486304829, `lkjh234lh9fiuh90y23oiuhsafujhadof229phr9h19h89h8` → −58897971, `abc` → 479470107. All pass.
2. **A differential test against the canonical C implementation.** Appleby's `MurmurHash2.cpp` was fetched, compiled with a small harness, confirmed to reproduce all six Kafka vectors, and then used as an oracle over ~120 inputs: every length 0–80 with random content, lengths 0–8 filled with `0x00`/`0xff`/`0x80`/`'a'` (the sign-extension and masking cases), and inputs up to 1024 bytes. The JS port agrees on every one. The value of a *second* implementation is that the C reference reads 4-byte blocks through a typed pointer while the port assembles them byte-by-byte, so agreement tests the endianness and masking separately from the algorithm.
3. **That exercise caught two of my own errors.** I first wrote the `0xff` tail cases from memory as −1664672372 and 1054419715; the oracle produced −1839913349 and −1253289233. Asserting remembered numbers is exactly the failure this project keeps finding, so the test now records where each value came from.

**A correction to the block-8 write-up.** Block 8 recorded that the `mqviz` seed put `user_102` in P0 "while Murmur2 maps it to P1", implying the old hash explained the bad seed. It did not: the legacy 31-multiplier hash also maps `user_102` to P1, so that seed was simply wrong under *both* algorithms. Also worth knowing for anyone editing the lab: the default key `user_881` lands in P2 under both hashes, so the default view never revealed the discrepancy — `user_101`/`user_305` and `foobar` are keys that actually move. The seed now carries a test-visible invariant (`seedPartitionMismatches()`) so a future edit cannot silently re-break the agreement between the displayed hash and the seeded partition.

### Five more dead-CSS / undefined-token instances, and a browser-verified method

The block's tooling (a repo-wide token-scope scan) found four fresh instances of the class this project keeps rediscovering:

- **`evminternals` ships a palette that was never defined — 79 dead utilities.** `text-evm-accent` ×38, `bg-evm-accent` ×27, `border-evm-accent` ×11, `text/bg-evm-gas` ×2, `bg-evm-bg` ×1 — and **zero** `evm` definitions anywhere in `src/**/*.css` or `tailwind.config.js`. Tailwind is 3.4.19, so there are no v4-style auto-generated utilities from `--color-*`: every one of those classes emits nothing. Two more references in `GasMeter.tsx` (`text-[var(--color-viz-active)]`, `…-secondary`) are the same story. Fixing it needs the multi-role split this repo has now hit five times (`--evm-accent` is used both as a bright fill under `text-neutral-950` *and* as text on a 10 % tint of itself, so one token cannot serve both). Recorded as **FS-85** with the plan.
- **`nextjscosmos` had 12 declarations that were invalid rather than undefined**, all now fixed. Nine sites wrote `oklch(var(--primary) / 0.05)` — but `--primary` is an HSL triple (`240 5.9% 10%`), so feeding it to `oklch()` makes the whole declaration invalid. Confirmed in headless Chromium: `oklch(var(--primary) / 0.05)` computes to `rgba(0, 0, 0, 0)` (dropped), while `hsl(var(--primary) / 0.05)` computes to `rgba(24, 24, 27, 0.05)` — and `oklch(0.2 0.01 250 / 0.05)` is valid, so the fault is the HSL triple, not `oklch()` itself. Three more sites used `var(--emerald-500)`/`var(--amber-500)`/`var(--blue-500)`, none of which exist here, plus `oklch(var(--emerald-500) / …)` which is doubly wrong. All 12 now use concrete values.
- **`aicosmos/Home.tsx:169` (FS-77)** referenced browseruniverse's `--bu-bg`; now `--ai-bg`, the same role in aicosmos's own palette. A repo-wide scan after the fix reports **exactly one** remaining cross-engine reference.
- **`ptopblockchain/components/visualizer/NetworkGraph.tsx`** is the remaining one, and it is worse than a missing token: `fill="var(--surface)"` (undefined) and `fill/stroke="var(--primary)"` are used as *SVG paints* while `--primary` is an HSL triple. A raw triple is not a colour, so those values are invalid and fall back — the node boxes and their latency labels can render black-on-black in the light theme. It also asks for `fontFamily="var(--font-mono)"`, a variable defined only inside `golangviz`'s and `nextjscosmos`'s own absorbed `globals.css`. Recorded as **FS-85b** (nothing in the audit had looked at SVG paint values before).

This produced a reusable check worth keeping: **`oklch(var(--x))` and `hsl(var(--x))` are only as valid as the shape of `--x`**, and the way to settle it is a real browser reading `getComputedStyle`, not a Tailwind compile — a Tailwind compile happily emits `color: oklch(var(--primary) / 0.05)` because the class is well-formed; only a CSS engine can reject the value.

### The three heading gaps left, and why they were not content

After the conversion the only pages in the whole build with no heading element were six URLs — `/cloudcosmos/lab`, `/cloudcosmos/playground`, `/patriciatrie/lab`, `/patriciatrie/playground`, `/solidityviz/lab`, `/solidityviz/playground` — i.e. **three components**, each served under two alias routes. All three are full-height tool layouts with no title bar, which is why they had none. Fixed without inventing copy and without touching layout: `solidityviz`'s existing visible "EVM Playground" badge became the `<h1>` (same markup, same classes), and `cloudcosmos`/`patriciatrie` got a `sr-only` `<h1>` naming the route with the engine's own nav label. `sr-only` was verified to emit CSS by a real Tailwind compile before being relied on.

`stringalgoviz`'s `/playground` + `/lab` got a **visible** `<h1>` instead, because that page has an ordinary scrolling layout: the heading plus one factual subtitle, using the engine's own name for the page ("Algorithm Playground", the CTA text on its Home page). That closes **FS-76**.

### New findings from block 9

- [ ] **FS-84** **Twelve routes ship unreachable chrome, and two of them hide a theme toggle.** Measured by walking each shell's static import graph: the engine's own `Layout`/`Navbar`/`Header` is imported only by an `App.tsx` that *nothing* imports, so it is dead code — `aimathviz`, `blockchainviz`, `cloudcosmos`, `consensusviz`, `cryptviz`, `evminternals`, `gitcosmos`, `solidityviz`, `stringalgoviz` and `patriciatrie` among them. `cryptviz` and `solidityviz` each define a `ThemeToggle` reachable only from that dead layout, so their in-page theme control does not exist. Compounding it, `LayoutWrapper`'s `SELF_CONTAINED_SUBSITE_ROUTES` suppresses the global navbar+footer for **14** of the 37 shell routes on the assumption that the engine supplies its own — so those routes fall back to whatever links the page happens to contain. Post-conversion the practical damage is bounded: I checked every one of the 37 routes in the built HTML and **0 have neither a global nav nor any internal link**. The fix is either to mount each engine's own chrome (preserves §5 uniqueness) or to drop it from the self-contained list (restores the global nav); both are visible-experience decisions, so this is recorded rather than taken. `M`
- [x] **FS-85** **CLOSED in block 10.** `evminternals`' `*-evm-*` palette is referenced 79 times and defined nowhere (see above), plus 2 undefined `--color-viz-*` refs in `GasMeter.tsx`. Needs the fill/text split: `--evm-accent` (bright fill, labels are `text-neutral-950`) and `--evm-accent-text` (readable on white twice over — plain and on its own 10 % tint), and the Tailwind entries must be written `hsl(var(--evm-accent) / <alpha-value>)` so that `bg-evm-accent/10` — which is already used — emits instead of dying the way this class always does. `M`
- [x] **FS-85b** **CLOSED in block 9.** `ptopblockchain/components/visualizer/NetworkGraph.tsx`: `fill="var(--surface)"` and `fill/stroke="var(--primary)"` are invalid SVG paints (`--surface` is undefined; `--primary` is an HSL triple that needs an `hsl()` wrapper), and `fontFamily="var(--font-mono)"` points at a variable owned by two unrelated engines. Node boxes and latency labels could be unreadable. Fixed in six places: every token-driven SVG paint is now wrapped (`fill="hsl(var(--card))"`, `stroke/fill="hsl(var(--primary))"`, the inline `style={{ fill: … }}` on the down-node circles, and `fill="hsl(var(--background))"` for the hop-count label), and the `fontFamily="var(--font-mono)"` attribute became the `font-mono` class the rest of the file already uses. The same pass found and fixed a seventh instance: `--primary-dim` was referenced by **five** ptopblockchain glow shadows (`shadow-[0_0_15px_var(--primary-dim)]`, `drop-shadow-[0_0_10px_…]`) and defined nowhere, so every neon glow was dead. It is now a *complete colour* (`hsl(240 5.9% 10% / 0.45)` light, `hsl(0 0% 98% / 0.35)` dark) rather than a triple, because it is only ever consumed directly as a shadow colour. Verified in headless Chromium rather than by inspection: the rect computes `fill: rgb(255, 255, 255)`, the stroke and label `rgb(24, 24, 27)`, the glow `rgba(24, 24, 27, 0.45) 0px 0px 15px 0px` — and a control element using a still-undefined variable computes `box-shadow: none`, so the probe distinguishes the cases. After this, the repo-wide scan reports **0** cross-engine token references and an undefined-token list containing only lesson-snippet text (`tailwindcosmos`), library-injected variables (`--tw-ring-*`, Radix), and the two `evminternals` sites in FS-85. `S`
- [ ] **FS-86** 22 Shape-B routes generate `['learn']` and `['playground']` pages that are **byte-identical to their index** (asserted by the conversion agents), because their `App` ignores the route entirely. 44 duplicate pages. Not a build bug and not fixable by params — either the engines learn to read `slug` (a per-engine routing change) or those params should stop being pre-rendered. `M`
- [x] **FS-87** **CLOSED in block 10.** `aimathviz/pages/PlaygroundPage.jsx:585` had a **`useState` where a `useEffect` was meant**: `useState(() => { …setInterval… }, [autoSample, distribution, params])`. The dependency array is ignored and the initialiser early-returns because `autoSample` starts `false`, so the auto-sampling feature has never run. Deliberately not fixed during FS-64 — repairing it *enables* a feature that has never worked, which is a behaviour change, not an SSR fix. `S`
- [x] **FS-90** **CLOSED in block 10.** `scrollbar-hide` is used **9 times** across two engines (`evminternals`: `OpcodeVisualizer`, `StackVisualizer`, `MemoryVisualizer`, `StorageVisualizer`, `pages/Playground`; `blockchainviz`: `DistributedLedgerViz`, `ForkViz`, `HashLinkingViz`, `ChainVisualizer`) and is **defined nowhere** — not in `tailwind.config.js`, not in any CSS. `src/index.css` defines a *different* class, `.custom-scrollbar`, which styles the bar rather than hiding it, so these are not interchangeable. Found by the FS-85 agent while checking that every class in its rendered markup resolves. `S`

- [ ] **FS-92** Four `xrcosmos` residuals the FS-45/65/66 pass found and deliberately did not change. (a) **`components/HandTracker.tsx`'s hand-skeleton SVG paints literal `#14b8a6` and `#ffffff` on `--xr-bg`, so its white node outlines are invisible in light mode** — the same raw-SVG-paint class as FS-85b, and the only one of the four that is a light-mode visibility defect rather than a near-miss. (b) `accent-red/green/blue-400` and three `accent-[var(--xr-teal)]` are UI fills at 2.77 / 1.74 / 2.54 / 2.49:1 on white, under the 3:1 non-text bar; the shape would be `accent-red-600 dark:accent-red-400`. (c) the matrix's dark-mode `--xr-primary-text` on `--xr-surface-2` is 4.12:1, and fixing it needs a dark-only violet that would break FS-61's pinned-token contract. (d) `--xr-muted` on `--xr-surface-2` is 4.34:1 across ~70 call sites, pre-existing. `S`

- [x] **FS-91** **CLOSED in block 10.** Two `aicosmos` utility classes were referenced and defined nowhere: **`ai-glow`** on 8 headings (`AgentLab`, `About`, `Home`, `Learn`, `NeuralNetworkLab`, `RagLab`, `TransformerAttentionLab`, `TopicDetail`) and **`ai-grid-bg`** on the hero backdrop (`Home.tsx:84`). Both now live in the engine's own `styles.css` (which the route imports directly, not through `index.css`). `.ai-glow` uses `currentColor` deliberately: it is applied to spans that each set their own text colour (six `--ai-primary-text`, one `--ai-amber-text`), so a single hard-coded glow colour would be wrong for at least one of them. Found by the FS-38 agent while checking that every class in its rendered markup resolves. `S`

- [ ] **FS-93** `redisviz` residuals the FS-53/54/55 pass found and did not own. (a) `components/visualizers/KeyValueInspector.tsx:84,91` uses `text-redis` on `bg-muted/50` = **4.66:1 light / 3.56:1 dark**, and `:89` `text-blue-500` = 3.51 light / 4.73 dark; these touch the engine-wide `text-redis` convention (`#d82c20` caps at 4.32:1 on pure black, so it can never be AA text — the same pass introduced `--redis-light` for exactly that reason elsewhere). (b) `DiagramNode`'s node body carries `stroke-2` with **no stroke colour**, so no border paints at all — a class-shaped defect with nothing behind it. (c) A coarse scan found **~200 palette-on-surface sites** of this shape across `redisviz/pages` and `redisviz/components`, mostly `aria-hidden` icons; that is one sweep, not a colour-by-colour fix. (d) The resting (`opacity-50`) slot-bar labels sit at 2.26–2.38:1 light and 2.64–3.42:1 dark; that needs a state-dimming decision rather than a colour swap, since the dimming is what breaks them. `M`

- [x] **FS-89** **CLOSED in block 10 — the lint gate could not see 70 files.** `eslint.config.js` had no config object matching `**/*.jsx`, so every `.jsx` file under `src/` was skipped: `npx eslint src/components/visualizers/jsviz/pages/Problem.jsx` printed *"File ignored because no matching configuration was supplied"*, and `npm run lint` checked **1,371** files (67 `.js`, 264 `.ts`, 1,040 `.tsx`) with **zero** `.jsx`. That is 70 unlinted files, including most of `jsviz` — the very engine FS-28 wants to migrate. Measured the cost of enabling coverage first with a probe config: **0 errors, 2 warnings** across all 70, so a `files: ['**/*.jsx']` block supplying JSX parser mode and browser/node globals was added. The gate now checks **1,441** files at **0 errors / 46 warnings** (the +2 warnings are those pre-existing ones). `S`

- [x] **FS-88** **CLOSED in block 10.** `patriciatrie`/`consensusviz`/`ptopblockchain` render `new Date().getFullYear()` in their footers. Only the `patriciatrie` one is reachable; it now carries `suppressHydrationWarning` rather than freezing the build year into every page (the `merkletreeviz` fix — passing `year` from the server component — needs a shell prop change). The two unreachable ones are unfixed, and byte-for-byte the same on server and client within a year. `S`

### The routing fact worth carrying forward

`next.config.ts` does **not** serve most topics from a built page. Of the 72 active topics, **70 reach their route through a `beforeFiles` rewrite** (`/devops/gitcosmos` → `/gitcosmos`) and only **2** are built pages themselves. Any check that compares a topic's `url` against the build output will therefore report ~70 false "missing route" errors — I wrote exactly that check, briefly believed it, and then found the rewrite table. `/learn/<slug>` is a 308 into that rewritten namespace, so a broken alias would 404 *after* a redirect. The integrity test (`scratch/learn-alias.test.ts`) now resolves each `url` through `built ∪ rewrite-sources-whose-destination-is-built`, asserts both directions, and guards against its own earlier vacuous pass by asserting it parsed >50 active topics before trusting any result.

### Gate for this block

| Check | Result |
|:--|:--|
| `npm run lint` | **0 errors**, 44 warnings |
| `npx tsc --noEmit` | **clean** |
| `npm run build` | **exit 0**, **2,537** pages generated (**2,535** `.html` files; the difference is `sitemap.xml`) |
| shells using `dynamic(..., { ssr: false })` | **37 → 0** (no live `ssr: false`, no `next/dynamic`, no `= dynamic(` anywhere in `src/app`) |
| pages with a genuine heading gap | **724 → 0** |
| contentless pages | **975 → 239** (72 redirect stubs + 163 text-light tool pages + 0 without an `<h1>`) |
| pages that lost content | **0** (704 gained) |
| per-shell verification | 123 default imports checked: 0 unresolved, 0 stale, 86 route branches intact |

---

## 22. Block 10 — the checkbox list was lying, and five of my own premises were wrong

Two things dominated this block: reconciling the tracker, and discovering that several recorded items no longer described the code.

### The tracker contradicted itself, and now does not

The `- [ ]` markers had drifted badly from the `§9` table. Items closed in blocks 1–9 were still showing as open — including all four root causes, both mislabeling tasks and the whole route workstream. **33 checkboxes were ticked** after spot-verifying the ones that mattered rather than trusting the table (`grep -rnoE "\[var\(--[a-z0-9-]+\)\]/[0-9]+" src` → **0** for FS-03; `webprotocols/[[...slug]]/page.tsx` derives from `data/topics` for FS-15; `tsviz/problems/p01` renders an `<h1>` for FS-41; `fastapicosmos/pages/DiGraph.tsx` has **0** `text-white` sites for FS-25), and the table now leads with *what is open* instead of a cumulative tally that invites arithmetic errors.

**Three workstreams are now empty** — routes & missing content (FS-15…22), light-mode legibility (FS-23…25), and both root-cause/mislabeling blocks.

### Closures this block

| item | what it actually was |
|:--|:--|
| **FS-17** | A **render crash**, the most severe class in the audit. `authviz/Flashcards.tsx` hardcoded a chip list including "Authorization & Access Control", which no card carries; selecting it filtered to zero, `currentCard` became `undefined`, and `currentCard.category` threw. Chips now derive from the deck, an empty state handles the general case, and **`src/app/error.tsx` now exists** (the item asked for it; there was no error boundary at all). |
| **FS-18** | 47 of 50 challenge routes were never pre-rendered — `html-cosmos` listed `problems/1`–`problems/3` by hand while `ProblemList` links all 50. Params now derive from `data/problems.js`. **Verified in the build: pages 2,535 → 2,582, and `problems/25` pre-renders `<h1>Password Input</h1>`, matching the data's title for id 25.** |
| **FS-20** | The lock was the honest half. All 15 `apiviz` topics pre-rendered while `LearningPath` marks 8 as LOCKED; measured, the locked and unlocked pages were **862–917 visible chars each** — indistinguishable — so "locked" was decorative. The data says those lessons are not written, so `TopicDetail` now honours it with an explicit `STATUS::COMING_SOON` panel. |
| **FS-11** | The consistent-hashing ring **hardcoded each key's target**, so pressing "Remove Server" left keys pointing at a server that no longer existed — inverting the minimal-remapping property the page teaches. The ring logic is now real (clockwise lookup, `RING_SIZE`, FNV-1a for virtual-node placement) and extracted to `systemdesignviz/lib/consistentHashRing.ts` with 11 tests. The inert "150 virtual nodes" toggle is now wired. |
| **FS-13** | `mongocosmos` rendered a **permanently pulsing `Diagnostic_Sim_Loading`** panel for 9 of 10 topics — it read as "still loading" forever rather than "not implemented". Replaced with a state derived from each topic's own `status` (four are `coming-soon`), plus the duplicate `'use client'` removed and the hardcoded "Technical_Takeaways" relabelled `General_MongoDB_Tradeoffs` with a real `tradeoffs?: string[]` seam. |
| **FS-38** | 69 `aicosmos` text sites repointed to a new `--ai-primary-text`; 61 fill/border/stroke sites correctly left. FS-24's CTA contrast is **unchanged (6.29:1 light / 4.66:1 dark)**, independently confirmed. |
| **FS-40** | Both zustand stores lost their theme slice and both Navbars read `resolvedTheme` from the shared provider. |
| **FS-85 / FS-81** | `evminternals`' 79-usage palette defined for real (`21/21` distinct classes now emit, verified in a real compile) with the `*-text` split; `useTheme` no longer throws. |
| **FS-42, FS-45, FS-65, FS-66** | The specificity parser gained the `:nth-child(An+B of S)` clause and shadow-DOM functions, with 11 permanent tests; `xrcosmos` gained the two missing 6-DoF sliders and 34 contrast fixes. |
| **FS-37-class small items** | **FS-16** (six golangviz footer hrefs that had lost their `/golangviz` prefix — every target verified to resolve), **FS-22** (all 35 reactcosmos topics already authored their own `takeaways`; the page ignored them), **FS-27d, FS-30, FS-33, FS-68, FS-87, FS-88, FS-89, FS-90, FS-91**. |

### Five recorded items did not describe the code

I checked each before "fixing" it, and in every case the item was wrong — worth stating plainly, because acting on any of them would have damaged working code:

1. **FS-27d** claimed the "Animate Update" button was "ambient rather than load-bearing (the ten visualizers above no longer depend on it)". **All ten consume `isExecuting` and use it to drive markup** — `WhatIsReactVisualizer` rotates an element and reveals a panel only while it is true. The control is neither inert nor redundant. The real residual is smaller: a hard-coded `setTimeout(…, 2000)` cuts the animation off rather than letting it finish.
2. **FS-40's premise was wrong in a way that mattered.** I told the agent that deleting the theme slice would leave old persisted JSON harmless because "an unknown key is ignored". It measured instead: zustand 5's default merge is `(p, c) => ({ ...c, ...p })`, so `{"state":{"theme":"neon-bogus"}}`*is* spread back onto `getState()`. Both stores needed an explicit key-whitelisting `merge`; without it the fix would have shipped a resurrected phantom field.
3. **FS-68** said darkening `--text-muted` "would fix … every other `--text-muted`-on-`--bg-surface` site app-wide". There are **37 sites and every one is in `jsviz`** — the token is not used app-wide at all. (The one-line fix was still right: 4.40:1 → 7.03:1 on `--bg-surface`.)
4. **FS-33** listed five dead-code items, but three were already deleted in block 1 and `programviz/hooks/useTheme.ts` is **actively imported** by several files. The claim that survived was `react.svg`, and it was bigger than recorded: **22 unreferenced copies across the engines, ~91 KB, plus a stray `src/assets/`** that existed only to hold one of them.
5. **FS-19** and **FS-25's** duplicate entry were already fixed. FS-19's class is now swept: every other hardcoded chip list in the repo (`golangviz` ×3, `rustviz`, `aicosmos`, `cloudcosmos`) matches its own data — **0 dead chips**, with `cloudcosmos`'s `All Concepts` correctly special-cased as the show-all pseudo-chip.

### A gate that could not see 70 files

While editing a `.jsx` file I noticed ESLint reporting *"File ignored because no matching configuration was supplied"*. `eslint.config.js` had no config object matching `**/*.jsx`, so **every `.jsx` file under `src/` was skipped** — `npm run lint` checked 1,371 files (67 `.js`, 264 `.ts`, 1,040 `.tsx`) and **zero `.jsx`**, including most of `jsviz`, the engine FS-28 wants to migrate.

Measured the cost before enabling coverage with a probe config: **0 errors, 2 warnings across all 70**. Added a `files: ['**/*.jsx']` block supplying JSX parser mode and browser/node globals. The gate now checks **1,441 files** at **0 errors / 46 warnings** (the +2 warnings are those pre-existing ones). Recorded and closed as FS-89.

### New findings

- [x] **FS-90** **CLOSED.** `scrollbar-hide` was used 9 times across `evminternals` and `blockchainviz` and defined nowhere, so those scroll containers showed a bar instead of hiding it. `.scrollbar-hide` now exists in `src/index.css` (standard cross-browser recipe, verified to emit both rules). Found by the FS-85 agent.
- [x] **FS-91** **CLOSED.** `ai-glow` (8 headings) and `ai-grid-bg` (the hero backdrop) were referenced and defined nowhere. Both now live in `aicosmos/styles.css`; `.ai-glow` uses `currentColor` because it is applied to spans that each set their own text colour. Found by the FS-38 agent.

### Corrections to my own work in this block

- **Three of my hand-computed test expectations were wrong**, and each was caught by the test rather than by review: I forgot the pseudo-class's own contribution in `:nth-child(1 of .a, #b)` (wrote `(1,0,0)`, correct is `(1,1,0)`); I forgot `:host`'s class in `:host ::slotted(#id)`; and I assigned `session_91` to Server B when B owns the arc *behind* it, which is `user_849` at 70°. The fixed expectations are in the committed tests, with the reasoning.
- **My first sitemap assertion rejected the site root** for ending in `/` — a legitimate URL. The corrected test allows the bare origin and forbids a trailing slash anywhere else.
- **My first flashcards assertion compared raw HTML against `OAuth & OIDC`**, which React escapes to `&amp;`. The test now decodes entities.
- **`FS-85b`'s `--surface` finding initially looked fixed but wasn't**: my grep matched only the `fill="var(--…)"` attribute form, missing an inline `style={{ fill: 'var(--surface)' }}` on the next screen. The token scan covers both, which is why it kept reporting it.

### Gate for this block

| Check | Result |
|:--|:--|
| `npm run lint` | **0 errors**, 46 warnings — now covering **1,441** files instead of 1,371 |
| `npx tsc --noEmit` | **clean** |
| `npm run build` | **exit 0**, **2,584** pages generated / **2,582** `.html` files (was 2,535 `.html`; **+47** = every one of FS-18's challenge routes) |
| `npm test` | **8 files, 86 tests**, all passing (was 64; two new permanent suites) |
| pages with a genuine heading gap | **0** (72 `/learn` redirect stubs, which correctly have no heading) |
| pages that gained / lost content | **0 / 0** relative to block 9 — the only new contentless entries are the 47 new challenge pages, each of which carries its own problem title |
| new permanent test files | `cssviz/utils/specificity.test.ts`, `systemdesignviz/lib/consistentHashRing.test.ts` |
