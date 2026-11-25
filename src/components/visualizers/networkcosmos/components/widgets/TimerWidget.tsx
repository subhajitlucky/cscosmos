'use client';

import { useState, type ReactNode } from 'react';
import { WidgetButton, WidgetPanel, WidgetSlider, WidgetStat, WidgetToggle, type WidgetProps } from './shared';

interface TimelineEvent {
  label: string;
  kind: 'send' | 'ack' | 'dup' | 'fast' | 'timeout';
}

const EVENTS: TimelineEvent[] = [
  { label: 'Send seq=1', kind: 'send' },
  { label: 'ACK 1 arrives (RTT sample)', kind: 'ack' },
  { label: 'Send seq=2', kind: 'send' },
  { label: 'Duplicate ACK for seq=2', kind: 'dup' },
  { label: 'Duplicate ACK #2', kind: 'dup' },
  { label: 'Duplicate ACK #3 → fast retransmit', kind: 'fast' },
  { label: 'Timeout → RTO doubles, window resets', kind: 'timeout' },
];

export function TimerWidget({ concept }: WidgetProps) {
  const slug = concept.slug;
  const isNtp = slug.includes('ntp-clock');
  const isTtl = slug.includes('routing-loops');
  const isLatency = slug.includes('latency-jitter');

  const [rttMs, setRttMs] = useState(80);
  const [rwnd, setRwnd] = useState(4);
  const [step, setStep] = useState(0);
  const [loss, setLoss] = useState(concept.defaultFault === 'loss');
  const [asymmetric, setAsymmetric] = useState(false);
  const [pathDelay, setPathDelay] = useState(40);
  const [ttl, setTtl] = useState(4);
  const [hop, setHop] = useState(0);
  const [jitter, setJitter] = useState(10);
  const [lossPct, setLossPct] = useState(2);

  const elapsed = EVENTS.slice(0, step);
  const dupAcks = elapsed.filter((event) => event.kind === 'dup' || event.kind === 'fast').length;
  const fastRetransmit = dupAcks >= 3;

  let srtt = rttMs;
  let rttvar = rttMs / 4;
  let rto = srtt + 4 * rttvar;
  for (const event of elapsed) {
    if (event.kind === 'ack') {
      srtt = (7 / 8) * srtt + (1 / 8) * rttMs;
      rttvar = (3 / 4) * rttvar + (1 / 4) * Math.abs(rttMs - srtt);
      rto = srtt + 4 * rttvar;
    }
    if (event.kind === 'timeout') rto *= 2;
  }
  rto = Math.max(200, Math.round(rto));

  const t1 = 0;
  const t2 = pathDelay + (asymmetric ? 30 : 0);
  const t3 = t2 + 5;
  const t4 = t3 + pathDelay;
  const offset = ((t2 - t1) + (t3 - t4)) / 2;
  const roundTripDelay = (t4 - t1) - (t3 - t2);
  const goodput = (100 - lossPct) * 9.2;

  let modeControl: ReactNode = null;
  let modeNote = 'A retransmission timer waits for RTO; three duplicate ACKs trigger fast retransmit sooner.';
  if (isNtp) {
    modeControl = (
      <>
        <WidgetSlider label="One-way delay" value={pathDelay} min={1} max={200} suffix=" ms" onChange={setPathDelay} />
        <WidgetToggle label="Asymmetric return path" checked={asymmetric} onChange={setAsymmetric} hint="Biases the four-timestamp offset estimate" />
      </>
    );
    modeNote = `t1=${t1}, t2=${t2}, t3=${t3}, t4=${t4} ms → offset ${offset.toFixed(1)} ms, delay ${roundTripDelay} ms.`;
  } else if (isTtl) {
    modeControl = (
      <>
        <WidgetSlider label="Initial TTL" value={ttl} min={1} max={8} onChange={setTtl} hint="Each router decrements it by one" />
        <WidgetButton label="Advance packet one hop" onClick={() => setHop((value) => value + 1)}>Next hop →</WidgetButton>
      </>
    );
    modeNote = hop >= ttl
      ? `Hop ${hop}: TTL reached zero; router discards the packet and sends ICMP Time Exceeded.`
      : `Hop ${hop}: packet still carries TTL ${ttl - hop} and continues toward D.`;
  } else if (isLatency) {
    modeControl = (
      <>
        <WidgetSlider label="Jitter" value={jitter} min={0} max={100} suffix=" ms" onChange={setJitter} />
        <WidgetSlider label="Loss" value={lossPct} min={0} max={30} suffix=" %" onChange={setLossPct} />
      </>
    );
    modeNote = `RTT ${rttMs} ms ± ${jitter} ms, ${lossPct}% loss → goodput ≈ ${goodput.toFixed(1)} Mbit/s.`;
  }

  const lastEvent = step > 0 ? EVENTS[step - 1] : null;
  const narration =
    lastEvent === null
      ? loss
        ? 'The gap is reported by repeated ACKs for the missing byte until the sender reacts.'
        : modeNote
      : lastEvent.kind === 'send'
        ? 'The segment is in flight and its retransmission timer is armed.'
        : lastEvent.kind === 'ack'
          ? 'The ACK arrived before the timer expired; SRTT and RTTVAR are updated from this RTT sample.'
          : lastEvent.kind === 'dup'
            ? `Duplicate ACK ${dupAcks}: later bytes arrived, but the receiver is still missing the earlier gap.`
            : lastEvent.kind === 'fast'
              ? 'Three duplicate ACKs imply a later segment arrived: retransmit now instead of waiting for RTO.'
              : `No ACK arrived before the RTO (${rto} ms): retransmit, double the timeout and reset the congestion window.`;

  return (
    <WidgetPanel
      title={isNtp ? 'NTP clock estimate' : isTtl ? 'TTL & loop bound' : isLatency ? 'Path measurements' : 'Timers & acknowledgments'}
      subtitle="Advance the event timeline to see RTT samples, duplicate ACKs and retransmission behavior."
      badge="Timing"
    >
      <div role="list" aria-label="Segment event timeline" className="space-y-1">
        {EVENTS.map((event, index) => {
          const status = index === step ? 'next' : index < step ? 'done' : 'pending';
          const tone =
            status === 'done'
              ? 'border-emerald-500 bg-emerald-100 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100'
              : status === 'next'
                ? 'border-sky-500 bg-sky-100 text-sky-950 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-50'
                : 'border-slate-300 bg-white text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400';
          return (
            <div key={event.label} role="listitem" aria-label={`${event.label}, ${status}`} className={`rounded-md border px-2 py-1 text-[11px] font-semibold ${tone}`}>
              {index + 1}. {event.label}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <WidgetButton label="Advance to the next timeline event" onClick={() => setStep((value) => Math.min(EVENTS.length, value + 1))} disabled={step >= EVENTS.length}>
          Advance event →
        </WidgetButton>
        <WidgetButton label="Reset the timeline" onClick={() => setStep(0)}>Reset ↺</WidgetButton>
        <WidgetToggle label="Segment is lost" checked={loss} onChange={setLoss} hint="Creates the gap that duplicate ACKs report" />
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        <WidgetSlider label="Measured RTT" value={rttMs} min={10} max={400} suffix=" ms" onChange={setRttMs} hint="SRTT is updated with exponential weighting" />
        <WidgetSlider label="Receiver window" value={rwnd} min={1} max={8} suffix=" segments" onChange={setRwnd} hint="Caps bytes in flight regardless of congestion window" />
        {modeControl}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WidgetStat label="Smoothed RTT" value={`${Math.round(srtt)} ms`} />
        <WidgetStat label="Retransmission timeout" value={`${rto} ms`} tone={rto > 500 ? 'warn' : 'neutral'} />
        <WidgetStat label="Duplicate ACKs" value={String(dupAcks)} tone={fastRetransmit ? 'good' : 'neutral'} />
        <WidgetStat label="Receive window" value={`${rwnd} seg`} />
      </div>
      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300" aria-live="polite">
        {narration}
      </p>
    </WidgetPanel>
  );
}
