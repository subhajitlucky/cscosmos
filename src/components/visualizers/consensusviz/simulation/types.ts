export interface Transaction {
  id: string;
  color: string;
  timestamp: number;
}

export interface Block {
  id: string;
  prevHash: string;
  nonce: number;
  timestamp: number;
  transactions: Transaction[];
  minerId: string;
}

export interface NetworkMessage {
  id: string;
  type: 'BLOCK_ANNOUNCEMENT';
  data: Block;
  senderId: string;
  receiverId: string;
  progress: number;
}

export interface Node {
  id: string;
  type: 'POW' | 'POS';
  chain: Block[];
  peers: string[];
  isMining: boolean;
  hashRate: number;
  currentMiningTarget?: string;
  lastMessageReceived?: string;
}

// Added for simulation files
export interface NodeConfig {
  id: string;
  type: 'POW' | 'POS';
  stake: number;
}

export interface NodeState {
  id: string;
  peers: string[];
  isMining: boolean;
  chain: Block[];
}
