# CSCosmos Architecture

CSCosmos is a visual computer science learning platform: 245 curated topics, 72 live
interactive visualizer topics, interview walkthroughs, and a local-first learning layer
with optional accounts.

## System overview

```text
src/data/
  domains.ts       8 domains
  topics.ts        245 topics + metadata
  topic-meta.ts    difficulty, time, tags, prerequisites, related topics
  engine-routes.ts 70 topicSlug -> engineDir mappings
  interview/       5 categories, questions, companies, animations
  exercises.ts     auto-graded original questions

src/app/
  /[domain]/[topicSlug]/[[...segments]]   canonical topic + module routes
  /[domain]                       domain hubs
  /topics                         catalog + filters
  /interview                      interview bank
  /roadmap                        plan generator
  /review                         spaced repetition
  /exercises                      auto-graded exercises
  /mock-interview                 timed self-scored interviews
  /tutor                          BYO-key AI tutor
  /progress                       local/account progress
  /leaderboard                    opt-in completed-topic ranking
  /certificate/[certificateId]               public certificate
  /embed/topic/[topicSlug]             chrome-free visualizer iframe
  /api/*                          auth, learning sync, comments, certificates

Postgres (optional)
  ├─ cscosmos_users / login_tokens / sessions
  ├─ cscosmos_learning   bookmarks, completed, visited, notes
  ├─ cscosmos_certificates
  └─ cscosmos_comments
```

## Content model

`Topic` is the single source of truth:

- identity: `id` (numeric, internal), `name`, `slug` (public `topicSlug`), `domain`, `crossListedDomains`
- status: `active` or `coming-soon`
- public path: `canonicalPath` (`/<domain>/<slug>`)
- learning metadata: difficulty, estimated minutes, tags
- graph metadata: prerequisites and related slugs

`src/data/engine-routes.ts` maps each `topicSlug` to its `engineDir` and engine
path. `src/lib/module-registry.ts` registers the multi-view curriculum modules.
The universal route renders a module when registered, otherwise a development page.
See [`NAMING.md`](./NAMING.md) for the vocabulary used across the codebase.

## Rendering and SSG

- The site is static-first via Next.js App Router and `generateStaticParams`.
- The universal topic route pre-renders all views and subtopics.
- Visualizer engines are client components and must not touch `window` at module scope.
- Embed mode hides site chrome with `?embed=1` and a global `data-embed` flag.
- Account, leaderboard, certificate, and progress pages are request-time rendered because
  they read cookies or Postgres.

## Learning layer

Local-first by default:

- `src/lib/local-learning.ts` stores bookmarks, completed topics, and visited timestamps.
- Notes use `cscosmos:notes:v1`.
- Review scheduling uses a simplified SM-2 queue in `src/lib/review.ts`.
- Exercises and mock interviews keep session state in memory; certificates and progress
  sync are optional.

Signed-in learners can push/pull the same learning state to Postgres through
`/api/user/learning`. Local state remains the source of truth until the learner chooses
to sync.

## Authentication

Passwordless magic links, isolated from ContestRadar with `cscosmos_` table prefixes:

1. `/api/auth/request` hashes a random token and emails the link through Resend.
2. `/api/auth/verify` consumes the token, upserts the user, and sets an HttpOnly session.
3. `getSessionUser()` resolves the session for progress, certificates, leaderboard, and
   comments.
4. Sessions expire after 30 days.

## Feature modules

- **Roadmap:** deterministic grouping of active topics by goal, level, and weekly hours.
- **Review:** SM-2 queue built from interview questions.
- **Exercises:** original multiple-choice questions with answers and explanations.
- **Mock interview:** timed question sessions with self-scoring.
- **Tutor:** browser-side OpenAI-compatible calls with a user-provided key; no CSCosmos
  inference cost or key storage.
- **Comments:** authenticated per-topic threads with rate limiting and masked emails.
- **Certificates:** issued at 10 completed topics; public verification page and print view.
- **Embed:** iframe of a topic route with chrome hidden.

## Database

`db/auth.sql` creates the optional account tables. The site works without
`DATABASE_URL`; account APIs return `503`, and local learning features keep working.

## Testing

- Vitest covers catalog invariants, topic metadata, exercises, review scheduling, tutor
  settings, interview data, and existing utility tests.
- Playwright smoke tests cover the canonical URL, metadata, completion/reset flow, step
  navigation, keyboard controls, theming, and mobile navigation for `program-cosmos`.
- Lint, tests, and the full static build run in CI.

## Tradeoffs

- **Static-first + optional accounts:** keeps the site fast and free, but cross-device
  sync requires a database.
- **Local-first review/progress:** privacy-friendly and cheap, but not automatically
  available on a new device until synced.
- **BYO-key tutor:** zero inference cost, but users must supply a provider and the
  provider must allow browser CORS.
- **Absorbed engines:** one deployment and consistent SEO, at the cost of a larger
  route and component surface.
- **Original questions/certificates instead of proctored exams:** free, but certificates
  verify recorded completion, not identity or exam integrity.
