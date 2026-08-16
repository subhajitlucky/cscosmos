import type { NodeConfig, Block } from './types';
import { BlockchainNode } from './Node';
import { BlockFactory } from './Block';

type NetworkPayload = {
  type: 'BLOCK';
  data: Block;
};

export class Network {
  nodes: Map<string, BlockchainNode> = new Map();
  latency: number = 500; // ms
  messageQueue: Array<{
    from: string,
    to: string,
    payload: NetworkPayload,
    deliverAt: number
  }> = [];

  constructor() {
    // Initial setup if needed
  }

  addNode(config: NodeConfig) {
    const genesis = BlockFactory.createGenesis();
    const node = new BlockchainNode(config, genesis);
    
    this.nodes.forEach(peer => {
      peer.state.peers.push(node.state.id);
      node.state.peers.push(peer.state.id);
    });

    this.nodes.set(config.id, node);
  }

  tick(timestamp: number) {
    this.messageQueue = this.messageQueue.filter(msg => {
      if (timestamp >= msg.deliverAt) {
        const recipient = this.nodes.get(msg.to);
        if (recipient) {
           if (msg.payload.type === 'BLOCK') {
             recipient.receiveBlock(msg.payload.data);
           }
        }
        return false;
      }
      return true;
    });

    this.nodes.forEach(node => {
      if (node.state.isMining) {
        if (node.config.type === 'POW') {
          const newBlock = node.mineAttempt(3);
          if (newBlock) {
             node.receiveBlock(newBlock);
             this.broadcast(node.state.id, { type: 'BLOCK', data: newBlock }, timestamp);
          }
        }
        else if (node.config.type === 'POS') {
          let totalStake = 0;
          this.nodes.forEach(n => totalStake += n.config.stake);
          
          const newBlock = node.validateAttempt(totalStake);
          if (newBlock) {
            node.receiveBlock(newBlock);
            this.broadcast(node.state.id, { type: 'BLOCK', data: newBlock }, timestamp);
          }
        }
      }
    });
  }

  broadcast(fromId: string, payload: NetworkPayload, currentTime: number) {
    const sender = this.nodes.get(fromId);
    if (!sender) return;

    sender.state.peers.forEach((peerId: string) => {
      const travelTime = this.latency + (Math.random() * this.latency * 0.5);
      this.messageQueue.push({
        from: fromId,
        to: peerId,
        payload,
        deliverAt: currentTime + travelTime
      });
    });
  }
}