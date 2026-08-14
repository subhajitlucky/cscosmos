'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Box, Coins, Cpu, Flame, GitFork, HelpCircle, Layers, Link as LinkIcon, Network, Play, Server, ShieldAlert, Sparkles, Terminal, Waves, Zap } from 'lucide-react';
import { BlockMiningSimulator } from '../components/BlockMiningSimulator';
import { MerkleTreeVisualizer } from '../components/MerkleTreeVisualizer';
import { PatriciaTrieVisualizer } from '../components/PatriciaTrieVisualizer';
import { EvmStackVisualizer } from '../components/EvmStackVisualizer';
import { ReentrancyAttackVisualizer } from '../components/ReentrancyAttackVisualizer';
import { Eip1559FeeVisualizer } from '../components/Eip1559FeeVisualizer';
import { UtxoVsAccountVisualizer } from '../components/UtxoVsAccountVisualizer';
import { P2pConsensusSimulator } from '../components/P2pConsensusSimulator';
import { Web3Playground } from '../components/Web3Playground';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Complete Web3, Cryptography &amp; EVM Architecture Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master the <span className="text-amber-600 dark:text-amber-400">Blockchain &amp; EVM</span> Engine.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive visualizers for Proof-of-Work block mining, cryptographic tampering cascades, Binary Merkle Trees, Modified Merkle Patricia Tries (MPT), 256-bit EVM Opcode stack machines, DAO Reentrancy attacks, EIP-1559 base fee burning, UTXO vs Account models, and P2P Gossip consensus.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/blockchainviz/concepts"
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore 20 Concepts
          </Link>
          <Link
            href="/blockchainviz/playground"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> Web3 Sandbox
          </Link>
        </div>
      </div>

      {/* Feature 1: Block Mining & Tamper Simulator */}
      <BlockMiningSimulator />

      {/* Feature 2: Binary Merkle Trees & Inclusion Proofs */}
      <MerkleTreeVisualizer />

      {/* Feature 3: Ethereum Modified Merkle Patricia Trie (MPT) */}
      <PatriciaTrieVisualizer />

      {/* Feature 4: EVM 256-Bit Stack Machine & Gas Meter */}
      <EvmStackVisualizer />

      {/* Feature 5: DAO Reentrancy Attack Stepper */}
      <ReentrancyAttackVisualizer />

      {/* Feature 6: EIP-1559 Dynamic Gas Fee & Base Fee Burn */}
      <Eip1559FeeVisualizer />

      {/* Feature 7: Bitcoin UTXO vs Ethereum Account Model */}
      <UtxoVsAccountVisualizer />

      {/* Feature 8: P2P Gossip Consensus */}
      <P2pConsensusSimulator />

      {/* Feature 9: Keccak256 & ABI Selector Playground */}
      <Web3Playground />

      {/* Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/blockchainviz/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-amber-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-amber-500 transition-colors">
            20 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Secp256k1 ECDSA signatures, EIP-1559 base fees, Reentrancy attacks, Flash loans, and ZK-Rollups.
          </p>
        </Link>

        <Link
          href="/blockchainviz/mining-lab"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-amber-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-amber-500 transition-colors">
            Mining Lab
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Test PoW hash difficulty, tamper with transactions, and watch the cryptographic link cascade break.
          </p>
        </Link>

        <Link
          href="/blockchainviz/flashcards"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-amber-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-amber-500 transition-colors">
            Senior Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tough Web3 &amp; Solidity interview questions on SSTORE gas costs, checks-effects-interactions, and ZK proofs.
          </p>
        </Link>
      </div>
    </div>
  );
}
