export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export type Node = {
  id: string;
  hash: string;
  data?: string;
  leftId?: string;
  rightId?: string;
  parentId?: string;
  level: number;
  isLeaf: boolean;
};

export class MerkleTree {
  nodes: Map<string, Node> = new Map();
  levels: Node[][] = [];
  rootId: string = '';

  constructor() {}

  async build(dataItems: string[]) {
    this.nodes.clear();
    this.levels = [];
    
    if (dataItems.length === 0) {
      this.rootId = '';
      return;
    }

    // Level 0: Leaves
    let currentLevel: Node[] = [];
    for (let i = 0; i < dataItems.length; i++) {
      const data = dataItems[i];
      const hash = await sha256(data);
      const node: Node = {
        id: `leaf-${i}-${Date.now()}`,
        hash,
        data,
        level: 0,
        isLeaf: true
      };
      this.nodes.set(node.id, node);
      currentLevel.push(node);
    }
    this.levels.push(currentLevel);

    // Build levels upwards
    let level = 0;
    while (currentLevel.length > 1) {
      const nextLevel: Node[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left; // Duplicate if odd
        
        const combinedHash = left.id === right.id 
          ? await sha256(left.hash) 
          : await sha256(left.hash + right.hash);
          
        const parentNode: Node = {
          id: `node-${level + 1}-${i / 2}-${Date.now()}`,
          hash: combinedHash,
          level: level + 1,
          isLeaf: false,
          leftId: left.id,
          rightId: right.id
        };
        
        left.parentId = parentNode.id;
        if (left !== right) {
          right.parentId = parentNode.id;
        }
        
        this.nodes.set(parentNode.id, parentNode);
        nextLevel.push(parentNode);
      }
      this.levels.push(nextLevel);
      currentLevel = nextLevel;
      level++;
    }
    
    this.rootId = currentLevel[0].id;
  }

  getProof(leafIndex: number): { hash: string, isLeft: boolean }[] {
    const proof: { hash: string, isLeft: boolean }[] = [];
    if (this.levels.length === 0) return proof;

    let index = leafIndex;
    for (let i = 0; i < this.levels.length - 1; i++) {
      const level = this.levels[i];
      const isRight = index % 2 === 1;
      const siblingIndex = isRight ? index - 1 : index + 1;
      
      if (siblingIndex < level.length) {
        proof.push({
          hash: level[siblingIndex].hash,
          isLeft: isRight
        });
      } else {
        // Sibling is itself (odd number of nodes)
        proof.push({
          hash: level[index].hash,
          isLeft: isRight
        });
      }
      index = Math.floor(index / 2);
    }
    return proof;
  }

  static async verifyProof(leafData: string, proof: { hash: string, isLeft: boolean }[], rootHash: string): Promise<boolean> {
    let currentHash = await sha256(leafData);
    for (const p of proof) {
      if (p.isLeft) {
        currentHash = await sha256(p.hash + currentHash);
      } else {
        currentHash = await sha256(currentHash + p.hash);
      }
    }
    return currentHash === rootHash;
  }
}
