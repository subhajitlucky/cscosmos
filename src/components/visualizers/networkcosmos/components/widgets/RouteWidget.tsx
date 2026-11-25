'use client';

import { useState, type ReactNode } from 'react';
import { WidgetButton, WidgetPanel, WidgetStat, WidgetToggle, type WidgetProps } from './shared';

interface Edge {
  key: string;
  a: string;
  b: string;
  cost: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const NODES: Record<string, { x: number; y: number }> = {
  A: { x: 25, y: 70 },
  B: { x: 110, y: 25 },
  C: { x: 110, y: 115 },
  D: { x: 210, y: 70 },
};

const EDGES: Edge[] = [
  { key: 'A-B', a: 'A', b: 'B', cost: 1, x1: 25, y1: 70, x2: 110, y2: 25 },
  { key: 'A-C', a: 'A', b: 'C', cost: 4, x1: 25, y1: 70, x2: 110, y2: 115 },
  { key: 'B-C', a: 'B', b: 'C', cost: 1, x1: 110, y1: 25, x2: 110, y2: 115 },
  { key: 'B-D', a: 'B', b: 'D', cost: 5, x1: 110, y1: 25, x2: 210, y2: 70 },
  { key: 'C-D', a: 'C', b: 'D', cost: 1, x1: 110, y1: 115, x2: 210, y2: 70 },
];

function computeCosts(down: string[]): {
  cost: Record<string, number>;
  prev: Record<string, string | undefined>;
} {
  const cost: Record<string, number> = { A: 0, B: Infinity, C: Infinity, D: Infinity };
  const prev: Record<string, string | undefined> = { A: undefined, B: undefined, C: undefined, D: undefined };
  const seen = new Set<string>();

  for (;;) {
    const candidates = Object.keys(cost).filter((node) => !seen.has(node));
    const current = candidates.reduce<string | undefined>(
      (best, node) => (best === undefined || cost[node] < cost[best] ? node : best),
      undefined,
    );
    if (current === undefined || cost[current] === Infinity) break;
    seen.add(current);
    for (const edge of EDGES) {
      if (down.includes(edge.key)) continue;
      const neighbor = edge.a === current ? edge.b : edge.b === current ? edge.a : null;
      if (neighbor === null) continue;
      const candidate = cost[current] + edge.cost;
      if (candidate < cost[neighbor]) {
        cost[neighbor] = candidate;
        prev[neighbor] = current;
      }
    }
  }
  return { cost, prev };
}

function buildPath(prev: Record<string, string | undefined>): string[] {
  const path = ['D'];
  while (path[0] !== 'A') {
    const earlier = prev[path[0]];
    if (!earlier) return [];
    path.unshift(earlier);
  }
  return path;
}

export function RouteWidget({ concept }: WidgetProps) {
  const slug = concept.slug;
  const isRip = slug.includes('distance-vector');
  const isOspf = slug.includes('link-state');
  const isBgp = slug.includes('path-vector');
  const isStatic = slug.includes('static-vs-dynamic');
  const isSdn = slug.includes('sdn-and-programmable');
  const isSwitch = slug.includes('switches-and-collision');

  const [down, setDown] = useState<string[]>(concept.defaultFault === 'loop' ? ['B-C'] : []);
  const [hopIndex, setHopIndex] = useState(-1);
  const [round, setRound] = useState(0);
  const [prependOwn, setPrependOwn] = useState(false);
  const [staticRoute, setStaticRoute] = useState(true);
  const [flowInstalled, setFlowInstalled] = useState(false);
  const [knownMac, setKnownMac] = useState(true);

  const { cost, prev } = computeCosts(down);
  const path = buildPath(prev);
  const unreachable = path.length === 0;
  const baselinePath = buildPath(computeCosts([]).prev);
  const downOnBaseline = EDGES.some(
    (edge) =>
      down.includes(edge.key) &&
      baselinePath.some(
        (node, index) =>
          baselinePath[index + 1] !== undefined &&
          ((edge.a === node && edge.b === baselinePath[index + 1]) ||
            (edge.b === node && edge.a === baselinePath[index + 1])),
      ),
  );
  const bgpRejected = isBgp && prependOwn;
  const staticBlackHole = isStatic && staticRoute && downOnBaseline;
  const flooding = isSwitch && !knownMac;
  const forwardingPath = bgpRejected || unreachable
    ? []
    : flooding
      ? ['A', 'B', 'C', 'D']
      : staticBlackHole
        ? baselinePath
        : path;
  const canSend = forwardingPath.length > 0 && !staticBlackHole && !bgpRejected;
  const currentNode = hopIndex >= 0 && hopIndex < forwardingPath.length ? forwardingPath[hopIndex] : null;
  const pathLabel = forwardingPath.length ? forwardingPath.join('→') : bgpRejected ? 'withdrawn' : 'unreachable';
  const costLabel = bgpRejected
    ? 'rejected'
    : staticBlackHole
      ? 'stale'
      : flooding
        ? 'all ports'
        : isSdn && !flowInstalled && Number.isFinite(cost.D)
          ? `${cost.D + 3} (ctrl +3)`
          : Number.isFinite(cost.D)
            ? String(cost.D)
            : '∞';

  let modeControl: ReactNode = null;
  let modeNote = 'Fail a link to recompute the best path; send a packet to walk the result hop by hop.';
  if (isRip) {
    modeControl = (
      <WidgetButton label="Advance one RIP update round" onClick={() => setRound((value) => Math.min(8, value + 1))}>
        Update round {round} →
      </WidgetButton>
    );
    modeNote = round >= 4
      ? 'After several periodic updates the distances converge; on a failure bad news travels one hop per round.'
      : 'RIP advertises its whole table every 30 seconds; metrics can lag behind a topology change.';
  } else if (isOspf) {
    modeNote = `All routers share the same link-state database. Dijkstra installs the tree: ${path.length ? path.join(' → ') : 'unreachable'} (cost ${costLabel}).`;
  } else if (isBgp) {
    modeControl = (
      <WidgetToggle label="Prepend our own AS" checked={prependOwn} onChange={setPrependOwn} hint="A leaked AS_PATH is rejected; the route is withdrawn" />
    );
    modeNote = prependOwn
      ? 'AS_PATH contains our own AS: the update is rejected, so no route is installed (path: withdrawn).'
      : `AS 64500 → 64510 → 64520 installs ${path.length ? path.join(' → ') : 'no path'}; policy, not hop count, decides the path.`;
  } else if (isStatic) {
    modeControl = (
      <WidgetToggle label="Use a static next hop" checked={staticRoute} onChange={setStaticRoute} hint="Static routes survive a failure and can black-hole traffic" />
    );
    modeNote = staticBlackHole
      ? `The static next hop still points along ${baselinePath.join(' → ')}, but that link is down: traffic is black-holed.`
      : staticRoute
        ? `Static route ${baselinePath.join(' → ')} stays installed while links are up; fail its next-hop link to see it black-hole traffic.`
        : 'A dynamic route is withdrawn when a neighbor goes silent, so forwarding reconverges.';
  } else if (isSdn) {
    modeControl = (
      <WidgetToggle label="Flow already installed" checked={flowInstalled} onChange={setFlowInstalled} hint="A miss adds a controller round trip to the displayed cost" />
    );
    modeNote = flowInstalled
      ? `Flow entry matches: forwarding follows ${path.length ? path.join(' → ') : 'no path'} with no controller round trip.`
      : 'Table miss: the first packet goes to the controller as Packet-In; the Flow-Mod adds +3 to the displayed cost.';
  } else if (isSwitch) {
    modeControl = (
      <WidgetToggle label="Destination MAC is known" checked={knownMac} onChange={setKnownMac} hint="A CAM miss floods to every egress port except ingress" />
    );
    modeNote = knownMac
      ? `CAM hit: the frame follows ${path.length ? path.join(' → ') : 'no path'} to one egress port.`
      : 'CAM miss: the frame floods to every egress port (B, C, D) so the destination still sees it.';
  }

  return (
    <WidgetPanel
      title={isSwitch ? 'Switch forwarding lab' : isSdn ? 'Programmable forwarding' : 'Routing lab'}
      subtitle="Click links to fail or restore them, then send a packet to follow the computed path."
      badge="Routing"
    >
      <div className="rounded-md border border-slate-300 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/60">
        <svg viewBox="0 0 235 140" role="img" aria-label={`Network graph; active path ${forwardingPath.length ? forwardingPath.join(' to ') : 'none'}`} className="h-40 w-full">
          {EDGES.map((edge) => {
            const failed = down.includes(edge.key);
            const onPath = forwardingPath.some(
              (node, index) =>
                forwardingPath[index + 1] !== undefined &&
                ((edge.a === node && edge.b === forwardingPath[index + 1]) ||
                  (edge.b === node && edge.a === forwardingPath[index + 1])),
            );
            return (
              <g key={edge.key}>
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  strokeWidth={onPath && !failed ? 3 : 1.5}
                  strokeDasharray={failed ? '5 4' : undefined}
                  className={
                    failed
                      ? 'stroke-rose-600 dark:stroke-rose-400'
                      : onPath
                        ? 'stroke-sky-600 dark:stroke-sky-300'
                        : 'stroke-slate-400 dark:stroke-slate-500'
                  }
                />
                <text
                  x={(edge.x1 + edge.x2) / 2}
                  y={(edge.y1 + edge.y2) / 2 - 4}
                  textAnchor="middle"
                  className="fill-slate-700 text-[10px] font-bold dark:fill-slate-300"
                >
                  {failed ? 'down' : edge.cost}
                </text>
              </g>
            );
          })}
          {Object.entries(NODES).map(([name, point]) => (
            <g key={name}>
              <circle
                cx={point.x}
                cy={point.y}
                r="14"
                className={
                  currentNode === name
                    ? 'fill-emerald-500 dark:fill-emerald-400'
                    : 'fill-white stroke-slate-700 dark:fill-slate-800 dark:stroke-slate-300'
                }
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y + 4}
                textAnchor="middle"
                className={`text-[11px] font-bold ${currentNode === name ? 'fill-emerald-950 dark:fill-emerald-950' : 'fill-slate-900 dark:fill-slate-100'}`}
              >
                {name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div role="group" aria-label="Network links, click to fail or restore" className="mt-2 flex flex-wrap gap-1.5">
        {EDGES.map((edge) => (
          <WidgetButton
            key={edge.key}
            label={`Link ${edge.a} to ${edge.b}, ${down.includes(edge.key) ? 'failed, click to restore' : 'up, click to fail'}`}
            pressed={down.includes(edge.key)}
            onClick={() =>
              setDown((current) =>
                current.includes(edge.key) ? current.filter((value) => value !== edge.key) : [...current, edge.key],
              )
            }
          >
            {edge.a}–{edge.b}
          </WidgetButton>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <WidgetButton
          label="Send a packet along the current path"
          disabled={!canSend}
          onClick={() => setHopIndex(0)}
        >
          Send packet →
        </WidgetButton>
        <WidgetButton
          label="Advance packet to the next hop"
          disabled={!canSend || hopIndex >= forwardingPath.length - 1}
          onClick={() => setHopIndex((value) => Math.min(forwardingPath.length - 1, value + 1))}
        >
          Next hop →
        </WidgetButton>
        {modeControl}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WidgetStat label="Destination" value="D" />
        <WidgetStat label="Best path" value={pathLabel} tone={canSend || flooding ? 'good' : 'bad'} />
        <WidgetStat label="Total cost" value={costLabel} />
        <WidgetStat label="Packet at" value={currentNode ?? 'not sent'} />
      </div>
      {isRip && (
        <p className="mt-2 font-mono text-[11px] text-slate-700 dark:text-slate-300" aria-live="polite">
          Distance vector from A: B={Math.min(16, Number.isFinite(cost.B) ? cost.B + Math.max(0, 4 - round) : 16)},
          C={Math.min(16, Number.isFinite(cost.C) ? cost.C + Math.max(0, 4 - round) : 16)},
          D={Number.isFinite(cost.D) ? Math.min(16, cost.D + Math.max(0, 4 - round)) : 16}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300" aria-live="polite">{modeNote}</p>
    </WidgetPanel>
  );
}
