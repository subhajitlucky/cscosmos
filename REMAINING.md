# CSCosmos — What Remains

Status snapshot: **14 of 20 planned features shipped**.

## Shipped

- Local progress dashboard and streaks.
- Continue learning.
- Company-tagged interview bank.
- Per-topic notes.
- Local bookmarks.
- Daily challenge.
- Suggest-an-edit workflow.
- Public API (`/api/topics`, `/api/domains`, `/api/interview`) with `/developers` docs.
- Topic metadata: difficulty, estimated time, tags, prerequisites, related topics.
- Catalog filters for difficulty and time.
- Personalized roadmap generator at `/roadmap`.
- Local spaced-repetition review queue at `/review`.
- Timed, self-scored mock interviews at `/mock-interview`.
- Bring-your-own-key AI tutor at `/tutor` with per-topic context.

## Feature backlog

| ID | Feature | Priority | Depends on | Notes |
| :--- | :--- | :--- | :--- | :--- |
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

1. **Auth + Postgres** (F01) unlocks leaderboards, certificates, and community.
2. **Judge** (F13) and **embed layout** (F20) are separate tracks; do not block learning features on them.

## Next batch

F01 → F15/F16/F17, then F13/F20.
