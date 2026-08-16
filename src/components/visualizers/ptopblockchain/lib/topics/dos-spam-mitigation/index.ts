import type { TopicConfig } from '../types';

export const dosSpamMitigationConfig: TopicConfig = {
  id: "dos-spam-mitigation",
  title: "DoS & Spam Mitigation",
  shortDescription: "Pricing out the noise.",
  interactiveLabel: "Flood with Low-Fee Tx",
  content: "Because P2P networks are open, anyone can flood them with messages. To prevent Denial of Service (DoS), blockchains charge a fee (like Gas) for every transaction. 'Spam' that doesn't pay the fee is dropped immediately by peers.",
  analogy: "Like a toll road: traffic flows smoothly because the cost discourages people from driving aimlessly in circles.",
  initialState: {
    nodes: [
      { id: 'Honest-1', type: 'full', x: 100, y: 250, peers: ['Honest-2'], mempool: [], chain: [], latency: 100 },
      { id: 'Honest-2', type: 'full', x: 250, y: 250, peers: ['Honest-1'], mempool: [], chain: [], latency: 100 },
      { id: 'Attacker', type: 'miner', x: 500, y: 250, peers: ['Honest-2'], mempool: [], chain: [], latency: 100, isMalicious: true },
    ],
    connections: [
      { id: 'h12', from: 'Honest-1', to: 'Honest-2', latency: 1000 },
      { id: 'ah2', from: 'Attacker', to: 'Honest-2', latency: 1000 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'ATTACKER_NODE', desc: 'A malicious actor attempting to exhaust network resources by flooding the mesh with useless data.' },
      { label: 'HONEST_VALIDATORS', desc: 'Nodes that enforce strict "Admission Policies" before relaying any information to peers.' },
      { label: 'MEMPOOL_QUOTA', desc: 'The limited memory space for waiting transactions. High-fee packets "Evict" low-fee spam.' }
    ],
    logic: [
      { label: 'ECONOMIC_BARRIER', desc: 'By requiring a "Minimum Relay Fee," the network makes large-scale spamming prohibitively expensive.' },
      { label: 'SPAM_FILTER', desc: 'Observe how honest nodes identify and "Drop" zero-fee packets at the edge of the network.' },
      { label: 'TRANSACTION_PRIORITY', desc: 'Users who pay the "Market Rate" enjoy guaranteed propagation, while spam is discarded.' }
    ]
  },
  action: ({ broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    // Flood with 10 zero-fee transactions
    for(let i=0; i<10; i++) {
        setTimeout(() => broadcast('Attacker', 'transaction', `spam-${i}`, undefined, 0), i * 100);
    }
    // Send one legitimate high-fee transaction
    setTimeout(() => {
      broadcast('Honest-1', 'transaction', 'legit-tx', undefined, 0.5);
    }, 1200);
  }
};
