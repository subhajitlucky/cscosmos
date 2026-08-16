import type { TopicConfig } from '../types';

export const networkPartitionsConfig: TopicConfig = {
  id: "network-partitions",
  title: "Network Partitions",
  shortDescription: "Consensus during partial network failure.",
  interactiveLabel: "Initiate Regional Split",
  content: "The **CAP Theorem** states that during a **Network Partition**, a system must choose between **Consistency** and **Availability**. In blockchains, regions may become isolated (e.g., BGP hijacks or undersea cable cuts), leading to **Competing Realities**. Each 'island' continues to mine blocks independently. When the partition heals, the nodes must perform a **Chain Reorganization (Reorg)**, discarding the shorter chain to restore global agreement.",
  analogy: "Like two groups of explorers on an island who lose sight of each other. They both keep mapping the terrain independently until they reunite and realize they have two different versions of the map.",
  initialState: {
    nodes: [
      { id: 'EU-Host-1', type: 'full', x: 150, y: 200, peers: ['EU-Host-2', 'Bridge-Node'], mempool: [], chain: [], latency: 100 },
      { id: 'EU-Host-2', type: 'full', x: 150, y: 500, peers: ['EU-Host-1', 'Bridge-Node'], mempool: [], chain: [], latency: 100 },
      { id: 'Bridge-Node', type: 'full', x: 500, y: 350, peers: ['EU-Host-1', 'EU-Host-2', 'US-Host-1', 'US-Host-2'], mempool: [], chain: [], latency: 100 },
      { id: 'US-Host-1', type: 'full', x: 850, y: 200, peers: ['US-Host-2', 'Bridge-Node'], mempool: [], chain: [], latency: 100 },
      { id: 'US-Host-2', type: 'full', x: 850, y: 500, peers: ['US-Host-1', 'Bridge-Node'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 'eu-internal', from: 'EU-Host-1', to: 'EU-Host-2', latency: 1000 },
      { id: 'eu-bridge-1', from: 'EU-Host-1', to: 'Bridge-Node', latency: 1000 },
      { id: 'eu-bridge-2', from: 'EU-Host-2', to: 'Bridge-Node', latency: 1000 },
      { id: 'us-internal', from: 'US-Host-1', to: 'US-Host-2', latency: 1000 },
      { id: 'us-bridge-1', from: 'US-Host-1', to: 'Bridge-Node', latency: 1000 },
      { id: 'us-bridge-2', from: 'US-Host-2', to: 'Bridge-Node', latency: 1000 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'BRIDGE_NODE', desc: 'A critical routing node that connects regional clusters. Its failure causes an immediate global partition.' },
      { label: 'ISOLATED_REGIONS', desc: 'EU and US clusters that can no longer communicate. They are physically "Split" from the main state.' },
      { label: 'FORKED_LEDGERS', desc: 'During isolation, both sides continue mining, creating two "Competing Realities" (Chains).' }
    ],
    logic: [
      { label: 'CAP_THEOREM', desc: 'Blockchains choose Availability (staying active) over Consistency (staying in sync) during a split.' },
      { label: 'CHAIN_REORG', desc: 'When the partition heals, the "Longest Chain Rule" forces the shorter region to discard its history.' },
      { label: 'HEALING_PROTOCOL', desc: 'The Bridge-Node performs a cryptographic reconciliation to restore global agreement.' }
    ]
  },
  action: ({ state, killNode, broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    const bridgeNode = state.nodes.find(n => n.id === 'Bridge-Node');
    if (bridgeNode && !bridgeNode.isDown) {
      killNode('Bridge-Node');
      setTimeout(() => {
        broadcast('EU-Host-1', 'transaction', `eu-${Math.random().toString(36).substr(2, 3)}`);
        broadcast('US-Host-1', 'block', `us-${Math.random().toString(36).substr(2, 3)}`);
      }, 800);
    } else {
      killNode('Bridge-Node');
    }
  }
};
