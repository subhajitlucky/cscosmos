import { Database } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const whyTrie: TopicContent = {
  id: 'why-trie',
  title: 'Why Blockchain State?',
  description: 'Understand the unique challenges of storing global state in a decentralized network.',
  definition: 'Distributed ledgers require a state transition function that is both efficient and cryptographically verifiable. The "State Explosion" problem necessitated a data structure that could map a large address space to a fixed-size Merkle Root.',
  analogy: 'A library where every book contributes to a single DNA sequence. Change one letter in one book, and the DNA is completely different.',
  deepDive: 'Standard Merkle Trees are optimal for static datasets. However, blockchain state is dynamic and sparse. A Patricia Trie (Practical Algorithm to Retrieve Information Coded in Alphanumeric) provides a deterministic, authenticated key-value store that supports O(log N) updates and efficient inclusion proofs.',
  steps: [
    { title: 'Global Consensus', description: "Nodes reach agreement on the State Root. If your local trie's root matches the network, your state is mathematically guaranteed to be identical." },
    { title: 'Merkle Integrity', description: 'Every node in the trie is identified by the hash of its content, making the structure self-verifying.' },
    { title: 'Incremental Hashing', description: 'When a value changes, only the hashes along the path to the root require re-computation, minimizing I/O and CPU overhead.' }
  ],
  visualType: 'state',
  icon: Database,
  color: 'text-blue-500',
  tag: 'Fundamentals'
};