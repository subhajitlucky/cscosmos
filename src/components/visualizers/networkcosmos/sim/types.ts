// Shared types for the pure packet-journey simulator.
// No browser APIs or timers: this module is safe to import during SSG.

import type { FaultKind } from '../data/concepts';

export interface Headers {
  srcMac: string;
  dstMac: string;
  srcIp: string;
  dstIp: string;
  ipTtl?: number;
  srcPort?: number;
  dstPort?: number;
  seq?: number;
  ack?: number;
  flags?: string;
  checksumOk: boolean;
}

export interface JourneyEvent {
  /** Cumulative virtual timestamp in ms: each event advances the clock by rttMs / 2. */
  time: number;
  layer: string;
  device: string;
  direction: 'out' | 'in';
  headers: Headers;
  note: string;
  /** Independent per-event sequence counter, distinct from the ms timestamp. */
  packetId: number;
}

export interface JourneyState {
  scenarioId: 'dns' | 'http' | 'ping';
  fault: FaultKind;
  cursor: number;
  events: JourneyEvent[];
  headers: Headers;
  retransmits: number;
  dupAcks: number;
  /** Round-trip time in ms; advance reads it to advance each event's virtual clock. */
  rttMs: number;
  /** Display-only loss rate for the lab UI; fault injection itself is deterministic. */
  lossPct: number;
  cwnd: number;
  /** Display-only receive window (KiB) for the lab UI. */
  rwnd: number;
  done: boolean;
  /** Injected stream consumed by createJourney for the default RTT; advance stays pure. */
  rng: () => number;
}
