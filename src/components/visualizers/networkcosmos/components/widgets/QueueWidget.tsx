'use client';

import { useState } from 'react';
import { WidgetButton, WidgetPanel, WidgetSlider, WidgetStat, WidgetToggle, type WidgetProps } from './shared';

const CAPACITY = 8;

export function QueueWidget({ concept }: WidgetProps) {
  const isWifi = concept.slug.includes('wifi');

  const [arrivals, setArrivals] = useState(3);
  const [service, setService] = useState(2);
  const [efQueue, setEfQueue] = useState(0);
  const [beQueue, setBeQueue] = useState(0);
  const [drops, setDrops] = useState(0);
  const [ticks, setTicks] = useState(0);
  const [priority, setPriority] = useState(true);

  const [cw, setCw] = useState(16);
  const [slots, setSlots] = useState(0);
  const [collisions, setCollisions] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [hiddenNode, setHiddenNode] = useState(concept.defaultFault === 'loss');

  const runTick = (): void => {
    const efIn = efQueue + Math.ceil(arrivals / 3);
    const beIn = beQueue + Math.floor((arrivals * 2) / 3);
    const efServed = Math.min(efIn, priority ? service : Math.ceil(service / 2));
    const beServed = Math.min(beIn, priority ? service - efServed : Math.floor(service / 2));
    const keptEf = Math.min(efIn - efServed, CAPACITY);
    const keptBe = Math.min(beIn - beServed, CAPACITY - keptEf);
    setDrops((value) => value + (efIn - efServed - keptEf) + (beIn - beServed - keptBe));
    setEfQueue(keptEf);
    setBeQueue(keptBe);
    setTicks((value) => value + 1);
  };

  const runSlot = (): void => {
    const next = slots + 1;
    const collides = hiddenNode ? next % 3 === 0 : next % 11 === 0;
    if (collides) {
      setCollisions((value) => value + 1);
      setCw((value) => Math.min(1024, value * 2));
    } else {
      setSuccesses((value) => value + 1);
      setCw((value) => Math.max(8, Math.floor(value / 2)));
    }
    setSlots(next);
  };

  const reset = (): void => {
    setEfQueue(0);
    setBeQueue(0);
    setDrops(0);
    setTicks(0);
    setCw(16);
    setSlots(0);
    setCollisions(0);
    setSuccesses(0);
  };

  const depth = isWifi ? Math.min(CAPACITY, Math.ceil(cw / 128)) : efQueue + beQueue;
  const latency = isWifi ? Math.round(cw / 2) : Math.round((depth / Math.max(1, service)) * 10);

  return (
    <WidgetPanel
      title={isWifi ? 'Contention & backoff' : 'Queue & scheduler'}
      subtitle={isWifi
        ? 'Each slot the station senses the channel; a collision doubles the contention window.'
        : 'Packets arrive with DSCP marks; the scheduler decides which queue is served first.'}
      badge="Airtime / QoS"
    >
      <div role="group" aria-label={isWifi ? 'Contention window slots' : 'Queue occupancy'} className="flex flex-wrap gap-1.5">
        {Array.from({ length: CAPACITY }, (_, index) => (
          <span
            key={index}
            role="img"
            aria-label={`${isWifi ? 'Backoff' : 'Queue'} slot ${index + 1}: ${index < depth ? 'occupied' : 'empty'}`}
            className={`flex h-9 w-9 items-center justify-center rounded border font-mono text-xs font-bold ${
              index < depth
                ? 'border-amber-500 bg-amber-100 text-amber-950 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100'
                : 'border-slate-300 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <WidgetButton label={isWifi ? 'Run one contention slot' : 'Run one scheduling tick'} onClick={isWifi ? runSlot : runTick}>
          {isWifi ? 'Run slot →' : 'Run tick →'}
        </WidgetButton>
        <WidgetButton label="Reset the queue simulation" onClick={reset}>Reset ↺</WidgetButton>
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        {isWifi ? (
          <>
            <WidgetSlider label="Contention window" value={cw} min={8} max={1024} step={8} onChange={setCw} hint="Random backoff is drawn from 0…CW-1 slots" />
            <WidgetToggle label="Hidden node present" checked={hiddenNode} onChange={setHiddenNode} hint="Two stations cannot hear each other's transmissions" />
          </>
        ) : (
          <>
            <WidgetSlider label="Arrivals per tick" value={arrivals} min={1} max={8} onChange={setArrivals} />
            <WidgetSlider label="Service per tick" value={service} min={1} max={8} onChange={setService} />
            <WidgetToggle label="Strict priority for EF" checked={priority} onChange={setPriority} hint="Low-priority traffic starves during a burst" />
          </>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {isWifi ? (
          <>
            <WidgetStat label="Successful frames" value={String(successes)} tone="good" />
            <WidgetStat label="Collisions" value={String(collisions)} tone={collisions > 0 ? 'bad' : 'neutral'} />
            <WidgetStat label="Current CW" value={String(cw)} />
            <WidgetStat label="Avg backoff" value={`${latency} slots`} />
          </>
        ) : (
          <>
            <WidgetStat label="EF queue" value={String(efQueue)} />
            <WidgetStat label="BE queue" value={String(beQueue)} />
            <WidgetStat label="Dropped" value={String(drops)} tone={drops > 0 ? 'bad' : 'neutral'} />
            <WidgetStat label="Queueing delay" value={`${latency} ms`} tone={latency > 40 ? 'warn' : 'neutral'} />
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300" aria-live="polite">
        {isWifi
          ? hiddenNode
            ? 'A hidden node cannot sense the channel, so frames collide at the receiver and both stations back off.'
            : 'Stations defer and back off randomly; an ACK confirms each unicast frame.'
          : priority
            ? 'EF packets are served first. A sustained burst can starve best-effort traffic entirely.'
            : 'Fair sharing alternates between DSCP classes so neither queue is starved.'}
      </p>
    </WidgetPanel>
  );
}
