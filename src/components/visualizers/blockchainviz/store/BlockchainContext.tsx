import React, { useState, type ReactNode } from 'react';
import type { Block, Transaction } from '../lib/types';
import { hashData, generateId } from '../lib/utils';
import { BlockchainContext } from './BlockchainContextDefinition';

// Initial Genesis Block
const createGenesisBlock = (): Block => {
  const timestamp = Date.now();
  const header = {
    index: 0,
    previousHash: "0",
    timestamp,
    nonce: 0,
    merkleRoot: "",
  };
  return {
    hash: hashData(header),
    header,
    transactions: [],
    isValid: true,
  };
};

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chain, setChain] = useState<Block[]>([createGenesisBlock()]);
  const [mempool, setMempool] = useState<Transaction[]>([]);

  const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...tx,
      id: generateId(),
      timestamp: Date.now(),
    };
    setMempool((prev) => [...prev, newTx]);
  };

  const mineBlock = () => {
    if (mempool.length === 0) return;

    const previousBlock = chain[chain.length - 1];
    const index = chain.length;
    const nonce = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();

    const transactions = [...mempool];
    const merkleRoot = hashData(transactions);

    const header = {
      index,
      previousHash: previousBlock.hash,
      timestamp,
      nonce,
      merkleRoot
    };

    const hash = hashData({ 
        index: header.index,
        previousHash: header.previousHash,
        timestamp: header.timestamp,
        nonce: header.nonce,
        transactions: transactions
    });

    const newBlock: Block = {
      hash,
      header,
      transactions,
      isValid: true,
    };

    setChain((prev) => [...prev, newBlock]);
    setMempool([]);
  };

  const updateTransaction = (blockIndex: number, txIndex: number, newAmount: number) => {
    setChain((prev) => {
      const newChain = [...prev];
      const block = { ...newChain[blockIndex] };
      const transactions = [...block.transactions];
      transactions[txIndex] = { ...transactions[txIndex], amount: newAmount };
      block.transactions = transactions;
      // Note: We don't update hash, rendering it invalid
      newChain[blockIndex] = { ...block, isValid: false }; 
      
      // Also invalidate all subsequent blocks
      for (let i = blockIndex + 1; i < newChain.length; i++) {
          newChain[i] = { ...newChain[i], isValid: false };
      }
      
      return newChain;
    });
  };

  const resetChain = () => {
    setChain([createGenesisBlock()]);
    setMempool([]);
  };
  
  const validateChain = () => {
      setChain(prevChain => {
        let isPrevValid = true;
        return prevChain.map((block, index) => {
            if (index === 0) return block;
            
            const prevBlock = prevChain[index - 1];
            const computedHash = hashData({ 
                index: block.header.index,
                previousHash: block.header.previousHash,
                timestamp: block.header.timestamp,
                nonce: block.header.nonce,
                transactions: block.transactions 
            });
            
            const isIntegrityIntact = block.hash === computedHash;
            const isLinkValid = block.header.previousHash === prevBlock.hash && isPrevValid;
            
            const isValid = isIntegrityIntact && isLinkValid;
            if (!isValid) isPrevValid = false;
            
            return { ...block, isValid };
        });
      });
  }

  return (
    <BlockchainContext.Provider value={{ chain, mempool, addTransaction, mineBlock, updateTransaction, resetChain, validateChain }}>
      {children}
    </BlockchainContext.Provider>
  );
};