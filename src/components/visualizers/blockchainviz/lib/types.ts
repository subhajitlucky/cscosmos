export interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: number;
  signature?: string; // conceptual
}

export interface BlockHeader {
  index: number;
  previousHash: string;
  timestamp: number;
  nonce: number;
  merkleRoot: string; // Simplified for this viz
}

export interface Block {
  hash: string;
  header: BlockHeader;
  transactions: Transaction[];
  isValid: boolean; // For visualization purposes
}
