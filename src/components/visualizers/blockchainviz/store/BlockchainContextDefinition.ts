import { createContext } from 'react';
import type { Block, Transaction } from '../lib/types';

export interface BlockchainContextType {
  chain: Block[];
  mempool: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
  mineBlock: () => void;
  updateTransaction: (blockIndex: number, txIndex: number, newAmount: number) => void;
  resetChain: () => void;
  validateChain: () => void;
}

export const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);
