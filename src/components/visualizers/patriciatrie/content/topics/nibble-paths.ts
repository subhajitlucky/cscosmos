import { Key } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const nibblePaths: TopicContent = {
  id: 'nibble-paths',
  title: 'Key Encoding & Hex-Prefix',
  description: 'Master the conversion from raw keys to Radix-16 paths using Hex-Prefix (HP) encoding.',
  definition: 'To balance branching factor and tree depth, the trie segments 256-bit keys into 4-bit "nibbles." These are then optimized using Hex-Prefix encoding to distinguish between Leaf and Extension nodes.',
  analogy: 'A GPS that doesn\'t just tell you the turns, but uses a special flag to tell you if you\'ve reached a terminal (Leaf) or an express lane (Extension).',
  deepDive: 'Hex-Prefix (HP) encoding solves two problems: distinguishing node types and handling odd-length nibble paths. It adds a "flag nibble" at the start: 0 for Extension (even), 1 for Extension (odd), 2 for Leaf (even), and 3 for Leaf (odd). This ensures that the final encoded path always fits into a whole number of bytes.',
  steps: [
    { title: 'Nibble Decomposition', description: 'Keys are 256-bit hashes. We break them into 64 nibbles (0-15). 0xA7 becomes [0xA, 0x7].' },
    { title: 'HP Flagging', description: 'A prefix is added: 0x20 for a Leaf with even path length, 0x3 for a Leaf with odd length.' },
    { title: 'Byte Alignment', description: 'If the length is odd, the flag is packed into the first nibble. If even, the flag is 0 followed by a padding nibble.' }
  ],
  visualType: 'encoding',
  icon: Key,
  color: 'text-amber-500',
  tag: 'Structure'
};
