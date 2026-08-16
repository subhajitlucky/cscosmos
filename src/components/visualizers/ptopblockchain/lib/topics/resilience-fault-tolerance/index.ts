import type { TopicConfig } from '../types';

export const resilienceFaultToleranceConfig: TopicConfig = {
  id: "resilience-fault-tolerance",
  title: "Resilience & Fault Tolerance",
  shortDescription: "Surviving the chaos.",
  interactiveLabel: "Disable Central Hub",
  content: "A P2P network is resilient because it has no single point of failure. If one node (or even many) goes offline, the remaining nodes automatically find other paths to stay connected.",
  analogy: "Like a mesh net. If you cut one string, the rest of the net still holds its shape and stays together.",
  initialState: {
    nodes: [
      { id: 'Hub', type: 'full', x: 300, y: 250, peers: ['N1', 'N2', 'N3', 'N4'], mempool: [], chain: [], latency: 100 },
      { id: 'N1', type: 'full', x: 150, y: 150, peers: ['Hub', 'N2'], mempool: [], chain: [], latency: 100 },
      { id: 'N2', type: 'full', x: 450, y: 150, peers: ['Hub', 'N1'], mempool: [], chain: [], latency: 100 },
      { id: 'N3', type: 'full', x: 150, y: 350, peers: ['Hub', 'N4'], mempool: [], chain: [], latency: 100 },
      { id: 'N4', type: 'full', x: 450, y: 350, peers: ['Hub', 'N3'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 'h1', from: 'Hub', to: 'N1', latency: 1000 }, { id: 'h2', from: 'Hub', to: 'N2', latency: 1000 },
      { id: 'h3', from: 'Hub', to: 'N3', latency: 1000 }, { id: 'h4', from: 'Hub', to: 'N4', latency: 1000 },
      { id: '12', from: 'N1', to: 'N2', latency: 1500 }, { id: '34', from: 'N3', to: 'N4', latency: 1500 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'MESH_RESILIENCE', desc: 'The interconnected nature of the network where every node provides multiple path-finding vectors.' },
      { label: 'FAULT_DOMAIN', desc: 'By distributing nodes globally, the network avoids being taken down by regional power or internet failures.' },
      { label: 'SELF_HEALING', desc: 'Nodes automatically seek new peers if their current neighbors go offline, maintaining network connectivity.' }
    ],
    logic: [
      { label: 'BYZANTINE_TOLERANCE', desc: 'The network can survive even if a portion of nodes are actively malicious or non-responsive.' },
      { label: 'DECENTRALIZED_CONTROL', desc: 'No single switch can turn off the blockchain; it exists as long as at least two nodes are talking.' },
      { label: 'REDUNDANCY_FACTOR', desc: 'Observe how data flows around the "Offline" central hub using the secondary peer links.' }
    ]
  },
  action: ({ killNode, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    killNode('Hub');
  }
};
