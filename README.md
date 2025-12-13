# CSCosmos

A curated hub of computer science microsites across Full-Stack, DSA, Web3, AI, Core CS, DevOps, and Advanced Engineering. Built with React + TypeScript + Vite + Tailwind, using React Router, and deployed on Vercel.

- Live: https://cscosmos.vercel.app  
- Repo: https://github.com/subhajitlucky/cscosmos

## Live microsites
The authoritative list (including which topics are live) is defined in `src/data/topics.ts`.  
To mark a topic live, set `status: 'active'` and provide its `url`. The UI and counts will pick this up automatically.

## Features
- Domain browsing and search across all topics
- Per-domain filtering and topic detail pages
- Light/dark theme toggle
- “Coming Soon” vs “Live” badges with external links for live microsites
- SPA routing with Vercel rewrites for deep links

## Tech stack
- React + TypeScript + Vite
- TailwindCSS + clsx + tailwind-merge
- React Router v7
- Deployed on Vercel (`vercel.json` SPA rewrite)

## Getting started
```bash
npm install
npm run dev
```
Visit http://localhost:5173

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — type-check then build
- `npm run preview` — preview production build
- `npm run lint` — eslint

## Routing / deployment
Client routes are handled by React Router. `vercel.json` rewrites all paths to `/` so refreshes on deep links (e.g., `/topics`, `/:domain/:topicSlug`) work on Vercel.

## Project structure
- `src/data/` — domains and topics (status + external URLs)
- `src/pages/` — Home, About, AllTopics, DomainPage, TopicDetail, ComingSoon
- `src/components/` — Navbar, Footer, Topic/Domain cards, SearchBar, ThemeToggle, UI primitives

## Contributing
PRs/issues welcome at https://github.com/subhajitlucky/cscosmos.  
To add or update a microsite:
- Edit `src/data/topics.ts`
- Set `status: 'active'` and provide `url` for live items; leave as `'coming-soon'` otherwise
- UI counts, badges, and links will update automatically
