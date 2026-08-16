import type { TopicConfig } from '../types';

export const overlayNetworksConfig: TopicConfig = {
  id: "overlay-networks",
  title: "Overlay Networks",
  shortDescription: "Networks on top of networks.",
  interactiveLabel: "Show Logical Links",
  content: "A P2P network is an 'overlay'. It creates a logical structure of connections (peers) that sits on top of the physical internet (IP addresses). This allows the blockchain to have its own topology regardless of geography.",
  analogy: "Like a group of friends using a specific secret code to talk over a public radio frequency. The radio is the physical network; the secret code group is the overlay.",
  initialState: {
    nodes: [
      { id: 'A', type: 'full', x: 100, y: 100, peers: ['B', 'D'], mempool: [], chain: [], latency: 100 },
      { id: 'B', type: 'full', x: 500, y: 100, peers: ['A', 'C'], mempool: [], chain: [], latency: 100 },
      { id: 'C', type: 'full', x: 500, y: 400, peers: ['B', 'D'], mempool: [], chain: [], latency: 100 },
      { id: 'D', type: 'full', x: 100, y: 400, peers: ['A', 'C'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 'ab', from: 'A', to: 'B', latency: 2000 },
      { id: 'bc', from: 'B', to: 'C', latency: 2000 },
      { id: 'cd', from: 'C', to: 'D', latency: 2000 },
      { id: 'da', from: 'D', to: 'A', latency: 2000 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'LOGICAL_LINKS', desc: 'The connection between peers that exist only in the blockchain software, regardless of physical routers.' },
      { label: 'PHYSICAL_SUBSTRATE', desc: 'The underlying internet (TCP/IP) that the overlay uses to transport its packets.' },
      { label: 'TOPOLOGY_ISOLATION', desc: 'The ability of the overlay to maintain its shape even if the underlying physical path changes.' }
    ],
    logic: [
      { label: 'NETWORK_SOVEREIGNTY', desc: 'The overlay defines its own rules for who can join and how data is shared, independent of ISPs.' },
      { label: 'VIRTUAL_MESH', desc: 'Observe how nodes A and B are "Neighbors" in the overlay even if they are physically on different continents.' },
      { label: 'ENCAPSULATION', desc: 'Blockchain data is wrapped inside standard internet packets to travel across the globe.' }
    ]
  },
  action: ({ broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    broadcast('A', 'transaction', `ovl-${Math.random().toString(36).substr(2, 4)}`);
  }
};
