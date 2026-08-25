'use client';

import { useEffect, useState } from 'react';
import {
  Bug,
  Database,
  Fingerprint,
  Laptop,
  Lock,
  Play,
  RotateCcw,
  Scale,
  Server,
  Shield,
  ShieldCheck,
  ShieldX,
  User,
  type LucideIcon,
} from 'lucide-react';
import { MODE_INFO, ZERO_TRUST_STAGES, type Mode } from './data';

type ChipStatus = 'idle' | 'active' | 'allow' | 'deny' | 'compromised';
type Scenario = 'legit' | 'stolen';
type Phase = 'idle' | 'running' | 'done';

interface Step {
  chip: string;
  verdict: 'allow' | 'deny';
  reason: string;
  compromise?: boolean;
}

interface LogEntry {
  id: number;
  stage: string;
  verdict: 'allow' | 'deny';
  reason: string;
}

interface Banner {
  tone: 'good' | 'bad';
  text: string;
}

const STAGE_ICONS: Record<string, LucideIcon> = {
  identity: Fingerprint,
  device: Laptop,
  policy: Scale,
  mtls: Lock,
  authorize: ShieldCheck,
};

const CHIP_META: Record<string, { label: string; sub: string; icon: LucideIcon }> = {
  user: { label: 'User', sub: 'client device', icon: User },
  edge: { label: 'Castle Gate', sub: 'IP allowlist', icon: Shield },
  api: { label: 'API service', sub: 'internal logic', icon: Server },
  db: { label: 'Database', sub: 'crown jewels', icon: Database },
  attacker: { label: 'Attacker box', sub: 'already inside', icon: Bug },
  ...Object.fromEntries(
    ZERO_TRUST_STAGES.map((s) => [s.id, { label: s.label, sub: s.sub, icon: STAGE_ICONS[s.id] }])
  ),
};

function chipsFor(mode: Mode): string[] {
  return mode === 'castle'
    ? ['user', 'edge', 'api', 'db']
    : ['user', ...ZERO_TRUST_STAGES.map((s) => s.id), 'db'];
}

function buildScript(mode: Mode, scenario: Scenario): Step[] {
  if (mode === 'castle') {
    if (scenario === 'legit') {
      return [
        { chip: 'edge', verdict: 'allow', reason: 'Source IP on the allowlist - the only verification ever performed.' },
        { chip: 'api', verdict: 'allow', reason: 'Forwarded inward; internal hops never re-check who is asking.' },
        { chip: 'db', verdict: 'allow', reason: 'Query served over the flat network with no identity presented.' },
      ];
    }
    return [
      { chip: 'edge', verdict: 'allow', reason: 'Traffic originates inside the perimeter - the gate waves it through.' },
      { chip: 'api', verdict: 'allow', compromise: true, reason: 'Stolen session replayed laterally onto the API - no re-authentication exists.' },
      { chip: 'db', verdict: 'allow', compromise: true, reason: 'Attacker dumps records unchallenged. Breach complete.' },
    ];
  }
  if (scenario === 'legit') {
    return [
      { chip: 'identity', verdict: 'allow', reason: 'JWT signature, issuer, and expiry verified against the IdP keys.' },
      { chip: 'device', verdict: 'allow', reason: 'Device presents a valid health certificate; patch level current.' },
      { chip: 'policy', verdict: 'allow', reason: 'Rule set grants this identity access to this resource at this hour.' },
      { chip: 'mtls', verdict: 'allow', reason: 'Channel upgraded to mutual TLS; both sides present certificates.' },
      { chip: 'authorize', verdict: 'allow', reason: 'Scoped, short-lived grant issued for exactly this request.' },
      { chip: 'db', verdict: 'allow', reason: 'Request fulfilled under least privilege - every hop was verified.' },
    ];
  }
  return [
    { chip: 'identity', verdict: 'allow', reason: 'Token signature is valid - stolen credentials still look genuine.' },
    { chip: 'device', verdict: 'deny', reason: 'UNKNOWN DEVICE: no health certificate, stale patch level. Journey ends here.' },
  ];
}

function Connector({ state, vertical }: { state: 'idle' | 'ok' | 'attack'; vertical?: boolean }) {
  if (state === 'ok') {
    return vertical ? (
      <span className="h-7 w-[3px] rounded bg-emerald-500" />
    ) : (
      <span className="h-[3px] w-8 rounded bg-emerald-500" />
    );
  }
  if (state === 'attack') {
    const style: React.CSSProperties = vertical
      ? {
          backgroundImage: 'repeating-linear-gradient(180deg,#f43f5e 0 8px,transparent 8px 16px)',
          animation: 'zt-march-v 0.45s linear infinite',
        }
      : {
          backgroundImage: 'repeating-linear-gradient(90deg,#f43f5e 0 8px,transparent 8px 16px)',
          animation: 'zt-march-h 0.45s linear infinite',
        };
    return vertical ? (
      <span className="h-7 w-[3px] rounded" style={style} />
    ) : (
      <span className="h-[3px] w-8 rounded" style={style} />
    );
  }
  return vertical ? (
    <span className="h-7 w-[3px] rounded bg-zinc-300 dark:bg-zinc-700" />
  ) : (
    <span className="h-[3px] w-8 rounded bg-zinc-300 dark:bg-zinc-700" />
  );
}

interface ChipProps {
  id: string;
  status: ChipStatus;
}

function Chip({ id, status }: ChipProps) {
  const meta = CHIP_META[id];
  const Icon = status === 'deny' ? ShieldX : meta.icon;
  let cls =
    'relative flex min-w-[92px] max-w-[120px] flex-col items-center gap-0.5 rounded-xl border px-3 py-2.5 text-center transition-colors ';
  if (status === 'allow') {
    cls += 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300';
  } else if (status === 'deny' || status === 'compromised') {
    cls += 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300';
  } else if (status === 'active') {
    cls +=
      'animate-pulse border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200';
  } else {
    cls += 'border-zinc-300 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400';
  }
  return (
    <div className={cls} data-status={status}>
      {status === 'allow' && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
          ✓
        </span>
      )}
      {(status === 'deny' || status === 'compromised') && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
          ✕
        </span>
      )}
      <Icon className="h-5 w-5" aria-hidden />
      <span className="text-xs font-semibold leading-tight">{meta.label}</span>
      <span className="text-[10px] leading-tight opacity-75">{meta.sub}</span>
    </div>
  );
}

export default function ZeroTrustJourney() {
  const [mode, setMode] = useState<Mode>('castle');
  const [scenario, setScenario] = useState<Scenario>('legit');
  const [script, setScript] = useState<Step[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ChipStatus>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [resolved, setResolved] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [runId, setRunId] = useState(0);

  const chips = chipsFor(mode);
  const info = MODE_INFO[mode];
  const activeChip =
    phase === 'running' && resolved < script.length ? script[resolved].chip : null;

  const statusOf = (id: string): ChipStatus =>
    activeChip === id ? 'active' : (statuses[id] ?? 'idle');

  const segmentState = (a: string, b: string): 'idle' | 'ok' | 'attack' => {
    const sa = statuses[a] ?? 'idle';
    const sb = statuses[b] ?? 'idle';
    if (sa === 'deny' || sb === 'deny' || sa === 'compromised' || sb === 'compromised') return 'attack';
    if (sa === 'allow' && sb === 'allow') return 'ok';
    return 'idle';
  };

  const resetAll = (nextMode: Mode) => {
    setMode(nextMode);
    setScript([]);
    setStatuses({});
    setLogs([]);
    setResolved(0);
    setPhase('idle');
    setBanner(null);
  };

  const fire = (kind: Scenario) => {
    setScenario(kind);
    setScript(buildScript(mode, kind));
    setStatuses(Object.fromEntries(chips.map((id) => [id, 'idle'])));
    setLogs([]);
    setResolved(0);
    setBanner(null);
    setPhase('running');
    setRunId((n) => n + 1);
  };

  useEffect(() => {
    if (phase !== 'running' || resolved >= script.length) return;
    const t = setTimeout(() => {
      const s = script[resolved];
      setStatuses((prev) => ({
        ...prev,
        [s.chip]: s.verdict === 'deny' ? 'deny' : s.compromise ? 'compromised' : 'allow',
      }));
      setLogs((prev) => [
        { id: resolved, stage: CHIP_META[s.chip].label, verdict: s.verdict, reason: s.reason },
        ...prev,
      ]);
      setResolved((r) => r + 1);
    }, 900);
    return () => clearTimeout(t);
  }, [phase, resolved, script]);

  useEffect(() => {
    if (phase !== 'running' || script.length === 0 || resolved < script.length) return;
    setPhase('done');
    const breached = script.some((s) => s.chip === 'db' && s.compromise);
    const reachedDb = script.some((s) => s.chip === 'db');
    if (breached) {
      setBanner({
        tone: 'bad',
        text: 'BREACH: the stolen token walked laterally into the database - the perimeter never looked back.',
      });
    } else if (!reachedDb) {
      setBanner({
        tone: 'good',
        text: 'CONTAINED: stolen token rejected at Device posture - identity alone was never enough.',
      });
    } else if (mode === 'zero-trust') {
      setBanner({ tone: 'good', text: 'AUTHORIZED: verified at all five hops - least-privilege grant issued.' });
    } else {
      setBanner({ tone: 'good', text: 'DELIVERED: one gate checked, then trusted forever after.' });
    }
  }, [phase, resolved, script, mode]);

  const lateralActive = mode === 'castle' && scenario === 'stolen' && phase !== 'idle';

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Injected keyframes for marching dashed attack paths */}
      <style>
        {
          '@keyframes zt-march-h{to{background-position-x:-16px}}@keyframes zt-march-v{to{background-position-y:16px}}'
        }
      </style>

      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Security Architecture · IAM
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">One Gate vs Every Hop</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Fire the same request through two architectures. Watch where it is verified - and where a
            stolen token quietly slips through.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-7">
        {/* Controls */}
        <section
          aria-label="Controls"
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Architecture mode"
              className="flex overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700"
            >
              {(['castle', 'zero-trust'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => resetAll(m)}
                  aria-pressed={mode === m}
                  className={
                    'px-4 py-2 text-sm font-semibold transition-colors ' +
                    (mode === m
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800')
                  }
                >
                  {MODE_INFO[m].title}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => fire('legit')}
              disabled={phase === 'running'}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-600 bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play className="h-4 w-4" aria-hidden />
              Fire legitimate request
            </button>
            <button
              type="button"
              onClick={() => fire('stolen')}
              disabled={phase === 'running'}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-500 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <Bug className="h-4 w-4" aria-hidden />
              Inject stolen token
            </button>
            <button
              type="button"
              onClick={() => resetAll(mode)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
          </div>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{info.blurb}</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Pipeline */}
          <section
            aria-label="Request pipeline"
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-wrap items-center justify-center gap-y-5">
              {chips.flatMap((id, i) => {
                const nodes = [] as React.ReactNode[];
                if (i > 0) {
                  nodes.push(<Connector key={'conn-' + id} state={segmentState(chips[i - 1], id)} />);
                }
                nodes.push(<Chip key={id} id={id} status={statusOf(id)} />);
                return nodes;
              })}
            </div>

            {mode === 'castle' && (
              <div className="mt-6 border-t border-dashed border-zinc-300 pt-4 dark:border-zinc-700">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Inside the walls:
                  </span>
                  <Chip id="attacker" status={lateralActive && !statuses.api ? 'active' : (statuses.attacker ?? 'idle')} />
                  {lateralActive && <Connector state="attack" vertical />}
                  {lateralActive && (
                    <span className="max-w-[220px] text-[11px] italic leading-tight text-rose-600 dark:text-rose-400">
                      red dashed = unchecked lateral movement
                    </span>
                  )}
                </div>
              </div>
            )}

            {banner && (
              <div
                role="status"
                className={
                  'mt-5 rounded-lg p-3 text-sm font-medium ' +
                  (banner.tone === 'bad'
                    ? 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'
                    : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300')
                }
              >
                {banner.text}
              </div>
            )}

            <p className="mt-4 border-t border-zinc-100 pt-3 text-xs italic leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              {info.footnote}
            </p>
          </section>

          {/* Decision log */}
          <section
            aria-label="Decision log"
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-sm font-bold">Decision log</h2>
            <div aria-live="polite">
              {logs.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  No requests yet - fire one and watch each decision appear here.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {logs.map((entry) => (
                    <li
                      key={runId + '-' + entry.id}
                      className={
                        'rounded-lg border p-2.5 ' +
                        (entry.verdict === 'allow'
                          ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/5'
                          : 'border-rose-200 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/5')
                      }
                    >
                      <div className="flex items-start gap-2">
                        {entry.verdict === 'allow' ? (
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                        ) : (
                          <ShieldX className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden />
                        )}
                        <div>
                          <p className="text-xs font-bold">
                            {entry.stage}
                            <span
                              className={
                                'ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ' +
                                (entry.verdict === 'allow'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300')
                              }
                            >
                              {entry.verdict}
                            </span>
                          </p>
                          <p className="mt-0.5 text-xs leading-snug text-zinc-600 dark:text-zinc-300">
                            {entry.reason}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
