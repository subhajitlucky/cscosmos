'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Binary,
  CircuitBoard,
  Cpu,
  MemoryStick,
  Pause,
  Play,
  RotateCcw,
  StepForward,
  type LucideIcon,
} from 'lucide-react';
import {
  DEMO_PROGRAM,
  INSN_DEFS,
  INSN_ORDER,
  SOC_BLOCKS,
  buildAddressMap,
  disassemble,
  encodeInsn,
  initialCpu,
  stepCpu,
  type InsnKind,
  type Operands,
} from './data';

function SectionCard({
  icon: Icon,
  title,
  sub,
  children,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        <div>
          <h2 className="text-sm font-bold leading-tight">{title}</h2>
          <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

const FIELD_STYLE: Record<string, string> = {
  opcode: 'bg-zinc-500 text-white dark:bg-zinc-600',
  rd: 'bg-amber-400 text-amber-950 dark:bg-amber-300',
  rs1: 'bg-amber-200 text-amber-950 dark:bg-amber-700 dark:text-amber-50',
  rs2: 'bg-amber-500 text-white dark:bg-amber-500',
  funct3: 'bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100',
  funct7: 'bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100',
  imm: 'bg-amber-100 text-amber-900 dark:bg-amber-800/80 dark:text-amber-100',
};

const fieldFamily = (name: string): string => (name.startsWith('imm') ? 'imm' : name);

const DEFAULT_OPS: Record<InsnKind, Operands> = {
  add: { rd: 3, rs1: 1, rs2: 2 },
  addi: { rd: 1, rs1: 0, imm: 5 },
  lw: { rd: 4, rs1: 0, imm: 256 },
  sw: { rs1: 0, rs2: 3, imm: 256 },
  beq: { rs1: 3, rs2: 4, imm: 8 },
  jal: { rd: 0, imm: 0 },
};

function RegSelect({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-md border border-zinc-300 bg-white px-1.5 py-1 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <option key={i} value={i}>
            x{i}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function RiscVExplorer() {
  const [kind, setKind] = useState<InsnKind>('addi');
  const [ops, setOps] = useState<Operands>(DEFAULT_OPS.addi);

  const def = INSN_DEFS[kind];
  const encoded = useMemo(() => encodeInsn(kind, ops), [kind, ops]);

  const immRange = useMemo((): string => {
    if (def.fmt === 'B') return '-4096…4094 (even)';
    if (def.fmt === 'J') return '-1048576…1048574 (even)';
    return '-2048…2047';
  }, [def]);

  const pickKind = (k: InsnKind): void => {
    setKind(k);
    setOps({ ...DEFAULT_OPS[k] });
  };

  const [cpu, setCpu] = useState(initialCpu);
  const [running, setRunning] = useState(false);
  const activeIdx = Math.floor(cpu.pc / 4);
  useEffect(() => {
    if (!running || cpu.halted) {
      setRunning(false);
      return;
    }
    const id = window.setTimeout(() => setCpu((s) => stepCpu(s)), 550);
    return () => window.clearTimeout(id);
  }, [running, cpu]);

  const memAddr = Object.keys(cpu.mem)[0];

  const [enabled, setEnabled] = useState<Set<string>>(new Set(['core', 'sram', 'uart']));
  const addrMap = useMemo(() => buildAddressMap(enabled), [enabled]);

  const toggleBlock = (id: string): void => {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <header className="flex flex-wrap items-start gap-3">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">RISC-V and Custom Silicon</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Decompose real RV32I encodings bit by bit, step a tiny store-load-compare program, then wire up your own SoC address map.
          </p>
        </div>
        <code className="ml-auto rounded-md bg-zinc-100 px-2.5 py-1 font-mono text-xs font-bold dark:bg-zinc-800">{encoded.hex}</code>
      </header>

      <SectionCard icon={Binary} title="Instruction encoder" sub="Pick an instruction, tweak operands, and read the exact 32 bits the hardware sees.">
        <div className="mb-3 flex flex-wrap gap-2">
          {INSN_ORDER.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => pickKind(k)}
              className={
                'rounded-md px-3 py-1.5 font-mono text-xs font-bold transition-colors ' +
                (kind === k
                  ? 'bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950'
                  : 'border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800')
              }
            >
              {k}
            </button>
          ))}
          <span className="self-center text-[11px] italic text-zinc-500 dark:text-zinc-400">{def.desc}</span>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          {(def.fmt === 'R' || def.fmt === 'I') && (
            <RegSelect label="rd" value={ops.rd ?? 0} onChange={(v) => setOps((o) => ({ ...o, rd: v }))} />
          )}
          {def.fmt !== 'J' && (
            <RegSelect label={def.fmt === 'S' ? 'rs1 (base)' : 'rs1'} value={ops.rs1 ?? 0} onChange={(v) => setOps((o) => ({ ...o, rs1: v }))} />
          )}
          {(def.fmt === 'R' || def.fmt === 'S' || def.fmt === 'B') && (
            <RegSelect label="rs2" value={ops.rs2 ?? 0} onChange={(v) => setOps((o) => ({ ...o, rs2: v }))} />
          )}
          {def.fmt !== 'R' && (
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              imm ({immRange})
              <input
                type="number"
                value={ops.imm ?? 0}
                onChange={(e) => setOps((o) => ({ ...o, imm: Number(e.target.value) }))}
                className="w-24 rounded-md border border-zinc-300 bg-white px-1.5 py-1 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800"
              />
            </label>
          )}
          <code className="ml-auto text-[11px] font-bold text-zinc-500 dark:text-zinc-400">{def.asm}</code>
        </div>

        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
          <div className="mb-2 flex min-w-max">
            {encoded.fields.map((f) => (
              <div key={f.name} style={{ flexGrow: f.hi - f.lo + 1, flexBasis: 0 }} className="px-0.5 text-center">
                <p className="mb-1 truncate text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{f.name}</p>
                <div
                  className={'mx-auto h-2 rounded-full ' + (fieldFamily(f.name) === 'imm' ? 'bg-amber-300 dark:bg-amber-700' : fieldFamily(f.name) === 'opcode' ? 'bg-zinc-400 dark:bg-zinc-500' : 'bg-amber-500 dark:bg-amber-400')}
                  style={{ width: Math.min(100, (f.hi - f.lo + 1) * 6) + '%' }}
                />
              </div>
            ))}
          </div>
          <div className="flex min-w-max gap-px">
            {encoded.cells.map((c) => (
              <span
                key={c.bit}
                title={'bit ' + c.bit + ' · ' + c.field}
                className={'flex h-7 w-7 shrink-0 items-center justify-center rounded-[3px] font-mono text-[11px] font-bold ' + FIELD_STYLE[fieldFamily(c.field)]}
              >
                {c.val}
              </span>
            ))}
          </div>
          <div className="mt-1 flex min-w-max justify-between px-0.5 text-[9px] tabular-nums text-zinc-400 dark:text-zinc-500">
            {[31, 25, 20, 15, 12, 7, 0].map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>

        <table className="mt-3 w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              <th className="pb-1">Field</th>
              <th className="pb-1">Bits</th>
              <th className="pb-1">Binary</th>
              <th className="pb-1">Decimal</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {encoded.fields.map((f) => (
              <tr key={f.name} className="border-t border-zinc-100 dark:border-zinc-800">
                <td className="py-1 font-sans font-bold">{f.name}</td>
                <td className="py-1 tabular-nums text-zinc-500 dark:text-zinc-400">
                  [{f.hi}:{f.lo}]
                </td>
                <td className="py-1">{f.binary}</td>
                <td className="py-1 tabular-nums text-zinc-500 dark:text-zinc-400">{parseInt(f.binary, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard icon={Cpu} title="Register file · program stepper" sub="A store, a load and a compare - watch registers and memory change as the pc walks.">
        <div className="grid gap-4 md:grid-cols-2">
          <ol className="space-y-1 font-mono text-xs">
            {DEMO_PROGRAM.map((step, i) => (
              <li
                key={i}
                className={
                  'flex items-baseline justify-between gap-2 rounded-md px-2 py-1 ' +
                  (cpu.pc === i * 4 && !cpu.halted
                    ? 'bg-amber-100 ring-1 ring-amber-400 dark:bg-amber-500/20'
                    : '')
                }
              >
                <span className="shrink-0 text-zinc-400 tabular-nums dark:text-zinc-500">{String(i * 4).padStart(2, '0')}</span>
                <span className="font-bold">{disassemble(step)}</span>
                <span className="truncate text-[10px] italic text-zinc-400 dark:text-zinc-500">{step.comment}</span>
              </li>
            ))}
          </ol>
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCpu((s) => stepCpu(s))}
                disabled={cpu.halted}
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 disabled:opacity-40 dark:bg-amber-400 dark:text-amber-950"
              >
                <StepForward className="h-3.5 w-3.5" aria-hidden />
                Step
              </button>
              <button
                type="button"
                onClick={() => setRunning(true)}
                disabled={cpu.halted}
                className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-200 dark:text-zinc-900"
              >
                <Play className="h-3.5 w-3.5" aria-hidden />
                Run
              </button>
              <button
                type="button"
                onClick={() => setRunning(false)}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Pause className="h-3.5 w-3.5" aria-hidden />
                Halt
              </button>
              <button
                type="button"
                onClick={() => setCpu(initialCpu())}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Reset
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {cpu.regs.slice(0, 8).map((val, i) => (
                <div
                  key={i}
                  className={
                    'rounded-lg border p-1.5 text-center transition-colors duration-300 ' +
                    (val !== 0
                      ? 'border-amber-400 bg-amber-50 dark:border-amber-500/60 dark:bg-amber-500/10'
                      : 'border-zinc-200 dark:border-zinc-700')
                  }
                >
                  <p className="font-mono text-[10px] font-bold text-zinc-500 dark:text-zinc-400">x{i}</p>
                  <p className="font-mono text-sm font-bold tabular-nums">{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-1.5 text-xs dark:bg-zinc-800">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">pc</span>
              <code className="font-bold tabular-nums">{cpu.halted ? 'halted @ ' + cpu.pc : cpu.pc}</code>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-1.5 text-xs dark:bg-zinc-800">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">Mem[{memAddr ? '0x' + Number(memAddr).toString(16) : '0x100'}]</span>
              <code className="font-bold tabular-nums">{memAddr ? cpu.mem[Number(memAddr)] : 0}</code>
            </div>
            <p className="mt-2 h-4 text-[11px] italic text-zinc-500 dark:text-zinc-400">{cpu.trace}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={CircuitBoard} title="OpenSilicon corner · SoC builder" sub="Toggle peripherals and watch the memory map re-lay itself - exactly what LiteX does when you parametrise a design.">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {SOC_BLOCKS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  title={b.role}
                  disabled={b.fixed}
                  onClick={() => toggleBlock(b.id)}
                  className={
                    'rounded-md px-3 py-1.5 text-xs font-bold transition-colors ' +
                    (enabled.has(b.id)
                      ? 'bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950'
                      : 'border border-dashed border-zinc-300 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800') +
                    (b.fixed ? ' cursor-default opacity-90' : '')
                  }
                >
                  {b.name}
                </button>
              ))}
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white dark:bg-amber-400 dark:text-amber-950">CPU</span>
                <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-zinc-300 to-zinc-200 dark:from-zinc-600 dark:to-zinc-700" />
                <span className="text-[10px] font-bold uppercase text-zinc-400">system bus</span>
              </div>
              <div className="space-y-1.5">
                {SOC_BLOCKS.filter((b) => b.sizeKB > 0).map((b) => (
                  <div key={b.id} className="flex items-center gap-2">
                    <div
                      className={
                        'h-1.5 w-8 ' + (enabled.has(b.id) ? 'bg-amber-400 dark:bg-amber-500' : 'bg-zinc-200 dark:bg-zinc-700')
                      }
                    />
                    <div
                      className={
                        'flex-1 rounded-md border px-2.5 py-1.5 text-xs transition-all duration-300 ' +
                        (enabled.has(b.id)
                          ? 'border-amber-400 bg-white font-bold dark:border-amber-500/60 dark:bg-zinc-900'
                          : 'border-dashed border-zinc-300 italic text-zinc-400 dark:border-zinc-700 dark:text-zinc-600')
                      }
                    >
                      {b.name} · {b.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="min-w-[240px]">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="text-[9px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  <th className="pb-1 pr-2">Peripheral</th>
                  <th className="pb-1 pr-2">Base</th>
                  <th className="pb-1">End</th>
                </tr>
              </thead>
              <tbody>
                {addrMap.map((row) => (
                  <tr key={row.id} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="py-1 pr-2 font-sans font-bold">{row.name}</td>
                    <td className="py-1 pr-2 tabular-nums">{row.baseHex}</td>
                    <td className="py-1 tabular-nums text-zinc-500 dark:text-zinc-400">{row.endHex}</td>
                  </tr>
                ))}
                {addrMap.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-2 italic text-zinc-400">
                      enable a peripheral to map it
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="mt-2 flex items-start gap-1 text-[11px] italic text-zinc-500 dark:text-zinc-400">
              <MemoryStick className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
              UART sits at SiFive-style 0x10000000; GPIO follows at +0x12000 so both can stay put as SRAM grows.
            </p>
          </div>
        </div>
      </SectionCard>
    </main>
  );
}
