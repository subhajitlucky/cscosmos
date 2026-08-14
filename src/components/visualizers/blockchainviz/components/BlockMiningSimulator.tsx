'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Link as LinkIcon, RefreshCw, ShieldAlert, Sparkles, Zap } from 'lucide-react';

interface BlockState {
  index: number;
  nonce: number;
  data: string;
  previousHash: string;
  hash: string;
  isMined: boolean;
}

// Deterministic fast hash function for simulation
function computeHash(index: number, nonce: number, data: string, prevHash: string): string {
  let hashVal = 0;
  const str = `${index}${nonce}${data}${prevHash}`;
  for (let i = 0; i < str.length; i++) {
    hashVal = (hashVal << 5) - hashVal + str.charCodeAt(i);
    hashVal |= 0;
  }
  const hex = Math.abs(hashVal).toString(16).padStart(8, '0');
  return `0000${hex.slice(0, 12)}f8a92b4c12d93e7f`.slice(0, 16);
}

export function BlockMiningSimulator() {
  const [blocks, setBlocks] = useState<BlockState[]>([
    {
      index: 1,
      nonce: 48921,
      data: 'Genesis Block: Satoshi Nakamoto',
      previousHash: '0000000000000000',
      hash: '00004a8b9c1d2e3f',
      isMined: true,
    },
    {
      index: 2,
      nonce: 19284,
      data: 'Alice -> Bob: 5.5 BTC',
      previousHash: '00004a8b9c1d2e3f',
      hash: '000091bc4f8e7a2d',
      isMined: true,
    },
    {
      index: 3,
      nonce: 63109,
      data: 'Bob -> Charlie: 2.1 BTC',
      previousHash: '000091bc4f8e7a2d',
      hash: '00003e8a7f9b1c2d',
      isMined: true,
    },
  ]);

  const [activeTamperBlock, setActiveTamperBlock] = useState<number | null>(null);

  const handleEditData = (index: number, newData: string) => {
    setBlocks((prev) => {
      const next = [...prev];
      next[index].data = newData;
      // Invalidate this block and subsequent blocks:
      for (let i = index; i < next.length; i++) {
        next[i].isMined = false;
        next[i].hash = `e7a9${Math.abs(Math.random() * 1000000 | 0).toString(16).padStart(12, '0')}`;
        if (i + 1 < next.length) {
          next[i + 1].previousHash = next[i].hash;
        }
      }
      return next;
    });
    setActiveTamperBlock(index);
  };

  const handleMineBlock = (index: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      next[index].nonce = Math.floor(Math.random() * 90000) + 10000;
      next[index].hash = `0000${Math.abs(Math.random() * 1000000 | 0).toString(16).padStart(12, '0')}`;
      next[index].isMined = true;
      if (index + 1 < next.length) {
        next[index + 1].previousHash = next[index].hash;
      }
      return next;
    });
  };

  const handleReset = () => {
    setBlocks([
      {
        index: 1,
        nonce: 48921,
        data: 'Genesis Block: Satoshi Nakamoto',
        previousHash: '0000000000000000',
        hash: '00004a8b9c1d2e3f',
        isMined: true,
      },
      {
        index: 2,
        nonce: 19284,
        data: 'Alice -> Bob: 5.5 BTC',
        previousHash: '00004a8b9c1d2e3f',
        hash: '000091bc4f8e7a2d',
        isMined: true,
      },
      {
        index: 3,
        nonce: 63109,
        data: 'Bob -> Charlie: 2.1 BTC',
        previousHash: '000091bc4f8e7a2d',
        hash: '00003e8a7f9b1c2d',
        isMined: true,
      },
    ]);
    setActiveTamperBlock(null);
  };

  const isChainValid = blocks.every((b) => b.isMined && b.hash.startsWith('0000'));

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Cryptographic Consensus Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Blockchain Ledger &amp; Tamper Cascade Simulator
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          isChainValid
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          {isChainValid ? '✅ LEDGER INTEGRITY VALID' : '🚨 CRYPTOGRAPHIC CHAIN BROKEN'}
        </span>
      </div>

      {/* Warning Notice */}
      {!isChainValid && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-800 dark:text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <strong>Tampering Detected:</strong> Modifying transaction payload altered the block hash, breaking the <code>previousHash</code> pointer of all subsequent blocks! In a live network, all peer validator nodes would immediately reject this invalid branch.
          </div>
        </div>
      )}

      {/* Connected Blocks Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blocks.map((block, idx) => (
          <div
            key={block.index}
            className={`p-5 rounded-3xl border transition-all space-y-3 font-mono text-xs shadow-sm ${
              block.isMined && block.hash.startsWith('0000')
                ? 'bg-card border-border'
                : 'bg-rose-500/10 border-rose-500 shadow-md scale-[1.02]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-extrabold text-sm text-foreground">Block #{block.index}</span>
              <span className="text-[10px] text-muted-foreground">Nonce: {block.nonce}</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-muted-foreground block">Data / Transactions:</label>
                <input
                  type="text"
                  value={block.data}
                  onChange={(e) => handleEditData(idx, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 text-amber-300 border border-border focus:border-amber-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block">Previous Hash:</label>
                <div className="p-2 rounded-xl bg-slate-950 text-slate-400 text-[11px] truncate">
                  {block.previousHash}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block">Block Hash:</label>
                <div className={`p-2 rounded-xl text-[11px] font-bold truncate ${
                  block.isMined && block.hash.startsWith('0000')
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {block.hash}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleMineBlock(idx)}
                disabled={block.isMined && block.hash.startsWith('0000')}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-extrabold text-xs transition shadow flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{block.isMined ? 'Block Mined (0000...)' : 'Mine Block (PoW)'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reset Control */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Ledger to Genesis</span>
        </button>
      </div>
    </div>
  );
}
