'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import '../styles.css';

type BlockKey = 'input' | 'cpu' | 'memory' | 'output' | 'storage';
type BusKind = 'address' | 'data' | 'control';

interface BlockSpec {
  key: BlockKey;
  label: string;
  detail: string;
  role: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Connection {
  id: number;
  from: BlockKey;
  to: BlockKey;
  bus: BusKind;
}

interface Point {
  x: number;
  y: number;
}

// Geometry lives in SVG viewBox units; nothing here touches the DOM at import time.
const BLOCKS: BlockSpec[] = [
  {
    key: 'input',
    label: 'INPUT',
    detail: 'keyboard · mouse',
    role: 'Turns a physical action into digital codes and places them on the bus for the CPU to read.',
    x: 16,
    y: 120,
    w: 120,
    h: 64,
  },
  {
    key: 'cpu',
    label: 'CPU',
    detail: 'ALU · CU · registers',
    role: 'Fetches instructions, decodes them and computes results; it controls every transfer on the buses.',
    x: 188,
    y: 96,
    w: 176,
    h: 112,
  },
  {
    key: 'memory',
    label: 'MEMORY',
    detail: 'instructions + data',
    role: 'Holds the stored program and its working data in numbered locations the CPU can address directly.',
    x: 436,
    y: 96,
    w: 152,
    h: 112,
  },
  {
    key: 'output',
    label: 'OUTPUT',
    detail: 'display',
    role: 'Receives processed codes from the CPU and renders them as something a human can perceive.',
    x: 660,
    y: 120,
    w: 84,
    h: 64,
  },
  {
    key: 'storage',
    label: 'STORAGE',
    detail: 'disk / SSD',
    role: 'Keeps programs and data when power is off; copies are loaded into memory before the CPU can use them.',
    x: 416,
    y: 248,
    w: 192,
    h: 52,
  },
];

const BLOCK_BY_KEY = Object.fromEntries(BLOCKS.map((block) => [block.key, block])) as Record<
  BlockKey,
  BlockSpec
>;

const BUS_KINDS: { key: BusKind; label: string; meaning: string }[] = [
  { key: 'address', label: 'Address', meaning: 'where the word lives' },
  { key: 'data', label: 'Data', meaning: 'the bits being moved' },
  { key: 'control', label: 'Control', meaning: 'read / write and timing' },
];

const BUS_BY_KEY = Object.fromEntries(BUS_KINDS.map((bus) => [bus.key, bus])) as Record<
  BusKind,
  (typeof BUS_KINDS)[number]
>;

function connectionLabel(connection: Pick<Connection, 'from' | 'to' | 'bus'>): string {
  return `${BLOCK_BY_KEY[connection.from].label} → ${BLOCK_BY_KEY[connection.to].label} (${connection.bus})`;
}

function connectionKey(connection: Pick<Connection, 'from' | 'to' | 'bus'>): string {
  return `${connection.from}:${connection.to}:${connection.bus}`;
}

// Where a line from one block toward another meets the first block's border.
function anchorPoint(block: BlockSpec, toward: BlockSpec): Point {
  const cx = block.x + block.w / 2;
  const cy = block.y + block.h / 2;
  const dx = toward.x + toward.w / 2 - cx;
  const dy = toward.y + toward.h / 2 - cy;
  const edge = Math.max(Math.abs(dx) / (block.w / 2), Math.abs(dy) / (block.h / 2));
  const scale = edge === 0 ? 0 : 1 / edge;
  return { x: cx + dx * scale, y: cy + dy * scale };
}

function arrowPoints(tip: Point, from: Point): string {
  const angle = Math.atan2(tip.y - from.y, tip.x - from.x);
  const size = 9;
  const spread = 0.48;
  const left = `${tip.x - size * Math.cos(angle - spread)},${tip.y - size * Math.sin(angle - spread)}`;
  const right = `${tip.x - size * Math.cos(angle + spread)},${tip.y - size * Math.sin(angle + spread)}`;
  return `${tip.x},${tip.y} ${left} ${right}`;
}

// A block-by-block schematic the learner can wire up: three bus families answer
// where, what and when. State is local to this client component.
export function BlockDiagramBuilder() {
  const [selected, setSelected] = useState<BlockKey | null>(null);
  const [from, setFrom] = useState<BlockKey>('input');
  const [to, setTo] = useState<BlockKey>('cpu');
  const [bus, setBus] = useState<BusKind>('data');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [status, setStatus] = useState('No connections yet.');
  const nextId = useRef(0);

  const addConnection = () => {
    if (from === to) return;
    const candidate = { from, to, bus };
    if (connections.some((existing) => connectionKey(existing) === connectionKey(candidate))) {
      setStatus(`Already connected: ${connectionLabel(candidate)}`);
      return;
    }
    // Take the id before the updater so batched updates cannot duplicate keys.
    const id = nextId.current;
    nextId.current += 1;
    setConnections((current) => [...current, { id, ...candidate }]);
    setStatus(`Connection added: ${connectionLabel(candidate)}`);
  };

  const removeConnection = (connection: Connection) => {
    setConnections((current) => current.filter((item) => item.id !== connection.id));
    setStatus(`Connection removed: ${connectionLabel(connection)}`);
  };

  const clearConnections = () => {
    setStatus(`Cleared ${connections.length} connection${connections.length === 1 ? '' : 's'}.`);
    setConnections([]);
  };

  // Toggle so aria-pressed on both the SVG nodes and the buttons stays truthful.
  const selectBlock = (key: BlockKey) => setSelected((current) => (current === key ? null : key));
  const selectedBlock = selected ? BLOCK_BY_KEY[selected] : null;

  return (
    <div className="co-bbd">
      <p className="co-muted mt-0 text-sm">
        Click a block to read its job, then wire two blocks together using one of the three bus families.
      </p>

      <div className="co-schematic co-bbd-canvas mt-3">
        <svg
          viewBox="0 0 760 320"
          className="h-auto w-full"
          aria-labelledby="co-bbd-title co-bbd-desc"
        >
          <title id="co-bbd-title">Wireable digital computer block diagram</title>
          <desc id="co-bbd-desc">
            Five blocks: input, CPU, memory, output and secondary storage. Add address, data or
            control connections between them to trace how a word travels around the machine.
          </desc>

          {/* Fixed context wires, drawn behind the blocks. */}
          <path className="co-wire" d="M 136 152 L 180 152" />
          <polygon className="co-arrow-head" points="184,152 176,148 176,156" />
          <path className="co-wire" d="M 364 130 L 428 130" />
          <path className="co-wire" d="M 364 152 L 428 152" />
          <path className="co-wire" d="M 364 174 L 428 174" />
          <polygon className="co-arrow-head" points="432,152 424,148 424,156" />
          <polygon className="co-arrow-head" points="360,174 368,170 368,178" />
          <path className="co-wire" d="M 588 152 L 652 152" />
          <polygon className="co-arrow-head" points="656,152 648,148 648,156" />
          <path className="co-wire" d="M 480 208 L 480 246" />
          <path className="co-wire" d="M 544 246 L 544 208" />
          <polygon className="co-arrow-head" points="480,250 476,242 484,242" />
          <polygon className="co-arrow-head" points="544,204 540,212 548,212" />
          <text className="co-bbd-bus-address-text" x="396" y="124" textAnchor="middle">A</text>
          <text className="co-bbd-bus-data-text" x="396" y="146" textAnchor="middle">D</text>
          <text className="co-bbd-bus-control-text" x="396" y="168" textAnchor="middle">C</text>

          {/* Learner-created connections. */}
          {connections.map((connection) => {
            const source = BLOCK_BY_KEY[connection.from];
            const target = BLOCK_BY_KEY[connection.to];
            const start = anchorPoint(source, target);
            const end = anchorPoint(target, source);
            return (
              <g key={connection.id} className="co-bbd-connection">
                <line
                  className={`co-bbd-wire co-bbd-wire-${connection.bus}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                />
                <polygon
                  className={`co-bbd-arrow co-bbd-arrow-${connection.bus}`}
                  points={arrowPoints(end, start)}
                />
              </g>
            );
          })}

          {/* Real keyboard semantics on each SVG block; buttons below mirror them. */}
          {BLOCKS.map((block) => (
            <g
              key={block.key}
              className={`co-bbd-node${selected === block.key ? ' co-bbd-node-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={selected === block.key}
              aria-label={`${block.label.toLowerCase()} block — show its role`}
              onClick={() => selectBlock(block.key)}
              onKeyDown={(event: KeyboardEvent<SVGGElement>) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  selectBlock(block.key);
                }
              }}
            >
              <rect
                className="co-bbd-rect"
                x={block.x}
                y={block.y}
                width={block.w}
                height={block.h}
                rx="8"
              />
              <text
                className="co-diagram-label"
                x={block.x + block.w / 2}
                y={block.y + block.h / 2 - 4}
                textAnchor="middle"
              >
                {block.label}
              </text>
              <text
                className="co-diagram-sub"
                x={block.x + block.w / 2}
                y={block.y + block.h / 2 + 18}
                textAnchor="middle"
              >
                {block.detail}
              </text>
            </g>
          ))}

          {/* Letters come last so a label can never be hidden behind a block. */}
          {connections.map((connection) => {
            const source = BLOCK_BY_KEY[connection.from];
            const target = BLOCK_BY_KEY[connection.to];
            const start = anchorPoint(source, target);
            const end = anchorPoint(target, source);
            return (
              <text
                key={`${connection.id}-letter`}
                className={`co-bbd-bus-letter co-bbd-bus-${connection.bus}-text`}
                x={(start.x + end.x) / 2}
                y={(start.y + end.y) / 2 - 7}
                textAnchor="middle"
              >
                {connection.bus[0].toUpperCase()}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="co-bbd-roles mt-3" role="group" aria-label="Blocks — reveal role">
        {BLOCKS.map((block) => (
          <button
            key={block.key}
            type="button"
            className={`co-chip co-action${selected === block.key ? ' co-chip-active' : ''}`}
            aria-pressed={selected === block.key}
            onClick={() => selectBlock(block.key)}
          >
            {block.label.toLowerCase()}
          </button>
        ))}
      </div>
      <p className="co-card co-bbd-role mt-2 text-sm" aria-live="polite">
        {selectedBlock
          ? `${selectedBlock.label.toLowerCase()}: ${selectedBlock.role}`
          : 'Select a block above to read what it does.'}
      </p>

      <div className="co-bbd-controls co-card mt-4">
        <p className="font-semibold">Add a bus connection</p>
        <div className="co-bbd-fields mt-3">
          <div className="co-bbd-field">
            <label htmlFor="co-bbd-from">From</label>
            <select id="co-bbd-from" value={from} onChange={(event) => setFrom(event.target.value as BlockKey)}>
              {BLOCKS.map((block) => (
                <option key={block.key} value={block.key}>
                  {block.label.toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="co-bbd-field">
            <label htmlFor="co-bbd-to">To</label>
            <select id="co-bbd-to" value={to} onChange={(event) => setTo(event.target.value as BlockKey)}>
              {BLOCKS.map((block) => (
                <option key={block.key} value={block.key}>
                  {block.label.toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="co-bbd-field">
            <label htmlFor="co-bbd-bus">Bus family</label>
            <select id="co-bbd-bus" value={bus} onChange={(event) => setBus(event.target.value as BusKind)}>
              {BUS_KINDS.map((kind) => (
                <option key={kind.key} value={kind.key}>
                  {kind.label} — {kind.meaning}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="co-bbd-actions mt-3">
          <button type="button" className="co-action" onClick={addConnection} disabled={from === to}>
            Add connection
          </button>
          <button
            type="button"
            className="co-action"
            onClick={clearConnections}
            disabled={connections.length === 0}
          >
            Clear connections
          </button>
        </div>
        <p className="co-muted mt-2 text-xs" aria-live="polite">
          {status}
        </p>
        <p className="co-muted mt-2 text-xs">
          {from === to ? 'Pick two different blocks to make a connection.' : `Ready: ${from} → ${to} over the ${bus} bus.`}
        </p>
      </div>

      {connections.length > 0 && (
        <ul className="co-bbd-list mt-3">
          {connections.map((connection) => (
            <li key={connection.id}>
              <span
                className={`co-bbd-swatch co-bbd-swatch-${connection.bus}`}
                aria-hidden="true"
              />
              <span>
                {connection.from} → {connection.to} · {BUS_BY_KEY[connection.bus].label}
              </span>
              <button
                type="button"
                className="co-bbd-remove"
                aria-label={`Remove ${connection.from} to ${connection.to} ${connection.bus} connection`}
                onClick={() => removeConnection(connection)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
