import { whyTrie } from '../content/topics/why-trie';
import { patriciaTrie } from '../content/topics/patricia-trie';
import { trieVsMap } from '../content/topics/trie-vs-map';
import { nibblePaths } from '../content/topics/nibble-paths';
import { nodeTypes } from '../content/topics/node-types';
import { pathCompression } from '../content/topics/path-compression';
import { merkleProofs } from '../content/topics/merkle-proofs';
import { stateUpdates } from '../content/topics/state-updates';
import { stateRoot } from '../content/topics/state-root';
import { rlpEncoding } from '../content/topics/rlp-encoding';
import type { TopicContent } from '../types/topic';

export const topicData: Record<string, TopicContent> = {
  'why-trie': whyTrie,
  'patricia-trie': patriciaTrie,
  'trie-vs-map': trieVsMap,
  'nibble-paths': nibblePaths,
  'node-types': nodeTypes,
  'path-compression': pathCompression,
  'merkle-proofs': merkleProofs,
  'state-updates': stateUpdates,
  'rlp-encoding': rlpEncoding,
  'state-root': stateRoot,
};

export const allTopics: TopicContent[] = Object.values(topicData);
