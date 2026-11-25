import { describe, expect, it } from 'vitest';
import { createJourney, advance, pickRoute, type JourneyState } from './engine';
import type { FaultKind } from '../data/concepts';

const start = (fault: FaultKind = 'none'): JourneyState => createJourney('http', fault);
const run = (state: JourneyState, limit = 80): JourneyState => {
  let s = state;
  while (!s.done && s.events.length < limit) s = advance(s);
  return s;
};

describe('packet journey engine', () => {
  it('decrements TTL at every router hop', () => {
    const ttls: number[] = [];
    let s = start();
    while (!s.done && s.events.length < 60) { s = advance(s); const ttl = s.headers.ipTtl; if (ttl !== undefined) ttls.push(ttl); }
    expect(ttls[0]).toBe(64);
    expect(Math.min(...ttls)).toBeLessThan(64);

    // Ping traverses a router on the outbound and again on the return path.
    const ping = run(createJourney('ping', 'none'), 60);
    const routerTtls = ping.events
      .filter((e) => e.device === 'router' && e.direction === 'in' && e.headers.ipTtl !== undefined)
      .map((e) => e.headers.ipTtl as number);
    expect(routerTtls.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < routerTtls.length; i += 1) {
      expect(routerTtls[i]).toBe(routerTtls[i - 1] - 1);
    }
  });

  it('picks the longest prefix match from a forwarding table', () => {
    const table = [
      { prefix: '0.0.0.0/0', nextHop: 'r1' },
      { prefix: '192.168.0.0/16', nextHop: 'r2' },
      { prefix: '192.168.20.0/24', nextHop: 'r3' },
    ];
    expect(pickRoute('192.168.20.7', table)).toBe('r3');
    expect(pickRoute('8.8.8.8', table)).toBe('r1'); // /0 default route
    expect(pickRoute('192.168.20.7', [{ prefix: '192.168.20.7/32', nextHop: 'host' }])).toBe('host');
    expect(pickRoute('192.168.20.7', [{ prefix: '10.0.0.0/8', nextHop: 'r9' }])).toBe('drop'); // no match
    expect(pickRoute('192.168.20.7', [{ prefix: '192.168.20.0/33', nextHop: 'bad' }])).toBe('drop'); // malformed
    expect(pickRoute('192.168.20.7', [{ prefix: 'garbage', nextHop: 'bad' }, ...table])).toBe('r3');
  });

  it('loss produces duplicate ACKs then a retransmit', () => {
    let s = start('loss');
    while (!s.done && s.events.length < 80) s = advance(s);
    expect(s.events.some((e) => e.note.includes('DUP ACK'))).toBe(true);
    expect(s.retransmits).toBeGreaterThan(0);

    expect(s.dupAcks).toBe(3);
    expect(s.retransmits).toBe(1);
    expect(s.cwnd).toBe(5); // 10 -> 5 after three duplicate ACKs
    const dups = s.events.filter((e) => e.note.includes('DUP ACK'));
    expect(dups).toHaveLength(3);
    for (const e of dups) {
      expect(e.device).toBe('server');
      expect(e.direction).toBe('out');
      expect(e.headers.flags).toBe('DUP ACK');
      expect(e.headers.srcIp).toBe('203.0.113.10');
      expect(e.headers.dstIp).toBe('192.168.1.10');
      expect(e.headers.srcPort).toBe(443);
      expect(e.headers.dstPort).toBe(49152);
    }
    const retransmit = s.events.find((e) => e.note.includes('Retransmit'));
    expect(retransmit).toBeDefined();
    expect(s.events.indexOf(retransmit!)).toBe(s.events.indexOf(dups[2]) + 1);
    expect(retransmit!.device).toBe('client');
    expect(retransmit!.direction).toBe('out');
    expect(retransmit!.headers.srcIp).toBe('192.168.1.10');
    expect(retransmit!.headers.dstIp).toBe('203.0.113.10');
  });

  it('arpSpoof misdelivers the frame to the wrong MAC', () => {
    let s = start('arpSpoof');
    while (!s.done && s.events.length < 80) s = advance(s);
    expect(s.events.some((e) => e.note.includes('wrong MAC'))).toBe(true);
    expect(s.headers.dstMac).toBe('aa:bb:cc:dd:ee:ff');
    expect(s.events[s.events.length - 1].headers.dstMac).toBe('aa:bb:cc:dd:ee:ff');
  });

  it('mtu fault yields fragmentation or ICMP fragmentation-needed', () => {
    let s = start('mtu');
    while (!s.done && s.events.length < 80) s = advance(s);
    expect(s.events.some((e) => /fragment/i.test(e.note))).toBe(true);
    expect(s.events.some((e) => e.note.includes('ICMP fragmentation-needed'))).toBe(true);
  });

  it('loop fault expires TTL and emits ICMP time exceeded', () => {
    let s = start('loop');
    while (!s.done && s.events.length < 80) s = advance(s);
    expect(s.events.some((e) => e.note.includes('TTL expired'))).toBe(true);
    expect(s.headers.ipTtl).toBe(0);
    expect(s.events.some((e) => e.note.includes('ICMP Time Exceeded'))).toBe(true);
  });

  it('loss on dns and ping uses timeout/retry instead of TCP ACKs', () => {
    for (const scenarioId of ['dns', 'ping'] as const) {
      const s = run(createJourney(scenarioId, 'loss'));
      expect(s.done).toBe(true);
      expect(s.events.some((e) => e.note.includes('DUP ACK'))).toBe(false);
      expect(s.dupAcks).toBe(0);
      expect(s.retransmits).toBe(0);
      expect(s.cwnd).toBe(10);
      const note = scenarioId === 'dns' ? 'DNS query timed out' : 'echo request timed out';
      expect(s.events.some((e) => e.note.includes(note))).toBe(true);
    }
  });

  it('server response reverses IP and port endpoints', () => {
    const s = run(start(), 60);
    const request = s.events[0];
    expect(request.headers.srcIp).toBe('192.168.1.10');
    expect(request.headers.dstIp).toBe('203.0.113.10');
    expect(request.headers.srcPort).toBe(49152);
    expect(request.headers.dstPort).toBe(443);

    const reply = s.events.find((e) => e.device === 'server' && e.direction === 'out');
    expect(reply).toBeDefined();
    expect(reply!.headers.srcIp).toBe('203.0.113.10');
    expect(reply!.headers.dstIp).toBe('192.168.1.10');
    expect(reply!.headers.srcPort).toBe(443);
    expect(reply!.headers.dstPort).toBe(49152);
    expect(reply!.headers.srcMac).toBe(request.headers.dstMac);
    expect(reply!.headers.dstMac).toBe(request.headers.srcMac);
  });

  it('event time is cumulative ms from rttMs while packetId is a separate sequence', () => {
    const rttMs = 40;
    const s = run(createJourney('http', 'none', { rttMs }), 60);
    expect(s.events.length).toBeGreaterThan(1);
    s.events.forEach((e, i) => {
      expect(e.packetId).toBe(i + 1);
      expect(e.time).toBe(((i + 1) * rttMs) / 2);
      if (i > 0) expect(e.time).toBeGreaterThan(s.events[i - 1].time);
    });
  });

  it('every scenario and fault combination terminates', () => {
    const faults: FaultKind[] = ['none', 'loss', 'arpSpoof', 'mtu', 'loop'];
    for (const scenarioId of ['dns', 'http', 'ping'] as const) {
      for (const fault of faults) {
        const s = run(createJourney(scenarioId, fault), 120);
        expect(s.done, `${scenarioId}/${fault}`).toBe(true);
        expect(s.events.length, `${scenarioId}/${fault}`).toBeLessThan(100);
      }
    }
  });
});
