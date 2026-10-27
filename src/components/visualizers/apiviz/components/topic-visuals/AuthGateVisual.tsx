'use client';

import { useState } from 'react';
import { KeyRound, Lock, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';
import type { Topic, TopicRender } from '../../data/learning-path';
import { cn } from '@/lib/utils';
import { Micro, Panel, Stage, TerminalButton, VisualCaption } from './chrome';

type Data = Extract<TopicRender, { kind: 'auth-gate' }>;

/** How far a request gets for each credential scenario. `passed` = number of gates cleared. */
const SCENARIOS = [
  { id: 'absent', label: 'no credential', passed: 0 },
  { id: 'invalid', label: 'unverifiable / expired', passed: 1 },
  { id: 'scope', label: 'valid, wrong scope', passed: 2 },
  { id: 'granted', label: 'valid, permitted', passed: 4 },
] as const;

type ScenarioId = (typeof SCENARIOS)[number]['id'];

/**
 * FS-27c, `auth-models` — the credential gate chain.
 *
 * Geometry: each authored gate is a station the request must clear, with the status it
 * returns when it is the station that stops it. Interaction: switch the credential
 * scenario and watch the request stop at a different gate — 401 for "who are you",
 * 403 for "not allowed to do that". The chain short-circuits; later gates stay dark.
 */
export function AuthGateVisual({ topic, data }: { topic: Topic; data: Data }) {
  const [scenario, setScenario] = useState<ScenarioId>('granted');
  const cleared = SCENARIOS.find((s) => s.id === scenario)?.passed ?? 0;
  const allowed = cleared >= data.gates.length;
  const failed = allowed ? null : data.gates[cleared];
  const status = allowed ? '200 OK' : (failed?.onFail ?? '401 Unauthorized');

  return (
    <Stage>
      <VisualCaption topic={topic} />

      <div className="grid flex-grow grid-cols-1 gap-6 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* ---------------- scenarios ---------------- */}
        <div className="flex flex-col gap-3">
          <Micro className="text-cyan-400/60">PRESENTED_CREDENTIAL</Micro>
          <div className="flex flex-col gap-2">
            {SCENARIOS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setScenario(entry.id)}
                className={cn(
                  'flex items-center justify-between border-2 px-3 py-2.5 text-left transition-colors',
                  entry.id === scenario
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-cyan-400/10 bg-black/40 hover:border-cyan-400/30',
                )}
              >
                <span className="flex items-center gap-2">
                  {entry.id === 'granted' ? (
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  ) : (
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-500/70" />
                  )}
                  <span
                    className={cn(
                      'font-mono text-[10px] lowercase',
                      entry.id === scenario ? 'text-cyan-400' : 'text-cyan-400/40',
                    )}
                  >
                    {entry.label}
                  </span>
                </span>
                <span className="font-mono text-[9px] text-cyan-400/25">
                  clears {entry.passed}/{data.gates.length}
                </span>
              </button>
            ))}
          </div>

          <Panel className="mt-auto border-cyan-400/10">
            <Micro>AUTHN_VS_AUTHZ</Micro>
            <p className="mt-1 font-mono text-[9px] lowercase leading-relaxed text-cyan-400/30">
              the first gates only establish *who* is calling; the scope gate decides *what*
              they may do. Different questions, different failure codes.
            </p>
          </Panel>
        </div>

        {/* ---------------- gate chain ---------------- */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Micro className="text-cyan-400/60">GATE_CHAIN::SHORT_CIRCUIT</Micro>
            <Micro>RESPONSE::{status}</Micro>
          </div>

          {data.gates.map((gate, index) => {
            const passed = index < cleared;
            const blocked = index === cleared;
            const authentication = index < 2;
            return (
              <div
                key={gate.gate}
                className={cn(
                  'flex items-center gap-3 border-2 px-3 py-3 transition-colors',
                  blocked
                    ? 'border-rose-500/40 bg-rose-500/5'
                    : passed
                      ? 'border-cyan-400/40 bg-cyan-400/5'
                      : 'border-white/5 bg-black/20 opacity-40',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center border',
                    blocked
                      ? 'border-rose-500/50 text-rose-400'
                      : passed
                        ? 'border-cyan-400/50 text-cyan-400'
                        : 'border-white/10 text-cyan-400/20',
                  )}
                >
                  {index === data.gates.length - 1 ? (
                    <UserCheck className="h-4 w-4" />
                  ) : authentication ? (
                    <KeyRound className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-cyan-400/25">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'truncate font-mono text-[10px] lowercase',
                        blocked ? 'text-rose-300' : passed ? 'text-cyan-400' : 'text-cyan-400/30',
                      )}
                    >
                      {gate.gate}
                    </span>
                  </div>
                  <Micro className="text-[8px] tracking-[0.2em]">
                    {authentication ? 'AUTHENTICATION' : index === 2 ? 'AUTHORIZATION' : 'HANDLER'}
                  </Micro>
                </div>

                <span
                  className={cn(
                    'flex-shrink-0 border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em]',
                    blocked
                      ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                      : passed
                        ? 'border-cyan-400/40 text-cyan-400'
                        : 'border-white/10 text-cyan-400/20',
                  )}
                >
                  {blocked ? (gate.onFail ?? 'pass') : passed ? 'pass' : 'not reached'}
                </span>
              </div>
            );
          })}

          <Panel
            className={cn(
              'mt-1 flex items-center gap-3',
              allowed ? 'border-cyan-400/40' : 'border-rose-500/30',
            )}
          >
            <span
              className={cn(
                'font-mono text-[14px] font-black tracking-widest',
                allowed ? 'text-cyan-400' : 'text-rose-300',
              )}
            >
              {allowed ? '200 OK' : status}
            </span>
            <span className="font-mono text-[10px] lowercase leading-relaxed text-cyan-400/40">
              {allowed
                ? 'every gate cleared — the handler finally runs'
                : `${cleared} gate(s) cleared, then ${failed?.gate ?? 'a gate'} rejected the request`}
            </span>
          </Panel>
        </div>
      </div>
    </Stage>
  );
}
