'use client';

import React, { useState } from 'react';
import { ArrowRight, Coins, GitCommit, Layers, RefreshCw, Sparkles, Wallet, Zap } from 'lucide-react';

type ModelType = 'utxo' | 'account';

export function UtxoVsAccountVisualizer() {
  const [model, setModel] = useState<ModelType>('utxo');
  const [txTriggered, setTxTriggered] = useState<boolean>(false);

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              State Model Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Bitcoin UTXO Model vs Ethereum Account Model
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">
          Active: {model === 'utxo' ? 'Bitcoin UTXO Graph' : 'Ethereum Account State'}
        </span>
      </div>

      {/* Model Selector */}
      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <button
          onClick={() => {
            setModel('utxo');
            setTxTriggered(false);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            model === 'utxo'
              ? 'bg-amber-600 text-white font-bold shadow-md border-amber-500'
              : 'bg-card border-border text-foreground hover:border-amber-500'
          }`}
        >
          <div className="font-bold">1. Bitcoin UTXO Model</div>
          <div className={`text-[10px] ${model === 'utxo' ? 'text-amber-100' : 'text-muted-foreground'}`}>
            Coin-centric DAG of unspent outputs
          </div>
        </button>

        <button
          onClick={() => {
            setModel('account');
            setTxTriggered(false);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            model === 'account'
              ? 'bg-amber-600 text-white font-bold shadow-md border-amber-500'
              : 'bg-card border-border text-foreground hover:border-amber-500'
          }`}
        >
          <div className="font-bold">2. Ethereum Account Model</div>
          <div className={`text-[10px] ${model === 'account' ? 'text-amber-100' : 'text-muted-foreground'}`}>
            Global state mapping with balance &amp; nonce
          </div>
        </button>
      </div>

      {/* State Flow Diagram */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        {model === 'utxo' ? (
          <div className="space-y-3">
            <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Transaction: Alice sends 3.5 BTC to Bob from 5.0 BTC UTXO</span>
              <span className="text-amber-400 font-bold">{txTriggered ? 'UTXO CONSUMED & DESTROYED' : 'UNSPENT'}</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-center">
              {/* Input UTXO */}
              <div className={`p-4 rounded-2xl border ${
                txTriggered
                  ? 'border-rose-500/50 bg-rose-500/10 text-rose-300 line-through opacity-70'
                  : 'border-amber-500/50 bg-amber-500/10 text-amber-200'
              }`}>
                <span className="font-bold block">Input: UTXO #101</span>
                <span className="text-[10px]">Owner: Alice</span>
                <div className="text-xs font-extrabold pt-1">5.0 BTC</div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center text-slate-500 font-bold">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Created UTXOs */}
              <div className="space-y-2">
                <div className={`p-2.5 rounded-xl border ${
                  txTriggered ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}>
                  <span className="font-bold block text-[11px]">Output #1: Bob</span>
                  <span className="text-xs font-bold">3.5 BTC</span>
                </div>
                <div className={`p-2.5 rounded-xl border ${
                  txTriggered ? 'border-sky-500/50 bg-sky-500/20 text-sky-300' : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}>
                  <span className="font-bold block text-[11px]">Output #2: Alice Change</span>
                  <span className="text-xs font-bold">1.5 BTC</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>State Transition: Alice transfers 3.5 ETH to Bob (Nonce increments)</span>
              <span className="text-emerald-400 font-bold">{txTriggered ? 'STATE ROOT UPDATED' : 'STATE: BLOCK #19284'}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-sky-400 font-bold block">Alice Account (0x71C...89)</span>
                <div className="text-[11px] text-slate-300">
                  Balance: <strong className="text-white">{txTriggered ? '6.5 ETH (-3.5 ETH)' : '10.0 ETH'}</strong><br/>
                  Nonce: <strong className="text-white">{txTriggered ? '14 (Incremented)' : '13'}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block">Bob Account (0x91F...22)</span>
                <div className="text-[11px] text-slate-300">
                  Balance: <strong className="text-white">{txTriggered ? '5.5 ETH (+3.5 ETH)' : '2.0 ETH'}</strong><br/>
                  Nonce: <strong className="text-white">4</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Control */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setTxTriggered((prev) => !prev)}
          className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{txTriggered ? 'Reset Transaction' : 'Execute State Transition (Spend 3.5 Coins)'}</span>
        </button>
      </div>
    </div>
  );
}
