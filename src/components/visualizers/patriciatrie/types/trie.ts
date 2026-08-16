export type Nibble = number; // 0-15

export const NodeType = {
  LEAF: 'LEAF',
  EXTENSION: 'EXTENSION',
  BRANCH: 'BRANCH',
  NULL: 'NULL'
} as const;

export type NodeType = typeof NodeType[keyof typeof NodeType];

export interface BaseNode {
  type: NodeType;
  hash: string;
}

export interface LeafNode extends BaseNode {
  type: typeof NodeType.LEAF;
  path: Nibble[];
  value: string;
}

export interface ExtensionNode extends BaseNode {
  type: typeof NodeType.EXTENSION;
  path: Nibble[];
  nextNodeHash: string;
}

export interface BranchNode extends BaseNode {
  type: typeof NodeType.BRANCH;
  branches: (string | null)[]; // 16 nibbles
  value: string | null;
}

export type TrieNode = LeafNode | ExtensionNode | BranchNode;

export interface TrieState {
  rootHash: string;
  nodes: Record<string, TrieNode>;
}