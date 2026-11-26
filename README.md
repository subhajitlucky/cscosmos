# CSCosmos

CSCosmos is an interactive computer science visualizer hub and learning platform, organizing 257 catalog topics across 8 core domains with natively absorbed interactive visualization engines.

- Live: https://cscosmos.vercel.app
- Repo: https://github.com/subhajitlucky/cscosmos
- Creator: https://subhajitpradhan.vercel.app
- Portfolio case study: https://subhajitpradhan.vercel.app/projects/cscosmos
- Architecture: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- Naming: [docs/NAMING.md](./docs/NAMING.md)
- Status: Live platform

## Proof

- 257 computer science catalog topics.
- 49 live visualizer topics powered by 46 natively absorbed interactive engines (zero externally linked) and 3 registered curriculum modules. Another 24 topics are `coming-soon` while their engines are rebuilt.
- 8 major domains with dedicated routes.
- 2,500+ statically pre-rendered pages via Next.js SSG.
- Interview Prep: 25 deep-dive questions across 5 categories with step-by-step animated walkthroughs.
- Search, domain browsing, topic detail pages, live/coming-soon states, and dark/light theme support.
- Vercel deployment with SSG pre-rendering and App Router.

## Why This Exists

Computer science topics are usually scattered across separate articles, demos, videos, and one-off visualizers. CSCosmos organizes them into one navigable map so learners can move from fundamentals to advanced systems without losing context.

The goal is not to publish a static list. The hub acts as an index for a growing set of focused engines where each topic can eventually become an interactive visual learning module — natively absorbed into the platform.

## Current Domains

- Full Stack Development
- Data Structures and Algorithms
- Web3 and Blockchain
- Cybersecurity and Ethical Hacking
- Artificial Intelligence
- Core Computer Science
- DevOps, Cloud, and Engineering
- Advanced Engineering and Systems

## Natively Absorbed Visualizers

All 46 interactive visualizer engines are absorbed as native Next.js routes within CSCosmos. The authoritative topic-to-engine mapping lives in `src/data/engine-routes.ts`; the last static build produced 2,500+ pre-rendered pages. Canonical topic URLs are `/[domain]/[topicSlug]`; each engine-backed topic is served from its `/[enginePath]` route and rewritten behind the canonical URL, while module-backed topics are served directly by the universal route.

| Domain | Active topics | Example canonical URLs |
|:-------|:--------------|:----------------------|
| **Full Stack Development** | 18 | `/fullstack/jsviz`, `/fullstack/tsviz`, `/fullstack/html-cosmos`, `/fullstack/reactcosmos` |
| **Data Structures & Algorithms** | 2 | `/dsa/arrayviz`, `/dsa/stringalgoviz` |
| **Web3 & Blockchain** | 8 | `/web3/blockchainviz`, `/web3/cryptviz`, `/web3/patriciatrie`, `/web3/solidityviz` |
| **Cybersecurity & Ethical Hacking** | 2 | `/security/websecurity`, `/security/authviz` |
| **Artificial Intelligence** | 4 | `/ai/aimathviz`, `/ai/ai-engineering-foundations`, `/ai/python-for-ai-engineering` |
| **Core Computer Science** | 2 | `/corecs/program-cosmos`, `/corecs/computer-networks-internals-tcpip` |
| **DevOps, Cloud & Engineering** | 5 | `/devops/gitcosmos`, `/devops/k8scosmos`, `/devops/cloudcosmos`, `/devops/loadbalancing` |
| **Advanced Engineering & Systems** | 8 | `/advanced/wasmcosmos`, `/advanced/xrcosmos`, `/advanced/systemdesignviz` |

The full 46-row engine mapping is in `src/data/engine-routes.ts`. The three
curriculum modules (`ai-engineering-foundations`, `python-for-ai-engineering`,
`computer-networks-internals-tcpip`) are registered in `src/lib/module-registry.ts`.
The Computer Networks module is module-backed rather than engine-backed: its canonical
URL is `/corecs/computer-networks-internals-tcpip`, with home, `/learn`, `/lab`, and
`/problems` views plus 50 concept pages. The authoritative topic catalog is
`src/data/topics.ts`.


## Product Features

- Browse topics by domain.
- Search across the full topic catalog.
- Open topic detail pages with status and domain context.
- Launch live engines directly from topic cards or detail pages.
- Distinguish `active` modules from `coming-soon` modules.
- Persist light/dark theme preference with local storage.
- Full SSG pre-rendering for fast page loads and SEO.
- Interactive code workbenches with live execution.

## Architecture

```text
src/app/
  Next.js App Router pages and catch-all engine routes

src/data/domains.ts
  Domain metadata: domainKey, name, description, color

src/data/topics.ts
  Topic catalog: id, name, domain, slug, status, canonicalPath, metadata

src/data/engine-routes.ts
  Authoritative topicSlug -> engineDir/enginePath mapping used by next.config.ts

src/lib/module-registry.ts
  Registered multi-view curriculum modules (two AI modules + Computer Networks)

src/components/visualizers/
  Native visualizer engine implementations (jsviz, cssviz, reactcosmos, etc.)

src/components/
  Navbar, footer, search, domain cards, topic cards, theme toggle

public/
  robots.txt, llms.txt, static public assets (the sitemap is generated by src/app/sitemap.ts)
```

## Data Model

Each topic is modeled with:

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

To publish a new live topic:

1. Add or update the topic in `src/data/topics.ts`.
2. Set `status: 'active'`; `canonicalPath` is derived automatically.
3. For an absorbed engine, add its mapping to `src/data/engine-routes.ts`.
4. The home page, topic index, domain page, counts, badges, sitemap, and launch links update from the same data source.

To absorb an engine natively:

1. Place source components in `src/components/visualizers/<engineDir>/`.
2. Create the engine route at `src/app/<enginePath>/[[...slug]]/page.tsx` and mount it through `EngineMount.tsx`.
3. Provide `generateStaticParams()` returning all sub-routes for SSG.
4. Add `{ domain, topicSlug, engineDir }` to `src/data/engine-routes.ts`; the canonical URL is generated automatically.

## Routing And Deployment

CSCosmos uses the Next.js App Router for file-system based routing. The public URL is always
the canonical topic URL `/[domain]/[topicSlug]`. Each engine-backed canonical URL is rewritten
to the engine implementation at `/<enginePath>/[[...slug]]` (46 engine paths today);
module-backed topics are served directly by the universal route:

- `/` — Home page
- `/topics` — Full topic catalog
- `/about` — About page
- `/interview` — Interview preparation hub across 5 categories
- `/interview/[category]` — Filterable question list (topic, difficulty, frequency, round, type)
- `/interview/[category]/[questionSlug]` — Dedicated question page with step-by-step animated walkthrough
- `/[domain]` — Domain-specific topic lists (e.g., `/fullstack`, `/ai`, `/dsa`)
- `/[domain]/[topicSlug]` — Canonical topic URL (rewritten to the engine route for engine-backed topics; served directly for module-backed topics)
- `/learn/[topicSlug]` — permanent redirect alias to the canonical topic URL
- `/embed/topic/[topicSlug]` — chrome-free visualizer embed
- `/<enginePath>/[[...slug]]` — engine implementation route (e.g. `/program-cosmos`, `/jsviz`)

All routes are statically pre-rendered at build time via `generateStaticParams()` for optimal performance and SEO.

## SEO And AI Discovery

The platform includes:

- Server-rendered HTML for all pages via Next.js SSG.
- Proper title, description, canonical URL, robots metadata, OpenGraph, and Twitter metadata.
- `public/robots.txt`.
- A generated sitemap at `src/app/sitemap.ts` (served as `/sitemap.xml`; there is no static file).
- `public/llms.txt`.

## Accounts And Sync

Progress, bookmarks, notes, and streaks are local-first. Optional passwordless accounts
sync them across devices.

1. Use any Postgres free tier and set `DATABASE_URL` (and `DATABASE_SSL=disable` locally).
2. Run [`db/auth.sql`](./db/auth.sql).
3. Set `RESEND_API_KEY`, `ALERT_FROM_EMAIL`, and `NEXT_PUBLIC_SITE_URL`.
4. Sign in at `/login`; push or pull state from `/progress`.

If these variables are missing, the rest of the site works and the account APIs return an
honest `503`.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Framer Motion
- Lucide React
- Monaco Editor
- Anime.js / D3.js
- Vercel

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when you need local environment
overrides. Google Analytics is opt-in and only initializes in production when
`NEXT_PUBLIC_GA_MEASUREMENT_ID` contains a valid GA4 measurement ID.

Visit:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm test
npm run test:e2e
npm run deploy:prune
npm run deploy:prune:team
npm run storage:check
```

`npm run test:e2e` builds the app, starts the production server on port 3100, and runs the Playwright smoke suite.

`npm run deploy:prune` keeps the 2 newest CSCosmos deployments and removes older ones that do not hold an active alias. `npm run deploy:prune:team` keeps 5 newest deployments per team project (2 for CSCosmos), which is useful when the shared team Deployment Storage limit is close.

`npm run storage:check` compares current Deployment Storage and Functions Storage with the peak recorded during the current usage window. The Vercel Usage page shows the peak for the selected range, so the 30-day view can keep showing the pre-cleanup total after deployments are deleted. The current value is what applies to the limit; the peak rolls off as the window advances.

## Tradeoffs

- Next.js App Router provides SSG pre-rendering and SEO out of the box, but adds build complexity compared to a plain SPA.
- The topic catalog is stored in TypeScript for simplicity, but a larger version could move to MDX, JSON, a CMS, or a database.
- Absorbing engines natively keeps the user experience seamless but increases the monorepo surface area.
- All former external engines now run as native routes, so every topic shares one deployment pipeline and one SEO surface.

## Roadmap

- Expand the DSA domain (40 topics; 2 live today).
- Build the Advanced Engineering & Systems domain (18 topics; 8 live today).
- Add screenshots and short previews for live engines.
- Add progress filters for active versus planned modules.
- Deepen the three registered curriculum modules and add more multi-view modules.

## Contributing

PRs and issues are welcome.

To add or update an engine:

1. Edit `src/data/topics.ts`.
2. Set `status: 'active'` for live topics.
3. Add the topic-to-engine mapping in `src/data/engine-routes.ts`.
4. Run `npm test`, `npm run lint`, and `npm run build` before submitting.
