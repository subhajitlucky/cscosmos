import type { TopicConfig } from '../types';

export const whyP2PConfig: TopicConfig = {
  id: "why-p2p",
  title: "The P2P Paradigm",
  shortDescription: "Resilience through decentralization.",
  interactiveLabel: "Simulate Data Flow",
  content: "In traditional Client-Server architectures, a central authority controls all state. This creates a single point of failure and censorship. Peer-to-Peer (P2P) networks fundamentally shift this power dynamic. Every participant ('node') acts as both a client and a server, maintaining a full replica of the ledger. This architecture guarantees **Resilience** (network survives node failures), **Censorship Resistance** (no central target), and **Verifiability** (don't trust, verify).",
  analogy: "Centralized: A library with one librarian; if they leave, no one can borrow books. Decentralized: A book club where everyone has a copy of every book; if one member leaves, the library remains intact.",
  initialState: {
    nodes: [
      { id: 'Server', type: 'full', x: 300, y: 250, peers: ['C1', 'C2', 'C3', 'C4'], mempool: [], chain: [], latency: 100 },
      { id: 'C1', type: 'light', x: 150, y: 100, peers: ['Server'], mempool: [], chain: [], latency: 100 },
      { id: 'C2', type: 'light', x: 450, y: 100, peers: ['Server'], mempool: [], chain: [], latency: 100 },
      { id: 'C3', type: 'light', x: 150, y: 400, peers: ['Server'], mempool: [], chain: [], latency: 100 },
      { id: 'C4', type: 'light', x: 450, y: 400, peers: ['Server'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 's1', from: 'Server', to: 'C1', latency: 1500 },
      { id: 's2', from: 'Server', to: 'C2', latency: 1500 },
      { id: 's3', from: 'Server', to: 'C3', latency: 1500 },
      { id: 's4', from: 'Server', to: 'C4', latency: 1500 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'CENTRAL_SERVER', desc: 'In centralized mode, this node is the single arbiter of truth. If it falls, all clients lose sync.' },
      { label: 'P2P_MESH', desc: 'In decentralized mode, every node connects to multiple neighbors, removing single points of failure.' },
      { label: 'CLIENT_NODES', desc: 'Light participants that rely on full nodes or the server to verify the state of the network.' }
    ],
    logic: [
      { label: 'RESILIENCE', desc: 'Observe how the mesh network reroutes data when a random node is killed, unlike the star topology.' },
      { label: 'CENSORSHIP', desc: 'With no central hub, there is no single target for an attacker to disable or control.' },
      { label: 'TRUSTLESS', desc: 'Nodes verify incoming data against their own copy of the ledger rather than trusting a central server.' }
    ]
  },
  action: ({ state, broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    const isCentralized = state.nodes.some(n => n.id === 'Server');
    
    if (isCentralized) {
      const srv = state.nodes.find(n => n.id === 'Server');
      if (srv && !srv.isDown) {
        broadcast('Server', 'transaction', `srv-${Math.random().toString(36).substr(2, 3)}`);
      } else {
        // In centralized mode, if server is down, show ALL clients failing to connect
        state.nodes.filter(n => n.id !== 'Server' && !n.isDown).forEach((n, i) => {
          setTimeout(() => {
            broadcast(n.id, 'transaction', `fail-${n.id}`);
          }, i * 100);
        });
      }
    } else {
      // In P2P mode, broadcast from a random active node to show the mesh still works
      const activeNodes = state.nodes.filter(n => !n.isDown);
      if (activeNodes.length > 0) {
        const randomNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
        broadcast(randomNode.id, 'transaction', `p2p-${Math.random().toString(36).substr(2, 3)}`, 99);
      }
    }
  }
};
