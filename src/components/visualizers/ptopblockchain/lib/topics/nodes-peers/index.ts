import type { TopicConfig } from '../types';

export const nodesPeersConfig: TopicConfig = {
  id: "nodes-peers",
  title: "Nodes & Peers",
  shortDescription: "The identity and topology of the network.",
  interactiveLabel: "Establish Peer Uplinks",
  content: "A **Node** is any physical machine running the blockchain daemon. A **Peer** is a logical relationship between two nodes that have completed a successful cryptographic handshake. In a healthy network, each node maintains a 'Peer Table' of 8–125 neighbors. This redundancy ensures that data has multiple path-finding vectors even if 50% of the network goes offline.",
  analogy: "Nodes are computers in a room; Peers are the specific computers connected by ethernet cables. You can see everyone (the network), but you only talk to those you are plugged into.",
  initialState: {
    nodes: [
      { id: 'Local-Host', type: 'full', x: 300, y: 250, peers: [], mempool: [], chain: [], latency: 100 },
      { id: 'Remote-01', type: 'full', x: 100, y: 100, peers: [], mempool: [], chain: [], latency: 100 },
      { id: 'Remote-02', type: 'full', x: 500, y: 100, peers: [], mempool: [], chain: [], latency: 100 },
      { id: 'Remote-03', type: 'full', x: 100, y: 400, peers: [], mempool: [], chain: [], latency: 100 },
      { id: 'Remote-04', type: 'full', x: 500, y: 400, peers: [], mempool: [], chain: [], latency: 100 },
    ],
    connections: [],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'PEER_SLOTS', desc: 'Each node has 8 logical ports. These light up only after a successful handshake, representing the "Peer Table."' },
      { label: 'HANDSHAKE_PULSES', desc: 'Energy bursts indicating cryptographic negotiation. No link is formed until these reach the target.' },
      { label: 'LOCAL_HOST', desc: 'The reference node (you). Emits a constant radar sweep to visualize "Seeing everyone in the room."' }
    ],
    logic: [
      { label: 'LOGICAL_TOPOLOGY', desc: 'Seeing a node (physical) is different from talking to a node (logical). Links are built, not born.' },
      { label: 'REDUNDANCY', desc: 'Observe how filling the 8 slots creates multiple escape paths for data, protecting the node from isolation.' },
      { label: 'HANDSHAKE_REQ', desc: 'Data only flows once the "Neural Link" is confirmed. Notice how comets wait for the link to exist.' }
    ]
  },
  action: ({ state, connectNodes, broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    const remotes = state.nodes.filter(n => n.id.startsWith('Remote'));
    remotes.forEach((node, i) => {
      setTimeout(() => {
        connectNodes('Local-Host', node.id);
        if (i === remotes.length - 1) {
          setTimeout(() => {
            broadcast('Local-Host', 'block', `handshake-success-${Math.random().toString(36).substr(2, 4)}`);
          }, 1200);
        }
      }, i * 800);
    });
  }
};
