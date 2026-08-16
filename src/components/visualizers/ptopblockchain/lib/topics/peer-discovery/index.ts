import type { TopicConfig } from '../types';

export const peerDiscoveryConfig: TopicConfig = {
  id: "peer-discovery",
  title: "Peer Discovery",
  shortDescription: "How nodes find each other.",
  interactiveLabel: "Query Bootstrap Node",
  content: "When a node starts, it doesn't know anyone. It connects to 'Bootstrap Nodes' (hardcoded addresses) to get a list of active peers. From there, it can discover the rest of the network.",
  analogy: "Like arriving in a new city and asking the information desk at the airport for a map of local meetups.",
  initialState: {
    nodes: [
      { id: 'Bootstrap', type: 'full', x: 500, y: 150, peers: ['P1', 'P2', 'P3', 'P4', 'P5'], mempool: [], chain: [], latency: 100 },
      { id: 'New-Node', type: 'light', x: 500, y: 550, peers: [], mempool: [], chain: [], latency: 100 },
      { id: 'P1', type: 'full', x: 200, y: 300, peers: ['Bootstrap', 'P2'], mempool: [], chain: [], latency: 100 },
      { id: 'P2', type: 'full', x: 350, y: 300, peers: ['Bootstrap', 'P1'], mempool: [], chain: [], latency: 100 },
      { id: 'P3', type: 'full', x: 500, y: 300, peers: ['Bootstrap', 'P4'], mempool: [], chain: [], latency: 100 },
      { id: 'P4', type: 'full', x: 650, y: 300, peers: ['Bootstrap', 'P3'], mempool: [], chain: [], latency: 100 },
      { id: 'P5', type: 'full', x: 800, y: 300, peers: ['Bootstrap'], mempool: [], chain: [], latency: 100 },
    ],
    connections: [
      { id: 'b1', from: 'Bootstrap', to: 'P1', latency: 1200 },
      { id: 'b2', from: 'Bootstrap', to: 'P2', latency: 1200 },
      { id: 'b3', from: 'Bootstrap', to: 'P3', latency: 1200 },
      { id: 'b4', from: 'Bootstrap', to: 'P4', latency: 1200 },
      { id: 'b5', from: 'Bootstrap', to: 'P5', latency: 1200 },
      { id: 'p12', from: 'P1', to: 'P2', latency: 1000 },
      { id: 'p34', from: 'P3', to: 'P4', latency: 1000 },
    ],
    packets: []
  },
  briefing: {
    arch: [
      { label: 'BOOTSTRAP_NODES', desc: 'Hardcoded entry points (DNS Seeds) that provide the first set of peer IP addresses.' },
      { label: 'NEW_PARTICIPANT', desc: 'A "Fresh" node with an empty Peer Table. It must perform discovery to join the overlay.' },
      { label: 'ADDR_PACKETS', desc: 'Special messages containing a list of known active nodes in the network.' }
    ],
    logic: [
      { label: 'RECURSIVE_QUERY', desc: 'The new node asks its first peer for more peers, who then provide even more, leading to exponential discovery.' },
      { label: 'NETWORK_CRAWLING', desc: 'Nodes continuously "Crawl" the network to maintain a fresh list of neighbors in case of failures.' },
      { label: 'HANDSHAKE_CHAIN', desc: 'Observe how a single connection to the Bootstrap node triggers a chain reaction of new links.' }
    ]
  },
  action: ({ connectNodes, broadcast, togglePause, isPaused }) => {
    if (isPaused) togglePause();
    // Stage 1: Connect to Bootstrap
    connectNodes('New-Node', 'Bootstrap');
    
    // Stage 2: Request Peers from Bootstrap
    setTimeout(() => {
      broadcast('New-Node', 'transaction', 'GET_ADDR');
    }, 800);

    // Stage 3: Bootstrap Responds
    setTimeout(() => {
      broadcast('Bootstrap', 'transaction', 'ADDR_LIST');
    }, 1600);

    // Stage 4: Connect to discovered peers
    setTimeout(() => {
      connectNodes('New-Node', 'P1');
      setTimeout(() => broadcast('New-Node', 'transaction', 'HELLO_P1'), 400);
    }, 2400);

    setTimeout(() => {
      connectNodes('New-Node', 'P2');
      setTimeout(() => broadcast('New-Node', 'transaction', 'HELLO_P2'), 400);
    }, 3200);

    setTimeout(() => {
      connectNodes('New-Node', 'P3');
      setTimeout(() => broadcast('New-Node', 'transaction', 'HELLO_P3'), 400);
    }, 4000);

    setTimeout(() => {
      connectNodes('New-Node', 'P4');
      setTimeout(() => broadcast('New-Node', 'transaction', 'HELLO_P4'), 400);
    }, 4800);

    setTimeout(() => {
      connectNodes('New-Node', 'P5');
      setTimeout(() => broadcast('New-Node', 'transaction', 'HELLO_P5'), 400);
    }, 5600);
  }
};
