import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MerkleTree, type Node } from '../lib/merkle';
import TreeVisualizer from './TreeVisualizer';
import { AlertTriangle, RefreshCw, X, Trophy, MousePointer2 } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface ChallengeModeProps {
  onClose: () => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({ onClose }) => {
  const [tree, setTree] = useState<MerkleTree>(new MerkleTree());
  const [corruptedIndex, setCorruptedIndex] = useState<number>(0);
  const [inspectedIds, setInspectedIds] = useState<Set<string>>(new Set());
  const [brokenIds, setBrokenIds] = useState<Set<string>>(new Set());
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [clicks, setClicks] = useState(0);
  const { playClick, playError, playSuccess, playHash } = useSound();

  const initChallenge = useCallback(async () => {
    playHash();
    const data = Array(8).fill(0).map((_, i) => `Shard_${i}`);
    const badIdx = Math.floor(Math.random() * 8);
    setCorruptedIndex(badIdx);
    
    const newTree = new MerkleTree();
    await newTree.build(data);
    
    setTree(newTree);
    setInspectedIds(new Set());
    setBrokenIds(new Set());
    setClicks(0);
    setGameState('playing');
  }, [playHash]);

  useEffect(() => {
    initChallenge();
  }, [initChallenge]);

  const isNodeInPath = (node: Node, leafIdx: number, tree: MerkleTree) => {
    let currIdx = leafIdx;
    for (let i = 0; i < tree.levels.length; i++) {
        if (tree.levels[i][currIdx]?.id === node.id) return true;
        currIdx = Math.floor(currIdx / 2);
    }
    return false;
  };

  const handleNodeClick = (node: Node) => {
    if (gameState !== 'playing') return;
    
    setClicks(c => c + 1);
    const pathContainsCorruption = isNodeInPath(node, corruptedIndex, tree);

    if (pathContainsCorruption) {
        setBrokenIds(prev => {
            const next = new Set(prev);
            next.add(node.id);
            return next;
        });
        
        // If it's the leaf
        if (node.isLeaf) {
            const index = tree.levels[0].findIndex(n => n.id === node.id);
            if (index === corruptedIndex) {
                playSuccess();
                setGameState('won');
            }
        } else {
            playError();
        }
    } else {
        setInspectedIds(prev => {
            const next = new Set(prev);
            next.add(node.id);
            return next;
        });
        playClick();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div className="w-full max-w-5xl h-[90vh] bg-card border border-card-border rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-muted/10 flex items-center justify-between">
            <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <AlertTriangle className="text-amber-500 w-6 h-6" />
                    Shard Corruption Challenge
                </h2>
                <p className="text-xs text-muted-foreground font-medium">One of the 8 shards is corrupted. Find it in exactly 4 clicks ($log_2 8 + 1$) to prove your mastery.</p>
            </div>
            <button 
                onClick={onClose}
                className="p-3 hover:bg-secondary rounded-full transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Game Stats */}
        <div className="flex gap-8 px-8 py-4 bg-secondary/20">
            <div className="flex items-center gap-3">
                <MousePointer2 className="w-4 h-4 text-muted" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted">Clicks:</span>
                <span className="text-xl font-black">{clicks}</span>
            </div>
            <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-muted" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted">Optimal Path:</span>
                <span className="text-xl font-black text-indigo-500">4</span>
            </div>
        </div>

        {/* Tree Area */}
        <div className="flex-grow relative p-8 flex items-center justify-center overflow-hidden">
            <TreeVisualizer 
                levels={tree.levels}
                highlightedIds={inspectedIds}
                brokenIds={brokenIds}
                onNodeClick={handleNodeClick}
                tamperedLeafIndex={gameState === 'won' ? corruptedIndex : null}
            />

            <AnimatePresence>
                {gameState === 'won' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-background/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    >
                        <div className="bg-card border border-card-border p-8 md:p-12 rounded-[3rem] shadow-2xl text-center space-y-6 max-w-md w-full">
                            <div className="w-20 h-20 bg-green-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-green-500/20">
                                <Trophy className="text-white w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground">Root Secured!</h3>
                                <p className="text-sm text-muted-foreground">You isolated the corrupted shard in {clicks} clicks. Your efficiency score: {Math.round(4/clicks * 100)}%</p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={initChallenge}
                                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-105 transition-all"
                                >
                                    Play Again
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="flex-1 py-4 border border-muted/20 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-secondary transition-all"
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Footer Hint */}
        <div className="p-8 bg-secondary/10 border-t border-muted/10 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">
                Tip: Start from the Root. If it turns <span className="text-red-500 font-bold">RED</span>, click its children to trace the error. If a child is <span className="text-indigo-500 font-bold">BLUE</span>, that branch is healthy!
            </p>
        </div>
      </div>
    </motion.div>
  );
};