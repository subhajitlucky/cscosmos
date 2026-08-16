export type NodeType = 'full' | 'light' | 'miner';
export type PacketType = 'transaction' | 'block';

export interface Node {
  id: string;
  type: 'full' | 'light' | 'miner';
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  peers: string[];
  mempool: string[];
  chain: string[];
  latency: number;
  isMalicious?: boolean;
  isDown?: boolean;
  hopCount?: number;
  isReorging?: boolean;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  latency: number;
}

export interface Packet {
  id: string;
  type: PacketType;
  payloadId: string;
  from: string;
  to: string;
  startTime: number;
  duration: number;
  progress: number; // 0 to 1
  hops?: number;
  fanOut?: number;
  fee?: number;
  isRejected?: boolean;
}

export interface NetworkState {
  nodes: Node[];
  connections: Connection[];
  packets: Packet[];
  stats?: {
    duplicatesPrevented: number;
    totalTransmissions: number;
    failedRequests: number;
  };
}