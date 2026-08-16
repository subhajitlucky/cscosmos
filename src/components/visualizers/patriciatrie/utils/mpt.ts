import { NodeType } from '../types/trie';
import type { TrieNode, LeafNode, ExtensionNode, BranchNode, Nibble } from '../types/trie';

// Simple hash function for visualization purposes
export const hash = (data: string): string => {
  let h = 0;
  for (let i = 0; i < data.length; i++) {
    h = (Math.imul(31, h) + data.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).padStart(8, '0');
};

export const stringToNibbles = (str: string): Nibble[] => {
  const nibbles: Nibble[] = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    nibbles.push((code >> 4) & 0xf);
    nibbles.push(code & 0xf);
  }
  return nibbles;
};

export const hexToNibbles = (hex: string): Nibble[] => {
  return hex.split('').map(c => parseInt(c, 16));
};

export const nibblesToHex = (nibbles: Nibble[]): string => {
  return nibbles.map(n => n.toString(16)).join('');
};

export const getSharedPath = (path1: Nibble[], path2: Nibble[]): Nibble[] => {
  const shared: Nibble[] = [];
  const minLen = Math.min(path1.length, path2.length);
  for (let i = 0; i < minLen; i++) {
    if (path1[i] === path2[i]) {
      shared.push(path1[i]);
    } else {
      break;
    }
  }
  return shared;
};

export class MerklePatriciaTrie {
  nodes: Record<string, TrieNode> = {};
  rootHash: string | null = null;
  affectedNodes: Set<string> = new Set();

  constructor() {}

  clone(): MerklePatriciaTrie {
    const newTrie = new MerklePatriciaTrie();
    newTrie.nodes = { ...this.nodes };
    newTrie.rootHash = this.rootHash;
    newTrie.affectedNodes = new Set(this.affectedNodes);
    return newTrie;
  }

  getNode(hash: string): TrieNode | null {
    return this.nodes[hash] || null;
  }

  get(key: string): string | null {
    const nibbles = stringToNibbles(key);
    return this._get(this.rootHash, nibbles);
  }

  private _get(nodeHash: string | null, path: Nibble[]): string | null {
    if (!nodeHash) return null;
    const node = this.getNode(nodeHash);
    if (!node) return null;

    if (node.type === NodeType.LEAF) {
      if (nibblesToHex(node.path) === nibblesToHex(path)) {
        return node.value;
      }
      return null;
    }

    if (node.type === NodeType.EXTENSION) {
      const sharedPath = getSharedPath(node.path, path);
      if (sharedPath.length === node.path.length) {
        return this._get(node.nextNodeHash, path.slice(sharedPath.length));
      }
      return null;
    }

    if (node.type === NodeType.BRANCH) {
      if (path.length === 0) {
        return node.value;
      }
      const nibble = path[0];
      return this._get(node.branches[nibble], path.slice(1));
    }

    return null;
  }

  putNode(node: TrieNode): string {
    const nodeData = JSON.stringify(node);
    // Simulation of Keccak-256: 64 chars hex
    const h = hash(nodeData);
    const nodeHash = '0x' + h.repeat(8).substring(0, 64);
    const newNode = { ...node, hash: nodeHash };
    this.nodes[nodeHash] = newNode;
    this.affectedNodes.add(nodeHash);
    return nodeHash;
  }

  insert(key: string, value: string) {
    this.affectedNodes.clear();
    const nibbles = stringToNibbles(key);
    this.rootHash = this._insert(this.rootHash, nibbles, value);
  }

  delete(key: string) {
    this.affectedNodes.clear();
    const nibbles = stringToNibbles(key);
    this.rootHash = this._delete(this.rootHash, nibbles);
  }

  private _insert(nodeHash: string | null, path: Nibble[], value: string): string {
    if (!nodeHash) {
      const leaf: LeafNode = {
        type: NodeType.LEAF,
        path,
        value,
        hash: ''
      };
      return this.putNode(leaf);
    }

    const node = this.getNode(nodeHash)!;

    if (node.type === NodeType.LEAF) {
      const sharedPath = getSharedPath(node.path, path);
      
      if (sharedPath.length === node.path.length && sharedPath.length === path.length) {
        // Update existing leaf
        const updatedLeaf: LeafNode = { ...node, value };
        return this.putNode(updatedLeaf);
      }

      // Create a branch node
      const branch: BranchNode = {
        type: NodeType.BRANCH,
        branches: Array(16).fill(null),
        value: null,
        hash: ''
      };

      const remainingPathNode = node.path.slice(sharedPath.length);
      const remainingPathNew = path.slice(sharedPath.length);

      if (remainingPathNode.length === 0) {
        branch.value = node.value;
      } else {
        const nibble = remainingPathNode[0];
        branch.branches[nibble] = this._insert(null, remainingPathNode.slice(1), node.value);
      }

      if (remainingPathNew.length === 0) {
        branch.value = value;
      } else {
        const nibble = remainingPathNew[0];
        branch.branches[nibble] = this._insert(null, remainingPathNew.slice(1), value);
      }

      const branchHash = this.putNode(branch);

      if (sharedPath.length > 0) {
        const extension: ExtensionNode = {
          type: NodeType.EXTENSION,
          path: sharedPath,
          nextNodeHash: branchHash,
          hash: ''
        };
        return this.putNode(extension);
      }
      return branchHash;
    }

    if (node.type === NodeType.EXTENSION) {
      const sharedPath = getSharedPath(node.path, path);

      if (sharedPath.length === node.path.length) {
        const nextNodeHash = this._insert(node.nextNodeHash, path.slice(sharedPath.length), value);
        const updatedExtension: ExtensionNode = { ...node, nextNodeHash };
        return this.putNode(updatedExtension);
      }

      // Split extension node
      const branch: BranchNode = {
        type: NodeType.BRANCH,
        branches: Array(16).fill(null),
        value: null,
        hash: ''
      };

      const remainingPathNode = node.path.slice(sharedPath.length);
      const remainingPathNew = path.slice(sharedPath.length);

      // Node path part
      if (remainingPathNode.length === 1) {
        branch.branches[remainingPathNode[0]] = node.nextNodeHash;
      } else {
        const subExtension: ExtensionNode = {
          type: NodeType.EXTENSION,
          path: remainingPathNode.slice(1),
          nextNodeHash: node.nextNodeHash,
          hash: ''
        };
        branch.branches[remainingPathNode[0]] = this.putNode(subExtension);
      }

      // New path part
      if (remainingPathNew.length === 0) {
        branch.value = value;
      } else {
        const nibble = remainingPathNew[0];
        branch.branches[nibble] = this._insert(null, remainingPathNew.slice(1), value);
      }

      const branchHash = this.putNode(branch);

      if (sharedPath.length > 0) {
        const extension: ExtensionNode = {
          type: NodeType.EXTENSION,
          path: sharedPath,
          nextNodeHash: branchHash,
          hash: ''
        };
        return this.putNode(extension);
      }
      return branchHash;
    }

    if (node.type === NodeType.BRANCH) {
      if (path.length === 0) {
        const updatedBranch: BranchNode = { ...node, value };
        return this.putNode(updatedBranch);
      }

      const nibble = path[0];
      const updatedBranches = [...node.branches];
      updatedBranches[nibble] = this._insert(node.branches[nibble], path.slice(1), value);
      
      const updatedBranch: BranchNode = { ...node, branches: updatedBranches };
      return this.putNode(updatedBranch);
    }

    return nodeHash;
  }

  private _delete(nodeHash: string | null, path: Nibble[]): string | null {
    if (!nodeHash) return null;

    const node = this.getNode(nodeHash)!;

    if (node.type === NodeType.LEAF) {
      if (nibblesToHex(node.path) === nibblesToHex(path)) {
        delete this.nodes[nodeHash];
        return null;
      }
      return nodeHash;
    }

    if (node.type === NodeType.EXTENSION) {
      const sharedPath = getSharedPath(node.path, path);
      if (sharedPath.length === node.path.length) {
        const nextNodeHash = this._delete(node.nextNodeHash, path.slice(sharedPath.length));
        if (!nextNodeHash) {
          delete this.nodes[nodeHash];
          return null;
        }
        
        const nextNode = this.getNode(nextNodeHash)!;
        if (nextNode.type === NodeType.EXTENSION) {
          const mergedExtension: ExtensionNode = {
            type: NodeType.EXTENSION,
            path: [...node.path, ...nextNode.path],
            nextNodeHash: nextNode.nextNodeHash,
            hash: ''
          };
          delete this.nodes[nodeHash];
          delete this.nodes[nextNodeHash];
          return this.putNode(mergedExtension);
        }

        const updatedExtension: ExtensionNode = { ...node, nextNodeHash };
        return this.putNode(updatedExtension);
      }
      return nodeHash;
    }

    if (node.type === NodeType.BRANCH) {
      const updatedBranches = [...node.branches];
      let updatedValue = node.value;

      if (path.length === 0) {
        updatedValue = null;
      } else {
        const nibble = path[0];
        updatedBranches[nibble] = this._delete(node.branches[nibble], path.slice(1));
      }

      // Check if branch can be collapsed
      const activeBranches = updatedBranches.filter(b => b !== null);
      if (activeBranches.length === 0 && !updatedValue) {
        delete this.nodes[nodeHash];
        return null;
      }

      if (activeBranches.length === 1 && !updatedValue) {
        const index = updatedBranches.findIndex(b => b !== null);
        const remainingNodeHash = updatedBranches[index]!;
        const remainingNode = this.getNode(remainingNodeHash)!;
        
        delete this.nodes[nodeHash];

        if (remainingNode.type === NodeType.LEAF) {
          const newLeaf: LeafNode = {
            type: NodeType.LEAF,
            path: [index, ...remainingNode.path],
            value: remainingNode.value,
            hash: ''
          };
          delete this.nodes[remainingNodeHash];
          return this.putNode(newLeaf);
        }

        if (remainingNode.type === NodeType.EXTENSION) {
          const newExtension: ExtensionNode = {
            type: NodeType.EXTENSION,
            path: [index, ...remainingNode.path],
            nextNodeHash: remainingNode.nextNodeHash,
            hash: ''
          };
          delete this.nodes[remainingNodeHash];
          return this.putNode(newExtension);
        }

        const newExtension: ExtensionNode = {
          type: NodeType.EXTENSION,
          path: [index],
          nextNodeHash: remainingNodeHash,
          hash: ''
        };
        return this.putNode(newExtension);
      }

      const updatedBranch: BranchNode = { ...node, branches: updatedBranches, value: updatedValue };
      return this.putNode(updatedBranch);
    }

    return nodeHash;
  }

  getProof(key: string): (TrieNode | null)[] {
    const nibbles = stringToNibbles(key);
    const proof: (TrieNode | null)[] = [];
    this._getProof(this.rootHash, nibbles, proof);
    return proof;
  }

  private _getProof(nodeHash: string | null, path: Nibble[], proof: (TrieNode | null)[]) {
    if (!nodeHash) return;
    const node = this.getNode(nodeHash);
    proof.push(node);
    if (!node) return;

    if (node.type === NodeType.LEAF) {
      return;
    }

    if (node.type === NodeType.EXTENSION) {
      const sharedPath = getSharedPath(node.path, path);
      if (sharedPath.length === node.path.length) {
        this._getProof(node.nextNodeHash, path.slice(sharedPath.length), proof);
      }
      return;
    }

    if (node.type === NodeType.BRANCH) {
      if (path.length === 0) return;
      const nibble = path[0];
      this._getProof(node.branches[nibble], path.slice(1), proof);
    }
  }
}