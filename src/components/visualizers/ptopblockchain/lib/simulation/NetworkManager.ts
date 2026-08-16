import type { Node, Packet, NetworkState, PacketType } from './types';

export interface NetworkLog {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export class NetworkManager {
  private state: NetworkState;
  private logs: NetworkLog[] = [];
  private onStateChange: (state: NetworkState, logs: NetworkLog[]) => void;
  private speed: number = 1;
  private isPaused: boolean = false;

  constructor(initialState: NetworkState, onStateChange: (state: NetworkState, logs: NetworkLog[]) => void) {
    this.state = JSON.parse(JSON.stringify(initialState)); // Deep clone
    if (!this.state.stats) {
      this.state.stats = { duplicatesPrevented: 0, totalTransmissions: 0, failedRequests: 0 };
    }
    this.onStateChange = onStateChange;
    this.addLog('Network initialized', 'info');
  }

  public setSpeed(speed: number) {
    this.speed = speed;
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
  }

  private addLog(message: string, type: 'info' | 'success' | 'warning' = 'info') {
    const log: NetworkLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message,
      type
    };
    this.logs = [log, ...this.logs].slice(0, 50);
    this.notify();
  }

  public addNode(node: Node) {
    this.state = {
      ...this.state,
      nodes: [...this.state.nodes, { ...node }]
    };
    this.addLog(`Added node ${node.id}`, 'info');
  }

  public removeNode(id: string) {
    this.state = {
      ...this.state,
      nodes: this.state.nodes.filter(n => n.id !== id).map(n => ({
        ...n,
        peers: n.peers.filter(p => p !== id)
      })),
      connections: this.state.connections.filter(c => c.from !== id && c.to !== id),
      packets: this.state.packets.filter(p => p.from !== id && p.to !== id)
    };
    this.addLog(`Removed node ${id}`, 'warning');
  }

  public connectNodes(id1: string, id2: string) {
    const node1 = this.state.nodes.find(n => n.id === id1);
    const node2 = this.state.nodes.find(n => n.id === id2);

    if (node1 && node2 && !node1.peers.includes(id2)) {
      this.state = {
        ...this.state,
        nodes: this.state.nodes.map(n => {
          if (n.id === id1) return { ...n, peers: [...n.peers, id2] };
          if (n.id === id2) return { ...n, peers: [...n.peers, id1] };
          return n;
        }),
        connections: [
          ...this.state.connections,
          { id: `${id1}-${id2}`, from: id1, to: id2, latency: Math.random() * 1000 + 800 }
        ]
      };
      this.addLog(`Connected ${id1} and ${id2}`, 'success');
    }
  }

  public disconnectNodes(id1: string, id2: string) {
    this.state = {
      ...this.state,
      nodes: this.state.nodes.map(n => {
        if (n.id === id1) return { ...n, peers: n.peers.filter(p => p !== id2) };
        if (n.id === id2) return { ...n, peers: n.peers.filter(p => p !== id1) };
        return n;
      }),
      connections: this.state.connections.filter(c => 
        !((c.from === id1 && c.to === id2) || (c.from === id2 && c.to === id1))
      )
    };
    this.addLog(`Disconnected ${id1} and ${id2}`, 'warning');
  }

  public killNode(id: string) {
    const node = this.state.nodes.find(n => n.id === id);
    if (!node) return;

    const newState = !node.isDown;
    this.state = {
      ...this.state,
      nodes: this.state.nodes.map(n => 
        n.id === id ? { ...n, isDown: newState } : n
      )
    };
    
    this.addLog(`${id} state changed: ${newState ? 'OFFLINE' : 'ONLINE'}`, newState ? 'warning' : 'success');
    
    // If we just healed a node, trigger a sync broadcast
    if (!newState) {
      setTimeout(() => {
        // Find the node with the longest chain to use as sync source
        const bestNode = this.state.nodes.reduce((prev, current) => 
          (current.chain.length > prev.chain.length) ? current : prev
        , this.state.nodes[0]);
        
        if (bestNode && bestNode.chain.length > 0) {
            this.broadcast(bestNode.id, 'block', bestNode.chain[bestNode.chain.length - 1]);
        }
      }, 500);
    }

    this.notify();
  }

  public broadcast(fromId: string, type: PacketType, payloadId: string, fanOut?: number, fee: number = 0.5) {
    const node = this.state.nodes.find(n => n.id === fromId);
    if (!node) return;
    
    if (node.isDown) {
      this.addLog(`CRITICAL: ${fromId} is OFFLINE. Broadcast failed.`, 'warning');
      return;
    }

    this.addLog(`${fromId} initiating broadcast of ${type} ${payloadId}`, 'info');
    
    // Set origin hop count to 0
    this.state = {
      ...this.state,
      nodes: this.state.nodes.map(n => n.id === fromId ? { ...n, hopCount: 0 } : n)
    };

    let targetPeers = node.peers;
    if (fanOut && fanOut < node.peers.length) {
      targetPeers = [...node.peers].sort(() => 0.5 - Math.random()).slice(0, fanOut);
    }

    targetPeers.forEach(peerId => {
      this.sendPacket(fromId, peerId, type, payloadId, 1, fee, fanOut);
    });
  }

  private sendPacket(from: string, to: string, type: PacketType, payloadId: string, hops: number = 0, fee: number = 0, fanOut?: number) {
    const fromNode = this.state.nodes.find(n => n.id === from);
    if (!fromNode || fromNode.isDown) return; 

    const connection = this.state.connections.find(
      c => (c.from === from && c.to === to) || (c.from === to && c.to === from)
    );
    
    if (!connection) return;

    const duration = connection.latency;
    
    const packet: Packet = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      payloadId,
      from,
      to,
      startTime: Date.now(), 
      duration,
      progress: 0,
      hops,
      fanOut,
      fee
    };

    this.state = {
      ...this.state,
      packets: [...this.state.packets, packet],
      stats: {
        ...this.state.stats!,
        totalTransmissions: (this.state.stats?.totalTransmissions || 0) + 1
      }
    };
    this.notify();
  }

  private deliverPacket(packetId: string) {
    const packet = this.state.packets.find(p => p.id === packetId);
    if (!packet) return;

    const targetNode = this.state.nodes.find(n => n.id === packet.to);
    
    if (!targetNode || targetNode.isDown) {
      this.state = {
        ...this.state,
        stats: {
          ...this.state.stats!,
          failedRequests: (this.state.stats?.failedRequests || 0) + 1
        }
      };
      this.addLog(`CONNECTION_REFUSED: Host ${packet.to} is UNREACHABLE.`, 'warning');
      return;
    }

    // Spam Mitigation Logic: Check Fee
    const MIN_RELAY_FEE = 0.1;
    const isSpam = (packet.fee || 0) < MIN_RELAY_FEE && !targetNode.isMalicious;

    if (isSpam) {
      this.state = {
        ...this.state,
        stats: {
          ...this.state.stats!,
          duplicatesPrevented: (this.state.stats?.duplicatesPrevented || 0) + 1 // Use this for spam mitigated count
        },
        packets: this.state.packets.map(p => p.id === packetId ? { ...p, isRejected: true } : p)
      };
      this.addLog(`SPAM_REJECTED: ${targetNode.id} dropped low-fee packet from ${packet.from}`, 'warning');
      return;
    }

    const alreadyHas = packet.type === 'transaction' 
      ? targetNode.mempool.includes(packet.payloadId)
      : targetNode.chain.includes(packet.payloadId);

    if (!alreadyHas) {
      const newHopCount = packet.hops ?? 0;
      const isReorg = packet.type === 'block' && targetNode.chain.length > 0;
      
      this.state = {
        ...this.state,
        nodes: this.state.nodes.map(n => {
          if (n.id === packet.to) {
            // Longest Chain Rule: If it's a block and we already have a chain, 
            // we only update if this is "new" (handled by !alreadyHas). 
            // In a real blockchain, we'd check if the chain is longer.
            // For the simulation, we'll simulate a reorg if the target already has some blocks.
            return {
              ...n,
              mempool: packet.type === 'transaction' ? [...n.mempool, packet.payloadId] : n.mempool,
              chain: packet.type === 'block' ? [...n.chain, packet.payloadId] : n.chain,
              hopCount: newHopCount,
              isReorging: isReorg
            };
          }
          return n;
        }),
      };

      if (isReorg) {
        this.addLog(`REORG: ${targetNode.id} discarded shorter chain for longer path!`, 'warning');
        setTimeout(() => {
          this.state = {
            ...this.state,
            nodes: this.state.nodes.map(n => n.id === packet.to ? { ...n, isReorging: false } : n)
          };
          this.notify();
        }, 1500);
      }

      this.addLog(`${targetNode.id} received new ${packet.type} (Hop: ${newHopCount})`, 'success');

      // Gossip to neighbors
      let targetPeers = targetNode.peers.filter(p => p !== packet.from);
      
      // If packet has hops, we are in gossip mode. 
      if (packet.hops !== undefined) {
        const k = packet.fanOut ?? 2; // Default to k=2 if not specified
        if (targetPeers.length > k) {
          targetPeers = [...targetPeers].sort(() => 0.5 - Math.random()).slice(0, k);
        }
      }

      targetPeers.forEach(peerId => {
        this.sendPacket(targetNode.id, peerId, packet.type, packet.payloadId, (packet.hops || 0) + 1, packet.fee, packet.fanOut);
      });
    } else {
      this.state = {
        ...this.state,
        stats: {
          ...this.state.stats!,
          duplicatesPrevented: (this.state.stats?.duplicatesPrevented || 0) + 1
        }
      };
    }
  }

  private notify() {
    this.onStateChange({ ...this.state }, [...this.logs]);
  }

  public tick(dt: number) {
    if (this.isPaused) return;

    let changed = false;
    const deliveredPacketIds: string[] = [];

    const nextPackets = this.state.packets.map(p => {
      const deltaProgress = (dt * this.speed) / p.duration;
      const newProgress = p.progress + deltaProgress;

      if (newProgress >= 1) {
        deliveredPacketIds.push(p.id);
        return { ...p, progress: 1 };
      }
      
      if (Math.abs(p.progress - newProgress) > 0.001) {
        changed = true;
      }
      return { ...p, progress: newProgress };
    });

    if (deliveredPacketIds.length > 0) {
      this.state = { ...this.state, packets: nextPackets };
      
      deliveredPacketIds.forEach(id => {
        this.deliverPacket(id);
      });

      this.state = {
        ...this.state,
        packets: this.state.packets.filter(p => !deliveredPacketIds.includes(p.id))
      };
      changed = true;
    } else if (changed) {
      this.state = { ...this.state, packets: nextPackets };
    }

    if (changed) {
      this.notify();
    }
  }

  public updatePackets() {
     this.tick(16);
  }

  public getState() {
    return this.state;
  }
}