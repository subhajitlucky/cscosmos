'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, ShieldAlert, ShieldCheck, Sparkles, Zap } from 'lucide-react';

type HashAlgo = 'argon2id' | 'bcrypt' | 'sha256';

export function PasswordHashingVisualizer() {
  const [algo, setAlgo] = useState<HashAlgo>('argon2id');
  const [password, setPassword] = useState<string>('correct-horse-battery-staple');

  const estimates = {
    sha256: {
      name: 'SHA-256 (Unsafe for Passwords)',
      salt: 'None or static',
      memory: '0 KB',
      gpuRate: '150 Billion hashes / sec',
      crackTime: '3.4 Seconds (Trivial Crack)',
      safe: false,
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    bcrypt: {
      name: 'bcrypt (Cost Factor 12)',
      salt: '$2b$12$e8Yx9p1... (128-bit random salt)',
      memory: '4 KB',
      gpuRate: '12,000 hashes / sec',
      crackTime: '8.4 Years',
      safe: true,
      hash: '$2b$12$K1Gg5Ym7b4fW9qZ1e7p4uO4Q2t8y6r1v0n3m5k8j9h2g4f6d8s0a'
    },
    argon2id: {
      name: 'Argon2id (OWASP Recommended)',
      salt: '$argon2id$v=19$m=65536,t=3,p=4$...',
      memory: '65,536 KB (64 MB per hash)',
      gpuRate: '150 hashes / sec (Memory-Hard)',
      crackTime: '450+ Years (Impracticable)',
      safe: true,
      hash: '$argon2id$v=19$m=65536,t=3,p=4$qW8xZ1p...$K9gNm2p8...'
    }
  };

  const current = estimates[algo];

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Password Storage Cryptography
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Argon2id vs bcrypt vs SHA-256 GPU Resistance
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          current.safe
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          {current.safe ? '🛡️ GPU BRUTE-FORCE RESISTANT' : '🚨 UNSAFE / INSTANT GPU CRACK'}
        </span>
      </div>

      {/* Algo Selector */}
      <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
        {(['argon2id', 'bcrypt', 'sha256'] as HashAlgo[]).map((a) => (
          <button
            key={a}
            onClick={() => setAlgo(a)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              algo === a
                ? 'bg-emerald-600 text-white font-bold shadow-md border-emerald-500'
                : 'bg-card border-border text-foreground hover:border-emerald-500'
            }`}
          >
            <div className="font-bold uppercase">{a}</div>
            <div className={`text-[10px] ${algo === a ? 'text-emerald-100' : 'text-muted-foreground'}`}>
              {a === 'argon2id' ? 'Memory-Hard (64MB RAM)' : a === 'bcrypt' ? 'CPU-Hard (Salted)' : 'Fast (Not for passwords)'}
            </div>
          </button>
        ))}
      </div>

      {/* Estimates Grid */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Hardware Resistance */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1">
            8x NVIDIA RTX 4090 GPU Cluster Crack Speed:
          </div>
          <div className="space-y-1.5 pt-1 text-[11px]">
            <div><strong>Memory Requirement:</strong> {current.memory}</div>
            <div><strong>Hash Computation Rate:</strong> {current.gpuRate}</div>
            <div className="pt-1">
              <span className="text-slate-500">Estimated Brute Force Time: </span>
              <span className={current.safe ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {current.crackTime}
              </span>
            </div>
          </div>
        </div>

        {/* Generated Hash Output */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="text-slate-400 font-bold border-b border-slate-800 pb-1">
            Database Stored Hash String:
          </div>
          <p className="text-[10px] text-emerald-300 break-all leading-relaxed font-mono pt-1">
            {current.hash}
          </p>
        </div>
      </div>
    </div>
  );
}
