'use client';

// The lab is a packet journey, not a generic playground: choose a real trace,
// inject one fault, then step (or play) the packet through every device and
// inspect the header bytes that changed at each stop.

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import type { FaultKind } from '../data/concepts';
import { getConcept } from '../data/concepts';
import { SCENARIOS, type Scenario } from '../data/scenarios';
import { advance, createJourney, type JourneyState } from '../sim/engine';
import { FaultInjector } from '../components/FaultInjector';
import { HeaderInspector } from '../components/HeaderInspector';
import { HopMap } from '../components/HopMap';
import { JourneyMap } from '../components/JourneyMap';
import { LayerStation } from '../components/LayerStation';
import { PacketLog } from '../components/PacketLog';
import { StepControls } from '../components/StepControls';
import type { SimLayer } from '../components/layers';

export interface NetworkLabProps {
  basePath?: string;
}

const STEP_INTERVAL_MS = 700;

export function NetworkLab({
  basePath = '/corecs/computer-networks-internals-tcpip',
}: NetworkLabProps) {
  const searchParams = useSearchParams();
  const conceptSlug = searchParams.get('concept') ?? '';
  const linkedConcept = conceptSlug ? getConcept(conceptSlug) : undefined;
  const linkedFault: FaultKind = linkedConcept?.defaultFault ?? 'none';

  const scenarioGroupId = useId();
  const [scenarioId, setScenarioId] = useState<Scenario['id']>('dns');
  const [manualFault, setManualFault] = useState<FaultKind | null>(null);
  const fault = manualFault ?? linkedFault;
  const [journey, setJourney] = useState<JourneyState>(() => createJourney('dns', linkedFault));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(false);

  // A new ?concept= selection replaces a manually injected fault with that
  // concept's default fault. Nothing touches the browser during render or at
  // module scope.
  useEffect(() => {
    setManualFault(null);
  }, [linkedFault]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(query.matches);
    const handleChange = (event: MediaQueryListEvent): void => setReduceMotion(event.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) setPlaying(false);
  }, [reduceMotion]);

  // Changing the scenario or the injected fault starts a clean trace.
  useEffect(() => {
    setJourney(createJourney(scenarioId, fault));
    setPlaying(false);
  }, [scenarioId, fault]);

  // One timeout per emitted event; key on the monotonically increasing event
  // count because a routing loop rewinds `cursor` without ending the journey.
  // Cleanup guarantees no timer survives a reset, speed change, pause or unmount.
  useEffect(() => {
    if (!playing || journey.done || reduceMotion) return;
    const timer = window.setTimeout(() => {
      setJourney((current) => advance(current));
    }, STEP_INTERVAL_MS / speed);
    return () => window.clearTimeout(timer);
  }, [playing, journey.done, journey.events.length, speed, reduceMotion]);

  const events = journey.events;
  const activeEvent = events.length > 0 ? events[events.length - 1] : undefined;
  const previousEvent = events.length > 1 ? events[events.length - 2] : undefined;
  const activeLayer = activeEvent?.layer as SimLayer | undefined;
  const activeIndex = events.length - 1;
  const scenario = SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0];

  const restart = (): void => {
    setPlaying(false);
    setJourney(createJourney(scenarioId, fault));
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-800 hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:hover:text-sky-200 dark:focus-visible:outline-sky-400"
        >
          <span aria-hidden="true">←</span> Back to the packet journey
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Packet journey lab
        </h1>
        <p className="max-w-3xl leading-relaxed text-slate-700 dark:text-slate-200">
          Follow {scenario.title.toLowerCase()} across client, switch, router and server. Choose a
          fault to see where the normal path breaks, then step through one hop at a time and watch
          the header inspector update.
        </p>
        {linkedConcept && linkedFault !== 'none' && (
          <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-900 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100">
            Fault preselected from concept: {linkedConcept.title} ({linkedFault})
          </p>
        )}
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <fieldset className="rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <legend className="px-1 text-sm font-bold text-slate-900 dark:text-slate-100">
            Choose a journey
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {SCENARIOS.map((item) => (
              <div key={item.id}>
                <input
                  type="radio"
                  id={`${scenarioGroupId}-${item.id}`}
                  name={scenarioGroupId}
                  value={item.id}
                  checked={scenarioId === item.id}
                  onChange={() => setScenarioId(item.id)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`${scenarioGroupId}-${item.id}`}
                  className="block h-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800 transition-colors motion-reduce:transition-none peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-600 peer-checked:border-sky-500 peer-checked:bg-sky-100 peer-checked:text-sky-950 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:peer-focus-visible:outline-sky-400 dark:peer-checked:border-sky-400 dark:peer-checked:bg-sky-950 dark:peer-checked:text-sky-50"
                >
                  {item.title}
                </label>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {scenario.description}
          </p>
        </fieldset>

        <div className="rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <FaultInjector value={fault} onChange={setManualFault} />
          <StepControls
            playing={playing}
            onToggle={() => {
              if (reduceMotion) return;
              if (journey.done) {
                setJourney(createJourney(scenarioId, fault));
                setPlaying(!reduceMotion);
                return;
              }
              setPlaying((current) => !current);
            }}
            onStep={() => {
              setPlaying(false);
              setJourney((current) => advance(current));
            }}
            onReset={restart}
            speed={speed}
            onSpeedChange={setSpeed}
          />
          {reduceMotion && (
            <p role="status" className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Reduced motion is enabled, so automatic playback is off. Use Step to advance one hop
              at a time.
            </p>
          )}
          <p role="status" className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {journey.done
              ? 'Journey complete — reset or press Play to run it again.'
              : events.length === 0
                ? `Ready — hop 0 of ${scenario.hops.length}. Press Play or Step to begin.`
                : `Hop ${Math.min(journey.cursor + 1, scenario.hops.length)} of ${scenario.hops.length}`}
          </p>
        </div>
      </div>

      <section aria-label="Path meters" className="rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-1 text-sm font-bold text-slate-900 dark:text-slate-100">Path meters</h2>
        <p className="mb-3 text-xs text-slate-600 dark:text-slate-300">
          RTT, loss and rwnd are seeded display values. cwnd and retransmits update as the journey
          advances.
        </p>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[
            { label: 'RTT (configured)', value: `${journey.rttMs} ms`, tone: 'text-slate-900 dark:text-slate-100' },
            { label: 'Loss (configured)', value: `${journey.lossPct}%`, tone: journey.lossPct > 0 ? 'text-amber-800 dark:text-amber-300' : 'text-slate-900 dark:text-slate-100' },
            { label: 'cwnd (live)', value: `${journey.cwnd} MSS`, tone: 'text-slate-900 dark:text-slate-100' },
            { label: 'rwnd (display)', value: `${journey.rwnd} KiB`, tone: 'text-slate-900 dark:text-slate-100' },
            { label: 'Retransmits', value: String(journey.retransmits), tone: journey.retransmits > 0 ? 'text-rose-800 dark:text-rose-300' : 'text-slate-900 dark:text-slate-100' },
          ].map((meter) => (
            <div key={meter.label} className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                {meter.label}
              </dt>
              <dd className={`font-mono text-lg font-bold ${meter.tone}`}>{meter.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <JourneyMap activeLayer={activeLayer} />
          <section aria-label="Current station" className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">Current station</h2>
            <LayerStation
              layer={activeEvent?.layer ?? 'Application'}
              active={Boolean(activeEvent)}
              note={activeEvent?.note}
            >
              {activeEvent && (
                <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {activeEvent.device} · {activeEvent.direction === 'out' ? 'outbound' : 'inbound'} · #
                  {activeEvent.packetId}
                </p>
              )}
            </LayerStation>
          </section>
        </div>
        <div className="space-y-4">
          <HopMap events={events} activeIndex={activeIndex} />
          <HeaderInspector event={activeEvent} previous={previousEvent} />
        </div>
      </div>

      <PacketLog events={events} activeId={activeEvent?.packetId} />
    </div>
  );
}
