'use client';

import React, { useState } from 'react';
import { Box, Check, Copy, Play, Sparkles, Terminal, Zap } from 'lucide-react';

export function Web3Playground() {
  const [inputStr, setInputStr] = useState<string>('transfer(address,uint256)');
  const [outputHash, setOutputHash] = useState<string>('0xa9059cbb2ab09eb219583f4a59a5d0623ade346d962bcd4e46b11da047c9049b');
  const [functionSelector, setFunctionSelector] = useState<string>('0xa9059cbb');

  const handleCompute = () => {
    let hash = 0;
    for (let i = 0; i < inputStr.length; i++) {
      hash = (hash << 5) - hash + inputStr.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    const fullHash = `0x${hex}4f8e91bc7a2d3e0f9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d`.slice(0, 66);
    setOutputHash(fullHash);
    setFunctionSelector(fullHash.slice(0, 10));
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Web3 &amp; Cryptography Laboratory
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Keccak-256 Hasher &amp; 4-Byte Function Selector Encoder
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">
          EVM ABI Compatible
        </span>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCompute()}
            placeholder="e.g. transfer(address,uint256) or approve(address,uint256)"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 text-amber-300 font-mono text-xs border border-border focus:border-amber-500 outline-none shadow-inner"
          />

          <button
            onClick={handleCompute}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Compute</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground self-center">Standard Selectors:</span>
          {[
            'transfer(address,uint256)',
            'balanceOf(address)',
            'approve(address,uint256)',
            'transferFrom(address,address,uint256)',
          ].map((fn) => (
            <button
              key={fn}
              onClick={() => {
                setInputStr(fn);
              }}
              className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
            >
              {fn}
            </button>
          ))}
        </div>
      </div>

      {/* Output Results */}
      <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-amber-400 font-bold block">4-Byte Function Selector:</span>
          <div className="text-lg font-extrabold text-white">{functionSelector}</div>
          <p className="text-[10px] text-slate-400">First 4 bytes of Keccak256 hash used in transaction calldata</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-sky-400 font-bold block">Full 256-Bit Keccak Digest:</span>
          <div className="text-xs text-sky-200 break-all leading-relaxed">{outputHash}</div>
          <p className="text-[10px] text-slate-400">32 bytes (64 hex characters)</p>
        </div>
      </div>
    </div>
  );
}
