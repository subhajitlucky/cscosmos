'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, RefreshCw, RotateCcw, ShieldAlert, ShieldCheck, Skull, Sparkles, Zap } from 'lucide-react';

type Mode = 'vulnerable' | 'secure';

export function ReentrancyAttackVisualizer() {
  const [mode, setMode] = useState<Mode>('vulnerable');
  const [step, setStep] = useState<number>(0);
  const [contractEth, setContractEth] = useState<number>(30);
  const [attackerEth, setAttackerEth] = useState<number>(1);
  const [log, setLog] = useState<string>('Ready to initiate withdrawal.');

  const handleNextStep = () => {
    if (mode === 'vulnerable') {
      if (step === 0) {
        setStep(1);
        setLog('1. Attacker invokes EtherStore.withdraw(1 ETH).');
      } else if (step === 1) {
        setStep(2);
        setContractEth((prev) => prev - 1);
        setAttackerEth((prev) => prev + 1);
        setLog('2. EtherStore sends 1 ETH via .call{value: 1 ETH}("") BEFORE setting balances[attacker] = 0!');
      } else if (step === 2) {
        setStep(3);
        setLog('3. 🚨 REENTRANCY TRIGGERED: Attacker fallback() receives ETH and immediately calls EtherStore.withdraw() again!');
      } else if (step === 3) {
        setStep(4);
        setContractEth((prev) => prev - 1);
        setAttackerEth((prev) => prev + 1);
        setLog('4. 💀 RECURSIVE DRAIN: Since balance was not zeroed out, EtherStore sends another 1 ETH! Attacker repeats until contract is empty.');
      }
    } else {
      if (step === 0) {
        setStep(1);
        setLog('1. CHECKS: EtherStore verifies balances[attacker] >= 1 ETH (Valid).');
      } else if (step === 1) {
        setStep(2);
        setLog('2. EFFECTS: EtherStore sets balances[attacker] = 0 FIRST.');
      } else if (step === 2) {
        setStep(3);
        setContractEth((prev) => prev - 1);
        setAttackerEth((prev) => prev + 1);
        setLog('3. INTERACTIONS: EtherStore sends 1 ETH. Attacker fallback attempts reentrancy, but balances[attacker] is already 0, reverting the attack! ✅');
      }
    }
  };

  const handleReset = () => {
    setStep(0);
    setContractEth(30);
    setAttackerEth(1);
    setLog('Reset to initial state.');
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Smart Contract Security Simulator
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Reentrancy Attack Stepper (The DAO Hack)
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center gap-1 ${
          mode === 'vulnerable'
            ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        }`}>
          {mode === 'vulnerable' ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          {mode === 'vulnerable' ? 'VULNERABLE CONTRACT' : 'CHECKS-EFFECTS-INTERACTIONS PATTERN'}
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <button
          onClick={() => {
            setMode('vulnerable');
            handleReset();
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'vulnerable'
              ? 'bg-rose-600 text-white font-bold shadow-md border-rose-500'
              : 'bg-card border-border text-foreground hover:border-amber-500'
          }`}
        >
          <div className="font-bold">1. Vulnerable (External Call First)</div>
          <div className={`text-[10px] ${mode === 'vulnerable' ? 'text-rose-100' : 'text-muted-foreground'}`}>
            Enables recursive fallback hijacking
          </div>
        </button>

        <button
          onClick={() => {
            setMode('secure');
            handleReset();
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'secure'
              ? 'bg-emerald-600 text-white font-bold shadow-md border-emerald-500'
              : 'bg-card border-border text-foreground hover:border-amber-500'
          }`}
        >
          <div className="font-bold">2. Secure (Checks-Effects-Interactions)</div>
          <div className={`text-[10px] ${mode === 'secure' ? 'text-emerald-100' : 'text-muted-foreground'}`}>
            Zeroes balance before transfer
          </div>
        </button>
      </div>

      {/* Vault Balances */}
      <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-bold block">EtherStore Vault Balance:</span>
          <div className="text-xl font-extrabold text-amber-400">{contractEth} ETH</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-bold block">Attacker Stolen Balance:</span>
          <div className={`text-xl font-extrabold ${attackerEth > 1 ? 'text-rose-400' : 'text-slate-300'}`}>
            {attackerEth} ETH
          </div>
        </div>
      </div>

      {/* Execution Trace Log */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-amber-400 font-bold">Execution Step Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>

        <button
          onClick={handleNextStep}
          disabled={step >= (mode === 'vulnerable' ? 4 : 3)}
          className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Execute Next Step ({step + 1}/{mode === 'vulnerable' ? 4 : 3})</span>
        </button>
      </div>
    </div>
  );
}
