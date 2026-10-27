# CSCosmos — The Next 10 Years

The features that survive are not the ones that look modern in 2026. They are the ones
that stay useful when the interface, the model, and the search engine all change.

## Durability test

Every future feature should pass at least four of these:

1. **Agent-accessible:** usable through an API/MCP tool, not only a webpage.
2. **Owned data:** learner state is exportable and portable.
3. **Trustable:** sources, authors, reviewers, and version history are visible.
4. **Verifiable:** completion and skill claims can be checked by a third party.
5. **Local-first:** core learning works offline and without an account.
6. **Multimodal:** text, voice, diagrams, and eventually spatial interfaces.
7. **Inclusive:** low bandwidth, small screens, regional languages, accessibility.

## Ten bets

### 1. MCP server for learning
Expose topics, visualizers, interview questions, and review decks as tools any AI
assistant can call. Build a thin wrapper over the public API.
**Why it lasts:** assistants will browse less and call tools more.
**Build now:** stable topic IDs, `/api/topics`, `/api/interview`, an MCP manifest.

### 2. Mastery graph instead of a completion counter
Model per-topic mastery from exercises, reviews, and time-on-task. Use it to choose the
next topic, not just to display a percentage.
**Why it lasts:** adaptive sequencing is the highest-evidence personalization layer.
**Build now:** event schema for answers, reviews, and completions.

### 3. Verifiable micro-credentials
Issue Open Badges 3.0 / W3C Verifiable Credentials tied to assessments, with public
verification and selective disclosure.
**Why it lasts:** skills-based hiring keeps growing; certificates need to be checkable.
**Build now:** certificate records, issuer metadata, public verification pages.

### 4. Process-based assessment
Oral/viva mode, code-comprehension checks, “explain your solution,” and AI-use
disclosure. Grade the process, not just the output.
**Why it lasts:** AI makes output-only assessment unreliable.
**Build now:** rubrics, timed explain-back sessions, local recordings.

### 5. Local-first AI
Run a small tutor model in the browser with WebGPU/WebLLM, plus BYO-key support.
**Why it lasts:** privacy, cost, and offline access will matter more, not less.
**Build now:** provider abstraction that supports cloud, local, and user keys.

### 6. Voice and spatial visualizers
Talk to a visualizer, ask why a pointer moved, and eventually inspect systems in WebXR.
**Why it lasts:** multimodal and spatial interfaces are expanding beyond flat screens.
**Build now:** transcript/event models for visualizer state; keep rendering-agnostic.

### 7. Provenance and content trust
Every topic needs authors, reviewers, sources, a changelog, and a last-reviewed date.
**Why it lasts:** AI-generated content floods will make provenance a differentiator.
**Build now:** metadata fields, citation UI, review workflow.

### 8. Regional languages and low-bandwidth mode
Hindi and regional language UI, text-first visualizers, offline packs, and smaller
bundles for tier-2/3 users.
**Why it lasts:** the next billion learners are mobile-first and non-English-first.
**Build now:** i18n extraction, language switcher, text fallbacks for canvases.

### 9. Career skill graph and proof of work
Map completed topics to role skills, attach verified projects, and export a portfolio.
**Why it lasts:** hiring is moving from degrees to demonstrated ability.
**Build now:** skill taxonomy, portfolio export, verification links.

### 10. Open content commons
Let contributors author modules with review, attribution, and revenue sharing.
**Why it lasts:** a single maintainer cannot keep 245 modules accurate forever.
**Build now:** contribution guidelines, reviewer roles, versioned content.

## What not to build

- A VR-only experience before the flat web experience is excellent.
- Crypto tokens or wallet-gated learning.
- LLM-only features with no deterministic fallback.
- Native apps before the PWA and mobile web retain users.
- Scraped or copied paid course content.

## 90-day sequence

1. MCP server + public API hardening.
2. Mastery event schema and adaptive “next topic.”
3. Verifiable certificate v2 with issuer metadata.
4. Provenance fields across all active topics.
5. Hindi UI shell + text-first visualizer fallbacks.

## Signals to watch

- MCP/agent-tool adoption across assistants.
- AI answer engines reducing search traffic.
- Open Badges 3.0 and Verifiable Credentials adoption by employers.
- Passkey adoption replacing passwords.
- Browser WebGPU/WebLLM support.
- Platform API changes and rate limits.
