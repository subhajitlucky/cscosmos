import { Binary } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const rlpEncoding: TopicContent = {
  id: 'rlp-encoding',
  title: 'RLP: Recursive Length Prefix',
  description: 'The serialization format that converts trie structures into raw bytes for database storage.',
  definition: 'Recursive Length Prefix (RLP) is the primary encoding method used in Ethereum to serialize objects of arbitrary complexity, ensuring a deterministic byte-stream for every trie node.',
  analogy: 'A specialized vacuum sealer for data. It takes complex objects and flattens them into a single, unbreakable ribbon of bytes without losing the original structure.',
  deepDive: 'RLP is designed for simplicity and efficiency. It uses a prefix-based system where the first byte tells you the type (string or list) and the length of the following data. Unlike JSON, it has zero metadata overhead (no keys like "type": "leaf"), which is critical when storing millions of nodes in a LevelDB or RocksDB instance.',
  steps: [
    { title: 'String Encoding', description: 'Single bytes [0x00, 0x7f] are their own RLP. Short strings get a prefix of 0x80 + length.' },
    { title: 'List Serialization', description: 'Lists (like a Branch node\'s 17 elements) are prefixed with 0xc0 + total length of all encoded elements.' },
    { title: 'Deterministic Output', description: 'Because there are no optional fields or whitespace, the same object always produces the exact same byte-stream and hash.' }
  ],
  visualType: 'rlp',
  icon: Binary,
  color: 'text-violet-500',
  tag: 'Serialization'
};