import type { Node, LBAlgorithm } from './types';

let rrIndex = 0;

export function selectNode(nodes: Node[], algorithm: LBAlgorithm, seed?: string): Node | null {
  const healthyNodes = nodes.filter(n => n.status === 'healthy');
  if (healthyNodes.length === 0) return null;

  switch (algorithm) {
    case 'round-robin': {
      const node = healthyNodes[rrIndex % healthyNodes.length];
      rrIndex = (rrIndex + 1) % healthyNodes.length;
      return node;
    }

    case 'weighted-round-robin': {
      const totalWeight = healthyNodes.reduce((acc, n) => acc + n.weight, 0);
      let random = Math.random() * totalWeight;
      for (const node of healthyNodes) {
        if (random < node.weight) return node;
        random -= node.weight;
      }
      return healthyNodes[0];
    }

    case 'least-connections':
      return [...healthyNodes].sort((a, b) => a.currentConnections - b.currentConnections)[0];

    case 'least-response-time':
      return [...healthyNodes].sort((a, b) => {
        const scoreA = a.baseLatency + (a.currentConnections * 50);
        const scoreB = b.baseLatency + (b.currentConnections * 50);
        return scoreA - scoreB;
      })[0];

    case 'random':
      return healthyNodes[Math.floor(Math.random() * healthyNodes.length)];

    case 'ip-hash': {
      if (!seed) return healthyNodes[0];
      // Better hash function (DJB2-like) for better distribution
      let hash = 5381;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) + hash) + seed.charCodeAt(i);
      }
      // Add a second pass to mix bits further
      hash = hash ^ (hash >>> 16);
      return healthyNodes[Math.abs(hash) % healthyNodes.length];
    }

    default:
      return healthyNodes[0];
  }
}