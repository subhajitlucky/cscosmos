'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Cable,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';
import {
  CONCEPTS,
  CWND_METER_MAX,
  DEFAULTS,
  FLAG_LEGEND,
  HANDSHAKE_STEPS,
  LOSS_MAX,
  LOSS_MIN,
  MSS,
  RTT_MAX,
  RTT_MIN,
} from './data';

const MAX_BYTES = DEFAULTS.segments * MSS;

type PktKind = 'syn' | 'synack' | 'ackhs' | 'data' | 'rxt' | 'ack' | 'dupack';
type Dir = 'lr' | 'rl';
type Tone = 'syn' | 'data' | 'ack' | 'warn' | 'good';
type ConnState = 'closed' | 'opening' | 'established';

interface WirePkt {
  id: number;
  kind: PktKind;
  label: string;
  dir: Dir;
  durMs: number;
  drop: boolean;
  seqStart?: number;
  seqEnd?: number;
  ackNum?: number;
}

interface LogEntry {
  id: number;
  text: string;
  tone: Tone;
}

interface StatsShape {
  cwnd: number;
  ssthresh: number;
  inflight: number;
  ackedBytes: number;
  rxts: number;
  dupAcks: number;
}

interface InflightRec {
  dups: number;
  rto: ReturnType<typeof setTimeout> | null;
}

function pktClass(kind: PktKind): string {
  switch (kind) {
    case 'syn':
    case 'synack':
    case 'ackhs':
      return 'border-sky-500 bg-sky-500 text-white';
    case 'data':
      return 'border-sky-400 bg-white text-sky-700 dark:bg-zinc-900 dark:text-sky-300';
    case 'rxt':
      return 'border-dashed border-rose-500 bg-white text-rose-700 dark:bg-zinc-900 dark:text-rose-300';
    case 'ack':
      return 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500/70 dark:bg-emerald-500/15 dark:text-emerald-300';
    case 'dupack':
      return 'border-rose-400 bg-transparent text-rose-600 dark:text-rose-300';
  }
}

const LOG_TONE_CLASS: Record<Tone, string> = {
  syn: 'border-sky-400 text-sky-800 dark:text-sky-300',
  data: 'border-zinc-400 text-zinc-700 dark:border-zinc-600 dark:text-zinc-200',
  ack: 'border-emerald-500 text-emerald-800 dark:text-emerald-300',
  warn: 'border-rose-500 text-rose-700 dark:text-rose-300',
  good: 'border-emerald-600 font-semibold text-emerald-800 dark:text-emerald-300',
};

function StatChip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={
        'rounded-lg border px-2.5 py-1.5 ' +
        (accent
          ? 'border-sky-400 bg-sky-500/10 text-sky-800 dark:text-sky-300'
          : 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300')
      }
    >
      <p className="text-[10px] uppercase tracking-wider opacity-70">{label}</p>
      <p className="font-mono text-sm font-bold">{value}</p>
    </div>
  );
}

function HostCard({
  side,
  role,
  state,
  Icon,
}: {
  side: 'l' | 'r';
  role: string;
  state: string;
  Icon: LucideIcon;
}) {
  const established = state === 'ESTABLISHED';
  return (
    <div className={'flex w-full flex-row items-center gap-3 md:w-auto ' + (side === 'r' ? 'md:flex-row-reverse' : '')}>
      <div
        className={
          'flex items-center gap-2 rounded-xl border px-3 py-2.5 shadow-sm transition-colors ' +
          (established
            ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10'
            : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900')
        }
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden />
        <div className="text-left">
          <p className="text-sm font-bold leading-tight">{role}</p>
          <p
            className={
              'font-mono text-[10px] font-semibold uppercase tracking-wider ' +
              (established ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400')
            }
          >
            {state}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TcpReliabilityLab() {
  const [conn, setConn] = useState<ConnState>('closed');
  const [sending, setSending] = useState(false);
  const [lossPct, setLossPct] = useState(DEFAULTS.lossPct);
  const [rttMs, setRttMs] = useState(DEFAULTS.rttMs);
  const [pkts, setPkts] = useState<WirePkt[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<StatsShape>({
    cwnd: 1,
    ssthresh: 8,
    inflight: 0,
    ackedBytes: 0,
    rxts: 0,
    dupAcks: 0,
  });

  const idRef = useRef(1);
  const sessionRef = useRef(0);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const lossRef = useRef(lossPct);
  const rttRef = useRef(rttMs);
  const pktMetaRef = useRef<Map<number, WirePkt>>(new Map());
  const simRef = useRef({
    nextByte: 1,
    lastAck: 0,
    serverExpected: 1,
    cwnd: 1,
    ssthresh: 8,
    rxts: 0,
    dupAcks: 0,
    dupStreak: 0,
    sending: false,
    inflight: new Map<number, InflightRec>(),
  });

  useEffect(() => {
    lossRef.current = lossPct;
  }, [lossPct]);
  useEffect(() => {
    rttRef.current = rttMs;
  }, [rttMs]);
  useEffect(() => {
    return () => {
      sessionRef.current++;
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
  };

  const after = (ms: number, fn: () => void) => {
    const mySession = sessionRef.current;
    const t = setTimeout(() => {
      timersRef.current.delete(t);
      if (sessionRef.current !== mySession) return;
      fn();
    }, ms);
    timersRef.current.add(t);
  };

  const pushLog = (text: string, tone: Tone) => {
    setLogs((prev) => [{ id: idRef.current++, text, tone }, ...prev].slice(0, 80));
  };

  const syncStats = () => {
    const s = simRef.current;
    setStats({
      cwnd: s.cwnd,
      ssthresh: s.ssthresh,
      inflight: s.inflight.size,
      ackedBytes: s.lastAck,
      rxts: s.rxts,
      dupAcks: s.dupAcks,
    });
  };

  const spawnPkt = (p: Omit<WirePkt, 'id'>) => {
    const pkt: WirePkt = { ...p, id: idRef.current++ };
    pktMetaRef.current.set(pkt.id, pkt);
    setPkts((prev) => [...prev, pkt]);
  };

  const removePkt = (id: number) => {
    pktMetaRef.current.delete(id);
    setPkts((prev) => prev.filter((x) => x.id !== id));
  };

  const transmitSegment = (seqStart: number, asRxt: boolean) => {
    const s = simRef.current;
    const rec: InflightRec = { dups: 0, rto: null };
    s.inflight.set(seqStart, rec);
    const mySession = sessionRef.current;
    const rto = rttRef.current * 2 + 400;
    const t = setTimeout(() => {
      timersRef.current.delete(t);
      if (sessionRef.current !== mySession) return;
      onRto(seqStart);
    }, rto);
    timersRef.current.add(t);
    rec.rto = t;
    spawnPkt({
      kind: asRxt ? 'rxt' : 'data',
      label: (asRxt ? '[RXT] ' : '[PSH,ACK] ') + 'seq ' + seqStart + '-' + (seqStart + MSS - 1),
      dir: 'lr',
      durMs: rttRef.current / 2,
      drop: Math.random() * 100 < lossRef.current,
      seqStart,
      seqEnd: seqStart + MSS - 1,
    });
    syncStats();
  };

  const onRto = (seqStart: number) => {
    const s = simRef.current;
    if (!s.inflight.has(seqStart)) return;
    const rec = s.inflight.get(seqStart);
    if (rec && rec.rto) {
      clearTimeout(rec.rto);
      timersRef.current.delete(rec.rto);
    }
    s.rxts += 1;
    s.ssthresh = Math.max(2, Math.floor(s.cwnd / 2));
    s.cwnd = 1;
    pushLog('[RTO] timeout waiting for ACK of seq ' + seqStart + ' - ssthresh=' + s.ssthresh + ', cwnd=1', 'warn');
    transmitSegment(seqStart, true);
  };

  const finishIfDone = () => {
    const s = simRef.current;
    if (s.nextByte > MAX_BYTES && s.inflight.size === 0 && s.sending) {
      s.sending = false;
      setSending(false);
      pushLog('stream complete - all ' + MAX_BYTES + ' bytes acknowledged', 'good');
    }
  };

  const pump = () => {
    const s = simRef.current;
    let guard = 0;
    while (s.sending && Math.floor(s.cwnd) > s.inflight.size && s.nextByte <= MAX_BYTES && guard < 64) {
      transmitSegment(s.nextByte, false);
      s.nextByte += MSS;
      guard++;
    }
    syncStats();
    finishIfDone();
  };

  const fastRetransmit = (seqStart: number) => {
    const s = simRef.current;
    const rec = s.inflight.get(seqStart);
    if (rec && rec.rto) {
      clearTimeout(rec.rto);
      timersRef.current.delete(rec.rto);
    }
    s.inflight.delete(seqStart);
    s.rxts += 1;
    s.ssthresh = Math.max(2, Math.floor(s.cwnd / 2));
    s.cwnd = s.ssthresh;
    pushLog('[FAST RXT] seq ' + seqStart + ' resent - ssthresh=' + s.ssthresh + ', cwnd=' + s.cwnd, 'warn');
    transmitSegment(seqStart, true);
  };

  const onDataArrive = (p: WirePkt) => {
    const s = simRef.current;
    if (p.seqStart === undefined || p.seqEnd === undefined) return;
    if (p.seqStart === s.serverExpected) {
      s.serverExpected = p.seqEnd + 1;
      pushLog('server received seq ' + p.seqStart + '-' + p.seqEnd + ' - sends [ACK] ack=' + s.serverExpected, 'data');
      spawnPkt({
        kind: 'ack',
        label: '[ACK] ack=' + s.serverExpected,
        dir: 'rl',
        durMs: rttRef.current / 2,
        drop: Math.random() * 100 < lossRef.current,
        ackNum: s.serverExpected,
      });
    } else {
      pushLog(
        'server gap! expected seq ' + s.serverExpected + ', got ' + p.seqStart + ' - fires [DUP ACK] ack=' + s.serverExpected,
        'warn'
      );
      spawnPkt({
        kind: 'dupack',
        label: '[DUP ACK] ack=' + s.serverExpected,
        dir: 'rl',
        durMs: rttRef.current / 2,
        drop: Math.random() * 100 < lossRef.current,
        ackNum: s.serverExpected,
      });
    }
  };

  const onAckArrive = (p: WirePkt) => {
    const s = simRef.current;
    const ack = p.ackNum;
    if (ack === undefined) return;
    if (ack > s.lastAck) {
      s.lastAck = ack;
      s.dupStreak = 0;
      for (const start of Array.from(s.inflight.keys())) {
        if (start + MSS <= ack) {
          const rec = s.inflight.get(start);
          if (rec && rec.rto) {
            clearTimeout(rec.rto);
            timersRef.current.delete(rec.rto);
          }
          s.inflight.delete(start);
        }
      }
      pushLog(
        'client got [ACK] ack=' + ack +
          (s.cwnd < s.ssthresh ? ' - slow start, cwnd+1' : ' - congestion avoidance, cwnd+1/cwnd'),
        'ack'
      );
      if (s.cwnd < s.ssthresh) {
        s.cwnd += 1;
      } else {
        s.cwnd += 1 / Math.max(1, s.cwnd);
      }
      pump();
    } else {
      s.dupStreak += 1;
      s.dupAcks += 1;
      pushLog('client got duplicate ack=' + ack + ' (streak x' + s.dupStreak + ')', 'warn');
      if (s.dupStreak >= 3) {
        let minKey: number | null = null;
        for (const k of s.inflight.keys()) {
          if (minKey === null || k < minKey) minKey = k;
        }
        s.dupStreak = 0;
        if (minKey !== null) fastRetransmit(minKey);
      }
    }
    syncStats();
  };

  const onPktEnd = (id: number) => {
    const p = pktMetaRef.current.get(id);
    removePkt(id);
    if (!p || p.drop) return;
    if (p.kind === 'data' || p.kind === 'rxt') {
      onDataArrive(p);
    } else if (p.kind === 'ack' || p.kind === 'dupack') {
      onAckArrive(p);
    }
  };

  const startHandshake = () => {
    if (conn !== 'closed') return;
    setConn('opening');
    pushLog('three-way handshake starts', 'syn');
    const leg = (stepIdx: number, attempt: number) => {
      const step = HANDSHAKE_STEPS[stepIdx];
      if (!step) return;
      const dropped = Math.random() * 100 < lossRef.current;
      const who = stepIdx === 1 ? 'server' : 'client';
      pushLog(who + ' sends [' + step.flags + '] ' + step.label, 'syn');
      spawnPkt({
        kind: stepIdx === 0 ? 'syn' : stepIdx === 1 ? 'synack' : 'ackhs',
        label: '[' + step.flags + '] ' + step.label,
        dir: stepIdx === 1 ? 'rl' : 'lr',
        durMs: rttRef.current / 2,
        drop: dropped,
      });
      after(rttRef.current / 2 + 40, () => {
        if (dropped) {
          pushLog(step.label + ' was lost on the wire - retransmitting', 'warn');
          if (attempt < 4) after(260, () => leg(stepIdx, attempt + 1));
          return;
        }
        if (stepIdx === 0) {
          pushLog('server enters SYN_RCVD - replies', 'syn');
          after(60, () => leg(1, 0));
        } else if (stepIdx === 1) {
          pushLog('client enters ESTABLISHED', 'good');
          after(60, () => leg(2, 0));
        } else {
          setConn('established');
          pushLog('server enters ESTABLISHED - connection ready', 'good');
        }
      });
    };
    leg(0, 0);
  };

  const startStream = () => {
    const s = simRef.current;
    if (conn !== 'established' || s.sending) return;
    if (s.nextByte > MAX_BYTES) {
      pushLog('every byte up to ' + MAX_BYTES + ' has already been delivered - hit Reset to run again', 'warn');
      return;
    }
    s.sending = true;
    setSending(true);
    pushLog('streaming ' + (MAX_BYTES - s.nextByte + 1) + ' remaining bytes, cwnd=' + s.cwnd, 'data');
    pump();
  };

  const stopStream = () => {
    const s = simRef.current;
    if (!s.sending) return;
    s.sending = false;
    setSending(false);
    pushLog('sender paused by user - in-flight segments still resolve', 'warn');
  };

  const resetAll = () => {
    sessionRef.current++;
    clearTimers();
    pktMetaRef.current.clear();
    simRef.current = {
      nextByte: 1,
      lastAck: 0,
      serverExpected: 1,
      cwnd: 1,
      ssthresh: 8,
      rxts: 0,
      dupAcks: 0,
      dupStreak: 0,
      sending: false,
      inflight: new Map<number, InflightRec>(),
    };
    setPkts([]);
    setLogs([]);
    setSending(false);
    setConn('closed');
    setStats({ cwnd: 1, ssthresh: 8, inflight: 0, ackedBytes: 0, rxts: 0, dupAcks: 0 });
  };

  const clientState = conn === 'closed' ? 'CLOSED' : conn === 'opening' ? 'SYN_SENT' : 'ESTABLISHED';
  const serverState = conn === 'closed' ? 'LISTEN' : conn === 'opening' ? 'SYN_RCVD' : 'ESTABLISHED';
  const cwndPct = Math.min(100, (stats.cwnd / CWND_METER_MAX) * 100);
  const threshPct = Math.min(100, (stats.ssthresh / CWND_METER_MAX) * 100);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <style>{'@keyframes tcp-go-lr{from{left:0;transform:translateY(-50%)}to{left:calc(100% - 72px);transform:translateY(-50%)}}' +
        '@keyframes tcp-go-rl{from{left:calc(100% - 72px);transform:translateY(-50%)}to{left:0;transform:translateY(-50%)}}' +
        '@keyframes tcp-drop-lr{0%{left:4%;opacity:1;transform:translateY(-50%)}45%{left:37%;opacity:1;transform:translateY(-50%)}100%{left:40%;opacity:0;transform:translateY(calc(-50% + 18px))}}' +
        '@keyframes tcp-drop-rl{0%{left:96%;opacity:1;transform:translateY(-50%)}55%{left:63%;opacity:1;transform:translateY(-50%)}100%{left:60%;opacity:0;transform:translateY(calc(-50% + 18px))}}'}</style>

      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
            Systems · Computer Networks Internals · TCP/IP
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Handshakes, Loss &amp; Congestion</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Open a TCP connection across a lossy wire, then watch sequence numbers, retransmissions,
            and the congestion window react to whatever you throw at them.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-5 py-7">
        {/* Controls */}
        <section aria-label="Controls" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startHandshake}
              disabled={conn !== 'closed'}
              className="inline-flex items-center gap-2 rounded-lg border border-sky-600 bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Cable className="h-4 w-4" aria-hidden />
              3-way handshake
            </button>
            <button
              type="button"
              onClick={sending ? stopStream : startStream}
              disabled={conn !== 'established'}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              {sending ? 'Pause stream' : 'Send data'}
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="loss-slider" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Packet loss: <span className="font-mono text-sky-600 dark:text-sky-400">{lossPct}%</span>
              </label>
              <input
                id="loss-slider"
                type="range"
                min={LOSS_MIN}
                max={LOSS_MAX}
                value={lossPct}
                onChange={(e) => setLossPct(Number(e.target.value))}
                className="mt-1 w-full accent-sky-500"
              />
            </div>
            <div>
              <label htmlFor="rtt-slider" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                RTT: <span className="font-mono text-sky-600 dark:text-sky-400">{rttMs} ms</span>
              </label>
              <input
                id="rtt-slider"
                type="range"
                min={RTT_MIN}
                max={RTT_MAX}
                step={20}
                value={rttMs}
                onChange={(e) => setRttMs(Number(e.target.value))}
                className="mt-1 w-full accent-sky-500"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            {/* Wire */}
            <section aria-label="The wire" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Activity className="h-4 w-4 text-sky-500" aria-hidden />
                The wire
              </h2>
              <div className="grid items-center gap-3 md:grid-cols-[auto_1fr_auto]">
                <HostCard side="l" role="Client" state={clientState} Icon={Cable} />
                <div className="relative h-24 overflow-visible">
                  <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-zinc-300 dark:border-zinc-700" />
                  {pkts.map((p) => (
                    <span
                      key={p.id}
                      onAnimationEnd={() => onPktEnd(p.id)}
                      style={{ animationDuration: p.durMs + 'ms' }}
                      className={
                        'absolute top-1/2 z-10 w-[72px] -translate-y-1/2 rounded-md border px-1 py-1 text-center font-mono text-[9px] font-bold leading-tight shadow-sm ' +
                        pktClass(p.kind) +
                        ' ' +
                        (p.drop ? (p.dir === 'lr' ? 'tcp-drop-lr' : 'tcp-drop-rl') : p.dir === 'lr' ? 'tcp-go-lr' : 'tcp-go-rl')
                      }
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
                <HostCard side="r" role="Server" state={serverState} Icon={Cable} />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-100 pt-3 text-[11px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                {FLAG_LEGEND.map((f) => (
                  <span key={f.flag}>
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{f.flag}</span> - {f.meaning}
                  </span>
                ))}
              </div>
            </section>

            {/* Congestion */}
            <section aria-label="Congestion control" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Gauge className="h-4 w-4 text-sky-500" aria-hidden />
                Congestion window
              </h2>
              <div className="relative h-3 rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-3 rounded-full bg-sky-500 transition-all duration-300"
                  style={{ width: cwndPct + '%' }}
                />
                <div
                  className="absolute -top-1 h-5 w-[2px] bg-rose-500"
                  style={{ left: threshPct + '%' }}
                  title={'ssthresh = ' + stats.ssthresh}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <StatChip label="cwnd (segs)" value={stats.cwnd.toFixed(1)} accent />
                <StatChip label="ssthresh" value={String(stats.ssthresh)} />
                <StatChip label="in flight" value={String(stats.inflight)} />
                <StatChip label="acked bytes" value={stats.ackedBytes + '/' + MAX_BYTES} />
                <StatChip label="retransmits" value={String(stats.rxts)} />
                <StatChip label="dup acks seen" value={String(stats.dupAcks)} />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {CONCEPTS.map((c) => (
                  <div key={c.title} className="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                    <p className="font-bold text-sky-700 dark:text-sky-300">{c.title}</p>
                    <p className="mt-0.5 leading-snug text-zinc-600 dark:text-zinc-300">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Packet log */}
          <section aria-label="Packet log" className="max-h-[640px] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-bold">Packet log</h2>
            <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">newest first - every segment with flags</p>
            <div aria-live="polite" className="mt-3 space-y-1.5">
              {logs.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Run the handshake, then send data - every segment lands here.
                </p>
              ) : (
                logs.map((entry) => (
                  <p
                    key={entry.id}
                    className={'border-l-2 pl-2 font-mono text-[11px] leading-snug ' + LOG_TONE_CLASS[entry.tone]}
                  >
                    {entry.text}
                  </p>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
