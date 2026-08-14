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
    mentalModel: 'The Wax-Sealed Ledger: Each page in the notary notebook has a wax stamp containing a microdot photograph of the previous page. If someone rips out or modifies page 2, the wax seal on page 3 immediately breaks, alerting everyone in the room.',
    codeSnippet: `// Cryptographic Block Linkage:
interface Block {
  index: number;
  timestamp: number;
  previousHash: string; // Cryptographic pointer to parent
  merkleRoot: string;   // Summary hash of all transactions
  nonce: number;        // Proof of Work solution
  hash: string;         // SHA-256(index + prevHash + merkleRoot + nonce)
}

// Block 2 commits to Block 1:
// Block 2: { prevHash: "0000a4b9...", hash: "0000f81c..." }
// Block 3: { prevHash: "0000f81c...", hash: "00003e8a..." }`,
    takeaways: [
      'Each block header contains the SHA-256/Keccak-256 hash of the parent block.',
      'Modifying any transaction in Block #N changes its Merkle Root, which alters Block #N\'s hash, invalidating the previousHash pointers of all subsequent blocks.',
      'Distributed peer nodes reject any chain with broken cryptographic hash links.'
    ],
    commonPitfall: {
      mistake: 'Assuming blockchain immutability is enforced by central servers rather than decentralized cryptographic consensus across thousands of independent validator nodes.',
      fix: 'Understand that immutability arises from the computational cost of re-mining the entire chain (longest chain rule) across a decentralized network.'
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
// "8a9f204b12c8..."

// Modifying ONE letter:
const hash2 = sha256('Transfer 10 BTC to Bob');
// "3d4e81fa09c2..." (Completely different 256-bit hash!)`,
    takeaways: [
      'Deterministic: The exact same input always generates the exact same 256-bit output hash.',
      'Pre-image Resistance: Computationally infeasible to reverse-engineer input $X$ from output hash $H(X)$.',
      'Collision Resistance: Infeasible to find two different inputs $X$ and $Y$ where $H(X) == H(Y)$.'
    ],
    commonPitfall: {
      mistake: 'Confusing Keccak-256 (used in Ethereum EVM) with standard NIST SHA-3 (which added different padding bytes in 2015).',
      fix: 'Use keccak256 (OpenZeppelin / ethers.js) when interacting with Ethereum smart contracts.'
    },
    nextTopicId: 'public-key-crypto-secp256k1'
  },
  {
    id: 'public-key-crypto-secp256k1',
    title: 'Public Key Cryptography & Secp256k1 ECDSA Signatures',
    category: 'cryptography',
    difficulty: 'Advanced',
    summary: 'Blockchains use Elliptic Curve Cryptography (ECDSA on curve secp256k1) where a 256-bit private key generates a public key via elliptic curve scalar point multiplication: Public Key = Private Key * G.',
    mentalModel: 'The Digital Signature Stamp: Anyone can verify your signature using your public wax seal, but only you possess the private physical signet ring to produce authentic stamp impressions.',
    codeSnippet: `// ECDSA Signature Generation & Recovery:
// 1. Private Key (Random 256-bit integer scalar k):
// 2. Public Key = k * G (Point on y^2 = x^3 + 7 over finite field)
// 3. Ethereum Address = Last 20 bytes of Keccak256(PublicKey)

// Solidity ecrecover verification:
function verifySignature(
  bytes32 hash,
  uint8 v,
  bytes32 r,
  bytes32 s
) public pure returns (address) {
  return ecrecover(hash, v, r, s);
}`,
    takeaways: [
      'Asymmetry: Multiplying private key $k$ with base point $G$ is trivial; finding $k$ from public key point $K$ is the Discrete Log Problem (computationally impossible).',
      'ecrecover in Ethereum: Allows smart contracts to verify off-chain signatures (ERC-2612 gasless permits) without paying gas for on-chain transactions.',
      'Malleability: Signatures (r, s) must enforce low-s values (s < secp256k1_n / 2) to prevent signature malleability exploits.'
    ],
    commonPitfall: {
      mistake: 'Using ecrecover without checking if the returned address is address(0), which occurs on invalid signature inputs.',
      fix: 'Use OpenZeppelin\'s ECDSA.recover() library which automatically reverts on invalid signatures and malleability.'
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
    codeSnippet: `// Merkle Proof Verification in Solidity (O(log N)):
function verifyMerkleProof(
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
      'SPV (Simplified Payment Verification) Light Clients: Verify a transaction was included in a block with only O(log N) sibling hashes (e.g. 10 hashes for 1,024 transactions).',
      'Merkle Airdrops: Distribute tokens to 1,000,000 eligible addresses by storing only ONE 32-byte Merkle Root on-chain, saving millions in deployment gas.',
      'Immutable integrity: Changing a single transaction flips every parent hash up to the root.'
    ],
    commonPitfall: {
      mistake: 'Second Preimage Attacks in Merkle Trees: Allowing intermediate nodes (64 bytes) to be submitted as leaf nodes.',
      fix: 'Prefix leaf hashes with a domain separator byte: keccak256(abi.encodePacked(bytes1(0x00), data)).'
    },
    nextTopicId: 'evm-architecture-stack-machine'
  },
  {
    id: 'evm-architecture-stack-machine',
    title: 'Ethereum Virtual Machine (EVM) 256-Bit Stack Machine',
    category: 'evm',
    difficulty: 'Advanced',
    summary: 'The EVM is a quasi-Turing complete, 256-bit word-sized stack machine executing bytecode instructions with isolated volatile Memory and persistent Storage slots.',
    mentalModel: 'The Pez Candy Dispenser & The File Cabinet: The EVM Stack is a Pez dispenser holding up to 1,024 candy pieces (256-bit words) accessed LIFO. Volatile Memory is your scratchpad on the desk (erased when transaction finishes); Storage is the steel fireproof file cabinet (persisted on disk forever).',
    codeSnippet: `// EVM Opcode Execution Flow:
// Code: a + b
// 1. PUSH1 0x05 (Stack: [5])
// 2. PUSH1 0x07 (Stack: [7, 5])
// 3. ADD        (Pops 7 and 5, pushes 12 -> Stack: [12])

// Memory vs Storage in Solidity:
contract EvmStorageDemo {
  uint256 public storedNumber; // Storage Slot 0 (Persistent, 20,000 Gas write)

  function compute(uint256 a) public pure returns (uint256) {
    uint256 temp = a * 2; // Memory / Stack (Volatile, cheap 3 Gas)
    return temp;
  }
}`,
    takeaways: [
      'Stack: 1,024 depth limit with 256-bit word size (native support for Keccak256 and Secp256k1 integers).',
      'Memory: Volatile, byte-addressable linear array expanded dynamically in 32-byte chunks (quadratic gas expansion cost).',
      'Storage: Persistent key-value store mapping $2^{256}$ 32-byte slots to 32-byte values.'
    ],
    commonPitfall: {
      mistake: 'Stack Too Deep Error: Trying to reference more than 16 local variables inside a Solidity function (EVM only allows DUP1 to DUP16 stack access).',
      fix: 'Group related variables into a struct or extract helper functions.'
    },
    nextTopicId: 'evm-opcodes-gas-calculation'
  },
  {
    id: 'evm-opcodes-gas-calculation',
    title: 'EVM Gas Dynamics & Storage Slot Optimization (SSTORE/SLOAD)',
    category: 'evm',
    difficulty: 'Expert',
    summary: 'Gas is the execution fee unit measuring computational work and disk writes. SSTORE writes to uninitialized slots cost 20,000 gas, while warm reads (SLOAD) cost 100 gas.',
    mentalModel: 'The Metered Taxi: Every kilometer driven on the highway costs 3 cents (simple math opcodes), but stopping at toll booths and opening shipping containers costs $20 (SSTORE disk writes).',
    codeSnippet: `// Unoptimized Storage (Uses 3 separate 32-byte slots = 60,000 Gas):
contract Unoptimized {
  uint256 public a; // Slot 0
  uint8 public b;   // Slot 1
  uint256 public c; // Slot 2
}

// Optimized Struct Packing (Fits in 2 slots = saves 20,000 Gas!):
contract Optimized {
  uint128 public a; // Slot 0 (16 bytes)
  uint128 public b; // Slot 0 (16 bytes) -> Packed together in 32 bytes!
  uint256 public c; // Slot 1 (32 bytes)
}`,
    takeaways: [
      'Variable Packing: Multiple variables totaling $\\le 32$ bytes are packed into a single storage slot, reducing SSTORE operations.',
      'Warm vs Cold Access: EIP-2929 charges 2,100 gas for the first access to a cold storage slot, and only 100 gas for subsequent warm accesses within the same transaction.',
      'Gas Refunds: Clearing non-zero storage slots to zero grants a gas refund (capped at 20% of total transaction gas by EIP-3529).'
    ],
    commonPitfall: {
      mistake: 'Reading state variables repeatedly inside a loop (e.g. for (uint i = 0; i < array.length; i++)), paying SLOAD gas on every iteration.',
      fix: 'Cache the length in a local memory variable: uint256 len = array.length; for (uint i = 0; i < len; i++).'
    },
    nextTopicId: 'smart-contract-reentrancy-checks-effects'
  },
  {
    id: 'smart-contract-reentrancy-checks-effects',
    title: 'Reentrancy Vulnerability & Checks-Effects-Interactions Pattern',
    category: 'security',
    difficulty: 'Expert',
    summary: 'The infamous DAO Hack ($60M stolen in 2016): An external ETH transfer hands execution control to the recipient fallback function before the sender balances are updated, allowing the attacker to re-enter and drain the contract.',
    mentalModel: 'The Bank Teller Loophole: The bank teller gives you cash at the counter before deducting the amount from your bank ledger. While holding the cash, you quickly ask for another withdrawal before the teller touches their computer pen.',
    codeSnippet: `// ❌ VULNERABLE CONTRACT (DAO Hack Pattern):
function withdraw() public {
  uint256 amount = balances[msg.sender];
  // 1. External Call BEFORE state update:
  (bool success, ) = msg.sender.call{value: amount}("");
  require(success);
  // 2. State update happens too late! Attacker re-entered withdraw()!
  balances[msg.sender] = 0;
}

// ✅ SECURE CONTRACT (Checks-Effects-Interactions):
function withdrawSecure() public {
  // 1. CHECKS:
  uint256 amount = balances[msg.sender];
  require(amount > 0, "No balance");

  // 2. EFFECTS (Update state FIRST):
  balances[msg.sender] = 0;

  // 3. INTERACTIONS (External call LAST):
  (bool success, ) = msg.sender.call{value: amount}("");
  require(success, "Transfer failed");
}`,
    takeaways: [
      'Always update internal contract state (balances, flags) BEFORE making external calls to untrusted addresses.',
      'Use OpenZeppelin\'s ReentrancyGuard nonReentrant modifier on sensitive external functions.',
      'Read-only Reentrancy: Even view functions can be exploited if external contracts rely on transient un-updated state.'
    ],
    commonPitfall: {
      mistake: 'Relying solely on transfer() or send() for reentrancy defense (2,300 gas stipend breaks with smart contract multisig wallets).',
      fix: 'Use .call{value: amount}("") combined with the Checks-Effects-Interactions pattern and ReentrancyGuard.'
    }
  }
];
