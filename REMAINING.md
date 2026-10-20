# CSCosmos — What Remains

Status snapshot: **8 of 20 planned features shipped**. The rest are grouped by dependency
so the next batches do not build the same foundation twice.

## Shipped

- Local progress dashboard and streaks.
- Continue learning.
- Company-tagged interview bank.
- Per-topic notes.
- Local bookmarks.
- Daily challenge.
- Suggest-an-edit workflow.
- Public API (`/api/topics`, `/api/domains`, `/api/interview`) with `/developers` docs.

## Feature backlog

| ID | Feature | Priority | Depends on | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F11 | Prerequisite + related-topic graph | P1 | Topic metadata | Extend `Topic` with `prerequisites`, `related`, `difficulty`, `estimatedMinutes`; populate active topics. |
| F12 | Difficulty/time metadata + filters | P1 | F11 metadata | Filter catalog by domain, difficulty, tag, and time. |
| F10 | Personalized roadmap generator | P1 | F11, F12 | Generate 4/8/12-week plans from goals and metadata. |
| F09 | Global spaced-repetition flashcards | P1 | Per-engine flashcards | Unify existing cards into one SM-2 review queue; local-first. |
| F05 | Mock interview mode | P1 | Existing interview questions | Timer, hidden hints, self-score; no auth required for v1. |
| F06 | AI tutor with BYO key | P1 | None | User supplies key; explain current topic and visualizer; no inference cost to CSCosmos. |
| F01 | Accounts + cross-device sync | P0 for retention | Auth + Postgres free tier | Sync progress, bookmarks, notes, completions. |
| F15 | Weekly leaderboards | P2 | F01 | Opt-in profiles and weekly aggregation. |
| F16 | Certificates + verifiable badges | P2 | F01 | Open Badges / W3C VC with public verification. |
| F17 | Community Q&A per topic | P2 | F01 + moderation | Threads, voting, reporting, moderator tools. |
| F13 | Auto-graded exercises | P2 | Judge/runner | Start with client-side WASM; server judge only when proven. |
| F20 | Embeddable visualizer widget | P1 | Public embed route | Needs standalone embed layout and share snippets. |

## Platform improvements

- **I02 Content quality:** replace generic topic descriptions, verify every active route, remove dead links.
- **I03 SEO/AI discovery:** dynamic OG images, `LearningResource`/`FAQPage` JSON-LD, stronger internal linking.
- **I04 Accessibility:** WCAG 2.2 AA audit, reduced-motion mode, keyboard paths, screen-reader labels.
- **I05 Performance:** Lighthouse budgets, split heavy engines (D3/Monaco/anime), lazy-mount visualizers.
- **I06 Observability:** error monitoring beyond current Vercel analytics.
- **I07 PWA/offline:** manifest and service worker for static topic pages.
- **I08 i18n:** Hindi and regional language UI, language switcher.

## Critical path

1. **Metadata** (F11/F12) unlocks roadmap, filters, and recommendations.
2. **Local-first retention** (F09/F05/F06) ships without infrastructure.
3. **Auth + Postgres** (F01) is required before leaderboards, certificates, and community.
4. **Judge** (F13) and **embed layout** (F20) are separate tracks; do not block learning features on them.

## Next batch

F11 → F12 → F10 → F09, then F05 → F06, then F01.
