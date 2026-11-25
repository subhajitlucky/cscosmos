# Design: Computer Networks curriculum + packet-journey simulator

Date: 2026-11-25
Topic: `computer-networks-internals-tcpip` (domain `corecs`, canonical URL `/corecs/computer-networks-internals-tcpip`)
Status: **Approved** — full redesign, replacing the narrow `tcpviz` engine with a registered curriculum module.

## Goals

- Replace the current TCP-only reliability lab (4 concept notes: slow start, congestion avoidance, fast retransmit, RTO timeout) with a full 50-concept, 7-phase computer networks curriculum.
- Teach through a **packet journey simulator**: follow one frame/packet across every layer, inspecting headers at each hop and injecting realistic faults.
- Keep the canonical URL, active status, SSG pre-rendering, light/dark theming, and the hub's learning/progress features intact.
- Make this topic's pedagogy and UI distinct from every other topic, including the separate `webprotocols` topic (phase 5 stays wire-level, not app-level HTTP caching/CORS tutorials).

## Non-goals

- No backend, database, or new accounts work.
- No duplication of the `webprotocols` topic's application-level content.
- No changes to other topics or engines.

## Architecture decision

Use the existing **curriculum module** pattern (`src/lib/module-registry.ts`) rather than a standalone engine route:

- Register `computer-networks-internals-tcpip` as the third module.
- The universal route `src/app/[domain]/[topicSlug]/[[...segments]]/page.tsx` pre-renders home, `/learn`, `/lab`, `/problems`, and all 50 `/learn/[subtopicSlug]` pages (54 new static pages).
- Remove the topic's entry from `src/data/engine-routes.ts` so canonical URLs are no longer rewritten to the old engine (engine count 70 → 69).
- Delete `src/app/computer-networks-internals-tcpip/[[...slug]]/` and `src/components/visualizers/tcpviz/`.
- Keep `status: 'active'` in `src/data/topics.ts`; launch links and `/learn/[topicSlug]` alias keep working.

## Concept taxonomy — 50 concepts in 7 phases

| Phase | Count | Concepts |
|---|---|---|
| 1. Signals & Link | 7 | bit encoding; bandwidth/Nyquist/Shannon; framing & CRC; MAC/Ethernet; switches & collision domains; error detection vs correction; stop-and-wait & sliding window |
| 2. IP & Addressing | 8 | IP packet anatomy; IPv4→CIDR; subnetting/VLSM; aggregation; IPv6; ARP/ND; DHCP; ICMP |
| 3. Routing & Forwarding | 7 | LPM forwarding table; RIP; OSPF/Dijkstra; BGP; static vs dynamic; metrics/ECMP; loops, TTL & convergence |
| 4. Transport & Reliability | 10 | ports/mux; UDP; TCP segment & state; handshake/teardown; seq/ACK/retransmit; RTT & timers; flow control; slow start/congestion avoidance; fast retransmit/RTO; QUIC |
| 5. Application on the Wire | 8 | DNS; HTTP/1→2→3; TLS; cookies/sessions; caching/CDN; WebSockets/SSE; SMTP/IMAP; NTP |
| 6. Infrastructure | 6 | NAT; VLAN/STP; Wi-Fi/CSMA-CA; tunnels/VPN; SDN; QoS/queueing |
| 7. Measurement & Failure | 4 | latency/jitter/loss/throughput; packet capture; ping/traceroute; troubleshooting/fault domains |

## Approaches considered for the simulator

- **A (chosen): deterministic simulation core + DOM/SVG views** — pure-TS event engine, React layer stations, header inspector, hop map, fault injection. Fully SSG-safe, accessible, unit-testable.
- B: canvas/D3 animation — more cinematic, but harder to inspect headers and keep accessible/SSR-safe.
- C: narrated slides + widgets — fastest but not a real simulator.

## File layout

`src/components/visualizers/networkcosmos/`:
- `data/concepts.ts` — 50 concepts: stable `subtopicSlug`, number, title, phase/category, difficulty, 3-part lesson copy, widget config.
- `data/scenarios.ts` — lab scenarios + 20-question challenge bank with answers/explanations.
- `sim/` — pure TS journey engine: hosts/routers/links, encapsulation/decapsulation, event queue, faults, `advance(state, event)` reducer. No browser APIs at module scope.
- `pages/` — `NetworkHome`, `NetworkLearn`, `NetworkTopic`, `NetworkLab`, `NetworkProblems`.
- `components/` — `JourneyMap`, `LayerStation`, `HeaderInspector`, `HopMap`, `PacketLog`, `StepControls`, `FaultInjector`, ~12 parameterized concept widgets (bit stream, frame inspector, subnet calculator, LPM lookup, state machine, window diagram, capture view, etc.). Each concept gets a distinct widget/config.

## The five views

| View | URL | Experience |
|---|---|---|
| Home | `/` ("Packet Journey Atlas") | 7-layer stack with animated packet, phase cards with concept counts, CTAs to Learn/Lab/Problems |
| Syllabus | `/learn` | Searchable/filterable 50-concept table by phase and difficulty, progress markers |
| Concept | `/learn/[subtopicSlug]` | 3-part lesson + wire diagram + one interactive widget + prev/next + "try in lab" deep link |
| Lab | `/lab` ("Packet Journey Studio") | DNS/HTTP/ping scenarios, hop-by-hop encapsulation, header inspector, fault injection, play/pause/step/speed/reset, RTT/loss/cwnd/rwnd meters |
| Challenges | `/problems` ("Network Olympics") | 20 auto-graded scenarios with explanations and score/retry |

## Simulator behavior

- Scenario = app action + topology (2 hosts, 2 routers, 2 subnets).
- Each hop event: `{time, layer, device, direction, header snapshot, note}`. Playback driven by one `useEffect` timer; step advances one event; speed is a multiplier.
- Faults and visible effects:
  - packet loss → duplicate ACKs → fast retransmit
  - ARP spoof → wrong destination MAC → misdelivered frame
  - MTU too small → fragmentation / ICMP "fragmentation needed"
  - routing loop → TTL to 0 → ICMP time exceeded
- Header inspector shows MACs, IPs, TTL, ports, flags, seq/ack, checksum per hop plus a diff from the previous hop.
- Invalid subtopic slugs fall back to the first concept (existing module pattern).

## Accessibility and SSG

Keyboard controls (Space = play/pause, arrows = step), `aria-live` event log, visible focus, Tailwind dark variants for both themes, `prefers-reduced-motion` respected, no `window`/`document`/animation APIs at module top level.

## Testing

- Vitest: 50-concept catalog invariants (unique slugs, sequential numbers, all phases, valid widget configs, challenge answers); simulator reducer tests (LPM, TTL, retransmit, fault outcomes).
- Playwright `e2e/networkcosmos.spec.ts`: canonical URL, 50 concepts in `/learn`, concept widget rendering, lab step/fault changes the log, problems scoring, theme toggle, mobile nav.
- Final verification per `AGENTS.md`: `npm run lint`, `npm run build`, `npm run test:e2e`.

## Docs

Update counts (70 → 69 engines, 2 → 3 modules) and describe the new views in `AGENTS.md`, `README.md`, `PROJECT_CONTEXT.md`, and `docs/ARCHITECTURE.md`.

## Implementation order

1. Concept data (50) and challenge bank.
2. Pure simulator core + Vitest unit tests.
3. Widgets and five page components.
4. Module registration + old engine/route removal.
5. Playwright spec.
6. Docs update.
7. Run full verification suite.
