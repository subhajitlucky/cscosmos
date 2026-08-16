import type { Block, NodeConfig, NodeState } from './types';
import { BlockFactory } from './Block';

export class BlockchainNode {
  config: NodeConfig;
  state: NodeState;

  constructor(config: NodeConfig, genesis: Block) {
    this.config = config;
    this.state = {
      id: config.id,
      peers: [],
      isMining: false,
      chain: [genesis]
    };
  }

  get head(): Block {
    return this.state.chain[this.state.chain.length - 1];
  }

  mineAttempt(difficulty: number): Block | null {
    const nonce = Math.floor(Math.random() * 1000000);
    const candidate = BlockFactory.createBlock(
      this.head,
      [], // In real sim, pull from mempool
      this.state.id,
      nonce
    );

    const target = '0'.repeat(difficulty);
    if (candidate.id.startsWith(target)) {
      return candidate;
    }
    return null;
  }

  validateAttempt(totalStake: number): Block | null {
    // Simplified PoS: Chance to win proportional to stake
    const winProb = this.config.stake / totalStake;
    if (Math.random() < winProb * 0.1) { // 0.1 factor to slow it down
       return BlockFactory.createBlock(this.head, [], this.state.id);
    }
    return null;
  }

  receiveBlock(block: Block) {
    // Longest chain rule
    if (block.prevHash === this.head.id) {
       this.state.chain.push(block);
    } else if (this.state.chain.length < 100) { // Safety limit
       // Potential fork or older block - simplified for demo
    }
  }
}