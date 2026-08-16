import type { TopicConfig } from '../types';

export const transactionPropagationConfig: TopicConfig = {
  id: "transaction-propagation",
  title: "Transaction Propagation",
  shortDescription: "Filling the mempools.",
  interactiveLabel: "Send New Transaction",
  content: "When you send crypto, your transaction is gossiped to all nodes. Each node validates it and adds it to its 'mempool' (a waiting room). This ensures every miner eventually sees your transaction.",
  analogy: "Like a waiter taking your order and telling all the chefs in the kitchen. They all write it down on their own lists of 'things to cook'.",
  initialState: {
    nodes: [
      { id: 'User', type: 'light', x: 100, y: 250, peers: ['N1', 'N2'], mempool: [], chain: [], latency: 100 },
      { id: 'N1', type: 'full', x: 300, y: 150, peers: ['User', 'N3'], mempool: [], chain: [], latency: 100 },
      { id: 'N2', type: 'full', x: 300, y: 350, peers: ['User', 'N4'], mempool: [], chain: [], latency: 100 },
      { id: 'N3', type: 'full', x: 500, y: 150, peers: ['N1', 'N4'], mempool: [], chain: [], latency: 100 },
      { id: 'N4', type: 'full', x: 500, y: 350, peers: ['N2', 'N3'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 'u1', from: 'User', to: 'N1', latency: 800 }, { id: 'u2', from: 'User', to: 'N2', latency: 800 },
      { id: '13', from: 'N1', to: 'N3', latency: 1200 }, { id: '24', from: 'N2', to: 'N4', latency: 1200 },
      { id: '34', from: 'N3', to: 'N4', latency: 1200 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'USER_TRANSACTION', desc: 'A signed request to move assets, originating from a light client or wallet.' },
      { label: 'MEMPOOL', desc: 'The "Waiting Room" where valid transactions sit before being included in a block.' },
      { label: 'VALIDATION_NODES', desc: 'Full nodes that verify the transaction signature and balance before gossiping it further.' }
    ],
    logic: [
      { label: 'GOSSIP_REACH', desc: 'Watch how a single transaction from the user reaches every node in the network via gossiping.' },
      { label: 'MEMPOOL_SYNC', desc: 'All nodes eventually maintain a similar list of pending transactions, ready for the next block.' },
      { label: 'ORDERING_AGNOSTIC', desc: "In the mempool, the order of transactions doesn't matter until a miner picks them up." }
    ]
  },
  action: ({ broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    broadcast('User', 'transaction', `tx-${Math.random().toString(36).substr(2, 4)}`);
  }
};
