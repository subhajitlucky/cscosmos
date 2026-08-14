export interface BlockchainTopic {
  id: string;
  title: string;
  category: 'foundations' | 'cryptography' | 'consensus' | 'evm' | 'scaling-l2' | 'security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const BLOCKCHAIN_TOPICS: BlockchainTopic[] = [
  {
    id: 'blockchain-architecture-immutability',
    title: 'Blockchain Architecture & Cryptographic Immutability',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'A blockchain is an append-only distributed ledger where each block cryptographically commits to the hash of the previous block, making historical tampering mathematically impossible.',
    mentalModel: 'The Wax-Sealed Ledger: Each page in the notary notebook has a wax stamp containing a microdot photograph of the previous page. If someone modifies page 2, the wax seal on page 3 immediately breaks, alerting everyone in the room.',
    codeSnippet: `interface Block {
  index: number;
  timestamp: number;
  previousHash: string; // Pointer to parent block hash
  merkleRoot: string;   // Summary hash of all block transactions
  nonce: number;        // Proof of Work solution
  hash: string;         // SHA-256(index + prevHash + merkleRoot + nonce)
}`,
    takeaways: [
      'Each block header contains the SHA-256/Keccak-256 hash of the parent block.',
      'Modifying any transaction changes its Merkle Root, invalidating the parent hash pointers of all subsequent blocks.',
      'Distributed peer nodes reject any chain with broken cryptographic hash links.'
    ],
    commonPitfall: {
      mistake: 'Assuming blockchain immutability is enforced by central servers rather than decentralized cryptographic consensus across thousands of validator nodes.',
      fix: 'Understand that immutability arises from the computational cost of re-mining the entire chain across a decentralized network.'
    },
    nextTopicId: 'cryptographic-hashing-sha256-keccak'
  },
  {
    id: 'cryptographic-hashing-sha256-keccak',
    title: 'Cryptographic Hashing: SHA-256, Keccak-256 & The Avalanche Effect',
    category: 'cryptography',
    difficulty: 'Intermediate',
    summary: 'Cryptographic hash functions are deterministic, one-way mathematical algorithms producing fixed-size digests. The Avalanche Effect guarantees that changing a single bit in the input flips >50% of the output bits.',
    mentalModel: 'The Meat Grinder: You can turn beef into minced meat in seconds, but you can never put minced meat back into the machine and reconstruct the original cow (pre-image resistance).',
    codeSnippet: `import { createHash } from 'crypto';

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

// Avalanche Effect Demonstration:
const hash1 = sha256('Transfer 10 BTC to Alice');
const hash2 = sha256('Transfer 10 BTC to Bob');`,
    takeaways: [
      'Deterministic: The exact same input always generates the exact same 256-bit output hash.',
      'Pre-image Resistance: Computationally infeasible to reverse-engineer input X from output hash H(X).',
      'Collision Resistance: Infeasible to find two different inputs X and Y where H(X) == H(Y).'
    ],
    commonPitfall: {
      mistake: 'Confusing Keccak-256 (used in Ethereum EVM) with standard NIST SHA-3 (which added different padding bytes in 2015).',
      fix: 'Use keccak256 when interacting with Ethereum smart contracts.'
    },
    nextTopicId: 'public-key-crypto-secp256k1'
  },
  {
    id: 'public-key-crypto-secp256k1',
    title: 'Public Key Cryptography & Secp256k1 ECDSA Signatures',
    category: 'cryptography',
    difficulty: 'Advanced',
    summary: 'Blockchains use Elliptic Curve Cryptography (ECDSA on curve secp256k1) where a 256-bit private key generates a public key via elliptic curve scalar point multiplication: Public Key = Private Key * G.',
    mentalModel: 'The Digital Signet Ring: Anyone can verify your signature using your public wax seal, but only you possess the private signet ring to produce authentic stamp impressions.',
    codeSnippet: `function verifySignature(
  bytes32 hash,
  uint8 v,
  bytes32 r,
  bytes32 s
) public pure returns (address) {
  return ecrecover(hash, v, r, s);
}`,
    takeaways: [
      'Asymmetry: Multiplying private key k with base point G is trivial; finding k from public key point K is the Discrete Log Problem.',
      'ecrecover in Ethereum: Allows smart contracts to verify off-chain signatures (ERC-2612 gasless permits) without paying gas for on-chain transactions.',
      'Malleability: Signatures (r, s) must enforce low-s values (s < secp256k1_n / 2) to prevent signature malleability exploits.'
    ],
    commonPitfall: {
      mistake: 'Using ecrecover without checking if the returned address is address(0), which occurs on invalid signature inputs.',
      fix: 'Use OpenZeppelin ECDSA.recover() library which automatically reverts on invalid signatures.'
    },
    nextTopicId: 'merkle-trees-integrity-proofs'
  },
  {
    id: 'merkle-trees-integrity-proofs',
    title: 'Binary Merkle Trees & O(log N) Merkle Proofs',
    category: 'cryptography',
    difficulty: 'Advanced',
    summary: 'A Merkle Tree is a binary tree of hashes where leaf nodes represent individual transactions and parent nodes store the combined hash of their children: Hash(A + B).',
    mentalModel: 'The Tournament Bracket: 16 teams play in 4 rounds to determine 1 champion (Merkle Root). To prove Team #3 was in the tournament, you only need to show the 4 match results along their specific branch, not all 15 matches.',
    codeSnippet: `function verifyMerkleProof(
  bytes32[] memory proof,
  bytes32 root,
  bytes32 leaf
) public pure returns (bool) {
  bytes32 computedHash = leaf;
  for (uint256 i = 0; i < proof.length; i++) {
    bytes32 proofElement = proof[i];
    if (computedHash <= proofElement) {
      computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
    } else {
      computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
    }
  }
  return computedHash == root;
}`,
    takeaways: [
      'SPV Light Clients: Verify a transaction was included in a block with only O(log N) sibling hashes (e.g. 10 hashes for 1,024 transactions).',
      'Merkle Airdrops: Distribute tokens to 1,000,000 eligible addresses by storing only ONE 32-byte Merkle Root on-chain.',
      'Immutable integrity: Changing a single transaction flips every parent hash up to the root.'
    ],
    commonPitfall: {
      mistake: 'Second Preimage Attacks: Allowing intermediate nodes (64 bytes) to be submitted as leaf nodes.',
      fix: 'Prefix leaf hashes with a domain separator byte: keccak256(abi.encodePacked(bytes1(0x00), data)).'
    },
    nextTopicId: 'patricia-trie-ethereum-mpt'
  },
  {
    id: 'patricia-trie-ethereum-mpt',
    title: 'Modified Merkle Patricia Trie (Ethereum State MPT)',
    category: 'cryptography',
    difficulty: 'Expert',
    summary: 'Ethereum stores all world state (accounts, nonces, balances, contract code, storage) in a Modified Merkle Patricia Trie consisting of Root, Extension, Branch, and Leaf nodes.',
    mentalModel: 'The Decimal Filing System: Like looking up a book in a library by its call number prefix, the MPT traverses key nibbles (hex digits) down shared extension nodes to locate the target account state.',
    codeSnippet: `// 4 Node Types in Ethereum MPT:
// 1. Root Node: 32-byte hash pointer in block header (stateRoot)
// 2. Extension Node: Compresses shared prefix nibbles (e.g. "a711")
// 3. Branch Node: 16 child pointers [0..f] + 1 value
// 4. Leaf Node: Contains remaining key path + RLP encoded account state`,
    takeaways: [
      'State Trie: Maps 20-byte account addresses (hashed via Keccak256) to { nonce, balance, storageRoot, codeHash }.',
      'Storage Trie: Every smart contract has its own private MPT storage trie mapped in its account storageRoot.',
      'Cryptographic state proofs: Any decentralized light client can verify an account balance with a single Merkle-Patricia proof.'
    ],
    commonPitfall: {
      mistake: 'Assuming Ethereum stores accounts in a traditional relational database SQL table.',
      fix: 'Understand that Ethereum uses LevelDB/PebbleDB as a flat key-value store holding the raw RLP nodes of the Merkle Patricia Trie.'
    },
    nextTopicId: 'utxo-vs-account-model'
  },
  {
    id: 'utxo-vs-account-model',
    title: 'State Models: Bitcoin UTXO Graph vs Ethereum Account Model',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'Bitcoin models state as a directed acyclic graph of Unspent Transaction Outputs (UTXOs). Ethereum models state as account objects with balances and execution nonces.',
    mentalModel: 'Cash in Wallet vs Bank Account Ledger: UTXO is physical cash bills (you spend a $20 bill to buy a $5 coffee and get a $15 bill as change). The Account model is your debit card checking account with a single changing balance number.',
    codeSnippet: `// Bitcoin UTXO:
// Transaction Input: References UTXO #892 (5.0 BTC)
// Transaction Outputs: [ 3.5 BTC -> Bob, 1.5 BTC -> Alice Change ]

// Ethereum Account State:
// Alice Balance: 10.0 ETH -> 6.5 ETH (Nonce: 14)
// Bob Balance: 2.0 ETH -> 5.5 ETH`,
    takeaways: [
      'UTXO: Highly parallelizable, coin-centric, eliminates race conditions and replay attacks by destroying spent inputs.',
      'Account Model: Supports complex smart contract state transitions and persistent storage slots, but requires strict sequential transaction nonces.'
    ],
    commonPitfall: {
      mistake: 'Sending multiple Ethereum transactions with the same nonce, causing the second transaction to overwrite or get stuck.',
      fix: 'Ensure sequential nonces or replace pending transactions with higher priority gas tips.'
    },
    nextTopicId: 'consensus-pow-difficulty'
  },
  {
    id: 'consensus-pow-difficulty',
    title: 'Proof of Work (PoW) & Dynamic Difficulty Adjustment',
    category: 'consensus',
    difficulty: 'Advanced',
    summary: 'Proof of Work secures decentralized ledgers by requiring miners to find a Nonce such that SHA-256(BlockHeader) < Target Difficulty.',
    mentalModel: 'The Million-Sided Dice: Miners roll million-sided dice billions of times per second until someone rolls a number smaller than the target threshold (e.g. starting with 4 zeros: 0000...).',
    codeSnippet: `function mineBlock(headerWithoutNonce, targetDifficulty) {
  let nonce = 0;
  while (true) {
    const hash = sha256(headerWithoutNonce + nonce);
    if (hash.startsWith(targetDifficulty)) {
      return { nonce, hash };
    }
    nonce++;
  }
}`,
    takeaways: [
      'Nakamoto Consensus: The longest valid chain with the most cumulative Proof of Work represents the canonical truth.',
      'Difficulty Retargeting: Bitcoin adjusts difficulty every 2,016 blocks (~2 weeks) to maintain a constant 10-minute block interval.',
      '51% Attack: An attacker with >50% hashrate can re-mine historical blocks to execute double-spending.'
    ],
    commonPitfall: {
      mistake: 'Believing miners can steal coins during a 51% attack; 51% hashrate can only rewrite recent transaction order, not forge cryptographic private key signatures.',
      fix: 'Understand the difference between cryptographic authorization (ECDSA) and consensus ordering (PoW).'
    },
    nextTopicId: 'consensus-pos-slashing'
  },
  {
    id: 'consensus-pos-slashing',
    title: 'Proof of Stake (PoS), Finality & Validator Slashing',
    category: 'consensus',
    difficulty: 'Advanced',
    summary: 'Proof of Stake replaces physical energy mining with economic collateral (32 ETH stake). Validators propose and attest to blocks, risking slashing (destruction of staked capital) for malicious behavior.',
    mentalModel: 'The Security Deposit at the Hotel: Instead of having security guards perform heavy lifting, every guest deposits $10,000 cash. If you break the furniture (double-sign blocks), your entire deposit is shredded.',
    codeSnippet: `// Ethereum PoS Consensus Architecture:
// 1. Epoch: 32 Slots (6.4 minutes)
// 2. Justification: 2/3 Supermajority of validator attestations
// 3. Finality: 2 Consecutive justified epochs = Cryptographically irreversible!
// 4. Slashing Condition: Double signing or surround voting destroys staked ETH.`,
    takeaways: [
      'Energy Efficiency: PoS reduces blockchain electricity consumption by >99.95% compared to PoW.',
      'Casper FFG Finality: Blocks become provably finalized after 2 epochs (~12.8 minutes) without relying on probabilistic confirmation depths.',
      'Inactivity Leak: If >1/3 of validators go offline, their stakes are burned until the remaining online validators regain 2/3 supermajority.'
    ],
    commonPitfall: {
      mistake: 'Running redundant validator backup keys on two servers simultaneously, which causes double-signing and immediate automated slashing.',
      fix: 'Use active-passive failover with remote slashing protection databases (Web3Signer).'
    },
    nextTopicId: 'p2p-gossip-protocol'
  },
  {
    id: 'p2p-gossip-protocol',
    title: 'P2P Gossip Networking & The Mempool',
    category: 'consensus',
    difficulty: 'Intermediate',
    summary: 'Nodes communicate over a decentralized peer-to-peer network (libp2p / devp2p) using Gossip protocols to broadcast unconfirmed transactions (Mempool) and new blocks.',
    mentalModel: 'The Rumor Mill: If you tell 8 friends a secret and each tells 8 others, the entire school of 10,000 students knows the news in just 4 conversation rounds (epidemic dissemination).',
    codeSnippet: `// Gossip Sub Protocol:
// 1. Transaction signed locally by user wallet
// 2. Broadcast to 8 connected peer nodes
// 3. Peers validate transaction against local state & add to Mempool
// 4. Peers forward to their respective 8 peers (O(log N) propagation)`,
    takeaways: [
      'Mempool: Local in-memory buffer on each node holding valid unconfirmed transactions waiting to be included in a block.',
      'Kademlia DHT: Distributed Hash Table used for peer discovery and network bootstrapping without central servers.'
    ],
    commonPitfall: {
      mistake: 'Assuming the Mempool is a single global server; each validator node maintains its own independent mempool based on its local peers.',
      fix: 'Understand that transaction propagation speed depends on peer connections and priority gas fees.'
    },
    nextTopicId: 'evm-architecture-stack-machine'
  },
  {
    id: 'evm-architecture-stack-machine',
    title: 'Ethereum Virtual Machine (EVM) 256-Bit Stack Machine',
    category: 'evm',
    difficulty: 'Advanced',
    summary: 'The EVM is a quasi-Turing complete, 256-bit word-sized stack machine executing bytecode instructions with isolated volatile Memory and persistent Storage slots.',
    mentalModel: 'The Pez Candy Dispenser: The EVM Stack is a Pez dispenser holding up to 1,024 candy pieces (256-bit words) accessed LIFO.',
    codeSnippet: `// 1. PUSH1 0x05 (Stack: [5])
// 2. PUSH1 0x07 (Stack: [7, 5])
// 3. ADD        (Stack: [12])
// 4. MSTORE 0x00 (Memory[0..32] = 12)`,
    takeaways: [
      'Stack: 1,024 depth limit with 256-bit word size.',
      'Memory: Volatile, byte-addressable linear array expanded dynamically in 32-byte chunks.',
      'Storage: Persistent key-value store mapping 2^256 32-byte slots to 32-byte values.'
    ],
    commonPitfall: {
      mistake: 'Stack Too Deep Error: Trying to reference more than 16 local variables inside a Solidity function.',
      fix: 'Group related variables into a struct or extract helper functions.'
    },
    nextTopicId: 'evm-opcodes-gas-calculation'
  },
  {
    id: 'evm-opcodes-gas-calculation',
    title: 'EVM Gas Dynamics & Storage Slot Optimization (SSTORE/SLOAD)',
    category: 'evm',
    difficulty: 'Expert',
    summary: 'Gas is the execution fee unit measuring computational work and disk writes. SSTORE writes to uninitialized slots cost 20,000 gas, while warm reads cost 100 gas.',
    mentalModel: 'The Metered Taxi: Highway driving costs 3 cents (simple math), but stopping at toll booths and opening shipping containers costs $20 (SSTORE disk writes).',
    codeSnippet: `// Struct Packing (Fits in 1 slot = saves 20,000 Gas!):
contract Optimized {
  uint128 public a; // 16 bytes
  uint128 public b; // 16 bytes -> Packed in 32 bytes (Slot 0)
}`,
    takeaways: [
      'Variable Packing: Multiple variables totaling <= 32 bytes are packed into a single storage slot.',
      'Warm vs Cold Access: EIP-2929 charges 2,100 gas for cold storage reads, 100 gas for warm reads.',
      'Gas Refunds: Clearing non-zero storage slots to zero grants a gas refund.'
    ],
    commonPitfall: {
      mistake: 'Reading state variables repeatedly inside a loop, paying SLOAD gas on every iteration.',
      fix: 'Cache array length in local memory: uint256 len = array.length; for (uint i = 0; i < len; i++).'
    },
    nextTopicId: 'solidity-storage-layout-slots'
  },
  {
    id: 'solidity-storage-layout-slots',
    title: 'Solidity Storage Layout: Dynamic Arrays & Mappings in 2^256 Keyspace',
    category: 'evm',
    difficulty: 'Expert',
    summary: 'Fixed-size variables occupy sequential 32-byte slots (0, 1, 2...). Dynamic arrays and mappings calculate storage slots non-contiguously using Keccak256 hashes across the 2^256 keyspace.',
    mentalModel: 'The Galaxy of Storage Slots: The EVM storage space has 2^256 slots (more than atoms in the known universe). Fixed variables live in the Solar System (slots 0..10); dynamic mappings live on distant stars calculated by Keccak256(key . slot).',
    codeSnippet: `contract StorageLayout {
  uint256 public x; // Slot 0
  mapping(address => uint256) public balances; // Slot 1 declaration

  // To find balances[userAddress]:
  // Storage Slot = keccak256(abi.encode(userAddress, uint256(1)))
}`,
    takeaways: [
      'Slot Collision Impossibility: Hashing mapping keys produces uniform 256-bit slot numbers, making collisions mathematically impossible.',
      'Storage Invalidation in Upgradeable Proxies: Adding new variables in the middle of storage slots corrupts proxy contract memory (use Append-Only storage).'
    ],
    commonPitfall: {
      mistake: 'Modifying the variable order in an upgradeable contract (e.g. UUPS proxy), shifting all storage slot mappings.',
      fix: 'Always append new variables to the bottom of the contract or use ERC-7201 Namespaced Storage Layout.'
    },
    nextTopicId: 'eip-1559-fee-market'
  },
  {
    id: 'eip-1559-fee-market',
    title: 'EIP-1559 Dynamic Gas Fee Market & Base Fee Burn',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'EIP-1559 replaced first-price gas auctions with a predictable Base Fee that dynamically adjusts +/-12.5% per block targeting 50% gas fullness, burning 100% of the Base Fee.',
    mentalModel: 'The Congestion Toll: If the bridge is crowded (>15M gas), the toll automatically increases by 12.5% per minute; if empty (<15M gas), the toll decreases. All toll money is burned to reduce total currency supply.',
    codeSnippet: `// Total Transaction Fee Formula:
// EffectiveGasPrice = BaseFee + min(PriorityFee, MaxFee - BaseFee)
// TotalCost = GasUsed * EffectiveGasPrice
// BurnedETH = GasUsed * BaseFee (Permanently removed from supply!)`,
    takeaways: [
      'Base Fee: Protocol-mandated fee burned on every transaction to make ETH deflationary during high network activity.',
      'Priority Fee (Tip): Direct incentive paid to block builders for rapid transaction inclusion.',
      'Max Fee: The absolute ceiling the user agrees to pay per unit of gas.'
    ],
    commonPitfall: {
      mistake: 'Setting MaxFeePerGas equal to current BaseFee during high network congestion, causing transactions to get stuck.',
      fix: 'Set MaxFeePerGas = 2 * BaseFee + PriorityFee to withstand sudden gas surges.'
    },
    nextTopicId: 'smart-contract-reentrancy-checks-effects'
  },
  {
    id: 'smart-contract-reentrancy-checks-effects',
    title: 'Reentrancy Vulnerability & Checks-Effects-Interactions Pattern',
    category: 'security',
    difficulty: 'Expert',
    summary: 'External ETH transfers hand execution control to recipient fallback functions before balances are updated, allowing attackers to re-enter and drain contract vaults.',
    mentalModel: 'The Bank Teller Loophole: The teller hands you cash before updating their computer ledger. You immediately ask for another withdrawal while the teller is still counting notes.',
    codeSnippet: `// ❌ Vulnerable (DAO Hack):
// (bool s, ) = msg.sender.call{value: amount}("");
// balances[msg.sender] = 0; // Too late!

// ✅ Secure (Checks-Effects-Interactions):
// balances[msg.sender] = 0; // Effects FIRST
// (bool s, ) = msg.sender.call{value: amount}(""); // Interactions LAST`,
    takeaways: [
      'Always update internal contract state BEFORE making external calls to untrusted addresses.',
      'Use OpenZeppelin ReentrancyGuard nonReentrant modifier on sensitive external functions.'
    ],
    commonPitfall: {
      mistake: 'Relying solely on transfer() or send() for reentrancy defense (2,300 gas stipend breaks smart contract multisig wallets).',
      fix: 'Use .call{value: amount}("") combined with Checks-Effects-Interactions and ReentrancyGuard.'
    },
    nextTopicId: 'flash-loans-defi-arbitrage'
  },
  {
    id: 'flash-loans-defi-arbitrage',
    title: 'Flash Loans & Atomic DeFi Arbitrage Invariants',
    category: 'security',
    difficulty: 'Expert',
    summary: 'Flash loans allow borrowing millions in uncollateralized crypto assets with zero upfront collateral, provided the borrowed principal plus fee is returned in the exact same atomic transaction.',
    mentalModel: 'The Time-Traveling Loan: You borrow $100 Million for 12 seconds to buy discounted gold in London and sell it in New York. If your profit trade fails, the entire universe rewinds as if the loan never happened.',
    codeSnippet: `function executeFlashLoan(uint256 amount) external {
  // 1. Borrow $10,000,000 USDC from Aave (0 Collateral)
  // 2. Buy Token X on Uniswap for $1.00
  // 3. Sell Token X on SushiSwap for $1.05 ($500,000 Profit)
  // 4. Repay $10,000,000 + 0.05% Fee to Aave
  // If balance < debt, whole transaction REVERTS!
}`,
    takeaways: [
      'Atomic Invariant: If repayment fails, the entire transaction reverts, ensuring zero credit risk for liquidity pools.',
      'Oracle Manipulation: Flash loans are frequently weaponized in DeFi exploits to artificially manipulate spot price AMM reserves.'
    ],
    commonPitfall: {
      mistake: 'Using spot AMM reserve balances (e.g. Uniswap getReserves()) as a price oracle for lending protocol collateralization.',
      fix: 'Use Time-Weighted Average Price (TWAP) or decentralized Chainlink Price Feeds.'
    },
    nextTopicId: 'layer2-rollups-optimistic-zk'
  },
  {
    id: 'layer2-rollups-optimistic-zk',
    title: 'Layer-2 Scaling: Optimistic Fraud Proofs vs ZK-Rollups',
    category: 'scaling-l2',
    difficulty: 'Advanced',
    summary: 'Layer-2 Rollups execute transactions off-chain to reduce gas fees by 95%+, compressing transaction batches and posting cryptographic proofs back to Layer-1 Ethereum.',
    mentalModel: 'The Accountant Summary Report: Instead of bringing 10,000 paper receipts to the IRS (Layer-1), your accountant bundles them into one sealed certified summary page.',
    codeSnippet: `// 1. Optimistic Rollup (Arbitrum / Optimism):
// Posts state roots optimistically; relies on 7-day Fraud Proof window.

// 2. ZK-Rollup (zkSync / Starknet / Scroll):
// Generates ZK-SNARK/STARK validity proof verified instantly on L1 smart contract!`,
    takeaways: [
      'Data Availability: EIP-4844 Blob transactions (Proto-Danksharding) provide cheap temporary data blobs for L2 rollups.',
      'Fraud Proofs (Optimistic) vs Validity Proofs (ZK): ZK-Rollups provide instant mathematical finality without 7-day withdrawal delays.'
    ],
    commonPitfall: {
      mistake: 'Assuming Layer-2 rollups sacrifice Layer-1 base security guarantees.',
      fix: 'Rollups inherit 100% of Ethereum L1 data availability and security.'
    },
    nextTopicId: 'account-abstraction-erc-4337'
  },
  {
    id: 'account-abstraction-erc-4337',
    title: 'Account Abstraction (ERC-4337) & Smart Contract Wallets',
    category: 'scaling-l2',
    difficulty: 'Advanced',
    summary: 'ERC-4337 replaces standard Externally Owned Accounts (EOAs / private key seed phrases) with programmable Smart Contract Wallets supporting session keys, gas sponsorship (Paymasters), and social recovery.',
    mentalModel: 'The Smart Smartphone vs A Physical Key: An EOA is a physical brass key (lose it, you are locked out forever). A Smart Contract Wallet is an iPhone with FaceID, Passkeys, and Apple Family recovery.',
    codeSnippet: `// UserOperation (Replaces standard transaction):
struct UserOperation {
  address sender; // Smart Contract Wallet address
  uint256 nonce;
  bytes callData;
  address paymaster; // Gas sponsored by DApp!
  bytes signature;
}`,
    takeaways: [
      'Paymasters: Allows DApps to sponsor user gas fees or accept payment in ERC-20 tokens (USDC) instead of native ETH.',
      'Session Keys: Authorize pre-approved gaming transactions for 24 hours without signing popups on every move.'
    ],
    commonPitfall: {
      mistake: 'Confusing consensus-layer account abstraction (EIP-3074/7702) with application-layer ERC-4337.',
      fix: 'ERC-4337 requires zero hard forks and runs on top of current EVM chains.'
    },
    nextTopicId: 'zero-knowledge-snarks-starks'
  },
  {
    id: 'zero-knowledge-snarks-starks',
    title: 'Zero-Knowledge Proofs: ZK-SNARKs & Arithmetic Circuits',
    category: 'cryptography',
    difficulty: 'Expert',
    summary: 'Zero-Knowledge Proofs allow a Prover to mathematically prove to a Verifier that a statement is true without revealing any secret underlying data.',
    mentalModel: 'Where is Waldo in the Large Sheet: You place a large opaque cardboard sheet with a small viewing cutout over Waldo, proving to your friend you found him without revealing his coordinates on the poster.',
    codeSnippet: `// R1CS Arithmetic Circuit:
// Proves knowledge of secret x such that: x^3 + x + 5 == 35
// Verifier checks tiny proof in 2ms without knowing x == 3!`,
    takeaways: [
      'Completeness: If the statement is true, an honest verifier will be convinced.',
      'Soundness: A cheating prover cannot convince a verifier of a false statement.',
      'Zero-Knowledge: The verifier learns nothing except that the statement is true.'
    ],
    commonPitfall: {
      mistake: 'Assuming ZK-SNARKs are only for privacy; their largest industrial use case in Web3 is succinct scalability compression (ZK-Rollups).',
      fix: 'Understand that ZK proofs enable verifying 10,000 transactions in under 2 milliseconds.'
    },
    nextTopicId: 'mev-frontrunning-flashbots'
  },
  {
    id: 'mev-frontrunning-flashbots',
    title: 'Maximal Extractable Value (MEV), Sandwich Attacks & Flashbots',
    category: 'security',
    difficulty: 'Expert',
    summary: 'MEV is the maximum profit a block builder can extract by reordering, inserting, or censoring transactions within a block (Sandwich attacks, liquidation sniping, and DEX arbitrage).',
    mentalModel: 'The Stock Exchange Front-Runner: A predatory trader sees your large market order for Apple stock in the postal mail, buys the shares ahead of you to spike the price, and immediately dumps them back to you at the top.',
    codeSnippet: `// MEV Sandwich Attack Sequence:
// 1. Attacker detects Victim DEX swap (slippage 2.0%) in public Mempool
// 2. Attacker submits Tx1 with higher gas tip: Buys Token X first (Price rises)
// 3. Victim Tx2 executes at worst slippage price (Price spikes higher)
// 4. Attacker submits Tx3: Sells Token X for guaranteed profit!`,
    takeaways: [
      'Searchers & Builders: Specialized bot algorithms scan public mempools for profitable reordering opportunities.',
      'Flashbots & MEV-Boost: Private RPC endpoints allowing users to submit transactions directly to block builders, bypassing public mempool front-running.'
    ],
    commonPitfall: {
      mistake: 'Setting excessive slippage tolerance (e.g. 5%) on decentralized exchanges in public mempools.',
      fix: 'Keep slippage under 0.5% and use MEV-protecting RPCs (Flashbots Protect).'
    }
  }
];
