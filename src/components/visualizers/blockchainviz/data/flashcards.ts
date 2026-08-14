export interface BlockchainFlashcard {
  id: string;
  category: 'Cryptography & Hashing' | 'Consensus & P2P' | 'EVM & Smart Contracts' | 'Security & Scaling';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const BLOCKCHAIN_FLASHCARDS: BlockchainFlashcard[] = [
  {
    id: 'bf-1',
    category: 'Cryptography & Hashing',
    difficulty: 'Junior',
    question: 'How does Merkle Tree enable $O(\\log N)$ transaction inclusion verification for Light Clients?',
    answer: 'Instead of downloading every transaction in a block, a light client only needs the Merkle Root from the 80-byte block header and $O(\\log N)$ sibling hashes along the branch (the Merkle Proof). Hashing the transaction with the proof elements reconstructs the root, proving inclusion in milliseconds.',
    code: `// 1,024 Transactions -> Only 10 sibling hashes needed!
// 1,048,576 Transactions -> Only 20 sibling hashes needed!`,
    tip: 'SPV (Simplified Payment Verification) wallets in Bitcoin rely exclusively on Merkle proofs.'
  },
  {
    id: 'bf-2',
    category: 'EVM & Smart Contracts',
    difficulty: 'Mid',
    question: 'What is the difference between Memory, Storage, and Calldata in the Ethereum Virtual Machine (EVM)?',
    answer: '1. Storage: Persistent, 32-byte key-value mapping on disk (20,000 gas for cold write). 2. Memory: Volatile, byte-addressable scratchpad cleared after transaction execution (cheap linear + quadratic expansion gas). 3. Calldata: Read-only, non-modifiable byte array containing transaction payload (cheapest memory space).',
    code: `function processData(bytes calldata data) external pure {
  // calldata avoids copying array into memory, saving gas!
}`,
    tip: 'Always declare external function array parameters as calldata instead of memory to save significant gas.'
  },
  {
    id: 'bf-3',
    category: 'Security & Scaling',
    difficulty: 'Senior',
    question: 'How does the Checks-Effects-Interactions pattern prevent Reentrancy attacks?',
    answer: 'By modifying contract internal state (such as setting user balance to 0) BEFORE making external Ether transfers or calls to foreign addresses. If the recipient contract attempts to re-enter the withdrawal function in its fallback, the check phase (require(balance > 0)) immediately fails and reverts the transaction.',
    code: `// Checks: require(balance > 0);
// Effects: balance = 0;
// Interactions: (bool s, ) = msg.sender.call{value: amount}("");`,
    tip: 'Combine Checks-Effects-Interactions with OpenZeppelin ReentrancyGuard for defense-in-depth.'
  },
  {
    id: 'bf-4',
    category: 'Consensus & P2P',
    difficulty: 'Senior',
    question: 'What is the difference between Bitcoin UTXO model and Ethereum Account model?',
    answer: 'Bitcoin uses Unspent Transaction Outputs (UTXOs): each transaction consumes previous UTXOs as inputs and generates new immutable outputs (like dollar bills). Ethereum uses an Account State transition model where accounts have explicit balances and nonces, with smart contracts maintaining private storage slot trees.',
    code: `# UTXO: Coin-centric, high parallel validation, stateless
# Account: State-centric, easy smart contracts, sequential nonce`,
    tip: 'UTXO prevents race conditions by design; Account model requires nonces to prevent replay attacks.'
  },
  {
    id: 'bf-5',
    category: 'Security & Scaling',
    difficulty: 'Staff',
    question: 'What is the fundamental architectural difference between Optimistic Rollups and ZK-Rollups?',
    answer: 'Optimistic Rollups assume all Layer-2 state transitions are valid and rely on a 7-day Fraud Proof challenge window (anyone can submit a fault proof to revert invalid batches). ZK-Rollups use cryptographic Zero-Knowledge validity proofs (ZK-SNARKs/STARKs) verified directly on Layer-1 smart contracts, enabling instant mathematical finality without 7-day withdrawal delays.',
    code: `# Optimistic: Arbitrum / Optimism (7-day fraud proof window)
# ZK-Rollup: zkSync / Starknet / Scroll (Instant ZK validity proof)`,
    tip: 'ZK-Rollups require high off-chain prover computation, but provide mathematically guaranteed instant settlement on L1.'
  }
];
