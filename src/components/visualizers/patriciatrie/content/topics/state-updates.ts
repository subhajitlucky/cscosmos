import { Activity } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const stateUpdates: TopicContent = {
  id: 'state-updates',
  title: 'State Updates & Deltas',
  description: 'How the trie handles changes between blocks efficiently.',
  definition: 'State updates in a Merkle Patricia Trie are persistent and copy-on-write, ensuring that historical state can be preserved through "Path Shadowing".',
  analogy: 'Imagine a giant LEGO castle. If you change one brick on a tower, you don\'t rebuild the whole castle—you only swap the affected section and its support structure.',
  deepDive: 'When a leaf is updated, its hash changes. This invalidates the parent Branch node, which must also be re-hashed with the new child hash. This "ripple" continues up to the root, effectively creating a new version of the tree that shares unchanged nodes with the previous version.',
  steps: [
    { title: 'Immutability', description: 'Nodes are never updated in-place. Instead, new nodes are added to the database with new hashes.' },
    { title: 'State Persistence', description: 'Old versions of the trie remain accessible, which is vital for handling chain reorganizations (forks).' },
    { title: 'Hash Recalculation', description: 'Only the O(log N) nodes along the modified path are updated, making state transitions highly efficient.' }
  ],
  visualType: 'state-update',
  icon: Activity,
  color: 'text-cyan-500',
  tag: 'Lifecycle'
};