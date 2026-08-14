export interface SystemDesignCheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    title: string;
    description: string;
    code: string;
    tip: string;
  }[];
}

export const SYSTEM_DESIGN_CHEATSHEET: SystemDesignCheatSheetSection[] = [
  {
    id: 'back-of-envelope',
    title: 'Back-of-the-Envelope Capacity Numbers',
    category: 'Estimations',
    snippets: [
      {
        title: 'Latency Numbers Every Programmer Should Know',
        description: 'Orders of magnitude for hardware operations',
        code: `// Hardware Latencies:
// L1 Cache Reference:       0.5 ns
// L2 Cache Reference:       7.0 ns
// Main Memory (RAM) Read:   100 ns
// NVMe SSD Random Read:     16,000 ns (16 µs)
// Sequential Disk Read:     2,000,000 ns (2 ms)
// Roundtrip DC to DC (US):  150,000,000 ns (150 ms)`,
        tip: 'Memory is 100,000x faster than disk; cache locality is king.'
      },
      {
        title: 'QPS and Storage Calculation Rules',
        description: 'Quick estimation rules for scale',
        code: `// 1 Million Daily Active Users (DAU):
// Writes per day: 10M events = ~115 writes/sec (Peak: ~250 QPS)
// 100M DAU: ~11,500 writes/sec (Peak: ~25,000 QPS)

// Storage:
// 100 Million records * 1 KB = 100 GB / day = 36.5 TB / year`,
        tip: 'Always design for peak traffic (typically 2x to 3x average QPS).'
      }
    ]
  },
  {
    id: 'resilience-patterns',
    title: 'High Availability & Resilience Patterns',
    category: 'Architecture',
    snippets: [
      {
        title: 'Exponential Backoff with Full Jitter',
        description: 'Prevents thundering herd retries against failing backends',
        code: `function getBackoffDelay(attempt: number, baseMs = 100, maxMs = 10000): number {
  const temp = Math.min(maxMs, baseMs * Math.pow(2, attempt));
  return Math.floor(Math.random() * temp); // Full randomized jitter
}`,
        tip: 'Adding full jitter spreads retry requests evenly over time.'
      }
    ]
  }
];
