import { GitBranch } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const nodeTypes: TopicContent = {
  id: 'node-types',
  title: 'Node Archetypes: Branch, Extension, Leaf',
  description: 'Master the three building blocks: Branch, Extension, and Leaf nodes.',
  definition: 'To achieve path compression and efficient RLP-encoding, the trie implements three specialized node architectures that optimize for both sparse and dense key distributions.',
  analogy: 'A high-speed rail network: Branch nodes are the switching stations, Extension nodes are the long-haul express tracks, and Leaf nodes are the final terminal platforms.',
  deepDive: 'The Branch node is a 17-element array: 16 slots for nibbles (0-F) and 1 for a value. Extension nodes act as "Path Shortcuts," storing a partial nibble sequence and a single child pointer. Leaf nodes terminate the path, containing the final key suffix and the RLP-encoded value (e.g., account balance, nonce, or code hash).',
  steps: [
    { title: 'Radix Divergence', description: 'Branch nodes facilitate multi-way branching, allowing the trie to handle up to 16 children per level.' },
    { title: 'Pointer Integrity', description: 'Every pointer in a Branch or Extension node is actually the 32-byte Keccak-256 hash of the child node it references.' },
    { title: 'Value Termination', description: 'Leaf nodes provide the ultimate mapping, where the cryptographic path finally resolves to concrete state data.' }
  ],
  visualType: 'archetypes',
  icon: GitBranch,
  color: 'text-emerald-500',
  tag: 'Structure'
};