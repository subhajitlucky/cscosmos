// TCP handshake + reliable-delivery simulation constants and knowledge base.
// Pure data - no browser APIs - safe for module scope.

/** Payload bytes carried by one data segment. */
export const MSS = 100;

export interface SimDefaults {
  lossPct: number;
  rttMs: number;
  segments: number;
}

export const DEFAULTS: SimDefaults = {
  lossPct: 12,
  rttMs: 140,
  segments: 12,
};

export const LOSS_MIN = 0;
export const LOSS_MAX = 40;
export const RTT_MIN = 60;
export const RTT_MAX = 400;

/** cwnd value at which the congestion-window meter reads full. */
export const CWND_METER_MAX = 24;

export interface FlagInfo {
  flag: string;
  meaning: string;
}

export const FLAG_LEGEND: FlagInfo[] = [
  { flag: 'SYN', meaning: 'open a connection and synchronize sequence numbers' },
  { flag: 'ACK', meaning: 'cumulative - every byte below the ack number is confirmed' },
  { flag: 'PSH', meaning: 'push payload to the receiving application promptly' },
  { flag: 'RXT', meaning: 'retransmission of a segment presumed lost' },
];

export interface HsStep {
  label: string;
  flags: string;
  detail: string;
}

export const HANDSHAKE_STEPS: HsStep[] = [
  { label: 'SYN', flags: 'SYN', detail: 'client picks an initial sequence number and asks to open' },
  { label: 'SYN-ACK', flags: 'SYN,ACK', detail: 'server answers with its own initial sequence number' },
  { label: 'ACK', flags: 'ACK', detail: 'client confirms - both sides are ESTABLISHED' },
];

export interface ConceptNote {
  title: string;
  body: string;
}

export const CONCEPTS: ConceptNote[] = [
  {
    title: 'Slow start',
    body: 'Below ssthresh every ACK adds a whole segment, so cwnd doubles each RTT.',
  },
  {
    title: 'Congestion avoidance',
    body: 'Above ssthresh growth turns linear - about one segment per RTT - to avoid overflowing the pipe.',
  },
  {
    title: 'Fast retransmit',
    body: 'Three duplicate ACKs prove a gap in the stream: resend the missing segment without waiting for the timer.',
  },
  {
    title: 'RTO timeout',
    body: 'Silence for roughly two RTTs means trouble: halve ssthresh, collapse cwnd to 1, retransmit.',
  },
];
