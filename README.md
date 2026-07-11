# CSCosmos

CSCosmos is a curated hub of computer science microsites across Full Stack, DSA, Web3, Cybersecurity, AI, Core CS, DevOps, and Advanced Engineering.

- Live: https://cscosmos.vercel.app
- Repo: https://github.com/subhajitlucky/cscosmos
- Creator: https://subhajitpradhan.vercel.app
- Portfolio case study: https://subhajitpradhan.vercel.app/projects/cscosmos
- Status: Live platform

## Proof

- 172 planned computer science learning modules.
- 34 live microsites linked from the hub.
- 8 major domains with dedicated routes.
- Search, domain browsing, topic detail pages, live/coming-soon states, and dark/light theme support.
- Vercel deployment with SPA rewrites for deep links.

## Why This Exists

Computer science topics are usually scattered across separate articles, demos, videos, and one-off visualizers. CSCosmos organizes them into one navigable map so learners can move from fundamentals to advanced systems without losing context.

The goal is not to publish a static list. The hub acts as an index for a growing set of focused microsites where each topic can eventually become an interactive visual learning module.

## Current Domains

- Full Stack Development
- Data Structures and Algorithms
- Web3 and Blockchain
- Cybersecurity and Ethical Hacking
- Artificial Intelligence
- Core Computer Science
- DevOps, Cloud, and Engineering
- Advanced Engineering and Systems

## Selected Live Microsites

- Program execution visualizer: https://programviz.vercel.app
- HTTP and web protocols: https://webprotocols.vercel.app
- Web security visualizer: https://websecureviz.vercel.app
- JavaScript visualizer: https://jsviz.vercel.app
- TypeScript visualizer: https://tsviz.vercel.app
- Browser internals: https://browseruniverse.vercel.app
- React visualizer: https://reactcosmos.vercel.app
- Next.js visualizer: https://nextjscosmos.vercel.app
- SQL visualizer: https://sqlcosmos.vercel.app
- Blockchain fundamentals: https://blockchainviz.vercel.app
- EVM internals: https://evminternals.vercel.app
- Docker visualizer: https://dockercosmos.vercel.app
- Kubernetes visualizer: https://k8scosmos.vercel.app

The authoritative list is defined in `src/data/topics.ts`.

## Product Features

- Browse topics by domain.
- Search across the full topic catalog.
- Open topic detail pages with status and domain context.
- Launch live microsites directly from topic cards or detail pages.
- Distinguish `active` modules from `coming-soon` modules.
- Persist light/dark theme preference with local storage.
- Support direct links and refreshes through Vercel rewrites.

## Architecture

```text
src/App.tsx
  React Router route tree

src/data/domains.ts
  Domain metadata: name, route, description, color

src/data/topics.ts
  Topic catalog: id, name, domain, slug, status, optional URL

src/pages/*
  Home, all topics, domain pages, topic detail, about, coming soon

src/components/*
  Navbar, footer, search, domain cards, topic cards, theme toggle

public/*
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
3. Add the deployed `url`.
4. The home page, topic index, domain page, counts, badges, and launch links update from the same data source.

## Routing And Deployment

CSCosmos uses React Router for client-side routes:

- `/`
- `/topics`
- `/about`
- `/:domainKey`
- `/:domainKey/:topicSlug`

Because this is a Vite SPA, `vercel.json` rewrites all requests to `/index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This keeps deep links and browser refreshes working on Vercel.

## SEO And AI Discovery

The hub includes:

- Static title, description, canonical URL, robots metadata, OpenGraph, Twitter metadata, and JSON-LD in `index.html`.
- `public/robots.txt`.
- `public/sitemap.xml`.
- `public/llms.txt`.

The current hub is still a client-rendered SPA, so the next major SEO upgrade would be migrating the hub to Next.js or another static/server-rendered setup so topic and domain pages ship richer HTML before hydration.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Vercel

## Getting Started

```bash
npm install
npm run dev
```

Visit:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Tradeoffs

- The Vite SPA keeps development fast and deployment simple, but it does not provide per-route server-rendered HTML.
- The topic catalog is stored in TypeScript for simplicity, but a larger version could move to MDX, JSON, a CMS, or a database.
- Live microsites are separate deployments, which keeps each topic isolated but increases maintenance work across many small projects.

## Roadmap

- Add screenshots and short previews for live microsites.
- Add generated sitemap entries for every active topic.
- Add progress filters for active versus planned modules.
- Add richer topic metadata: difficulty, estimated reading time, prerequisites, and related topics.
- Consider migrating the hub to Next.js for static generation of domain and topic pages.

## Contributing

PRs and issues are welcome.

To add or update a microsite:

1. Edit `src/data/topics.ts`.
2. Set `status: 'active'` and provide `url` for live items.
3. Leave planned modules as `status: 'coming-soon'`.
4. Run `npm run build` before submitting.
