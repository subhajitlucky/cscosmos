// Pure, deterministic packet-journey engine. One call to `advance` processes
// one hop of a scenario's base path. No React, no browser APIs, no timers at
// module scope, so this is safe to import during SSG.

import type { FaultKind } from '../data/concepts';
import { SCENARIOS, type HopSpec } from '../data/scenarios';
import type { Headers, JourneyState } from './types';

export type { Headers, JourneyEvent, JourneyState } from './types';

const INITIAL_TTL = 64;
const EPHEMERAL_PORT = 49152;
const BASE_RTT_MS = 20;
const RTT_SPREAD_MS = 40;
const DEFAULT_LOSS_PCT = 25;
const DEFAULT_CWND = 10; // in MSS
const DEFAULT_RWND = 64; // KiB, display-only
const DUP_ACK_THRESHOLD = 3;
const CLIENT_IP = '192.168.1.10';
const CLIENT_MAC = '00:11:22:33:44:55';
const GATEWAY_MAC = '66:77:88:99:aa:bb';
const SPOOFED_MAC = 'aa:bb:cc:dd:ee:ff';

const DESTINATIONS: Record<'dns' | 'http' | 'ping', { ip: string; port?: number; flags?: string }> = {
  dns: { ip: '192.0.2.53', port: 53 }, // UDP has no TCP flags
  http: { ip: '203.0.113.10', port: 443, flags: 'SYN' },
  ping: { ip: '8.8.8.8', flags: 'ICMP' },
};

// Deterministic default stream; callers can inject any () => number instead.
function makeLcg(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function hopsFor(scenarioId: 'dns' | 'http' | 'ping'): HopSpec[] {
  return SCENARIOS.find((scenario) => scenario.id === scenarioId)!.hops;
}

function firstHopIndex(hops: HopSpec[], layer: string, device: string, direction: 'out' | 'in'): number {
  return hops.findIndex((hop) => hop.layer === layer && hop.device === device && hop.direction === direction);
}

function firstServerOutIndex(hops: HopSpec[]): number {
  return hops.findIndex((hop) => hop.device === 'server' && hop.direction === 'out');
}

// The reply path reverses both L3 and L2 endpoints.
function reverseEndpoints(headers: Headers): Headers {
  return {
    ...headers,
    srcMac: headers.dstMac,
    dstMac: headers.srcMac,
    srcIp: headers.dstIp,
    dstIp: headers.srcIp,
    srcPort: headers.dstPort,
    dstPort: headers.srcPort,
  };
}

// TCP flags change with the phase of the journey; UDP has none and ICMP has
// no TCP flags, so those scenarios use undefined / a protocol label instead.
function flagsForHop(scenarioId: 'dns' | 'http' | 'ping', hop: HopSpec, current?: string): string | undefined {
  if (scenarioId === 'ping') return 'ICMP';
  if (scenarioId !== 'http') return undefined;
  if (hop.device === 'client' && hop.direction === 'in' && current === 'SYN,ACK') return 'ACK';
  if (hop.layer === 'Application' && current !== 'SYN') return 'PSH,ACK';
  if (hop.device === 'server' && hop.direction === 'out') return 'SYN,ACK';
  return current ?? 'SYN';
}

function ipv4ToInt(ip: string): number {
  const octets = ip.split('.');
  if (octets.length !== 4) return 0;
  let value = 0;
  for (const octet of octets) {
    const n = Number(octet);
    if (!Number.isInteger(n) || n < 0 || n > 255) return 0;
    value = (value * 256 + n) >>> 0;
  }
  return value >>> 0;
}

export function pickRoute(destIp: string, table: { prefix: string; nextHop: string }[]): string {
  const destination = ipv4ToInt(destIp);
  let bestLength = -1;
  let bestNextHop = 'drop';
  for (const route of table) {
    const [base, lengthText] = route.prefix.split('/');
    const length = Number(lengthText);
    if (!Number.isInteger(length) || length < 0 || length > 32) continue;
    const mask = length === 0 ? 0 : (0xffff_ffff << (32 - length)) >>> 0;
    const network = ipv4ToInt(base);
    if (((destination & mask) >>> 0) === ((network & mask) >>> 0) && length > bestLength) {
      bestLength = length;
      bestNextHop = route.nextHop;
    }
  }
  return bestNextHop;
}

export function createJourney(
  scenarioId: 'dns' | 'http' | 'ping',
  fault: FaultKind,
  opts?: { rng?: () => number; rttMs?: number; lossPct?: number },
): JourneyState {
  const rng = opts?.rng ?? makeLcg(0x9e37_79b9);
  const destination = DESTINATIONS[scenarioId];
  const headers: Headers = {
    srcMac: CLIENT_MAC,
    dstMac: GATEWAY_MAC,
    srcIp: CLIENT_IP,
    dstIp: destination.ip,
    ipTtl: INITIAL_TTL,
    srcPort: destination.port === undefined ? undefined : EPHEMERAL_PORT,
    dstPort: destination.port,
    seq: scenarioId === 'http' ? 0 : undefined,
    ack: scenarioId === 'http' ? 0 : undefined,
    flags: destination.flags,
    checksumOk: true,
  };
  return {
    scenarioId,
    fault,
    cursor: 0,
    events: [],
    headers,
    retransmits: 0,
    dupAcks: 0,
    rttMs: opts?.rttMs ?? Math.round(BASE_RTT_MS + RTT_SPREAD_MS * rng()),
    lossPct: opts?.lossPct ?? (fault === 'loss' ? DEFAULT_LOSS_PCT : 0),
    cwnd: DEFAULT_CWND,
    rwnd: DEFAULT_RWND,
    done: false,
    rng,
  };
}

export function advance(state: JourneyState): JourneyState {
  const hops = hopsFor(state.scenarioId);
  if (state.done) return state;
  if (state.cursor >= hops.length) return { ...state, done: true };

  const hop = hops[state.cursor];
  const events = [...state.events];
  let nextPacketId = events.length + 1;
  // Virtual clock resumes where the previous event left off: rttMs / 2 per event.
  let nextTimeMs = (nextPacketId * state.rttMs) / 2;
  let headers: Headers = { ...state.headers, flags: flagsForHop(state.scenarioId, hop, state.headers.flags) };
  let retransmits = state.retransmits;
  let dupAcks = state.dupAcks;
  let cwnd = state.cwnd;
  const cursor = state.cursor + 1;

  const emit = (
    note: string,
    snapshot: Headers = headers,
    layer: string = hop.layer,
    device: string = hop.device,
    direction: 'out' | 'in' = hop.direction,
  ): void => {
    events.push({
      time: nextTimeMs,
      layer,
      device,
      direction,
      headers: { ...snapshot },
      note,
      packetId: nextPacketId,
    });
    nextPacketId += 1;
    nextTimeMs += state.rttMs / 2;
  };

  const commit = (nextCursor: number, nextDone: boolean): JourneyState => ({
    ...state,
    cursor: nextCursor,
    events,
    headers,
    retransmits,
    dupAcks,
    cwnd,
    done: nextDone,
  });

  // The first outbound hop from the server is the reply: reverse the endpoints.
  if (hop.device === 'server' && hop.direction === 'out' && headers.srcIp === CLIENT_IP) {
    headers = reverseEndpoints(headers);
  }

  // Every inbound router traversal forwards an IP packet, so TTL drops each
  // time - including the return path and each repeated pass in a routing loop.
  const routerIn = hop.device === 'router' && hop.direction === 'in';
  const firstRouterInIndex = firstHopIndex(hops, 'Network', 'router', 'in');
  if (routerIn && headers.ipTtl !== undefined) {
    headers = { ...headers, ipTtl: headers.ipTtl - 1 };
  }

  if (state.fault === 'loop' && routerIn) {
    if ((headers.ipTtl ?? 0) <= 0) {
      emit(
        'TTL expired at the router: packet discarded and ICMP Time Exceeded (type 11) returned to the source',
        headers,
        'Network',
        'router',
        'in',
      );
      return commit(firstRouterInIndex, true);
    }
    emit(`Routing loop: packet forwarded back to the router, TTL now ${headers.ipTtl}`, headers);
    return commit(firstRouterInIndex, false);
  }

  if (state.fault === 'arpSpoof' && state.cursor === firstHopIndex(hops, 'Link', 'client', 'out')) {
    headers = { ...headers, dstMac: SPOOFED_MAC };
    emit(
      `ARP cache poisoned: frame delivered to the wrong MAC ${SPOOFED_MAC} instead of the gateway ${GATEWAY_MAC}`,
      headers,
      'Link',
      'client',
      'out',
    );
    return commit(cursor, true);
  }

  if (state.fault === 'mtu' && routerIn) {
    emit(hop.note);
    emit(
      'Packet exceeds the link MTU: IPv4 fragmentation would split it into smaller fragments',
      headers,
      'Network',
      'router',
      'in',
    );
    emit(
      'DF bit set: router drops the packet and sends ICMP fragmentation-needed (type 3, code 4) to the source',
      headers,
      'Network',
      'router',
      'in',
    );
    return commit(cursor, true);
  }

  emit(hop.note);

  // Loss is injected at the first server reply, after the request arrived.
  if (state.fault === 'loss' && state.cursor === firstServerOutIndex(hops)) {
    if (state.scenarioId === 'http') {
      // TCP only: UDP (DNS) and ICMP (ping) have no ACKs or congestion window.
      for (let i = 1; i <= DUP_ACK_THRESHOLD; i += 1) {
        dupAcks += 1;
        emit(
          `DUP ACK ${i}/${DUP_ACK_THRESHOLD}: server re-acknowledges the last in-order byte, suspecting a lost segment`,
          { ...headers, flags: 'DUP ACK' },
          'Transport',
          'server',
          'out',
        );
      }
      cwnd = Math.max(1, Math.floor(cwnd / 2));
      retransmits += 1;
      emit(
        `Retransmit: client resends the missing segment after three duplicate acknowledgements, congestion window halved to ${cwnd} MSS`,
        { ...reverseEndpoints(headers), flags: 'PSH,ACK' },
        'Transport',
        'client',
        'out',
      );
    } else {
      emit(
        state.scenarioId === 'dns'
          ? 'DNS query timed out: no answer arrived over UDP, so the stub resolver retries the recursive query'
          : 'ICMP echo request timed out: no echo reply arrived, so ping sends a new probe',
        reverseEndpoints(headers),
        state.scenarioId === 'dns' ? 'Application' : 'Network',
        'client',
        'out',
      );
    }
  }

  return commit(cursor, cursor >= hops.length);
}
