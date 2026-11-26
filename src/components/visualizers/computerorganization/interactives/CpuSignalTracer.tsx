'use client';

import { useState, type KeyboardEvent } from 'react';
import '../styles.css';

type UnitKey = 'pc' | 'ir' | 'cu' | 'alu' | 'gpr' | 'acc';
type SignalKind = 'address' | 'data' | 'control';

interface UnitSpec {
  key: UnitKey;
  label: string;
  detail: string;
  role: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface TraceSpec {
  id: string;
  from: UnitKey;
  to: UnitKey;
  signal: SignalKind;
  d: string;
  label: string;
  labelX: number;
  labelY: number;
}

// Geometry is in SVG viewBox units; nothing here touches the DOM at import time.
const UNITS: UnitSpec[] = [
  {
    key: 'pc',
    label: 'PC',
    detail: 'program counter',
    role: 'Holds the address of the next instruction. Fetch copies that address to memory and then advances PC, so the machine is always ready for the following instruction.',
    x: 30,
    y: 40,
    w: 140,
    h: 64,
  },
  {
    key: 'ir',
    label: 'IR',
    detail: 'instruction register',
    role: 'Latches the word fetched from memory. Its opcode field goes to the control unit while its operand fields name registers or an address.',
    x: 30,
    y: 210,
    w: 140,
    h: 64,
  },
  {
    key: 'cu',
    label: 'CU',
    detail: 'control unit',
    role: 'A finite-state machine that decodes the opcode and asserts the read, write and select signals. It never computes the result itself — it tells the datapath what to do on each clock tick.',
    x: 274,
    y: 40,
    w: 172,
    h: 84,
  },
  {
    key: 'alu',
    label: 'ALU',
    detail: 'arithmetic / logic',
    role: 'Combinational logic that adds, subtracts and compares the values presented at its inputs. The control unit selects the operation; status flags record carry, zero and sign.',
    x: 274,
    y: 210,
    w: 172,
    h: 84,
  },
  {
    key: 'gpr',
    label: 'GPRs',
    detail: 'register file',
    role: 'A small bank of named registers next to the ALU. Reading operands from here avoids a slow main-memory trip; the control unit decides which registers are read and written.',
    x: 548,
    y: 40,
    w: 142,
    h: 64,
  },
  {
    key: 'acc',
    label: 'ACC',
    detail: 'accumulator',
    role: 'A dedicated register that holds the ALU result between instructions. It is the classic home of intermediate values in a single-accumulator machine.',
    x: 548,
    y: 210,
    w: 142,
    h: 64,
  },
];

const TRACES: TraceSpec[] = [
  {
    id: 'pc-ir',
    from: 'pc',
    to: 'ir',
    signal: 'data',
    d: 'M 100 104 L 100 210',
    label: 'fetch word',
    labelX: 108,
    labelY: 160,
  },
  {
    id: 'ir-cu',
    from: 'ir',
    to: 'cu',
    signal: 'control',
    d: 'M 170 224 L 274 116',
    label: 'opcode',
    labelX: 214,
    labelY: 158,
  },
  {
    id: 'cu-gpr',
    from: 'cu',
    to: 'gpr',
    signal: 'control',
    d: 'M 446 72 L 548 72',
    label: 'reg select',
    labelX: 498,
    labelY: 62,
  },
  {
    id: 'cu-alu',
    from: 'cu',
    to: 'alu',
    signal: 'control',
    d: 'M 360 124 L 360 210',
    label: 'ALU select',
    labelX: 370,
    labelY: 172,
  },
  {
    id: 'gpr-alu',
    from: 'gpr',
    to: 'alu',
    signal: 'data',
    d: 'M 620 104 L 620 158 Q 620 172 606 172 L 452 172 Q 446 172 446 210',
    label: 'operand',
    labelX: 528,
    labelY: 164,
  },
  {
    id: 'alu-acc',
    from: 'alu',
    to: 'acc',
    signal: 'data',
    d: 'M 446 252 L 548 252',
    label: 'result',
    labelX: 498,
    labelY: 242,
  },
];

// The highlighted route is the set of traces that carry information into and
// out of the chosen unit — the datapath equivalent of following a wire.
const UNIT_PATHS: Record<UnitKey, { traces: string[]; flow: string; note: string }> = {
  pc: {
    traces: ['pc-ir'],
    flow: 'PC → instruction word → IR',
    note: 'On fetch, PC drives the address lines; the fetched word travels on the data lines into IR.',
  },
  ir: {
    traces: ['pc-ir', 'ir-cu'],
    flow: 'PC → IR → opcode → CU',
    note: 'IR holds the whole instruction, but only its opcode field steers the control unit.',
  },
  cu: {
    traces: ['ir-cu', 'cu-gpr', 'cu-alu'],
    flow: 'IR → CU → register select + ALU select',
    note: 'Control lines fan out to the register file and the ALU. No data passes through the CU.',
  },
  alu: {
    traces: ['cu-gpr', 'gpr-alu', 'cu-alu', 'alu-acc'],
    flow: 'CU selects → GPRs supply operands → ALU → ACC',
    note: 'The CU chooses the operation, the GPRs drive the operands and the result is latched into ACC on the clock edge.',
  },
  gpr: {
    traces: ['cu-gpr', 'gpr-alu'],
    flow: 'CU selects → GPRs → ALU input',
    note: 'The register file puts the named operands on the internal data path only when the CU enables those reads.',
  },
  acc: {
    traces: ['alu-acc'],
    flow: 'ALU result → ACC',
    note: 'ACC latches the computed word; a later instruction can read it back as an ALU operand.',
  },
};

const SIGNAL_LEGEND: { key: SignalKind; label: string }[] = [
  { key: 'address', label: 'address — where' },
  { key: 'data', label: 'data — what' },
  { key: 'control', label: 'control — when' },
];

// Click (or press Enter on) a functional unit to light up its signal route.
export function CpuSignalTracer() {
  const [selected, setSelected] = useState<UnitKey>('alu');
  const activeTraces = new Set(UNIT_PATHS[selected].traces);
  const activeUnits = new Set<UnitKey>([selected]);
  TRACES.forEach((trace) => {
    if (activeTraces.has(trace.id)) {
      activeUnits.add(trace.from);
      activeUnits.add(trace.to);
    }
  });
  const unit = UNITS.find((item) => item.key === selected)!;

  const choose = (key: UnitKey) => setSelected(key);

  return (
    <div className="co-cst">
      <p className="co-muted mt-0 text-sm">
        Select an internal unit. The wires that carry its signals light up; the description explains what that
        unit actually does.
      </p>

      <div className="co-schematic co-cst-canvas mt-3">
        <svg viewBox="0 0 720 320" className="h-auto w-full" aria-labelledby="co-cst-title co-cst-desc">
          <title id="co-cst-title">CPU datapath signal tracer</title>
          <desc id="co-cst-desc">
            Program counter, instruction register, control unit, ALU, general-purpose registers and accumulator
            connected by address, data and control traces. Choose a unit to highlight its route.
          </desc>

          {TRACES.map((trace) => (
            <g key={trace.id}>
              <path
                className={`co-cst-trace co-cst-trace-${trace.signal}${
                  activeTraces.has(trace.id) ? ' co-cst-trace-live' : ''
                }`}
                d={trace.d}
              />
              <text
                className={`co-cst-trace-label${activeTraces.has(trace.id) ? ' co-cst-trace-label-live' : ''}`}
                x={trace.labelX}
                y={trace.labelY}
              >
                {trace.label}
              </text>
            </g>
          ))}

          {UNITS.map((item) => (
            <g
              key={item.key}
              className={`co-cst-node${
                activeUnits.has(item.key) ? ' co-cst-node-hit' : ''
              }${selected === item.key ? ' co-cst-node-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={selected === item.key}
              aria-label={`${item.label} — ${item.detail}. Show its signal path.`}
              onClick={() => choose(item.key)}
              onKeyDown={(event: KeyboardEvent<SVGGElement>) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  choose(item.key);
                }
              }}
            >
              <rect className="co-cst-box" x={item.x} y={item.y} width={item.w} height={item.h} rx="9" />
              <text className="co-diagram-label" x={item.x + item.w / 2} y={item.y + item.h / 2 - 4} textAnchor="middle">
                {item.label}
              </text>
              <text className="co-cst-sub" x={item.x + item.w / 2} y={item.y + item.h / 2 + 18} textAnchor="middle">
                {item.detail}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="co-cst-units mt-3" role="group" aria-label="Functional units — reveal signal path">
        {UNITS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`co-chip co-action${selected === item.key ? ' co-chip-active' : ''}`}
            aria-pressed={selected === item.key}
            onClick={() => choose(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="co-cst-readout co-card mt-3" aria-live="polite">
        <p className="co-cst-flow">
          <span className="co-num">{unit.label}</span> · {UNIT_PATHS[selected].flow}
        </p>
        <p className="mt-1 text-sm">{unit.role}</p>
        <p className="co-muted mt-1 text-xs">{UNIT_PATHS[selected].note}</p>
      </div>

      <ul className="co-cst-legend mt-3" aria-label="Signal families">
        {SIGNAL_LEGEND.map((item) => (
          <li key={item.key} className="co-cst-legend-item">
            <span className={`co-bbd-swatch co-bbd-swatch-${item.key}`} aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
