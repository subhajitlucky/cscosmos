import type { TopicConfig } from '../types';

export const blockPropagationConfig: TopicConfig = {
  id: "block-propagation",
  title: "Block Propagation",
  shortDescription: "Updating the global state.",
  interactiveLabel: "Broadcast New Block",
  content: "When a miner finds a block, they broadcast it immediately. Since blocks are larger and more critical than transactions, their propagation speed determines how often the network 'forks' or stays in sync.",
  analogy: "Like the principal announcing a new school rule over the loudspeaker. Everyone stops what they're doing and updates their notebooks at the same time.",
  initialState: {
    nodes: [
      { id: 'Miner', type: 'miner', x: 100, y: 250, peers: ['N1', 'N2'], mempool: [], chain: [], latency: 100 },
      { id: 'N1', type: 'full', x: 300, y: 150, peers: ['Miner', 'N3'], mempool: [], chain: [], latency: 100 },
      { id: 'N2', type: 'full', x: 300, y: 350, peers: ['Miner', 'N4'], mempool: [], chain: [], latency: 100 },
      { id: 'N3', type: 'full', x: 500, y: 150, peers: ['N1', 'N4'], mempool: [], chain: [], latency: 100 },
      { id: 'N4', type: 'full', x: 500, y: 350, peers: ['N2', 'N3'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 'm1', from: 'Miner', to: 'N1', latency: 1500 }, { id: 'm2', from: 'Miner', to: 'N2', latency: 1500 },
      { id: '13', from: 'N1', to: 'N3', latency: 2000 }, { id: '24', from: 'N2', to: 'N4', latency: 2000 },
      { id: '34', from: 'N3', to: 'N4', latency: 2000 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'BLOCK_GENERATION', desc: 'A collection of transactions bundled with a cryptographic proof (hash) by a miner.' },
      { label: 'MINING_NODE', desc: 'A high-performance participant that expends energy to secure the network and propose new blocks.' },
      { label: 'CHAIN_HEIGHT', desc: 'The total number of blocks in the ledger. Each new block increases the height and network security.' }
    ],
    logic: [
      { label: 'STATE_UPDATE', desc: 'When a block arrives, nodes move transactions from their mempool to the permanent "Chain" storage.' },
      { label: 'CRITICAL_SPEED', desc: 'Blocks must reach the entire network quickly to prevent "Stale Blocks" and chain splits.' },
      { label: 'BLOCK_VALIDATION', desc: 'Nodes check that the miner followed the consensus rules before accepting the new state.' }
    ]
  },
  action: ({ broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    broadcast('Miner', 'block', `blk-${Math.random().toString(36).substr(2, 4)}`);
  }
};
