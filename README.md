# CSCosmos

CSCosmos is an interactive computer science visualizer hub and learning platform, organizing 157+ topics across 8 core domains with natively absorbed interactive visualization engines.

- Live: https://cscosmos.vercel.app
- Repo: https://github.com/subhajitlucky/cscosmos
- Creator: https://subhajitpradhan.vercel.app
- Portfolio case study: https://subhajitpradhan.vercel.app/projects/cscosmos
- Status: Live platform

## Proof

- 157+ planned computer science learning modules.
- 34 live visualizer topics (9 natively absorbed, 25 externally linked).
- 8 major domains with dedicated routes.
- 440 statically pre-rendered pages via Next.js SSG.
- Search, domain browsing, topic detail pages, live/coming-soon states, and dark/light theme support.
- Vercel deployment with SSG pre-rendering and App Router.

## Why This Exists

Computer science topics are usually scattered across separate articles, demos, videos, and one-off visualizers. CSCosmos organizes them into one navigable map so learners can move from fundamentals to advanced systems without losing context.

The goal is not to publish a static list. The hub acts as an index for a growing set of focused microsites where each topic can eventually become an interactive visual learning module — natively absorbed into the platform.

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

## Natively Absorbed Visualizers

All 47 microsites and interactive visualizer engines have been fully absorbed and integrated as native Next.js routes within CSCosmos with 1,500+ statically pre-rendered SSG pages:

| Domain | Absorbed Visualizer Routes |
|:-------|:---------------------------|
| **Full Stack & Core Web** | `/program-cosmos`, `/html-cosmos`, `/css-cosmos`, `/webprotocols`, `/websecurity`, `/jsviz`, `/tsviz`, `/browseruniverse`, `/reactcosmos`, `/nextjscosmos`, `/vuecosmos`, `/sveltecosmos`, `/tailwindcosmos`, `/wasmcosmos`, `/xrcosmos`, `/crossplatformviz` |
| **Backend & Systems** | `/nodecosmos`, `/golangviz`, `/rustviz`, `/fastapicosmos`, `/apiviz`, `/authviz`, `/sqlcosmos`, `/mongocosmos`, `/redisviz`, `/synccosmos` |
| **Architecture & DevOps** | `/dockercosmos`, `/k8scosmos`, `/gitcosmos`, `/cloudcosmos`, `/loadbalancing`, `/mqviz`, `/microservicesviz`, `/lldcosmos`, `/systemdesignviz` |
| **Web3 & Blockchain** | `/blockchainviz`, `/cryptviz`, `/merkletreeviz`, `/patriciatrie`, `/consensusviz`, `/ptopblockchain`, `/evminternals`, `/solidityviz` |
| **DSA & AI** | `/arrayviz`, `/stringalgoviz`, `/aimathviz`, `/aicosmos` |

The authoritative list is defined in `src/data/topics.ts`.

## Product Features

- Browse topics by domain.
- Search across the full topic catalog.
- Open topic detail pages with status and domain context.
- Launch live microsites directly from topic cards or detail pages.
- Distinguish `active` modules from `coming-soon` modules.
- Persist light/dark theme preference with local storage.
- Full SSG pre-rendering for fast page loads and SEO.
- Interactive code workbenches with live execution.

## Architecture

```text
src/app/
  Next.js 15 App Router pages and catch-all routes for absorbed visualizers

src/data/domains.ts
  Domain metadata: name, route, description, color, icons

src/data/topics.ts
  Topic catalog: id, name, domain, slug, status, optional URL

src/components/visualizers/
  Native visualizer engine implementations (jsviz, cssviz, reactcosmos, etc.)

src/components/
  Navbar, footer, search, domain cards, topic cards, theme toggle

public/
  robots.txt, sitemap.xml, llms.txt, static public assets
```

## Data Model

Each topic is modeled with:

```ts
type Topic = {
  id: number;
  name: string;
  domain: DomainKey;
  shortDescription: string;
  slug: string;
  status: 'coming-soon' | 'active';
  url?: string;
};
```

To publish a new live microsite:

1. Add or update the topic in `src/data/topics.ts`.
2. Set `status: 'active'`.
3. Add the deployed `url` (for external links) or an internal route path.
4. The home page, topic index, domain page, counts, badges, and launch links update from the same data source.

To absorb a microsite natively:

1. Place source components in `src/components/visualizers/<site_name>/`.
2. Create the route in `src/app/<site_name>/[[...slug]]/page.tsx`.
3. Provide `generateStaticParams()` returning all sub-routes for SSG.
4. Update `src/data/topics.ts` matching topic IDs: set `status: 'active'`.

## Routing And Deployment

CSCosmos uses the Next.js 15 App Router for file-system based routing:

- `/` — Home page
- `/topics` — Full topic catalog
- `/about` — About page
- `/[domain]` — Domain-specific topic lists (e.g., `/fullstack`, `/ai`, `/dsa`)
- `/learn/[slug]` — Universal player loading native visualizers or fallback registry
- `/program-cosmos/[[...slug]]` — Absorbed visualizer routes
- `/html-cosmos/[[...slug]]`
- `/css-cosmos/[[...slug]]`
- `/jsviz/[[...slug]]`
- `/webprotocols/[[...slug]]`
- `/websecurity/[[...slug]]`
- `/reactcosmos/[[...slug]]`
- `/nextjscosmos/[[...slug]]`

All routes are statically pre-rendered at build time via `generateStaticParams()` for optimal performance and SEO.

## SEO And AI Discovery

The platform includes:

- Server-rendered HTML for all pages via Next.js SSG.
- Proper title, description, canonical URL, robots metadata, OpenGraph, and Twitter metadata.
- `public/robots.txt`.
- `public/sitemap.xml`.
- `public/llms.txt`.

## Tech Stack

- Next.js 15 (App Router)
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
```

## Tradeoffs

- Next.js App Router provides SSG pre-rendering and SEO out of the box, but adds build complexity compared to a plain SPA.
- The topic catalog is stored in TypeScript for simplicity, but a larger version could move to MDX, JSON, a CMS, or a database.
- Absorbing microsites natively keeps the user experience seamless but increases the monorepo surface area.
- External microsites remain as separate deployments, which keeps each topic isolated but increases maintenance work across many small projects.

## Roadmap

- Absorb TypeScript visualizer (`tsviz`) as native route.
- Absorb SQL visualizer (`sqlcosmos`) as native route.
- Absorb Docker visualizer (`dockercosmos`) as native route.
- Absorb Kubernetes visualizer (`k8scosmos`) as native route.
- Absorb Blockchain + EVM visualizers as native routes.
- Add screenshots and short previews for live microsites.
- Add generated sitemap entries for every active topic.
- Add progress filters for active versus planned modules.
- Add richer topic metadata: difficulty, estimated reading time, prerequisites, and related topics.

## Contributing

PRs and issues are welcome.

To add or update a microsite:

1. Edit `src/data/topics.ts`.
2. Set `status: 'active'` and provide `url` for live items.
3. Leave planned modules as `status: 'coming-soon'`.
4. Run `npm run build` before submitting.
