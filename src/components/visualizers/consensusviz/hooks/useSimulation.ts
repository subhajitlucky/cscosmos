import { useState, useEffect, useCallback, useRef } from 'react';
import type { Node, Block, Transaction, NetworkMessage } from '../simulation/types';

const INITIAL_GENESIS: Block = {
  id: '0000abc',
  prevHash: '0',
  nonce: 0,
  timestamp: Date.now(),
  transactions: [],
  minerId: 'SYSTEM'
};

const INITIAL_NODES: Node[] = [
  { id: 'Alpha', type: 'POW', chain: [INITIAL_GENESIS], peers: ['Beta', 'Gamma'], isMining: false, hashRate: 1 },
  { id: 'Beta', type: 'POW', chain: [INITIAL_GENESIS], peers: ['Alpha', 'Gamma'], isMining: false, hashRate: 0.8 },
  { id: 'Gamma', type: 'POW', chain: [INITIAL_GENESIS], peers: ['Alpha', 'Beta'], isMining: false, hashRate: 0.5 },
];

export const useSimulation = () => {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [mempool, setMempool] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<NetworkMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const simLoopRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (mempool.length < 20) {
        const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 5),
          color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)],
          timestamp: Date.now()
        };
        setMempool(prev => [...prev, newTx]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isRunning, mempool]);

  const toggleSimulation = () => setIsRunning(!isRunning);

  const toggleMining = (nodeId: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, isMining: !n.isMining } : n));
  };

  const broadcastBlock = useCallback((block: Block, senderId: string) => {
    setNodes(prevNodes => {
      const sender = prevNodes.find(n => n.id === senderId);
      if (!sender) return prevNodes;

      const newMessages: NetworkMessage[] = sender.peers.map(peerId => ({
        id: Math.random().toString(36),
        type: 'BLOCK_ANNOUNCEMENT',
        data: block,
        senderId,
        receiverId: peerId,
        progress: 0
      }));

      setMessages(prev => [...prev, ...newMessages]);
      return prevNodes;
    });
  }, []);

  const triggerFork = useCallback(() => {
    if (nodes.length < 2) return;
    setIsRunning(true);
    const nodeA = nodes[0];
    const nodeB = nodes[nodes.length - 1];
    const lastBlock = nodeA.chain[nodeA.chain.length - 1];

    const blockA: Block = {
      id: 'fork-a-' + Math.random().toString(36).substr(2, 4),
      prevHash: lastBlock.id,
      nonce: 111,
      timestamp: Date.now(),
      transactions: mempool.slice(0, 2),
      minerId: nodeA.id
    };

    const blockB: Block = {
      id: 'fork-b-' + Math.random().toString(36).substr(2, 4),
      prevHash: lastBlock.id,
      nonce: 999,
      timestamp: Date.now(),
      transactions: mempool.slice(2, 4),
      minerId: nodeB.id
    };

    setNodes(prev => prev.map(n => {
        if (n.id === nodeA.id) return { ...n, chain: [...n.chain, blockA] };
        if (n.id === nodeB.id) return { ...n, chain: [...n.chain, blockB] };
        return n;
    }));

    broadcastBlock(blockA, nodeA.id);
    broadcastBlock(blockB, nodeB.id);
  }, [nodes, mempool, broadcastBlock]);

  useEffect(() => {
    if (!isRunning) return;

    const loop = () => {
      setMessages(prev => {
        const remaining: NetworkMessage[] = [];
        prev.forEach(msg => {
          const nextProgress = msg.progress + 0.05;
          if (nextProgress >= 1) {
            setNodes(nodes => nodes.map(node => {
              if (node.id === msg.receiverId) {
                if (!node.chain.some(b => b.id === msg.data.id)) {
                  const newChain = [...node.chain, msg.data];
                  return { ...node, chain: newChain };
                }
              }
              return node;
            }));
          } else {
            remaining.push({ ...msg, progress: nextProgress });
          }
        });
        return remaining;
      });

      setNodes(prevNodes => prevNodes.map(node => {
        if (node.isMining && mempool.length > 0) {
          if (Math.random() < 0.01 * node.hashRate) {
            const lastBlock = node.chain[node.chain.length - 1];
            const minedBlock: Block = {
              id: '0000' + Math.random().toString(36).substr(2, 5),
              prevHash: lastBlock.id,
              nonce: Math.floor(Math.random() * 1000000),
              timestamp: Date.now(),
              transactions: mempool.slice(0, 5),
              minerId: node.id
            };
            
            setTimeout(() => {
              broadcastBlock(minedBlock, node.id);
              setMempool(m => m.slice(5));
            }, 0);

            return { ...node, chain: [...node.chain, minedBlock] };
          }
        }
        return node;
      }));

      simLoopRef.current = requestAnimationFrame(loop);
    };

    simLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (simLoopRef.current) cancelAnimationFrame(simLoopRef.current);
    };
  }, [isRunning, mempool, broadcastBlock]);

  return {
    nodes,
    mempool,
    messages,
    isRunning,
    toggleSimulation,
    toggleMining,
    triggerFork,
    addNode: (id: string) => {
        setNodes(prev => [...prev, { id, type: 'POW', chain: prev[0].chain, peers: [prev[0].id], isMining: false, hashRate: 1 }]);
    }
  };
};