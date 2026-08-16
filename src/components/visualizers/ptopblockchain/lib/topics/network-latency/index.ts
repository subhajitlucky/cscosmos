import type { TopicConfig } from '../types';

export const networkLatencyConfig: TopicConfig = {
  id: "network-latency",
  title: "Network Latency",
  shortDescription: "The physical constraint of information speed.",
  interactiveLabel: "Stress-Test Latency Vectors",
  content: "Information is bound by the **Speed of Light** in glass (~200,000 km/s). Global P2P networks face **Propagation Delay** (the time data takes to travel physical distance) and **Transmission Delay** (the time routers take to process packets). This 'Latency' is why high-performance blockchains must optimize their **Topology** to minimize the 'diameter' of the network, ensuring consensus is reached before the next block cycle.",
  analogy: "Like a global game of telephone. Even if everyone speaks perfectly, the time it takes for the message to travel from New York to Singapore creates an unavoidable delay in the conversation.",
  initialState: {
    nodes: [
      { id: 'Tokyo', type: 'full', x: 100, y: 150, peers: ['Singapore', 'NY'], mempool: [], chain: [], latency: 100 },
      { id: 'Singapore', type: 'full', x: 100, y: 450, peers: ['Tokyo', 'London'], mempool: [], chain: [], latency: 100 },
      { id: 'London', type: 'full', x: 400, y: 150, peers: ['Singapore', 'NY'], mempool: [], chain: [], latency: 100 },
      { id: 'NY', type: 'full', x: 600, y: 350, peers: ['Tokyo', 'London'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 't-s', from: 'Tokyo', to: 'Singapore', latency: 1500 },
      { id: 's-l', from: 'Singapore', to: 'London', latency: 2500 },
      { id: 'l-n', from: 'London', to: 'NY', latency: 1800 },
      { id: 't-n', from: 'Tokyo', to: 'NY', latency: 4500 }, // Trans-pacific
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'PHYSICAL_VECTORS', desc: 'Connections representing undersea fiber optic cables. Tokyo to NY is ~11,000km.' },
      { label: 'PROPAGATION_DELAY', desc: 'The time taken for a bit to travel at 2/3 the speed of light through glass fibers.' },
      { label: 'TRANSMISSION_DELAY', desc: 'The "Processing Time" at each node. Large blocks take longer to "serialize" than small transactions.' }
    ],
    logic: [
      { label: 'SPEED_OF_LIGHT', desc: 'Information is physically capped at ~200,000 km/s. Global consensus can never be truly instantaneous.' },
      { label: 'NETWORK_DIAMETER', desc: 'The longest path between any two nodes. Optimizing this is critical for high-frequency blockchains.' },
      { label: 'STRESS_CONGESTION', desc: 'Observe how concurrent broadcasts create "Queues," increasing the total time to reach consensus.' }
    ]
  },
  action: ({ broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    // Broadcast a Block (heavy) and then Transactions (light) to show difference
    broadcast('Tokyo', 'block', `heavy-blk-${Math.random().toString(36).substr(2, 3)}`);
    setTimeout(() => {
      broadcast('Singapore', 'transaction', `tx-sg`);
    }, 400);
    setTimeout(() => {
      broadcast('London', 'transaction', `tx-ldn`);
    }, 800);
    setTimeout(() => {
      broadcast('NY', 'transaction', `tx-ny`);
    }, 1200);
  }
};
