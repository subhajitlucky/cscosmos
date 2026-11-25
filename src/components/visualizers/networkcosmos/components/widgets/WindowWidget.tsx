'use client';

import { useState } from 'react';
import { WidgetButton, WidgetPanel, WidgetSlider, WidgetStat, type WidgetProps } from './shared';

const SLOTS = Array.from({ length: 12 }, (_, index) => index);
const SEGMENT_BYTES = 1460;

export function WindowWidget({ concept }: WidgetProps) {
  const isCongestion = concept.slug.includes('slow-start');
  const isFlowControl = concept.slug.includes('tcp-flow-control');

  const [windowSize, setWindowSize] = useState(isFlowControl ? 4 : 3);
  const [acked, setAcked] = useState(0);
  const [lost, setLost] = useState<number[]>(concept.defaultFault === 'loss' ? [2] : []);
  const [rttMs, setRttMs] = useState(40);
  const [rwnd, setRwnd] = useState(6);
  const [cwnd, setCwnd] = useState(1);
  const [ssthresh, setSsthresh] = useState(8);
  const [growth, setGrowth] = useState<number[]>([1]);
  const [rounds, setRounds] = useState(0);

  const effectiveWindow = isCongestion ? Math.min(cwnd, rwnd) : windowSize;
  const throughputMbps = (effectiveWindow * SEGMENT_BYTES * 8) / (rttMs / 1000) / 1_000_000;
  const blocked = lost.includes(acked);
  const firstInFlight = acked;

  const ackOne = (): void => {
    if (!blocked && acked < SLOTS.length) setAcked((value) => value + 1);
  };
  const ackRound = (): void => {
    const next = cwnd < ssthresh ? cwnd * 2 : cwnd + 1;
    setCwnd(next);
    setGrowth((values) => [...values, next]);
    setRounds((value) => value + 1);
  };
  const lossEvent = (): void => {
    setSsthresh(Math.max(2, Math.floor(cwnd / 2)));
    setCwnd(1);
    setGrowth((values) => [...values, 1]);
    setRounds((value) => value + 1);
  };

  return (
    <WidgetPanel
      title={isCongestion ? 'Congestion window growth' : 'Sliding window lab'}
      subtitle="ACKs slide the window forward; a lost segment blocks cumulative acknowledgment."
      badge="Transport"
    >
      <div role="group" aria-label="Sequence number space" className="flex flex-wrap gap-1.5">
        {SLOTS.map((slot) => {
          const state = slot < acked
            ? 'acked'
            : lost.includes(slot)
              ? 'lost'
              : slot < acked + effectiveWindow
                ? 'in flight'
                : 'unsent';
          const tone =
            state === 'acked'
              ? 'border-emerald-500 bg-emerald-100 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100'
              : state === 'lost'
                ? 'border-rose-500 bg-rose-100 text-rose-950 dark:border-rose-500 dark:bg-rose-950 dark:text-rose-100'
                : state === 'in flight'
                  ? 'border-sky-500 bg-sky-100 text-sky-950 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-50'
                  : 'border-slate-300 bg-white text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400';
          return (
            <span
              key={slot}
              role="img"
              aria-label={`Sequence ${slot + 1}: ${state}`}
              title={`Sequence ${slot + 1}: ${state}`}
              className={`flex h-9 w-9 items-center justify-center rounded border font-mono text-xs font-bold ${tone}`}
            >
              {slot + 1}
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <WidgetButton label="Acknowledge the next segment" onClick={ackOne} disabled={blocked || acked >= SLOTS.length}>
          ACK next →
        </WidgetButton>
        <WidgetButton
          label="Mark the next in-flight segment as lost"
          pressed={blocked}
          onClick={() =>
            setLost((current) =>
              current.includes(firstInFlight)
                ? current.filter((value) => value !== firstInFlight)
                : [...current, firstInFlight],
            )
          }
          disabled={firstInFlight >= SLOTS.length}
        >
          Toggle loss
        </WidgetButton>
        {isCongestion && (
          <>
            <WidgetButton label="Advance one RTT of ACKs" onClick={ackRound}>ACK one RTT</WidgetButton>
            <WidgetButton label="Simulate a loss event" onClick={lossEvent}>Loss event</WidgetButton>
          </>
        )}
        <WidgetButton
          label="Reset window simulation"
          onClick={() => {
            setAcked(0);
            setLost([]);
            setCwnd(1);
            setGrowth([1]);
            setRounds(0);
            setSsthresh(8);
          }}
        >
          Reset ↺
        </WidgetButton>
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        {!isCongestion && (
          <WidgetSlider
            label={isFlowControl ? 'Receiver window (rwnd)' : 'Sender window'}
            value={windowSize}
            min={0}
            max={6}
            suffix=" segments"
            onChange={setWindowSize}
            hint={isFlowControl && windowSize === 0 ? 'Zero window: sender must probe with a persist timer' : 'Unacknowledged bytes allowed in flight'}
          />
        )}
        {isCongestion && (
          <WidgetSlider
            label="Receiver window cap (rwnd)"
            value={rwnd}
            min={1}
            max={12}
            suffix=" segments"
            onChange={setRwnd}
            hint={`Effective window = min(cwnd ${cwnd}, rwnd ${rwnd})`}
          />
        )}
        <WidgetSlider
          label="Path RTT"
          value={rttMs}
          min={5}
          max={400}
          suffix=" ms"
          onChange={setRttMs}
          hint="Throughput ≈ window / RTT"
        />
      </div>

      {isCongestion && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            cwnd per RTT (ssthresh = {ssthresh})
          </p>
          <div role="img" aria-label={`Congestion window growth: ${growth.join(', ')} segments over ${rounds} rounds`} className="flex h-16 items-end gap-1 rounded-md border border-slate-300 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/60">
            {growth.slice(-10).map((value, index) => (
              <span
                key={`${index}-${value}`}
                className="min-w-3 flex-1 rounded-t bg-sky-600 dark:bg-sky-400"
                style={{ height: `${Math.max(4, Math.min(100, value * 12))}%` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WidgetStat label="Acknowledged" value={`${acked} / ${SLOTS.length}`} />
        <WidgetStat label="In flight" value={String(effectiveWindow)} />
        <WidgetStat label="Estimated goodput" value={`${throughputMbps.toFixed(2)} Mbit/s`} />
        <WidgetStat label="Window status" value={blocked ? 'Blocked by gap' : effectiveWindow === 0 ? 'Zero window' : 'Advancing'} tone={blocked || effectiveWindow === 0 ? 'bad' : 'good'} />
      </div>
      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300" aria-live="polite">
        {blocked
          ? `Segment ${acked + 1} was lost, so later ACKs can only repeat ${acked}: this is head-of-line blocking.`
          : isCongestion
            ? 'Slow start doubles cwnd each RTT until ssthresh, then congestion avoidance adds one segment per RTT.'
            : 'Each cumulative ACK frees buffer space and slides the window one segment to the right.'}
      </p>
    </WidgetPanel>
  );
}
