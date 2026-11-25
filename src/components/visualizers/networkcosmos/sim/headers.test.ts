import { describe, expect, it } from 'vitest';
import { diffHeaders } from './headers';
import type { Headers } from './types';

const base: Headers = {
  srcMac: 'aa:aa:aa:aa:aa:aa', dstMac: 'bb:bb:bb:bb:bb:bb',
  srcIp: '192.168.1.10', dstIp: '203.0.113.10', ipTtl: 64,
  srcPort: 49152, dstPort: 443, flags: 'SYN', checksumOk: true,
};

describe('diffHeaders', () => {
  it('returns only fields that changed between hops', () => {
    const after: Headers = { ...base, dstMac: 'cc:cc:cc:cc:cc:cc', ipTtl: 63 };
    expect(diffHeaders(base, after)).toEqual({
      dstMac: ['bb:bb:bb:bb:bb:bb', 'cc:cc:cc:cc:cc:cc'],
      ipTtl: [64, 63],
    });
  });
  it('returns an empty object for identical headers', () => {
    expect(diffHeaders(base, { ...base })).toEqual({});
  });
  it('diffs optional fields appearing/disappearing and a boolean field', () => {
    const withAck: Headers = { ...base, ack: 0 };
    expect(diffHeaders(base, withAck)).toEqual({ ack: [undefined, 0] });
    expect(diffHeaders(withAck, base)).toEqual({ ack: [0, undefined] });

    const badChecksum: Headers = { ...base, checksumOk: false };
    expect(diffHeaders(base, badChecksum)).toEqual({ checksumOk: [true, false] });
  });
  it('does not throw on null or undefined inputs', () => {
    expect(diffHeaders(null, base)).toEqual({});
    expect(diffHeaders(base, undefined)).toEqual({});
    expect(diffHeaders(null, undefined)).toEqual({});
  });
});
