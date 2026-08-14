# CSCosmos Project Blueprint & Technical Reference

## 📌 Overview
CSCosmos is an interactive computer science visualizer hub and learning platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **React 19**.

The platform organizes 172+ topics across 8 core domains and natively embeds interactive visualization engines directly into client-side routes.

---

## 🏗️ Architecture & Data Model

### Data Schemas
- **Domains**: Defined in `src/data/domains.ts`. Represents 8 CS fields (`fullstack`, `dsa`, `web3`, `ai`, `corecs`, `devops`, `advanced`).
- **Topics**: Defined in `src/data/topics.ts`.
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

---

## 🌐 Routes & Native Visualizers Status

| Route | Status | Description / Visualizer |
| :--- | :--- | :--- |
| `/` | Live | Main Landing Page (Hero, Search, Domain Grid, Featured Deep-Dives) |
| `/topics` | Live | Catalog of all 172+ topics with domain filters & search |
| `/[domain]` | Live | Domain specific topic lists (e.g. `/fullstack`, `/ai`, `/dsa`) |
| `/program-cosmos` | **Absorbed** | Program execution visualizer (CPU, Memory, Instruction Cycle) |
| `/html-cosmos` | **Absorbed** | HTML & Accessibility visualizer (53 pre-rendered topic pages) |
| `/css-cosmos` | **Absorbed** | CSS Box Model, Flexbox, Grid visualizers |
| `/jsviz` | **Absorbed** | JavaScript Event Loop, Call Stack, Scope Chain & Memory visualizer |
| `/webprotocols` | **Absorbed** | HTTP, DNS, TCP/IP web protocols visualizers |
| `/websecurity` | **Absorbed** | XSS, CSRF, CSP, CORS security visualizers |
| `/reactcosmos` | **Absorbed** | React Fiber, Virtual DOM, Reconciliation & Hooks visualizers |
| `/nextjscosmos` | **Absorbed** | Next.js 15 App Router concepts, RSC, SSG/SSR/ISR, Error Debugger |
| `/golangviz` | **Absorbed** | Go GMP Scheduler, Channels, Slice Memory Header, Stepper |
| `/tsviz` | **Absorbed** | TypeScript Type Narrowing, CFA, Generics, Utility Lab & TSC Pipeline |
| `/redisviz` | **Absorbed** | Redis Data Structures (SDS, SkipList), Caching Patterns, Eviction, CLI |
| `/sqlcosmos` | **Absorbed** | SQL Query Planner, B+ Tree Indexing, Joins Engine, EXPLAIN, MVCC |
| `/nodecosmos` | **Absorbed** | Node.js 6-Phase Libuv Event Loop, Thread Pool, Streams Backpressure |
| `/dockercosmos` | **Absorbed** | Linux Namespaces, cgroups v2, OverlayFS, Pod Lifecycle, kube-proxy |
| `/blockchainviz` | **Absorbed** | Block Mining, Merkle Trees, EVM Stack, UTXO vs Account, Gossip Consensus |
| `/arrayviz` | **Absorbed** | Contiguous RAM Layout, 64-Byte Cache Lines, Sliding Window, KMP, Rabin-Karp |
| `/systemdesignviz` | **Absorbed** | Consistent Hashing Ring, Raft Consensus, Rate Limiters, CAP Partitioning, Sharding |
| `/learn/[slug]` | Active | Universal player loading native visualizers or fallback registry |

---

## 🔄 Roadmap & Absorption Progress

### Absorbed Sites (Native App Router):
- ✅ Site 1: `programviz` -> `/program-cosmos`
- ✅ Site 2: `htmlviz` -> `/html-cosmos`
- ✅ Site 3: `cssviz` -> `/css-cosmos`
- ✅ Site 4: `webprotocolsviz` -> `/webprotocols`
- ✅ Site 5: `websecureviz` -> `/websecurity`
- ✅ Site 6: `jsviz` -> `/jsviz` (Completed: sticky sidebar layout, SSR safety, dark/light theme, Event Loop & V8 GC Steppers)
- ✅ Site 7: `reactcosmos` -> `/reactcosmos` (Completed: 35 pre-rendered React topics, Fiber visualizer, Hooks simulator, lab playground)
- ✅ Site 8: `nextjscosmos` -> `/nextjscosmos` (Completed: 35 pre-rendered Next.js 15 App Router modules, RSC visualizer, SSG/SSR/ISR engine, Error debugger & Interactive lab)
- ✅ Site 9: `golangviz` -> `/golangviz` (Completed: Go GMP Scheduler, Channels, Slice Memory Lab, Stepper, 70 Concepts, Flashcards, 50 Pitfalls)
- ✅ Site 10: `tsviz` -> `/tsviz` (Completed: Control Flow Narrowing, Structural Subtyping, 12 Utility Types Lab, TSC 5-Stage Pipeline, Type Challenges, Flashcards, Cheat Sheet)
- ✅ Site 11: `redisviz` -> `/redisviz` (Completed: In-Memory Data Structures SDS/SkipList/QuickList, Caching Strategies Lab, Eviction Simulator, Interactive CLI, Persistence RDB/AOF)
- ✅ Site 12: `sqlcosmos` -> `/sqlcosmos` (Completed: B+ Tree Index Traversal, EXPLAIN ANALYZE Cost Optimizer, Physical Joins Engine, MVCC Tuple Versioning, SQL Playground)
- ✅ Site 13: `nodecosmos` -> `/nodecosmos` (Completed: 6-Phase Libuv Event Loop Stepper, UV_THREADPOOL_SIZE Thread Pool, Streams Backpressure Lab, Cluster vs Worker Threads)
- ✅ Site 14: `dockercosmos` -> `/dockercosmos` (Completed: 6 Linux Kernel Namespaces, OverlayFS Layered Storage Driver & CoW, cgroups v2 & OOM Killer, K8s Pod Lifecycle, kube-proxy Routing)
- ✅ Site 15: `blockchainviz` -> `/blockchainviz` (Completed: PoW Block Mining & Nonce Stepper, Merkle Trees & O(log N) SPV Proofs, 256-bit EVM Opcode Stack & Gas Meter, UTXO vs Account Flow, P2P Gossip Consensus)
- ✅ Site 16: `arrayviz` -> `/arrayviz` (Completed: Contiguous RAM Address Arithmetic, 64-Byte CPU Cache Line Spatial Locality, Geometric Resizing, Sliding Window Subarrays, KMP & Rabin-Karp)
- ✅ Site 17: `systemdesignviz` -> `/systemdesignviz` (Completed: Consistent Hashing & Virtual Nodes, Raft Consensus 5-Node Cluster, Distributed Rate Limiters, CAP Theorem & PACELC, Sharding & WAL, Back-of-the-Envelope Calculator)

### Planned Next Absorptions:
- ⏳ Site 18: `graphqlviz` & `apiviz` (GraphQL Schema AST, Resolvers, N+1 DataLoader & REST)

---

## 🛠️ Verification & Quality Standards

1. **Lint & Build Checks**:
   - `npm run lint` must exit with 0 errors.
   - `npm run build` must verify static pre-rendering and SSR compatibility (ensure no window / browser global leaks during static generation).
2. **Theme Compatibility**:
   - Every visualizer component must support both Light and Dark mode using Tailwind CSS dark classes and CSS variables.
