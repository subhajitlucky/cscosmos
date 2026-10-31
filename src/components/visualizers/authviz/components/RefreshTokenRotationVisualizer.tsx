'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Key,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

interface TokenRecord {
  token: string;
  generation: number;
  status: 'active' | 'used' | 'revoked';
  issuedAt: string;
}

export function RefreshTokenRotationVisualizer() {
  const [generation, setGeneration] = useState<number>(1);
  const [tokens, setTokens] = useState<TokenRecord[]>([
    { token: 'rt_gen1_9f4e2a', generation: 1, status: 'active', issuedAt: '12:00:00' },
  ]);
  const [accessToken, setAccessToken] = useState<string>('at_gen1_c018a');
  const [familyCompromised, setFamilyCompromised] = useState<boolean>(false);
  const [log, setLog] = useState<string[]>([
    'Token Family created: fam_user42_device1',
    'Initial tokens issued: [rt_gen1_9f4e2a] and [at_gen1_c018a] (TTL: 15m)',
  ]);

  const addLog = (msg: string) => {
    setLog((prev) => [msg, ...prev.slice(0, 4)]);
  };

  const handleLegitimateRefresh = () => {
    if (familyCompromised) return;

    const nextGen = generation + 1;
    const newRt = `rt_gen${nextGen}_` + Math.random().toString(36).substring(2, 8);
    const newAt = `at_gen${nextGen}_` + Math.random().toString(36).substring(2, 7);

    setTokens((prev) => [
      ...prev.map((t) => (t.status === 'active' ? { ...t, status: 'used' as const } : t)),
      { token: newRt, generation: nextGen, status: 'active', issuedAt: new Date().toLocaleTimeString() },
    ]);
    setGeneration(nextGen);
    setAccessToken(newAt);
    addLog(`Legitimate Client: Exchanged rt_gen${generation} for new pair: [${newRt}] + [${newAt}]`);
  };

  const handleAttackerReplay = () => {
    if (tokens.length < 2) {
      alert('Advance at least one legitimate rotation first so an old token exists to replay!');
      return;
    }

    // Attacker tries to use an already-used token (e.g. gen 1)
    setFamilyCompromised(true);
    setTokens((prev) => prev.map((t) => ({ ...t, status: 'revoked' as const })));
    addLog(
      'ALERT (RFC 9700): Replay detected! Attacker submitted already-used token [rt_gen1_9f4e2a]. Entire Token Family REVOKED.'
    );
  };

  const handleReset = () => {
    setGeneration(1);
    setTokens([
      { token: 'rt_gen1_9f4e2a', generation: 1, status: 'active', issuedAt: new Date().toLocaleTimeString() },
    ]);
    setAccessToken('at_gen1_c018a');
    setFamilyCompromised(false);
    setLog([
      'Token Family reset: fam_user42_device1',
      'Initial tokens issued: [rt_gen1_9f4e2a] and [at_gen1_c018a] (TTL: 15m)',
    ]);
  };

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Station 05 · OAuth 2.0 Resilience
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              RFC 9700 §4.14
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            Refresh Token Rotation &amp; Replay Detection Simulator
          </h3>
          <p className="text-xs text-muted-foreground">
            Experience how single-use refresh token rotation instantly detects token leaks and revokes compromised token families.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulator</span>
        </button>
      </div>

      {/* Compromise Alert Banner */}
      {familyCompromised && (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
              Token Reuse Attack Neutralized
            </h4>
            <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
              An already-used refresh token was re-submitted. Per RFC 9700, the authorization server invalidated the entire token family. The legitimate user and the attacker are both forced to re-authenticate with credentials/MFA.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Token Family Timeline + Action Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Token Family Chain */}
        <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-4">
          <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Token Family: fam_user42</span>
            <span className="text-[11px] font-mono text-muted-foreground">
              Gen {generation} active
            </span>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {tokens.map((t) => (
              <div
                key={t.token}
                className={`p-3 rounded-xl border font-mono text-xs flex items-center justify-between gap-3 ${
                  t.status === 'active'
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-foreground font-bold'
                    : t.status === 'used'
                    ? 'border-border/60 bg-card text-muted-foreground opacity-60'
                    : 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted">
                    Gen {t.generation}
                  </span>
                  <span className="truncate">{t.token}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold shrink-0">
                  {t.status}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg border border-border/70 bg-card flex items-center justify-between font-mono text-xs">
            <span className="text-muted-foreground">Active Access Token:</span>
            <span className="text-foreground font-bold truncate max-w-[180px]">
              {familyCompromised ? 'null (revoked)' : accessToken}
            </span>
          </div>
        </div>

        {/* Right: Interactive Actions */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
            Simulate Clients
          </div>

          <button
            onClick={handleLegitimateRefresh}
            disabled={familyCompromised}
            className="w-full p-4 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-emerald-500/50 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed space-y-1"
          >
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              <span>1. Legitimate Client: Rotate Refresh Token</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Exchanges the current active refresh token. The server marks it &quot;used&quot; and returns a new generation pair.
            </p>
          </button>

          <button
            onClick={handleAttackerReplay}
            disabled={familyCompromised || tokens.length < 2}
            className="w-full p-4 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-rose-500/50 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed space-y-1"
          >
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>2. Attacker: Replay Stolen Token (rt_gen1)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Simulates a token leak where an attacker intercepted an earlier token. Server detects reuse and triggers family-wide emergency revocation.
            </p>
          </button>
        </div>
      </div>

      {/* RFC 9700 Security Audit Terminal */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 space-y-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RFC 9700 OAuth 2.0 Security BCP Audit Log:
        </div>
        <div className="divide-y divide-slate-800/80">
          {log.map((msg, i) => (
            <div key={i} className="py-1 text-[11px] text-emerald-400 flex items-center gap-2">
              <span className="text-slate-600 select-none">&gt;</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
