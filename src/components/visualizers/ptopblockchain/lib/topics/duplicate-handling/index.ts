import type { TopicConfig } from '../types';

export const duplicateHandlingConfig: TopicConfig = {
  id: "duplicate-handling",
  title: "Duplicate Suppression",
  shortDescription: "Mitigating redundant data overhead.",
  interactiveLabel: "Trigger Multi-Path Broadcast",
  content: "In a mesh topology, a node often receives the same transaction from multiple neighbors. To prevent a **Broadcast Storm**, nodes store a **Message Hash** of every recently seen packet in an **Inventory Cache**. If an incoming packet's hash is already present in the cache, the node silently drops the data, preserving critical bandwidth for unique state updates.",
  analogy: "Like a group chat where 5 friends send the same meme. You only download the image once; your phone recognizes the file ID and ignores the redundant copies.",
  initialState: {
    nodes: [
      { id: 'Origin', type: 'full', x: 250, y: 400, peers: ['Relay-1', 'Relay-2', 'Relay-3'], mempool: [], chain: [], latency: 100 },
      { id: 'Relay-1', type: 'full', x: 500, y: 200, peers: ['Origin', 'Center'], mempool: [], chain: [], latency: 100 },
      { id: 'Relay-2', type: 'full', x: 500, y: 400, peers: ['Origin', 'Center'], mempool: [], chain: [], latency: 100 },
      { id: 'Relay-3', type: 'full', x: 500, y: 600, peers: ['Origin', 'Center'], mempool: [], chain: [], latency: 100 },
      { id: 'Center', type: 'full', x: 750, y: 400, peers: ['Relay-1', 'Relay-2', 'Relay-3', 'Target'], mempool: [], chain: [], latency: 100 },
      { id: 'Target', type: 'full', x: 1000, y: 400, peers: ['Center'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 'o1', from: 'Origin', to: 'Relay-1', latency: 1000 },
      { id: 'o2', from: 'Origin', to: 'Relay-2', latency: 1500 },
      { id: 'o3', from: 'Origin', to: 'Relay-3', latency: 2000 },
      { id: 'r1c', from: 'Relay-1', to: 'Center', latency: 1000 },
      { id: 'r2c', from: 'Relay-2', to: 'Center', latency: 1000 },
      { id: 'r3c', from: 'Relay-3', to: 'Center', latency: 1000 },
      { id: 'ct', from: 'Center', to: 'Target', latency: 1000 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'INVENTORY_CACHE', desc: 'A temporary memory buffer where nodes store the "Hashes" of recently processed packets.' },
      { label: 'MULTI_PATH_VECTORS', desc: 'In a mesh, data arrives from multiple peers. Redundant paths are shown as thinner link glows.' },
      { label: 'TARGET_NODE', desc: 'The destination node. Watch how it "Rejects" the second comet to save bandwidth.' }
    ],
    logic: [
      { label: 'HASH_COMPARISON', desc: 'Before processing, the node checks if the incoming ID exists in its Inventory. If yes, it "Drops" the packet.' },
      { label: 'BROADCAST_STORM', desc: 'Without this logic, a single transaction would bounce infinitely between nodes, crashing the internet.' },
      { label: 'BANDWIDTH_PRESERVATION', desc: 'This filter ensures the network only spends energy on "Unique" state updates.' }
    ]
  },
  action: ({ broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    broadcast('Origin', 'transaction', `dup-${Math.random().toString(36).substr(2, 4)}`);
  }
};
