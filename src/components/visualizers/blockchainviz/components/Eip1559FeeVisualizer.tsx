'use client';

import React, { useState } from 'react';
import { Flame, Gauge, Layers, Sparkles, TrendingDown, TrendingUp, Zap } from 'lucide-react';

export function Eip1559FeeVisualizer() {
  const [gasUsedM, setGasUsedM] = useState<number>(25); // 25 Million Gas (out of 30M limit)
  const currentBaseFeeGwei = 30;
  const targetGasM = 15; // 15M target
  const maxGasM = 30; // 30M limit

  // EIP-1559 Formula: NextBaseFee = CurrentBaseFee * (1 + (GasUsed - Target) / (Target * 8))
  const deltaGas = gasUsedM - targetGasM;
  const changePercent = ((deltaGas / (targetGasM * 8)) * 100).toFixed(2);
  const nextBaseFee = Math.max(1, currentBaseFeeGwei * (1 + deltaGas / (targetGasM * 8))).toFixed(2);

  const priorityTipGwei = 2;
  const totalFeeGwei = (parseFloat(nextBaseFee) + priorityTipGwei).toFixed(2);

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Ethereum Tokenomics Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              EIP-1559 Dynamic Gas Fee &amp; Base Fee Burn Calculator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 fill-current" /> Base Fee 100% Burned 🔥
        </span>
      </div>

      {/* Interactive Gas Slider */}
      <div className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-sm font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">Current Block Gas Consumed:</span>
          <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
            {gasUsedM}M / {maxGasM}M Gas ({((gasUsedM / maxGasM) * 100).toFixed(0)}% Full)
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="30"
          step="1"
          value={gasUsedM}
          onChange={(e) => setGasUsedM(parseFloat(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />

        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>0M (Empty: -12.5% Base Fee)</span>
          <span className="text-amber-500 font-bold">15M (Target Equilibrium: 0% Change)</span>
          <span>30M (Max: +12.5% Base Fee)</span>
        </div>
      </div>

      {/* Calculations Grid */}
      <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
        {/* Next Base Fee */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-bold block">Next Block Base Fee:</span>
          <div className="text-xl font-extrabold text-white flex items-center gap-1.5">
            {nextBaseFee} Gwei
            {parseFloat(changePercent) > 0 ? (
              <TrendingUp className="w-4 h-4 text-rose-500" />
            ) : parseFloat(changePercent) < 0 ? (
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            ) : null}
          </div>
          <p className="text-[10px] text-amber-400 font-bold">{changePercent}% adjustment</p>
        </div>

        {/* Priority Tip */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-bold block">Validator Priority Tip:</span>
          <div className="text-xl font-extrabold text-emerald-400">{priorityTipGwei} Gwei</div>
          <p className="text-[10px] text-slate-400">Direct incentive to block builder</p>
        </div>

        {/* Total Effective Gas Price */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-bold block">Total Effective Gas Price:</span>
          <div className="text-xl font-extrabold text-amber-400">{totalFeeGwei} Gwei</div>
          <p className="text-[10px] text-slate-400">Base Fee (Burned) + Priority Tip</p>
        </div>
      </div>
    </div>
  );
}
