# CSCosmos — 50 Improvements

Ordered roughly by impact. P0 = trust or correctness, P1 = product depth, P2 = polish/scale.

## Content and learning

1. **P0** Replace the generic `shortDescription` generated for all 245 topics with a real one-line description.
2. **P0** Add a `sources` field to every active topic and cite the material each visualizer is based on.
3. **P0** Add `lastReviewed` and `reviewer` metadata; surface “last reviewed” on topic pages.
4. **P0** Fill prerequisites for every active topic instead of the current partial override map.
5. **P1** Replace the same-domain fallback for related topics with curated related links for all 72 live topics.
6. **P1** Add a content changelog per topic so corrections are traceable.
7. **P1** Add a “known limitations” section to visualizers where the simulation simplifies reality.
8. **P1** Create a per-engine QA checklist: correctness, edge cases, mobile, keyboard, dark mode.
9. **P1** Expand the interview bank from 24 to at least 100 questions with company tags.
10. **P1** Add company filters to review and exercise sessions, not just the interview list.
11. **P1** Extend spaced repetition to completed topics and exercises, not only interview questions.
12. **P1** Add code-output prediction exercises; the current exercises are multiple-choice only.
13. **P2** Add short-answer exercises with normalized/fuzzy grading.
14. **P2** Store exercise attempt history and surface weak domains.
15. **P2** Add audio recording for mock interviews, stored locally.
16. **P2** Add roadmap controls to lock, swap, or skip a topic without regenerating everything.
17. **P2** Add ICS export for generated roadmaps.
18. **P2** Issue domain-specific certificates (DSA, systems, security) instead of one generic certificate.
19. **P2** Add certificate revocation and regeneration.

## Engineering and code quality

20. **P0** Remove the 46 current ESLint warnings, starting with explicit `any` types.
21. **P0** Add a content validation test that fails if an active topic lacks a real description or metadata.
22. **P1** Split the largest visualizer components into smaller units with shared primitives.
23. **P1** Add Playwright E2E tests for the top 20 visualizers.
24. **P1** Add visual regression screenshots for visualizer canvases.
25. **P1** Add axe accessibility checks to the main routes and top visualizers.
26. **P1** Add keyboard-navigation tests for canvas-heavy pages.
27. **P1** Add focus traps to menus, drawers, and dialogs.
28. **P1** Add a reduced-motion mode and verify every animation respects it.
29. **P1** Add per-route performance budgets and fail CI on bundle regressions.
30. **P1** Lazy-mount heavy engines (D3, Monaco, anime.js) below the fold.
31. **P2** Add Sentry or equivalent error monitoring.
32. **P2** Add analytics events for topic view, exercise complete, review grade, and sync.
33. **P2** Add server-side caching/invalidation for the public APIs.
34. **P2** Add JSON-LD for topics and interview pages.
35. **P2** Add dynamic OG images per topic and interview question.
36. **P2** Add a PWA manifest and offline reading for static topic pages.

## UX and accessibility

37. **P1** Add breadcrumbs to universal topic pages.
38. **P1** Add “back to domain” navigation inside self-contained visualizer routes.
39. **P1** Unify the duplicated engine headers/footers with the site shell, or clearly scope them.
40. **P1** Add global search across topics, interview questions, and exercises.
41. **P1** Add tag, difficulty, time, and completion filters in one coherent filter bar.
42. **P1** Add “completed / in progress / not started” filters to the catalog.
43. **P1** Add high-contrast and larger-type accessibility modes.
44. **P2** Add progress export/import as JSON.
45. **P2** Add a proper 404 and route-level error state for visualizer failures.

## Accounts and growth

46. **P1** Add session management and “sign out other devices.”
47. **P1** Add account deletion and full data export.
48. **P1** Add merge-based sync conflict resolution instead of push/pull replacement.
49. **P2** Add GitHub/Google OAuth alongside magic links.
50. **P2** Add comment edit/delete/report, moderation, pagination, and reply notifications.
