import type { Block, Transaction } from './types';
import { generateHash } from '../utils/hash';

export const BlockFactory = {
  createGenesis: (): Block => ({
    id: '0000abc',
    prevHash: '0',
    nonce: 0,
    timestamp: Date.now(),
    transactions: [],
    minerId: 'SYSTEM'
  }),

  createBlock: (
    prevBlock: Block,
    transactions: Transaction[],
    minerId: string,
    nonce: number = 0
  ): Block => {
    const timestamp = Date.now();
    const id = generateHash(prevBlock.id + timestamp + JSON.stringify(transactions) + nonce);
    
    return {
      id,
      prevHash: prevBlock.id,
      nonce,
      timestamp,
      transactions,
      minerId
    };
  }
};