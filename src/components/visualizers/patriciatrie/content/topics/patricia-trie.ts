import { GitMerge } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const patriciaTrie: TopicContent = {
  id: 'patricia-trie',
  title: 'What is a Patricia Trie?',
  description: 'A compressed prefix tree that merges single-child nodes for efficiency.',
  definition: 'A Patricia Trie (Practical Algorithm To Retrieve Information Coded In Alphanumeric), also known as a Radix Tree, is a space-optimized Trie that compresses chains of single-child nodes into individual edges containing the substring.',
  analogy: 'Instead of writing "c" -> "a" -> "t" as three separate steps, you just write "cat" as one step. You only branch when necessary, like splitting "cat" and "car" into "ca" -> ("t", "r").',
  deepDive: 'Standard Tries waste memory on long chains of nodes with only one child. Patricia Tries eliminate this redundancy by storing whole substrings on edges. This reduces the tree height and memory footprint significantly while maintaining O(k) lookup speed, where k is the key length.',
  steps: [
    { title: 'Run the Experiment', description: 'Select "Standard" and click "car". Notice the hop count (3). Now switch to "Patricia" and click "car" again. The hop count drops to 2. You just saved a database lookup!' },
    { title: 'Spot the Difference', description: 'In Standard mode, "c" and "a" are separate nodes. In Patricia mode, they fuse into a single "ca" node (marked with "Zip"). This is Path Compression in action.' },
    { title: 'Why It Matters', description: 'Every "Hop" in the simulation represents a slow disk read in the real world. By halving the hops, Patricia Tries make Ethereum state lookups 2x faster.' }
  ],
  visualType: 'patricia-trie',
  icon: GitMerge,
  color: 'text-pink-500',
  tag: 'Fundamentals'
};
