import type { TopicConfig } from '../types';

export const gossipBasicsConfig: TopicConfig = {
  id: "gossip-basics",
  title: "Gossip Protocol",
  shortDescription: "Exponential information fan-out.",
  interactiveLabel: "Initiate Gossip Ripple",
  content: "Blockchains achieve global consensus through **Gossip Protocols** (Epidemic Algorithms). Instead of a central server, each node selects a small number of random peers (**Fan-out Factor 'k'**) to forward data. This creates an **Exponential Ripple** where information reaches the entire network in **O(log N)** time. Crucially, nodes never 'gossip' back to the peer they received data from, preventing infinite loops.",
  analogy: "Like a 'Viral Video' on social media. You share it with 3 friends, they share it with 3 more, and within 10 'hops', millions of people have seen it.",
  initialState: {
    nodes: [
      { id: 'Source', type: 'full', x: 100, y: 400, peers: ['Relay-A', 'Relay-B'], mempool: [], chain: [], latency: 100 },
      { id: 'Relay-A', type: 'full', x: 500, y: 250, peers: ['Source', 'Node-1', 'Node-2'], mempool: [], chain: [], latency: 100 },
      { id: 'Relay-B', type: 'full', x: 500, y: 550, peers: ['Source', 'Node-3', 'Node-4'], mempool: [], chain: [], latency: 100 },
      { id: 'Node-1', type: 'full', x: 900, y: 150, peers: ['Relay-A'], mempool: [], chain: [], latency: 100 },
      { id: 'Node-2', type: 'full', x: 900, y: 300, peers: ['Relay-A'], mempool: [], chain: [], latency: 100 },
      { id: 'Node-3', type: 'full', x: 900, y: 500, peers: ['Relay-B'], mempool: [], chain: [], latency: 100 },
      { id: 'Node-4', type: 'full', x: 900, y: 650, peers: ['Relay-B'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 's-ra', from: 'Source', to: 'Relay-A', latency: 800 },
      { id: 's-rb', from: 'Source', to: 'Relay-B', latency: 800 },
      { id: 'ra-1', from: 'Relay-A', to: 'Node-1', latency: 800 },
      { id: 'ra-2', from: 'Relay-A', to: 'Node-2', latency: 800 },
      { id: 'rb-3', from: 'Relay-B', to: 'Node-3', latency: 800 },
      { id: 'rb-4', from: 'Relay-B', to: 'Node-4', latency: 800 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'FAN_OUT', desc: 'The number of peers (k) each node forwards to. A small k ensures rapid reach with minimal network overhead.' },
      { label: 'HOP_COUNTER', desc: 'The small numeric badges indicate the "Distance" from the Source. Watch how it increases per ripple.' },
      { label: 'SOURCE_NODE', desc: 'The point of origin for the data packet. In a decentralized network, any node can be the source.' }
    ],
    logic: [
      { label: 'EXPONENTIAL_REACH', desc: 'Each hop multiplies the total number of reached nodes. Global reach is O(log N).' },
      { label: 'LOOP_PREVENTION', desc: 'Nodes remember what they have seen and never send data back to the person who gave it to them.' },
      { label: 'EPIDEMIC_MODEL', desc: 'This is based on how viruses spread. Information "infects" the network until saturation is 100%.' }
    ]
  },
  action: ({ broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    broadcast('Source', 'transaction', `ripple-${Math.random().toString(36).substr(2, 4)}`, 2);
  }
};
