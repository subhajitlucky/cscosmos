'use client';

import { useState } from 'react';
import '../styles.css';

type Stage = 'Ready' | 'Fetch' | 'Decode' | 'Execute' | 'Memory' | 'Write-back';

interface Instruction {
  op: 'LOAD' | 'ADD' | 'STORE' | 'JMP';
  arg: number;
  text: string;
}

interface Snapshot {
  stage: Stage;
  instruction: string | null;
  note: string;
  changed: string | null;
  pc: number;
  ir: string;
  acc: number;
  mem6: number | null;
}

const PROGRAM: Instruction[] = [
  { op: 'LOAD', arg: 5, text: 'LOAD  ACC, [5]' },
  { op: 'ADD', arg: 3, text: 'ADD   ACC, [3]' },
  { op: 'STORE', arg: 6, text: 'STORE [6], ACC' },
  { op: 'JMP', arg: 0, text: 'JMP   0' },
];

const STAGES: Stage[] = ['Fetch', 'Decode', 'Execute', 'Memory', 'Write-back'];

// Pure pre-computed timeline: the exact same snapshots pre-render on the server.
function buildTimeline(): Snapshot[] {
  let pc = 0;
  let acc = 0;
  let mem6: number | null = null;
  let ir = '—';
  const steps: Snapshot[] = [
    {
      stage: 'Ready',
      instruction: null,
      note: 'Ready. Press Next step to fetch the instruction at PC = 0.',
      changed: null,
      pc,
      ir,
      acc,
      mem6,
    },
  ];

  for (const instruction of PROGRAM) {
    const currentPc = pc;

    pc = currentPc + 1;
    ir = instruction.text;
    steps.push({
      stage: 'Fetch',
      instruction: instruction.text,
      note: `PC = ${currentPc} supplied the instruction address; the word was copied into IR and PC advanced to ${pc}.`,
      changed: 'PC · IR',
      pc,
      ir,
      acc,
      mem6,
    });

    let decodeNote = `The control unit decoded ${instruction.op} and prepared the signals this instruction needs.`;
    if (instruction.op === 'ADD') {
      decodeNote = `Decoded ADD: operand M[${instruction.arg}] = 3 is latched now, before the ALU runs.`;
    }
    steps.push({
      stage: 'Decode',
      instruction: instruction.text,
      note: decodeNote,
      changed: null,
      pc,
      ir,
      acc,
      mem6,
    });

    let executeNote: string;
    if (instruction.op === 'LOAD') {
      executeNote = `Effective address computed: ${instruction.arg}. The ALU forms the location to read.`;
    } else if (instruction.op === 'ADD') {
      executeNote = `ALU adds ACC (${acc}) and the operand latched during decode (3).`;
    } else if (instruction.op === 'STORE') {
      executeNote = `Effective address computed: ${instruction.arg}. The value to write is ACC = ${acc}.`;
    } else {
      executeNote = `Branch target ${instruction.arg} is computed; JMP will overwrite PC at write-back.`;
    }
    steps.push({
      stage: 'Execute',
      instruction: instruction.text,
      note: executeNote,
      changed: null,
      pc,
      ir,
      acc,
      mem6,
    });

    let memoryNote: string;
    if (instruction.op === 'LOAD') {
      memoryNote = `M[${instruction.arg}] = 7 is read into the memory data register.`;
    } else if (instruction.op === 'ADD') {
      memoryNote = 'No data-memory access: the ADD operand was already latched during decode.';
    } else if (instruction.op === 'STORE') {
      mem6 = acc;
      memoryNote = `M[6] ← ${acc}; the store writes ACC into data memory.`;
    } else {
      memoryNote = 'No data-memory access: a branch changes only the instruction address.';
    }
    steps.push({
      stage: 'Memory',
      instruction: instruction.text,
      note: memoryNote,
      changed: null,
      pc,
      ir,
      acc,
      mem6,
    });

    let writeBackNote: string;
    if (instruction.op === 'LOAD') {
      acc = 7;
      writeBackNote = 'ACC ← 7. The loaded word is committed to the register file.';
    } else if (instruction.op === 'ADD') {
      acc = acc + 3;
      writeBackNote = `ACC ← ${acc}. The ALU result is committed on the clock edge.`;
    } else if (instruction.op === 'STORE') {
      writeBackNote = 'No register write-back; PC already points at the next instruction.';
    } else {
      pc = instruction.arg;
      writeBackNote = `PC ← ${instruction.arg}. The loop closes here — the next fetch starts at address 0 again.`;
    }
    steps.push({
      stage: 'Write-back',
      instruction: instruction.text,
      note: writeBackNote,
      changed: instruction.op === 'LOAD' || instruction.op === 'ADD' ? 'ACC' : instruction.op === 'JMP' ? 'PC' : null,
      pc,
      ir,
      acc,
      mem6,
    });
  }

  return steps;
}

const TIMELINE = buildTimeline();

// A tiny stored program walked one micro-stage at a time. Every register panel
// is a snapshot, so the learner can watch PC, IR and ACC change independently.
export function InstructionCycleStepper() {
  const [index, setIndex] = useState(0);
  const step = TIMELINE[index];
  const atEnd = index === TIMELINE.length - 1;
  // Highlight the instruction held in IR, not the next address held in PC.
  const currentLine = step.instruction
    ? PROGRAM.findIndex((instruction) => instruction.text === step.instruction)
    : step.pc;

  const next = () => setIndex((current) => (current >= TIMELINE.length - 1 ? 0 : current + 1));

  return (
    <div className="co-ics">
      <p className="co-muted mt-0 text-sm">
        One instruction at a time: fetch, decode, execute, memory for loads and stores, write back. A jump
        rewrites PC, so the last instruction sends the next fetch back to address 0.
      </p>

      <div className="co-ics-rail mt-3" role="group" aria-label="Instruction cycle stages">
        {STAGES.map((stage, stageIndex) => {
          const active = step.stage === stage;
          const passed = STAGES.indexOf(step.stage as Stage) > stageIndex && step.stage !== 'Ready';
          return (
            <span
              key={stage}
              className={`co-ics-stage${active ? ' co-ics-stage-active' : ''}${passed ? ' co-ics-stage-passed' : ''}`}
              aria-current={active ? 'step' : undefined}
            >
              <span className="co-ics-stage-num">{stageIndex + 1}</span>
              {stage}
            </span>
          );
        })}
      </div>

      <div className="co-ics-body mt-3">
        <div className="co-ics-program">
          <p className="co-ics-heading">Program in memory</p>
          <ol>
            {PROGRAM.map((instruction, line) => (
              <li
                key={instruction.text}
                className={`co-ics-line${currentLine === line ? ' co-ics-line-current' : ''}`}
                aria-current={currentLine === line ? 'true' : undefined}
              >
                <span className="co-ics-addr">{line}:</span>
                <code>{instruction.text}</code>
              </li>
            ))}
          </ol>
          <p className="co-muted mt-2 text-xs">M[3] = 3 · M[5] = 7 · M[6] = {step.mem6 ?? '—'}</p>
        </div>

        <div className="co-ics-registers">
          <p className="co-ics-heading">Live machine state</p>
          <div className="co-ics-register-grid">
            <div className={`co-ics-register${step.changed?.includes('PC') ? ' co-ics-register-changed' : ''}`}>
              <span className="co-ics-register-name">PC</span>
              <strong className="co-ics-register-value">{step.pc}</strong>
            </div>
            <div className={`co-ics-register${step.changed?.includes('IR') ? ' co-ics-register-changed' : ''}`}>
              <span className="co-ics-register-name">IR</span>
              <strong className="co-ics-register-value co-ics-ir-value">{step.ir}</strong>
            </div>
            <div className={`co-ics-register${step.changed === 'ACC' ? ' co-ics-register-changed' : ''}`}>
              <span className="co-ics-register-name">ACC</span>
              <strong className="co-ics-register-value">{step.acc}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="co-ics-narration co-card mt-3" aria-live="polite">
        <p className="co-ics-narration-head">
          <span className="co-chip">{step.stage}</span>
          <span className="co-muted">Step {index} of {TIMELINE.length - 1}</span>
        </p>
        <p className="mt-2">{step.note}</p>
      </div>

      <div className="co-ics-actions mt-3">
        <button type="button" className="co-action" onClick={next}>
          {atEnd ? 'Run program again' : 'Next step'}
        </button>
        <button type="button" className="co-action" onClick={() => setIndex(0)} disabled={index === 0}>
          Reset
        </button>
      </div>
    </div>
  );
}
