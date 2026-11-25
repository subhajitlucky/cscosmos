# Computer Networks Curriculum Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 4-concept `tcpviz` engine with a registered 50-concept Computer Networks curriculum module whose core interaction is a packet-journey simulator.

**Architecture:** A pure-TS simulator (`sim/`) emits hop events for DNS/HTTP/ping scenarios across two subnets; React client pages render layer stations, header inspector, hop map, and fault effects. The module is registered in `src/lib/module-registry.ts`, so the universal topic route pre-renders home + `/learn` + `/lab` + `/problems` + 50 concept pages. The old engine route, mapping, and `tcpviz/` folder are removed.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 3, Vitest 4, Playwright 1.64, lucide-react. No new dependencies.

**Repo root:** `/home/subhajit/project/cscosmos` (all paths below are relative to it). Design: `docs/plans/2026-11-25-network-curriculum-redesign.md`.

---

### Task 1: Concept catalog data + invariants test

**Files:**
- Create: `src/components/visualizers/networkcosmos/data/concepts.ts`
- Test: `src/components/visualizers/networkcosmos/data/concepts.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { CONCEPTS, PHASES, getConcept, type Concept } from './concepts';

describe('network concept catalog', () => {
  it('has exactly 50 concepts with unique sequential slugs and numbers', () => {
    expect(CONCEPTS).toHaveLength(50);
    expect(new Set(CONCEPTS.map((c) => c.slug)).size).toBe(50);
    CONCEPTS.forEach((c, i) => expect(c.number).toBe(i + 1));
  });

  it('covers all seven phases with the approved counts', () => {
    expect(PHASES.map((p) => p.concepts.length)).toEqual([7, 8, 7, 10, 8, 6, 4]);
  });

  it('every concept has complete lesson copy and a valid widget config', () => {
    for (const c of CONCEPTS) {
      expect(c.title.length).toBeGreaterThan(3);
      expect(c.why.length).toBeGreaterThan(80);
      expect(c.onTheWire.length).toBeGreaterThan(80);
      expect(c.whenItBreaks.length).toBeGreaterThan(80);
      expect(c.widget).toMatch(/^(bits|frame|subnet|lpm|state|window|capture|handshake|route|header|queue|timer)$/);
      expect(getConcept(c.slug)).toBe(c);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /home/subhajit/project/cscosmos && npx vitest run src/components/visualizers/networkcosmos/data/concepts.test.ts`
Expected: FAIL — module not found.

**Step 3: Write minimal implementation**

Create `concepts.ts` with these exact types and the full 50-concept seed list. `why`, `onTheWire`, and `whenItBreaks` are 2–3 sentences each (minimum 80 chars), written from the wire-level perspective (never duplicating `webprotocols` app-level content); `defaultFault` is one of `none | loss | arpSpoof | mtu | loop`.

```ts
export type WidgetKind = 'bits' | 'frame' | 'subnet' | 'lpm' | 'state' | 'window' | 'capture' | 'handshake' | 'route' | 'header' | 'queue' | 'timer';
export type FaultKind = 'none' | 'loss' | 'arpSpoof' | 'mtu' | 'loop';

export interface Concept {
  slug: string; number: number; title: string; phase: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  why: string; onTheWire: string; whenItBreaks: string;
  widget: WidgetKind; defaultFault: FaultKind;
}
export interface Phase { id: string; title: string; concepts: Concept[] }

export const CONCEPTS: Concept[] = [ /* 50 entries, order below */ ];
export const PHASES: Phase[] = [ /* 7 groups derived from CONCEPTS by phase id */ ];
export function getConcept(slug: string): Concept | undefined { return CONCEPTS.find((c) => c.slug === slug); }
```

Concept seed list (`slug | title | phase | widget | defaultFault`), in exact order:

1. `signals-and-bits` Signals & Bit Encoding | signals | bits | none
2. `bandwidth-and-shannon-limit` Bandwidth, Nyquist & Shannon | signals | bits | none
3. `framing-and-crc` Framing, Stuffing & CRC | signals | frame | none
4. `mac-addresses-and-ethernet` MAC Addresses & Ethernet | signals | frame | arpSpoof
5. `switches-and-collision-domains` Switches, Bridges & Collision Domains | signals | route | none
6. `error-detection-vs-correction` Error Detection vs Correction | signals | frame | loss
7. `sliding-window-flow-control` Stop-and-Wait & Sliding Window | signals | window | loss
8. `ip-packet-anatomy` IP Packet Anatomy | addressing | header | mtu
9. `ipv4-to-cidr` IPv4 Addresses & CIDR | addressing | subnet | none
10. `subnetting-and-vlsm` Subnetting & VLSM | addressing | subnet | none
11. `route-aggregation` Route Aggregation / Supernetting | addressing | subnet | none
12. `ipv6-addressing` IPv6 Addressing & Extension Headers | addressing | header | none
13. `arp-and-neighbor-discovery` ARP & Neighbor Discovery | addressing | frame | arpSpoof
14. `dhcp-address-assignment` DHCP Address Assignment | addressing | handshake | none
15. `icmp-errors` ICMP & Error Messages | addressing | capture | loop
16. `longest-prefix-match` Forwarding Table & Longest-Prefix Match | routing | lpm | none
17. `distance-vector-rip` Distance Vector (RIP) | routing | route | loop
18. `link-state-ospf` Link State (OSPF) & Dijkstra | routing | route | none
19. `path-vector-bgp` Path Vector (BGP) & Policy | routing | route | loop
20. `static-vs-dynamic-routing` Static vs Dynamic Routing | routing | route | none
21. `metrics-and-ecmp` Metrics, ECMP & Load Balancing | routing | lpm | none
22. `routing-loops-and-ttl` Routing Loops, TTL & Convergence | routing | timer | loop
23. `ports-and-multiplexing` Ports & Multiplexing | transport | header | none
24. `udp-datagrams` UDP Datagrams & Checksums | transport | header | loss
25. `tcp-segment-and-state` TCP Segment & State Machine | transport | state | none
26. `tcp-handshake-and-teardown` Three-Way Handshake & Teardown | transport | handshake | loss
27. `sequence-numbers-and-acks` Sequence Numbers, ACKs & Retransmission | transport | timer | loss
28. `rtt-and-retransmission-timers` RTT Estimation & Timers | transport | timer | loss
29. `tcp-flow-control` Flow Control & Receive Window | transport | window | none
30. `slow-start-and-congestion-avoidance` Slow Start & Congestion Avoidance | transport | window | loss
31. `fast-retransmit-and-rto` Fast Retransmit, RTO & Recovery | transport | timer | loss
32. `quic-and-modern-transport` QUIC & Modern Transport | transport | handshake | loss
33. `dns-resolution` DNS Hierarchy & Resolution | application | handshake | none
34. `http-versions-on-the-wire` HTTP/1 → HTTP/2 → HTTP/3 | application | frame | none
35. `tls-handshake-and-certificates` TLS Handshake & Certificates | application | handshake | arpSpoof
36. `cookies-and-sessions-on-the-wire` Cookies & Sessions on the Wire | application | header | none
37. `caching-and-cdn-wire-view` Caching, Caches & CDNs (wire view) | application | header | none
38. `websockets-and-sse` WebSockets & Server-Sent Events | application | state | none
39. `smtp-imap-mail-delivery` SMTP, IMAP & Mail Delivery | application | handshake | none
40. `ntp-clock-sync` NTP & Clock Synchronization | application | timer | none
41. `nat-and-port-forwarding` NAT & Port Forwarding | infrastructure | header | none
42. `vlans-trunking-and-stp` VLANs, Trunking & STP | infrastructure | frame | loop
43. `wifi-and-csma-ca` Wi-Fi & CSMA/CA | infrastructure | queue | loss
44. `tunnels-and-vpns` Tunnels & VPNs | infrastructure | frame | none
45. `sdn-and-programmable-forwarding` SDN & Programmable Forwarding | infrastructure | route | none
46. `qos-and-queueing` QoS, Queueing & Traffic Shaping | infrastructure | queue | loss
47. `latency-jitter-loss-throughput` Latency, Jitter, Loss & Throughput | measurement | timer | loss
48. `packet-capture-and-filters` Packet Capture & Wireshark Filters | measurement | capture | none
49. `ping-and-traceroute` Ping, traceroute & Path Discovery | measurement | capture | loop
50. `troubleshooting-fault-domains` Troubleshooting & Fault Domains | measurement | capture | arpSpoof |

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/visualizers/networkcosmos/data/concepts.test.ts` — Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/visualizers/networkcosmos/data/concepts.ts src/components/visualizers/networkcosmos/data/concepts.test.ts
git commit -m "feat(networkcosmos): add 50-concept network curriculum catalog"
```

---

### Task 2: Scenarios and challenge bank

**Files:**
- Create: `src/components/visualizers/networkcosmos/data/scenarios.ts`
- Test: `src/components/visualizers/networkcosmos/data/scenarios.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { SCENARIOS, CHALLENGES } from './scenarios';

describe('network lab data', () => {
  it('ships three distinct scenarios with full hop paths', () => {
    expect(SCENARIOS.map((s) => s.id)).toEqual(['dns', 'http', 'ping']);
    for (const s of SCENARIOS) expect(s.hops.length).toBeGreaterThanOrEqual(6);
  });
  it('ships 20 graded challenges with valid answers', () => {
    expect(CHALLENGES).toHaveLength(20);
    for (const q of CHALLENGES) {
      expect(q.options).toHaveLength(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(60);
    }
  });
});
```

**Step 2:** Run `npx vitest run .../scenarios.test.ts` — Expected: FAIL (module not found).

**Step 3: Implement** `scenarios.ts`:

```ts
export type HopSpec = { layer: string; device: string; direction: 'out' | 'in'; note: string };
export interface Scenario { id: 'dns' | 'http' | 'ping'; title: string; description: string; hops: HopSpec[] }
export interface Challenge { slug: string; question: string; options: string[]; answer: number; explanation: string }

export const SCENARIOS: Scenario[] = [ /* dns: query→cache→recursive→answer; http: DNS+TCP+TLS+GET+response; ping: ICMP echo request/reply */ ];
export const CHALLENGES: Challenge[] = [ /* 20 unique MCQs: subnet math (4), LPM (3), ARP (3), retransmit/RTT (4), capture reading (3), TLS/DNS/routing (3) */ ];
```

Each scenario's `hops` must include both directions across client, switch, router, server with explicit layer names (`Application`, `Transport`, `Network`, `Link`, `Physical`).

**Step 4:** Run test — Expected: PASS.
**Step 5: Commit:** `git add .../scenarios.ts .../scenarios.test.ts && git commit -m "feat(networkcosmos): add lab scenarios and 20 network challenges"`

---

### Task 3: Pure simulator core (TDD)

**Files:**
- Create: `src/components/visualizers/networkcosmos/sim/types.ts`
- Create: `src/components/visualizers/networkcosmos/sim/engine.ts`
- Test: `src/components/visualizers/networkcosmos/sim/engine.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { createJourney, advance, pickRoute, type JourneyState } from './engine';
import type { FaultKind } from '../data/concepts';

const start = (fault: FaultKind = 'none') => createJourney('http', fault);

describe('packet journey engine', () => {
  it('decrements TTL at every router hop', () => {
    const ttls: number[] = [];
    let s = start();
    while (!s.done && s.events.length < 60) { s = advance(s); const ttl = s.headers.ipTtl; if (ttl !== undefined) ttls.push(ttl); }
    expect(ttls[0]).toBe(64);
    expect(Math.min(...ttls)).toBeLessThan(64);
  });

  it('picks the longest prefix match from a forwarding table', () => {
    expect(pickRoute('192.168.20.7', [
      { prefix: '0.0.0.0/0', nextHop: 'r1' },
      { prefix: '192.168.0.0/16', nextHop: 'r2' },
      { prefix: '192.168.20.0/24', nextHop: 'r3' },
    ])).toBe('r3');
  });

  it('loss produces duplicate ACKs then a retransmit', () => {
    let s = start('loss');
    while (!s.done && s.events.length < 80) s = advance(s);
    expect(s.events.some((e) => e.note.includes('DUP ACK'))).toBe(true);
    expect(s.retransmits).toBeGreaterThan(0);
  });

  it('arpSpoof misdelivers the frame to the wrong MAC', () => {
    let s = start('arpSpoof');
    while (!s.done && s.events.length < 80) s = advance(s);
    expect(s.events.some((e) => e.note.includes('wrong MAC'))).toBe(true);
  });

  it('mtu fault yields fragmentation or ICMP fragmentation-needed', () => {
    let s = start('mtu');
    while (!s.done && s.events.length < 80) s = advance(s);
    expect(s.events.some((e) => /fragment/i.test(e.note))).toBe(true);
  });

  it('loop fault expires TTL and emits ICMP time exceeded', () => {
    let s = start('loop');
    while (!s.done && s.events.length < 80) s = advance(s);
    expect(s.events.some((e) => e.note.includes('TTL expired'))).toBe(true);
  });
});
```

**Step 2:** Run `npx vitest run .../sim/engine.test.ts` — Expected: FAIL.

**Step 3: Implement** — pure, deterministic (injectable `rng: () => number`, default seeded LCG); no `window`, no timers:

```ts
export interface Headers { srcMac: string; dstMac: string; srcIp: string; dstIp: string; ttl?: number; srcPort?: number; dstPort?: number; seq?: number; ack?: number; flags?: string; checksumOk: boolean }
export interface JourneyEvent { time: number; layer: string; device: string; direction: 'out' | 'in'; headers: Headers; note: string; packetId: number }
export interface JourneyState {
  scenarioId: 'dns' | 'http' | 'ping'; fault: FaultKind; cursor: number;
  events: JourneyEvent[]; headers: Headers; retransmits: number; dupAcks: number;
  rttMs: number; lossPct: number; cwnd: number; rwnd: number; done: boolean; rng: () => number;
}
export function createJourney(scenarioId: 'dns' | 'http' | 'ping', fault: FaultKind, opts?: { rng?: () => number; rttMs?: number; lossPct?: number }): JourneyState
export function advance(state: JourneyState): JourneyState  // one hop; pure, returns new state
export function pickRoute(destIp: string, table: { prefix: string; nextHop: string }[]): string
```

Key rules: TTL starts at 64 and decrements per router; `pickRoute` uses numeric longest-prefix match; `loss` injects a duplicate ACK then retransmit event with `cwnd` halved; `arpSpoof` rewrites `dstMac` to `aa:bb:cc:dd:ee:ff` and logs "wrong MAC"; `mtu` logs fragmentation + ICMP; `loop` decrements TTL to 0 and logs "TTL expired"; every event has an incrementing `time` and `packetId`.

**Step 4:** Run test — Expected: PASS.
**Step 5: Commit:** `git add .../sim/ && git commit -m "feat(networkcosmos): add deterministic packet journey simulator"`

---

### Task 4: Header diff helper + tests

**Files:** Create `sim/headers.ts` and `sim/headers.test.ts`.

**Step 1 (failing test):** `diffHeaders(before, after)` returns only changed fields, e.g. `{ dstMac: ['aa:aa…','bb:bb…'], ttl: [64,63] }`; identical headers return `{}` and `null` inputs do not throw.

**Step 2:** Run `npx vitest run .../sim/headers.test.ts` — Expected: FAIL.
**Step 3:** Implement pure `diffHeaders` over the `Headers` keys.
**Step 4:** Run test — Expected: PASS.
**Step 5:** Commit: `git commit -m "feat(networkcosmos): add per-hop header diff helper"`.

---

### Task 5: Shared lab UI primitives

**Files (create):** `src/components/visualizers/networkcosmos/components/StepControls.tsx`, `PacketLog.tsx`, `HeaderInspector.tsx`, `LayerStation.tsx`, `JourneyMap.tsx`, `HopMap.tsx`, `FaultInjector.tsx`.

All are `'use client'` React 19 components, Tailwind `dark:` variants only (no global CSS), and use `aria-*` attributes. `StepControls`: play/pause, step, reset, speed select, keyboard Space/ArrowLeft/ArrowRight via `useEffect` listener with cleanup. `PacketLog`: `aria-live="polite"`, newest first, focusable entries, filter by layer. `HeaderInspector`: table of header fields + `diffHeaders` highlights. `JourneyMap`/`LayerStation`: 7-layer stack with active layer highlight; CSS transitions disabled under `prefers-reduced-motion`. `FaultInjector`: radio group over `FaultKind`. `HopMap`: hosts → switch → routers → server with active hop highlight.

**Step 1:** No unit tests for presentational markup; verify via Task 10 e2e + manual rendered check.
**Step 2:** Implement components.
**Step 3:** Run `npx tsc --noEmit -p tsconfig.json` — Expected: PASS.
**Step 4:** Commit: `git commit -m "feat(networkcosmos): add journey lab UI primitives"`.

---

### Task 6: 12 parameterized concept widgets

**Files (create):** `src/components/visualizers/networkcosmos/components/widgets/index.tsx` exporting `CONCEPT_WIDGETS: Record<WidgetKind, React.ComponentType<{ concept: Concept }>>` with 12 small client widgets: `BitsWidget`, `FrameWidget`, `SubnetWidget`, `LpmWidget`, `StateWidget`, `WindowWidget`, `CaptureWidget`, `HandshakeWidget`, `RouteWidget`, `HeaderWidget`, `QueueWidget`, `TimerWidget`.

Each widget reads `concept.slug`/`defaultFault` to configure its own demo (e.g. SubnetWidget shows `/24 → /26` split; LpmWidget shows a 3-entry table; StateWidget shows TCP states; TimerWidget shows RTT/rwnd). Distinct interaction per widget: sliders, clickable tables, steppers, toggles. No widget may be an empty placeholder.

**Step 1:** Implement widget registry with all 12 keys.
**Step 2:** Run `npx tsc --noEmit -p tsconfig.json` — Expected: PASS.
**Step 3:** Commit: `git commit -m "feat(networkcosmos): add 12 interactive concept widgets"`.

---

### Task 7: Five page components

**Files (create):** `src/components/visualizers/networkcosmos/pages/NetworkHome.tsx`, `NetworkLearn.tsx`, `NetworkTopic.tsx`, `NetworkLab.tsx`, `NetworkProblems.tsx`.

Props exactly match `TopicModule` in `src/lib/topic-module.ts`: `{ basePath?: string }` for Home/Learn/Lab/Problems and `{ subtopicSlug: string; basePath?: string }` for Topic.

- `NetworkHome`: hero "Follow one packet. Understand every layer.", animated `JourneyMap` preview, 7 phase cards with counts, CTA links to `${basePath}/learn`, `/lab`, `/problems`; shows "50 concepts · 7 phases".
- `NetworkLearn`: search input + phase/difficulty filters over `CONCEPTS`, table rows linking `${basePath}/learn/${slug}`, progress markers from `local-learning.ts` where available.
- `NetworkTopic`: lookup via `getConcept(subtopicSlug)` with fallback to `CONCEPTS[0]` (existing module pattern), 3 copy sections, `CONCEPT_WIDGETS[concept.widget]`, prev/next links, "Open in lab" link `${basePath}/lab?concept=${concept.slug}`.
- `NetworkLab`: scenario picker from `SCENARIOS`, fault injection, `createJourney` state driven by `useEffect` timer (speed multiplier), `StepControls`, `JourneyMap`, `LayerStation`, `HeaderInspector`, `HopMap`, `PacketLog`, live meters; reads `?concept=` to preselect default fault; respects reduced motion; no module-scope browser APIs.
- `NetworkProblems`: 20 `CHALLENGES`, one at a time, immediate explanation, score, retry, next/prev.

**Step 1:** Implement pages.
**Step 2:** Run `npx tsc --noEmit -p tsconfig.json` — Expected: PASS.
**Step 3:** Commit: `git commit -m "feat(networkcosmos): add home, syllabus, concept, lab and problems pages"`.

---

### Task 8: Register module + registry test

**Files:** Modify `src/lib/module-registry.ts`; Test: `src/lib/network-module.test.ts`.

**Step 1 (failing test):** `getModule('computer-networks-internals-tcpip')` exists, has 50 subtopics with unique slugs, `domain === 'corecs'`, and `getAllModules()` has length 3.

**Step 2:** Run `npx vitest run src/lib/network-module.test.ts` — Expected: FAIL.
**Step 3:** Add imports of the five pages + `CONCEPTS` to `module-registry.ts` and call `registerModule({ topicSlug: 'computer-networks-internals-tcpip', title: 'Computer Networks Internals (TCP/IP)', domain: 'corecs', subtopics: CONCEPTS.map(c => ({ slug: c.slug, number: c.number, title: c.title, category: c.phase })), HomePage: NetworkHome, LearnPage: NetworkLearn, TopicPage: NetworkTopic, LabPage: NetworkLab, ProblemsPage: NetworkProblems })`.
**Step 4:** Run test — Expected: PASS.
**Step 5:** Commit: `git commit -m "feat(networkcosmos): register computer networks curriculum module"`.

---

### Task 9: Retire the old engine and routes

**Files:** Modify `src/data/engine-routes.ts` (remove line 76 entry); delete `src/app/computer-networks-internals-tcpip/[[...slug]]/` and `src/components/visualizers/tcpviz/`.

**Step 1:** Edit `engine-routes.ts` to remove the `computer-networks-internals-tcpip` row.
**Step 2:** Delete the two directories (`rm -rf`, after confirming no other imports via `grep -rn "tcpviz" src` — only the old EngineMount should remain).
**Step 3:** Run `npm run build` — Expected: PASS; build log should show module pages pre-rendered and no `/computer-networks-internals-tcpip` engine route.
**Step 4:** Commit: `git commit -m "refactor(networkcosmos): retire tcpviz engine in favor of module"`.

---

### Task 10: Playwright smoke spec

**Files:** Create `e2e/networkcosmos.spec.ts` (follow `e2e/program-cosmos.spec.ts` structure).

Tests: canonical URL `/corecs/computer-networks-internals-tcpip` loads and has title; `/learn` shows all 50 concept links; clicking first concept renders widget; `/lab` step button adds an event to the log and fault injection changes notes; `/problems` selecting an answer shows explanation; theme toggle switches `data-theme`/class; mobile viewport nav works; direct `/computer-networks-internals-tcpip/[[...slug]]` engine path no longer serves the old engine (redirect canonical).

Run: `npm run build && npx playwright test e2e/networkcosmos.spec.ts` — Expected: PASS.
Commit: `git commit -m "test(networkcosmos): add Playwright smoke coverage"`.

`@test-audit`: apply the skill's authoring gate to these tests before committing (assert user-visible behavior only, no implementation-coupled selectors).

---

### Task 11: Documentation updates

**Files:** Modify `AGENTS.md`, `README.md`, `PROJECT_CONTEXT.md`, `docs/ARCHITECTURE.md`.

Update 70 engines → 69, 2 modules → 3, list the network module beside the two AI modules, describe the five views and packet-journey simulator, and note that `/corecs/computer-networks-internals-tcpip` is now module-backed (no engine rewrite). Keep the 72-active-topic count unchanged.

Commit: `git commit -m "docs: document computer networks curriculum module"`.

---

### Task 12: Full verification

**Step 1:** `npm run lint` — Expected: exit 0, no errors.
**Step 2:** `npm test` — Expected: all Vitest suites pass, including new concept/scenarios/sim/registry tests.
**Step 3:** `npm run build` — Expected: PASS, SSG pre-renders 54 module pages.
**Step 4:** `npm run test:e2e` — Expected: PASS (builds again, starts server on 3100, full Playwright smoke suite).
**Step 5:** `git status --short` — Expected: clean tree.
**Step 6:** Report results; do not claim completion until all four commands exit 0 (`@verification-before-completion`).

---

## Execution handoff

After saving this plan: choose **subagent-driven execution in this session** (fresh subagent per task with review between tasks) or **a separate parallel session** using `executing-plans`. Recommended: subagent-driven for Tasks 1–4, then main-session execution for UI tasks that need visual review.
