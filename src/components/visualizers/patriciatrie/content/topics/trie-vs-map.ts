import { Info } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const trieVsMap: TopicContent = {
  id: 'trie-vs-map',
  title: 'Trie vs Tree vs Map',
  description: 'Compare different data structures and see why the Patricia Trie wins for blockchain.',
  definition: 'Patricia Tries combine the prefix-based search efficiency of Tries with the cryptographic properties of Merkle Trees, offering O(k) lookup complexity where k is the key length.',
  analogy: 'A regular Tree is like a search where you check every possible path, while a Trie is like a GPS that tells you exactly which turns to take based on the address.',
  deepDive: 'Unlike Binary Search Trees which are O(log N) and depend on entry count, Tries are O(k) and depend on key length. For 256-bit hashes, this ensures a maximum depth of 64 nibbles, regardless of whether the state contains 1 million or 1 billion accounts.',
  steps: [
    { title: 'BST Comparison', description: 'Binary Search Trees require rebalancing (like AVL) and are not natively deterministic for Merkle hashing.' },
    { title: 'Radix-16 Trie', description: 'The Trie structure follows the key nibbles directly. The "prefix" property ensures that keys with shared beginnings share the same physical path.' },
    { title: 'Deterministic Storage', description: 'The structural constraints of the Patricia Trie ensure that the same dataset always produces the exact same tree shape and hash.' }
  ],
  visualType: 'nodes',
  icon: Info,
  color: 'text-indigo-500',
  tag: 'Fundamentals'
};