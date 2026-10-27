# CSCosmos Naming Guide

Use these terms when describing a change to another engineer or an AI assistant.
The goal is one unambiguous name per concept.

## Vocabulary

| Term | Meaning | Example |
| :--- | :--- | :--- |
| `topicSlug` | Stable public identifier for a catalog topic. Used by URLs, storage, analytics, and the API. | `computer-architecture-cpu-caches` |
| `catalogId` | Numeric internal id. Never appears in a URL. | `42` |
| `engineDir` | Folder under `src/components/visualizers/`. | `cpuviz` |
| `enginePath` | Top-level engine route segment. Currently equal to `topicSlug`. | `computer-architecture-cpu-caches` |
| `canonicalPath` | Public topic URL: `/<domain>/<topicSlug>`. | `/corecs/computer-architecture-cpu-caches` |
| `module` | A multi-view curriculum package registered in `src/lib/module-registry.ts`. | `ai-engineering-foundations` |
| `subtopicSlug` | A section inside a curriculum module. | `parameters` |
| `crossListedDomains` | Extra domains a topic is listed under. Not URL aliases. | `dockercosmos` is also under `devops` |
| `EngineMount` | The thin client component that mounts an engine for a route. | `src/app/jsviz/[[...slug]]/EngineMount.tsx` |

Reserve:

- **topic** — a catalog entry.
- **engine** — an interactive implementation.
- **module** — a multi-view curriculum package.
- **subtopic** — a section inside a module.

Do not use “microsite”, “site”, “visualizer”, “module”, and “topic” interchangeably.

## Canonical URLs vs engine paths

The public URL is always the canonical topic URL:

```text
/[domain]/[topicSlug]
```

It is internally rewritten to the engine implementation:

```text
/[enginePath]/[[...slug]]
```

Direct visits to the engine path 308-redirect to the canonical URL. The mapping is
`src/data/engine-routes.ts`; it is the only topic-to-engine mapping.

## When names differ

The engine folder is allowed to differ from the topic slug, but the mapping must be
explicit in `src/data/engine-routes.ts`:

| Topic slug | Engine dir | Engine path |
| :--- | :--- | :--- |
| `program-cosmos` | `programviz` | `program-cosmos` |
| `html-cosmos` | `htmlviz` | `html-cosmos` |
| `websecurity` | `websecureviz` | `websecurity` |
| `computer-architecture-cpu-caches` | `cpuviz` | `computer-architecture-cpu-caches` |
| `compilers-and-runtime-internals-ast-bytecode` | `compilerviz` | same |

The two AI curriculum modules (`ai-engineering-foundations` and
`python-for-ai-engineering`) share the `aicosmos` component folder. They are
registered as modules, not as engine routes.

## How to refer to a change unambiguously

Prefer:

> Fix `EngineMount` for topic `jsviz` (`engineDir: jsviz`) at
> `src/app/jsviz/[[...slug]]/EngineMount.tsx`.

Avoid:

> Fix the JS visualizer.

The second form could mean the catalog topic, the engine folder, the top-level route,
the module, or the canonical URL.

## Rules for new work

1. Add the topic to `src/data/topics.ts` with a unique `slug`.
2. Add `{ domain, topicSlug, engineDir }` to `src/data/engine-routes.ts`.
3. Create `src/app/<enginePath>/[[...slug]]/page.tsx` and mount through `EngineMount.tsx`.
4. Add `generateStaticParams()` for every engine sub-route.
5. Run `npm test`, `npm run lint`, and `npm run build`.

`src/data/engine-routes.test.ts` and `src/data/topic-meta.test.ts` enforce the mapping
and reference integrity.
