# CSCosmos — Feature & Improvement Roadmap

> Working backlog for CSCosmos. Keep it honest: every item below was verified absent
> from the current code on 2026-10-20. Per-engine partials are called out so we reuse
> them instead of rebuilding.

## Positioning

CSCosmos is the **free visual learning layer** for computer science: deep interactive
explanations, not another course marketplace. Win on explanation quality, interactivity,
and discoverability — not on catalog size or live cohorts.

**Wedge:** "Understand any CS topic visually, then prove you can explain it."

## Current state (verified)

- Next.js 16 App Router, React 19, TypeScript, Tailwind, SSG.
- 245 topics across 8 domains; 72 active visualizer topics; 1,500+ pre-rendered pages.
- 17 interview questions across 5 categories with animated walkthroughs.
- Global search, dark/light theme, sitemap, `robots.txt`, `llms.txt`.
- No auth, no database, no API routes, no payments.
- Per-engine partials already exist (reuse these):
  - Flashcards: `apiviz`, `arrayviz`, `authviz`, `dockercosmos`, `golangviz`,
    `nextjscosmos`, `nodecosmos`, `patriciatrie`, `redisviz`, `rustviz`,
    `sqlcosmos`, `systemdesignviz`.
  - Quizzes: `golangviz`, `websecureviz`.
  - Progress: `golangviz`, `nextjscosmos`, `patriciatrie`, `programviz`,
    `websecureviz`, `k8scosmos`, `cloudcosmos`, `loadbalancing`, `jsviz`, `gitcosmos`.

These are **isolated per-engine** implementations. There is no unified account,
progress, flashcard, or quiz layer across the platform.

## Shipped (2026-10-20)

- [x] `/support` page with transparent infrastructure costs and no feature gating.
- [x] `SUPPORT.md` with the donation pledge and funding order.
- [x] `/support` added to navigation, footer, and sitemap.
- [x] Cost model split into ₹0 / free tier / paid at scale.
- [x] Horizon 2036 section added (H01–H12).
- [x] **F08 local bookmarks**: `/bookmarks`, bookmark toggle on every topic page, nav/footer links.
- [x] **F02 local progress**: `/progress`, domain completion bars, visit history, current/longest streak.
- [x] **Topic learning bar**: bookmark + mark-complete + progress link on every topic route.
- [x] Local-first storage layer (`src/lib/local-learning.ts`) — no server, no DB.
- [x] Bookmarks/progress added to the sitemap.
- [x] **F04 company tags**: every interview question has public-report company tags.
- [x] Company filter with URL state and search across company names.
- [x] Company badges on question cards and detail pages, with a "signals, not guarantees" note.
- [x] Tests extended: every question has at least one unique company tag (88 tests passing).
- [x] **F03 continue learning**: recent-topic card on the home page.
- [x] **F07 notes**: local per-topic notes with autosave on every topic route.
- [x] **F14 daily challenge**: deterministic daily active-topic card on the home page.
- [x] **F18 corrections**: "Suggest an edit" prefilled GitHub issue from every topic.
- [x] **F19 public API**: `/api/topics`, `/api/domains`, `/api/interview` plus `/developers` docs.
- [x] **F11/F12 metadata**: difficulty, estimated time, tags, prerequisites, related topics.
- [x] **F12 catalog filters**: difficulty and max-time filters on `/topics`.
- [x] **F10 roadmap generator**: `/roadmap` builds 4/8/12-week plans from goal, level, and hours.
- [x] **F09 spaced repetition**: `/review` SM-2 queue built from the interview bank, stored locally.
- [x] Learning graph surfaced on every topic page; metadata shown on cards.
- [x] **F05 mock interview**: `/mock-interview` timed sessions with self-scoring.
- [x] **F06 AI tutor**: `/tutor` BYO-key OpenAI-compatible tutor with topic context.
- [x] Tutor shortcut added to every topic learning bar.
- [x] **F13 exercises**: `/exercises` auto-graded question sets with instant explanations and domain filters.

## Principles

1. Free forever for learning. No paywall on topics, visualizers, or interview prep.
2. Original explanations. Never scrape or copy paywalled competitor content.
3. Local-first by default; accounts are optional and only for sync.
4. Reuse per-engine components through shared contracts; do not duplicate.
5. Every feature must improve understanding or retention — not feature count.
6. Ship with tests, lint, and a static build.

## Priority legend

| Priority | Meaning |
| :--- | :--- |
| **P0** | Required for the first public release of the learning loop |
| **P1** | Next 30–60 days after P0 |
| **P2** | Later; needs scale or community |

Effort: **S** = 1–2 days, **M** = 3–5 days, **L** = 1–2 weeks.

---

## Feature backlog

### F01 — Accounts + cross-device sync
- **Priority:** P0 · **Effort:** M · **Depends on:** auth provider + DB
- **Source:** LeetCode, Boot.dev, Scaler
- **Scope:** email/OAuth sign-in, profile, sync progress/bookmarks/notes.
- **Acceptance:** user can sign in on two devices and see identical progress.
- [ ] Auth provider chosen and configured
- [ ] Profile table/schema
- [ ] Sync API for progress, bookmarks, notes
- [ ] Sign-out + account deletion

### F02 — Unified progress dashboard
- **Priority:** P0 · **Effort:** M · **Depends on:** F01
- **Source:** Brilliant, Boot.dev
- **Scope:** topics started/completed, per-domain completion, streak heatmap.
- **Acceptance:** a single page shows all domains and activity for the last year.
- [ ] Global progress store (reuse per-engine `useProgress` contracts)
- [ ] Domain completion aggregation
- [ ] Streak + heatmap UI
- [ ] Empty state for new users

### F03 — Continue learning
- **Priority:** P0 · **Effort:** S · **Depends on:** F02
- **Source:** Coursera, Udemy
- **Scope:** last-visited topic, next unfinished topic, resume CTA on home.
- **Acceptance:** returning user sees a one-click resume card.
- [ ] Persist last route + timestamp
- [ ] Resume card on `/`
- [ ] Clear/reset control

### F04 — Company-tagged question bank
- **Priority:** P0 · **Effort:** L · **Depends on:** content review
- **Source:** LeetCode Premium, GFG, InterviewBit
- **Scope:** company, role, year, frequency, round filters on interview questions.
- **Acceptance:** filter by company + difficulty + round and get a question list.
- [ ] Extend `InterviewQuestion` schema with `companies: string[]`
- [ ] Add company metadata to existing 17 questions
- [ ] Add 30+ original questions with company tags
- [ ] Company filter UI + URL state
- [ ] Legal review: original writeups only, public sources only

### F05 — Mock interview mode
- **Priority:** P2 · **Effort:** L · **Depends on:** F01, F17
- **Source:** Pramp, interviewing.io, Scaler
- **Scope:** timed question, hidden hints, self-score, optional peer pairing.
- **Acceptance:** complete a 30-minute mock with timer and scorecard.
- [ ] Timer + question sequence
- [ ] Hidden hints / reveal flow
- [ ] Self-assessment scorecard
- [ ] Peer matching queue (later)

### F06 — AI tutor with BYO key
- **Priority:** P1 · **Effort:** M · **Depends on:** F01
- **Source:** ChatGPT, Claude
- **Scope:** explain current topic/visualizer, answer follow-ups; user supplies API key.
- **Acceptance:** key stored locally, contextual answers, no cost to CSCosmos.
- [ ] Settings for provider + key (local only)
- [ ] Context builder (topic, section, code)
- [ ] Streaming chat panel
- [ ] Clear-data + privacy notice

### F07 — Per-topic notes
- **Priority:** P1 · **Effort:** M · **Depends on:** F01
- **Source:** Educative, GFG
- **Scope:** Markdown notes attached to a topic, autosave, export.
- **Acceptance:** notes persist across sessions and export as `.md`.
- [ ] Note editor + autosave
- [ ] Notes index/search
- [ ] Markdown export

### F08 — Bookmarks & collections
- **Priority:** P0 · **Effort:** S · **Depends on:** none
- **Source:** LeetCode, GFG
- **Scope:** save topics, group into collections, local-first.
- **Acceptance:** bookmark a topic, reopen it from a bookmarks page.
- [ ] Local bookmark store
- [ ] Bookmark button on cards/detail pages
- [ ] `/bookmarks` page
- [ ] Account sync later (F01)

### F09 — Global spaced-repetition flashcards
- **Priority:** P1 · **Effort:** L · **Depends on:** F01, per-engine flashcards
- **Source:** Brilliant, Educative
- **Scope:** unify existing per-engine flashcards into one review queue with SM-2 scheduling.
- **Acceptance:** daily review queue built from cards across domains.
- [ ] Shared flashcard schema
- [ ] Adapters for existing engines
- [ ] SM-2 scheduler
- [ ] Review UI + results

### F10 — Personalized roadmap generator
- **Priority:** P1 · **Effort:** L · **Depends on:** F11, F12
- **Source:** TUF, NeetCode
- **Scope:** goal + time budget + current level → ordered study plan.
- **Acceptance:** generate a 4/8/12-week plan with checkpoints.
- [ ] Goal/level questionnaire
- [ ] Plan generator over topic metadata
- [ ] Plan page with completion tracking
- [ ] Regenerate/edit plan

### F11 — Prerequisite + related-topic graph
- **Priority:** P1 · **Effort:** M · **Depends on:** none
- **Source:** NeetCode, Boot.dev
- **Scope:** add `prerequisites` and `related` to the topic schema; render graphs.
- **Acceptance:** each live topic shows prerequisites and 3+ related topics.
- [ ] Extend `Topic` type
- [ ] Populate metadata for 72 active topics
- [ ] Related-topics UI
- [ ] Graph view

### F12 — Difficulty, time, and filter metadata
- **Priority:** P1 · **Effort:** M · **Depends on:** none
- **Source:** LeetCode, NeetCode
- **Scope:** `difficulty`, `estimatedMinutes`, `tags` on topics; filters on catalog.
- **Acceptance:** filter catalog by domain + difficulty + tag.
- [ ] Extend `Topic` type
- [ ] Populate metadata
- [ ] Filter UI synced to URL
- [ ] Sort options

### F13 — Auto-graded exercises
- **Priority:** P2 · **Effort:** L · **Depends on:** F01
- **Source:** Scrimba, Codecademy, Boot.dev
- **Scope:** per-topic exercises with test cases and pass/fail feedback.
- **Acceptance:** submit code and receive test results without leaving the page.
- [ ] Exercise schema + runner
- [ ] Sandboxed execution strategy
- [ ] Results UI
- [ ] Cost/rate limits

### F14 — Daily challenge
- **Priority:** P1 · **Effort:** S · **Depends on:** F02
- **Source:** LeetCode, GFG
- **Scope:** one topic/question per day, streak-aware.
- **Acceptance:** new challenge each day; completion updates streak.
- [ ] Challenge scheduler/data source
- [ ] Daily card on home
- [ ] Completion state + archive

### F15 — Weekly leaderboards
- **Priority:** P2 · **Effort:** M · **Depends on:** F01
- **Source:** LeetCode, Brilliant
- **Scope:** weekly completed topics/questions leaderboard; global + college.
- **Acceptance:** leaderboard updates weekly with opt-in profiles.
- [ ] Opt-in setting
- [ ] Weekly aggregation job
- [ ] Leaderboard UI

### F16 — Certificates + verifiable badges
- **Priority:** P2 · **Effort:** M · **Depends on:** F01
- **Source:** Coursera, Scaler
- **Scope:** completion badge per domain/path with public verification URL.
- **Acceptance:** shareable badge URL validates completion.
- [ ] Badge schema
- [ ] Public verification page
- [ ] Share/export

### F17 — Community Q&A per topic
- **Priority:** P2 · **Effort:** L · **Depends on:** F01, moderation
- **Source:** GFG, Stack Overflow
- **Scope:** threaded questions and accepted answers on topic pages.
- **Acceptance:** ask, answer, vote, report; moderator tools.
- [ ] Thread schema
- [ ] Composer + markdown
- [ ] Voting/reporting
- [ ] Moderation queue

### F18 — Contributor corrections workflow
- **Priority:** P1 · **Effort:** M · **Depends on:** GitHub or lightweight auth
- **Source:** GFG, Wikipedia
- **Scope:** report an error or suggest an edit directly from a topic.
- **Acceptance:** submission creates a reviewable issue with context.
- [ ] "Suggest an edit" CTA
- [ ] Prefilled issue/PR path
- [ ] Contributor guidelines page
- [ ] Review SLA

### F19 — Public API
- **Priority:** P2 · **Effort:** M · **Depends on:** F11, F12
- **Source:** CLIST model
- **Scope:** read-only JSON API for topics, domains, interview questions.
- **Acceptance:** documented endpoints with caching and CORS.
- [ ] `/api/topics`, `/api/domains`, `/api/interview`
- [ ] OpenAPI/README docs
- [ ] Rate limiting

### F20 — Embeddable visualizer widget
- **Priority:** P1 · **Effort:** M · **Depends on:** F19
- **Source:** VisuAlgo, Algorithm Visualizer
- **Scope:** iframe/share route for a single visualizer with attribution.
- **Acceptance:** paste a snippet into a blog and the visualizer runs.
- [ ] `/embed/[engine]` route
- [ ] Responsive standalone layout
- [ ] Copy-embed snippet
- [ ] Attribution + backlink

---

## Platform improvements (not feature count)

### I01 — Test and CI baseline
- **Priority:** P0 · **Effort:** S
- [ ] `npm run lint` and `npm run build` on every PR
- [ ] GitHub Actions workflow
- [ ] Keep existing Vitest suites green
- [ ] Add smoke tests for every active route

### I02 — Content quality pass
- **Priority:** P0 · **Effort:** M
- [ ] Replace generic `shortDescription` ("Interactive visualization and learning module for X")
- [ ] Add real one-line descriptions for all 72 active topics
- [ ] Verify every active topic resolves to a live route
- [ ] Remove dead/placeholder links

### I03 — SEO + AI discovery
- **Priority:** P1 · **Effort:** M
- [ ] Dynamic OG images per topic
- [ ] `LearningResource` / `FAQPage` structured data
- [ ] Internal linking between related topics
- [ ] Keep `sitemap.ts` and `llms.txt` in sync with the catalog

### I04 — Accessibility (WCAG 2.2 AA)
- **Priority:** P1 · **Effort:** M
- [ ] Keyboard navigation audit
- [ ] Focus-visible states
- [ ] Reduced-motion mode for animations
- [ ] Contrast audit in both themes
- [ ] Screen-reader labels for visualizer controls

### I05 — Performance
- **Priority:** P1 · **Effort:** M
- [ ] Lighthouse budget per route
- [ ] Code-split heavy engines (D3/Monaco/anime)
- [ ] Lazy-mount below-the-fold visualizers
- [ ] Track bundle size regressions

### I06 — Analytics + error monitoring
- **Priority:** P0 · **Effort:** S
- [ ] Events: topic view, visualizer start, exercise complete, bookmark
- [ ] Error boundary reporting
- [ ] Weekly retention dashboard

### I07 — PWA / offline reading
- **Priority:** P2 · **Effort:** M
- [ ] Web manifest
- [ ] Service worker for static topic pages
- [ ] Offline indicator

### I08 — Hindi / English i18n
- **Priority:** P2 · **Effort:** L
- [ ] Extract UI strings
- [ ] Hindi translations for navigation + interview pages
- [ ] Language switcher with persistence

---

## Build sequence

### Phase 0 — Foundation (week 1)
- [ ] I01 CI, I06 analytics, I02 content quality
- [ ] F08 local bookmarks
- [ ] Verify all 72 active routes

### Phase 1 — Retention loop (weeks 2–4)
- [ ] F02 local progress dashboard
- [ ] F03 continue learning
- [ ] F12 topic metadata + filters
- [ ] F11 prerequisites/related

### Phase 2 — Accounts + learning bank (weeks 5–8)
- [ ] F01 accounts + sync
- [ ] F04 company-tagged bank
- [ ] F10 roadmap generator
- [ ] F07 notes

### Phase 3 — Daily habit (weeks 9–12)
- [ ] F14 daily challenge
- [ ] F09 SRS flashcards
- [ ] F06 AI tutor (BYO key)
- [ ] F20 embed widget

### Phase 4 — Community + scale (later)
- [ ] F17 Q&A
- [ ] F15 leaderboards
- [ ] F05 mock interviews
- [ ] F16 certificates
- [ ] F19 public API

## Cost model — what runs for ₹0

Nothing below is blocked on donations. Build in this order so the free tiers last.

| Tier | Features | What it needs |
| :--- | :--- | :--- |
| **₹0 — no server** | F02 local, F03, F07 (local), F08, F11, F12, F14, F18, F20, I01–I06 | Repo content, `localStorage`, static routes |
| **Free tier** | F01, F04, F06 (BYO key), F09, F10, F13 (client-side WASM), F15, F16, F17, F19 | Supabase/Neon free tier, Vercel functions, GitHub Actions |
| **Paid only at scale** | DB overages, server-side judge compute, heavy realtime | Trigger only when free limits are actually exceeded |

Rules:
- Local-first until a feature genuinely needs sync.
- No server-side AI; the user brings a key.
- No judge until exercises are proven useful; start with client-side WASM.
- If a free tier is exhausted, degrade gracefully — do not add a paywall.
- Track actual spend in `SUPPORT.md`; publish it on `/support`.

## Horizon 2036 — build the primitives early

These are bets, not commitments. The point is to ship the data model now so the
next decade is cheap to add. Order matters: H01–H04 are buildable within a year.

### H01 — Agentic Socratic tutor
- **Why now:** AI tutors are shifting from chat to goal-oriented agents (OECD 2026).
- **Scope:** agent plans a session, asks questions, detects misconceptions, updates the learner model.
- **Primitive needed:** topic graph + mastery state + BYO-key runtime.

### H02 — Mastery model + adaptive sequencing
- **Why now:** adaptive learning is the highest-evidence personalization layer.
- **Scope:** Bayesian/knowledge-tracing model over topics, prerequisites, and quiz results.
- **Primitive needed:** per-topic mastery scores and event history.

### H03 — Verifiable micro-credentials
- **Why now:** skills-based hiring and portable micro-credentials keep growing.
- **Scope:** free Open Badges 3.0 / W3C Verifiable Credentials per domain and path.
- **Primitive needed:** stable learner IDs, completion proofs, public verification page.

### H04 — Local-first AI (offline/private)
- **Why now:** WebGPU/WebLLM makes small models viable in the browser; privacy matters.
- **Scope:** explain-this-topic and flashcard generation without sending data to a server.
- **Primitive needed:** provider abstraction so local and BYO-key models share one interface.

### H05 — Voice + multimodal explanations
- **Why now:** speech and diagram understanding are becoming default interfaces.
- **Scope:** talk to a visualizer, ask "why did the pointer move?", get a spoken walkthrough.
- **Primitive needed:** transcript/event model per visualizer.

### H06 — WebXR/WebGPU visualizers
- **Why now:** immersive learning is moving from pilots to standard practice.
- **Scope:** 3D memory, CPU, and network visualizers that run in the browser.
- **Primitive needed:** rendering-agnostic visualization state (already partially present in `xrcosmos`).

### H07 — Process-based assessment
- **Why now:** AI makes output-based grading unreliable; oral and process evidence wins.
- **Scope:** viva mode, code-comprehension checks, explain-your-solution recordings.
- **Primitive needed:** question bank + rubric + playback.

### H08 — MCP / agent interoperability
- **Why now:** assistants will call tools, not browse pages.
- **Scope:** expose topics, visuals, and interview questions as MCP tools for any AI client.
- **Primitive needed:** stable public API (F19) + structured metadata.

### H09 — Provenance and versioned community content
- **Why now:** AI-generated content floods education; provenance becomes trust.
- **Scope:** every topic has authors, reviewers, sources, and a changelog.
- **Primitive needed:** content versioning and review workflow.

### H10 — Career skill graph + proof of work
- **Why now:** hiring is shifting from degrees to demonstrated skills.
- **Scope:** map completed topics to role skills, attach verified projects and assessments.
- **Primitive needed:** skill taxonomy + portable profile.

### H11 — Regional languages and low-bandwidth mode
- **Why now:** the next billion learners are mobile-first and non-English-first.
- **Scope:** Hindi and regional language UI, text-first visualizers, offline packs.
- **Primitive needed:** i18n and a static content pipeline.

### H12 — Frontier computing modules
- **Why now:** quantum, bio, robotics, and neuromorphic systems will need explainers.
- **Scope:** visual modules for quantum circuits, DNA storage, robotics, and hardware security.
- **Primitive needed:** the existing domain/topic system (already supports this).

## Non-goals

- Paid courses, live cohorts, placement guarantees.
- Scraping paywalled content from LeetCode/GFG/InterviewBit.
- Rewriting all 245 topics before shipping the learning loop.
- Competing with GFG or LeetCode on catalog size.

## Definition of done

- `npm run lint` and `npm run build` pass.
- New routes are statically generated where possible.
- Both themes work; keyboard + screen-reader paths verified.
- No fake metrics or placeholder copy in shipped UI.
- Feature has an acceptance check and analytics event.
