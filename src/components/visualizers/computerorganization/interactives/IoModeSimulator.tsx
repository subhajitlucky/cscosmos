'use client';

import { useState, type ReactNode } from 'react';
import '../styles.css';

const MAX_TICKS = 24;
// Illustrative cycle counts, not hardware timings. The DMA total includes the
// CPU's setup and single completion interrupt, then divides over the whole block.
const POLL_COPY = 4;
const IRQ_SERVICE = 6;
const DMA_SETUP = 2;
const DMA_COMPLETE = 4;
const DMA_WORDS = 8;

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

interface LaneCost {
  total: number;
  words: number;
  perWord: number | null;
  detail: string;
}

function Lane({
  title,
  tagline,
  ready,
  cost,
  readout,
  children,
}: {
  title: string;
  tagline: string;
  ready: boolean;
  cost: LaneCost;
  readout: string;
  children: ReactNode;
}) {
  return (
    <section className={`co-iso-lane${ready ? ' co-iso-lane-ready' : ''}`}>
      <header className="co-iso-lane-head">
        <h3>{title}</h3>
        <span className={`co-iso-lamp${ready ? ' co-iso-lamp-on' : ''}`} aria-hidden="true" />
      </header>
      <p className="co-iso-tagline">{tagline}</p>
      <svg viewBox="0 0 420 118" className="co-iso-svg" role="img" aria-label={readout}>
        {children}
      </svg>
      <p className="co-iso-readout" aria-live="polite">{readout}</p>
      <div className="co-iso-cost">
        <span>CPU cycles / word · illustrative</span>
        <div
          className="co-iso-meter"
          role="img"
          aria-label={cost.perWord === null ? 'No word transferred yet' : `${cost.perWord} CPU cycles per word`}
        >
          <span
            className="co-iso-meter-fill"
            style={{ width: `${Math.min(100, ((cost.perWord ?? 0) / 20) * 100)}%` }}
          />
        </div>
        <strong className="co-num">{cost.perWord === null ? '—' : cost.perWord.toFixed(2)}</strong>
      </div>
      <p className="co-iso-cost-detail">
        {cost.words > 0
          ? `${cost.total} cycles ÷ ${plural(cost.words, 'word')} = ${cost.perWord?.toFixed(2)} cycles/word. `
          : `${plural(cost.total, 'cycle')} spent so far. `}
        {cost.detail}
      </p>
    </section>
  );
}

// Three ways of dealing with a slow device, running side by side. The ready
// toggle flips which path is lit; the tick button makes polling's waste visible.
export function IoModeSimulator() {
  const [ready, setReady] = useState(false);
  const [ticks, setTicks] = useState(0);

  const pollingTotal = ticks + (ready ? POLL_COPY : 0);
  const pollingCost: LaneCost = ready
    ? {
        total: pollingTotal,
        words: 1,
        perWord: pollingTotal,
        detail: `${POLL_COPY} cycles to read status, copy the word and loop (illustrative) + ${plural(ticks, 'wasted poll')}.`,
      }
    : {
        total: ticks,
        words: 0,
        perWord: null,
        detail: `${plural(ticks, 'cycle')} burned polling; no word transferred yet.`,
      };

  const interruptCost: LaneCost = ready
    ? {
        total: IRQ_SERVICE,
        words: 1,
        perWord: IRQ_SERVICE,
        detail: `${IRQ_SERVICE} cycles: save PC, vector, read and store one word, return (illustrative).`,
      }
    : {
        total: 0,
        words: 0,
        perWord: null,
        detail: 'No cycles spent waiting — the CPU does useful work until the IRQ arrives.',
      };

  const dmaTotal = DMA_SETUP + DMA_COMPLETE;
  const dmaCost: LaneCost = ready
    ? {
        total: dmaTotal,
        words: DMA_WORDS,
        perWord: dmaTotal / DMA_WORDS,
        detail: `${DMA_SETUP} setup + ${DMA_COMPLETE} completion-interrupt cycles = ${dmaTotal} for ${DMA_WORDS} words; the controller copies the block (illustrative).`,
      }
    : {
        total: 0,
        words: 0,
        perWord: null,
        detail: `Controller idle; CPU has not yet paid the ${DMA_SETUP} setup cycles.`,
      };

  const pollingReadout = ready
    ? `Poll ${ticks + 1}: status READY. CPU copies one word itself after ${plural(ticks, 'wasted poll')} (${pollingTotal} cycles total).`
    : `Poll ${ticks + 1}: status BUSY. ${plural(ticks, 'cycle')} burned so far; no word transferred.`;
  const interruptReadout = ready
    ? `IRQ: CPU saved PC, vectored to the handler, read one word and returned (${IRQ_SERVICE} cycles).`
    : 'Device is quiet. The CPU works until the IRQ arrives — no cycles spent waiting.';
  const dmaReadout = ready
    ? `CPU paid ${DMA_SETUP} setup + ${DMA_COMPLETE} completion cycles; controller moved ${DMA_WORDS} words without CPU copying (${(dmaTotal / DMA_WORDS).toFixed(2)} cycles/word).`
    : `Controller idle; CPU has not yet programmed source, length and destination (${DMA_SETUP} setup cycles).`;

  return (
    <div className="co-iso">
      <p className="co-muted mt-0 text-sm">
        A device is far slower than the processor. Compare the three strategies: turn the device ready and watch
        which route the CPU actually takes, then advance ticks to see polling burn cycles while it waits. Cycle
        counts below are illustrative averages, normalized to CPU cycles per word.
      </p>

      <div className="co-iso-controls co-card mt-3">
        <button
          type="button"
          className={`co-action${ready ? ' co-chip-active' : ''}`}
          aria-pressed={ready}
          onClick={() => setReady((current) => !current)}
        >
          Device ready: {ready ? 'yes' : 'no'}
        </button>
        <button
          type="button"
          className="co-action"
          onClick={() => setTicks((current) => Math.min(current + 1, MAX_TICKS))}
          disabled={ticks >= MAX_TICKS}
        >
          Advance CPU tick ({ticks})
        </button>
        <button
          type="button"
          className="co-action"
          onClick={() => {
            setReady(false);
            setTicks(0);
          }}
          disabled={!ready && ticks === 0}
        >
          Reset
        </button>
      </div>

      <div className="co-iso-lanes mt-3">
        <Lane title="Polling" tagline="CPU asks again and again" ready={ready} cost={pollingCost} readout={pollingReadout}>
          <rect className="co-iso-box" x="20" y="40" width="92" height="48" rx="8" />
          <text className="co-iso-text" x="66" y="69" textAnchor="middle">CPU</text>
          <text className="co-iso-sub" x="66" y="105" textAnchor="middle">poll loop</text>
          <rect className="co-iso-box" x="308" y="40" width="92" height="48" rx="8" />
          <text className="co-iso-text" x="354" y="66" textAnchor="middle">DEVICE</text>
          <text className="co-iso-sub" x="354" y="82" textAnchor="middle">{ready ? 'READY' : 'BUSY'}</text>
          <path className={`co-iso-wire${ready ? ' co-iso-wire-live' : ''}`} d="M 112 64 L 308 64" />
          <path className={`co-iso-loop${ready ? '' : ' co-iso-loop-live'}`} d="M 66 40 L 66 16 Q 66 10 74 10 L 202 10 Q 210 10 210 18 L 210 40" />
          <polygon className={ready ? 'co-iso-arrow-idle' : 'co-iso-arrow-live'} points="210,46 205,36 215,36" />
          <text className="co-iso-wire-label" x="138" y="27">poll again</text>
          <text className="co-iso-wire-label" x="210" y="58">status</text>
        </Lane>

        <Lane title="Interrupt" tagline="Device notifies the CPU" ready={ready} cost={interruptCost} readout={interruptReadout}>
          <rect className="co-iso-box" x="20" y="40" width="92" height="48" rx="8" />
          <text className="co-iso-text" x="66" y="66" textAnchor="middle">CPU</text>
          <text className="co-iso-sub" x="66" y="82" textAnchor="middle">{ready ? 'ISR' : 'useful work'}</text>
          <rect className="co-iso-box" x="308" y="40" width="92" height="48" rx="8" />
          <text className="co-iso-text" x="354" y="66" textAnchor="middle">DEVICE</text>
          <text className="co-iso-sub" x="354" y="82" textAnchor="middle">{ready ? 'IRQ raised' : 'waiting'}</text>
          <path className={`co-iso-wire${ready ? ' co-iso-wire-live' : ''}`} d="M 308 54 L 112 54" />
          <polygon className={ready ? 'co-iso-arrow-live' : 'co-iso-arrow-idle'} points="108,54 118,49 118,59" />
          <path className={`co-iso-irq${ready ? ' co-iso-irq-live' : ''}`} d="M 354 40 L 354 20 L 330 20" />
          <text className="co-iso-wire-label" x="382" y="24">IRQ</text>
          <text className="co-iso-sub" x="210" y="105" textAnchor="middle">save PC → handler → return</text>
        </Lane>

        <Lane title="DMA" tagline="Controller moves the block" ready={ready} cost={dmaCost} readout={dmaReadout}>
          <rect className="co-iso-box" x="12" y="14" width="80" height="36" rx="8" />
          <text className="co-iso-text" x="52" y="37" textAnchor="middle">CPU</text>
          <rect className="co-iso-box" x="12" y="72" width="80" height="36" rx="8" />
          <text className="co-iso-text" x="52" y="95" textAnchor="middle">DEVICE</text>
          <rect className={`co-iso-box${ready ? ' co-iso-box-active' : ''}`} x="166" y="43" width="88" height="40" rx="8" />
          <text className="co-iso-text" x="210" y="68" textAnchor="middle">DMA</text>
          <rect className="co-iso-box" x="326" y="43" width="82" height="40" rx="8" />
          <text className="co-iso-text" x="367" y="68" textAnchor="middle">MEMORY</text>
          <path className={`co-iso-wire${ready ? ' co-iso-wire-live' : ''}`} d="M 92 32 L 166 54" />
          <path className={`co-iso-wire${ready ? ' co-iso-wire-live' : ''}`} d="M 92 90 L 166 72" />
          <path className={`co-iso-wire co-iso-wire-thick${ready ? ' co-iso-wire-live' : ''}`} d="M 254 63 L 326 63" />
          <polygon className={ready ? 'co-iso-arrow-live' : 'co-iso-arrow-idle'} points="330,63 320,58 320,68" />
          <text className="co-iso-wire-label" x="290" y="52">8 words</text>
          <text className="co-iso-sub" x="210" y="112" textAnchor="middle">setup once, interrupt once</text>
        </Lane>
      </div>
      <p className="co-muted mt-2 text-xs">
        Polling is simple but spends cycles waiting. Interrupts free the CPU between events; DMA also removes the
        per-word copying.
      </p>
    </div>
  );
}
