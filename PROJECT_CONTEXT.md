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
| `/apiviz` | **Absorbed** | GraphQL AST Resolvers, DataLoader N+1 Batching, Protocols Matrix, Idempotency Keys |
| `/authviz` | **Absorbed** | OAuth 2.0 PKCE, JWT RS256/None Exploit, HttpOnly Cookies, RBAC/ABAC, Argon2id |
| `/rustviz` | **Absorbed** | Rust Ownership, Fat Pointers, Borrow Checker NLL, Lifetimes & Variance, Tokio Concurrency |
| `/aicosmos` | **Absorbed** | Multi-Layer Perceptron Live Backprop, Transformer Self-Attention Heatmap, RAG & ReAct |
| `/mqviz` | **Absorbed** | Message Queues & Event Streaming (Kafka Partitions, Consumer Groups, DLQ & Exponential Backoff) |
| `/synccosmos` | **Absorbed** | Real-Time Sync & CRDTs (Join-Semilattices, RGA Character Tree, Vector Clocks & Lamport Timestamps) |
| `/microservicesviz` | **Absorbed** | Resilient Microservices (Circuit Breaker State Machine, Saga Orchestrator & Compensations, OpenTelemetry) |
| `/fastapicosmos` | **Absorbed** | Python FastAPI & Async (Uvicorn ASGI vs WSGI, Pydantic V2 Rust Validation, Hierarchical DI DAG Resolver) |
| `/wasmcosmos` | **Absorbed** | WebAssembly Internals (Virtual LIFO Stack Machine, 64KB Linear Memory ArrayBuffer, WAT Hex Inspector) |
| `/lldcosmos` | **Absorbed** | Low-Level Design & Clean Architecture (SOLID Principles Interactive Studio, GoF Design Patterns) |
| `/crossplatformviz` | **Absorbed** | Cross-Platform Mobile Internals (React Native JSI C++ HostObjects vs Old JSON Bridge, Flutter Impeller GPU) |
| `/sveltecosmos` | **Absorbed** | Svelte 5 Runes & Compiler (Zero VDOM Surgical DOM Mutators, $state/$derived Signals Sandbox, AST CodeGen) |
| `/tailwindcosmos` | **Absorbed** | Tailwind CSS JIT & Design Tokens (Dynamic Atomic CSS JIT Sandbox, Strict 4px Spacing & Harmonious Palette) |
| `/xrcosmos` | **Absorbed** | WebXR & Spatial Computing (6-DoF 3D Frustum Sandbox, 4x4 Affine Model Matrix, 25-Joint Hand Tracking) |
| `/mongocosmos` | **Absorbed** | MongoDB Internals (WiredTiger B-Tree & BSON Engine, Aggregation Pipeline, Replica Set Failover) |
| `/vuecosmos` | **Absorbed** | Vue 3 Reactivity (Proxy Track/Trigger, Template AST Compiler, SFC Pipeline, Component Lifecycle) |
| `/browseruniverse` | **Absorbed** | Browser Internals (HTML/CSS Parsing & Tokenizer, Render Tree & Layout Geometry, Compositor, V8 Engine) |
| `/learn/[slug]` | Active | Universal player loading native visualizers or fallback registry |

---

## 🔄 Roadmap & Absorption Progress

### Absorbed & Verified Sites (Native App Router — All 34 Complete):
- ✅ Site 1: `programviz` -> `/program-cosmos` (CPU, Memory, Instruction Cycle)
- ✅ Site 2: `htmlviz` -> `/html-cosmos` (53 pre-rendered semantic HTML and accessibility modules)
- ✅ Site 3: `cssviz` -> `/css-cosmos` (CSS Box Model, Flexbox Playground, CSS Grid Visualizer)
- ✅ Site 4: `webprotocolsviz` -> `/webprotocols` (HTTP/1.1 vs HTTP/2 vs HTTP/3, DNS Resolution, TCP 3-Way Handshake)
- ✅ Site 5: `websecureviz` -> `/websecurity` (XSS Sanitization, CSRF Tokens, CSP Builder, CORS Preflight)
- ✅ Site 6: `jsviz` -> `/jsviz` (Event Loop, Call Stack, Scope Chain, V8 Garbage Collection)
- ✅ Site 7: `reactcosmos` -> `/reactcosmos` (35 pre-rendered React topics, Fiber visualizer, Hooks simulator, lab playground)
- ✅ Site 8: `nextjscosmos` -> `/nextjscosmos` (35 pre-rendered Next.js 15 App Router modules, RSC visualizer, SSG/SSR/ISR engine, Error debugger)
- ✅ Site 9: `golangviz` -> `/golangviz` (Go GMP Scheduler, Channels, Slice Memory Lab, Stepper, 70 Concepts, Flashcards, 50 Pitfalls)
- ✅ Site 10: `tsviz` -> `/tsviz` (Control Flow Narrowing, Structural Subtyping, 12 Utility Types Lab, TSC 5-Stage Pipeline, Type Challenges)
- ✅ Site 11: `redisviz` -> `/redisviz` (In-Memory Data Structures SDS/SkipList/QuickList, Caching Strategies Lab, Eviction Simulator, CLI)
- ✅ Site 12: `sqlcosmos` -> `/sqlcosmos` (B+ Tree Index Traversal, EXPLAIN ANALYZE Cost Optimizer, Physical Joins Engine, MVCC Tuple Versioning)
- ✅ Site 13: `nodecosmos` -> `/nodecosmos` (6-Phase Libuv Event Loop Stepper, UV_THREADPOOL_SIZE Thread Pool, Streams Backpressure Lab)
- ✅ Site 14: `dockercosmos` -> `/dockercosmos` (6 Linux Kernel Namespaces, OverlayFS Layered Storage Driver & CoW, cgroups v2, K8s Pods)
- ✅ Site 15: `blockchainviz` -> `/blockchainviz` (PoW Block Mining & Nonce Stepper, Merkle Trees & O(log N) SPV Proofs, 256-bit EVM Opcode Stack)
- ✅ Site 16: `arrayviz` -> `/arrayviz` (Contiguous RAM Address Arithmetic, 64-Byte CPU Cache Line Spatial Locality, Geometric Resizing, KMP)
- ✅ Site 17: `systemdesignviz` -> `/systemdesignviz` (Consistent Hashing & Virtual Nodes, Raft Consensus 5-Node Cluster, Distributed Rate Limiters)
- ✅ Site 18: `apiviz` -> `/apiviz` (GraphQL AST Resolvers Pipeline, DataLoader N+1 Batching & Caching, REST vs GraphQL vs gRPC vs tRPC)
- ✅ Site 19: `authviz` -> `/authviz` (OAuth 2.0 PKCE Flow Stepper, JWT RS256/None Exploit Inspector, HttpOnly Cookie vs LocalStorage XSS Sandbox)
- ✅ Site 20: `rustviz` -> `/rustviz` (Stack & Heap Fat Pointer Memory Stepper, Aliasing XOR Mutability, NLL CFG Analyzer, Lifetimes & Variance)
- ✅ Site 21: `aicosmos` -> `/aicosmos` (Multi-Layer Perceptron Live Backprop, 2D Decision Boundary Canvas, Transformer Scaled Dot-Product Heatmap)
- ✅ Site 22: `mqviz` -> `/mqviz` (Kafka Commit Logs, Murmur2 Partition Hashing, Consumer Groups & Rebalancing, Full Jitter Retries & DLQ)
- ✅ Site 23: `synccosmos` -> `/synccosmos` (CRDT Join-Semilattices, RGA Character Node Tree, Vector Clocks & Lamport Timestamps)
- ✅ Site 24: `microservicesviz` -> `/microservicesviz` (3-State Circuit Breaker State Machine, Distributed Saga Orchestration & Compensations, OpenTelemetry)
- ✅ Site 25: `fastapicosmos` -> `/fastapicosmos` (Uvicorn ASGI Event Loop vs WSGI ThreadPool, Pydantic V2 Rust Validation, Hierarchical DI DAG)
- ✅ Site 26: `wasmcosmos` -> `/wasmcosmos` (WebAssembly Virtual LIFO Stack Machine, 64KB Linear Memory ArrayBuffer, WAT Hex Inspector)
- ✅ Site 27: `lldcosmos` -> `/lldcosmos` (Interactive SOLID Refactoring Studio, Gang of Four Creational/Structural/Behavioral Design Patterns)
- ✅ Site 28: `crossplatformviz` -> `/crossplatformviz` (React Native JSI C++ HostObjects vs Asynchronous Bridge, Flutter Impeller GPU Engine)
- ✅ Site 29: `sveltecosmos` -> `/sveltecosmos` (Zero VDOM Surgical DOM Mutation, $state/$derived/$effect Universal Signals Sandbox, AST CodeGen)
- ✅ Site 30: `tailwindcosmos` -> `/tailwindcosmos` (Live Atomic CSS JIT Playground, Strict 4px Mathematical Spacing & Harmonious Palettes)
- ✅ Site 31: `xrcosmos` -> `/xrcosmos` (Volumetric 6-DoF 3D Frustum Studio, 4x4 Affine Model Transformation Matrix, 25-Joint Hand Tracking)
- ✅ Site 32: `mongocosmos` -> `/mongocosmos` (WiredTiger B-Tree & BSON Engine, Aggregation Pipeline Studio, Replica Set Failover)
- ✅ Site 33: `vuecosmos` -> `/vuecosmos` (Vue 3 Proxy Reactivity Track/Trigger, Template AST Compiler, SFC Pipeline, Component Lifecycle)
- ✅ Site 34: `browseruniverse` -> `/browseruniverse` (HTML/CSS Lexer & Tokenizer, Render Tree Layout Geometry, Paint & Composite Layers)

---

## 🛠️ Verification & Quality Standards

1. **Lint & Build Checks**:
   - `npm run lint` must exit with 0 errors.
   - `npm run build` must verify static pre-rendering and SSR compatibility (ensure no window / browser global leaks during static generation).
2. **Theme Compatibility**:
   - Every visualizer component must support both Light and Dark mode using Tailwind CSS dark classes and CSS variables.
