import { Database } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const stateRoot: TopicContent = {
  id: 'state-root',
  title: 'The State Root: The Cryptographic Anchor',
  description: 'Master the final 32-byte cryptographic fingerprint of the network.',
  definition: 'The State Root is the 32-byte Keccak-256 digest of the root node, serving as a recursive cryptographic commitment to the entire global state of the blockchain.',
  analogy: 'A DNA sample from a single hair that identifies the entire organism. If one cell changes, the DNA signature becomes invalid.',
  deepDive: 'In a Merkle Patricia Trie, every node is identified by the hash of its contents. Because nodes contain the hashes of their children, the root node\'s hash is mathematically dependent on every single key-value pair in the database. This allows a light client to verify the entire 500GB+ state of Ethereum using just this single 32-byte string found in the Block Header.',
  steps: [
    { title: 'Recursive Hashing', description: 'The root hash is calculated bottom-up. Leaf hashes flow into Branches, which flow into Extensions, eventually culminating in the single Root Hash.' },
    { title: 'Deterministic Truth', description: 'Because the Patricia Trie is deterministic, two nodes processing the same transactions will always arrive at the exact same 32-byte Root.' },
    { title: 'Stateless Verification', description: 'The State Root acts as the "Verification Anchor" for all Merkle Proofs, enabling trustless interaction without storing the full state.' }
  ],
  visualType: 'root-anchor',
  icon: Database,
  color: 'text-blue-600',
  tag: 'Finality'
};