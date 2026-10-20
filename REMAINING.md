# CSCosmos — What Remains

Status snapshot: **20 of 20 planned features shipped**.

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
- Auto-graded exercises at `/exercises` with domain filters and explanations.
- Passwordless accounts and cross-device progress/bookmark/note sync.
- Opt-in completed-topic leaderboard.
- Public certificates with verification pages and print-to-PDF.
- Per-topic community Q&A with authenticated comments.
- Chrome-free visualizer embeds at `/embed/topic/[slug]`.

## Feature backlog

No planned features remain. The next work is depth and quality, not new surface area.

## Platform improvements

- **I02 Content quality:** replace generic topic descriptions, verify every active route, remove dead links.
- **I03 SEO/AI discovery:** dynamic OG images, `LearningResource`/`FAQPage` JSON-LD, stronger internal linking.
- **I04 Accessibility:** WCAG 2.2 AA audit, reduced-motion mode, keyboard paths, screen-reader labels.
- **I05 Performance:** Lighthouse budgets, split heavy engines (D3/Monaco/anime), lazy-mount visualizers.
- **I06 Observability:** error monitoring beyond current Vercel analytics.
- **I07 PWA/offline:** manifest and service worker for static topic pages.
- **I08 i18n:** Hindi and regional language UI, language switcher.

## Next batch

Content quality, accessibility, performance, and error monitoring. See the improvement list above.
