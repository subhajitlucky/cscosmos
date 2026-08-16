import { Zap } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const pathCompression: TopicContent = {
  id: 'path-compression',
  title: 'Path Compression & Optimization',
  description: 'How the Trie stays shallow and fast by merging redundant nodes.',
  definition: 'Path compression transforms a standard Trie into a Radix Tree by collapsing non-branching node sequences into a single atomic "Extension" node.',
  analogy: 'Instead of having a separate zip code for every single house on a long private road, the entire road shares a single prefix, and you only distinguish the houses at the very end.',
  deepDive: 'In a sparse blockchain state (like Ethereum), most paths lead to only one child for many consecutive levels. Without compression, searching for an account would require 64 disk reads (one per nibble). Compression collapses these into 1-2 reads, drastically reducing I/O latency and gas costs for state lookups.',
  steps: [
    { title: 'Sequence Collapsing', description: 'Consecutive nodes with only one child are merged into a single Extension node containing the shared nibble path.' },
    { title: 'Dynamic Splitting', description: 'When a new key is inserted that partially matches an Extension path, the node is dynamically split into a new Branch and two children.' },
    { title: 'I/O Efficiency', description: 'Path compression is the primary reason why Merkle Patricia Tries can scale to handle billions of accounts with sub-millisecond lookup times.' }
  ],
  visualType: 'compression',
  icon: Zap,
  color: 'text-purple-500',
  tag: 'Optimization'
};