'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Key,
  Lock,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle,
  Zap,
} from 'lucide-react';

type SessionState =
  | 'unauthenticated'
  | 'active'
  | 'idle_expired'
  | 'absolute_expired'
  | 'destroyed';

export function SessionLifecycleVisualizer() {
  const [sessionState, setSessionState] = useState<SessionState>('active');
  const [sessionId, setSessionId] = useState<string>('sess_9a4f2e81c07b');
  const [idleMinutes, setIdleMinutes] = useState<number>(2);
  const [absoluteHours, setAbsoluteHours] = useState<number>(1);
  const [fixationProtected, setFixationProtected] = useState<boolean>(true);
  const [logMessages, setLogMessages] = useState<string[]>([
    'Session created: sess_9a4f2e81c07b for user_42 (CosmosApp)',
    'Set-Cookie: cosmos_sess=sess_9a4f2e81c07b; HttpOnly; Secure; SameSite=Lax',
  ]);

  const addLog = (msg: string) => {
    setLogMessages((prev) => [msg, ...prev.slice(0, 4)]);
  };

  const handleLogin = () => {
    const newId = 'sess_' + Math.random().toString(36).substring(2, 14);
    setSessionId(newId);
    setIdleMinutes(0);
    setAbsoluteHours(0);
    setSessionState('active');
    addLog(`User authenticated: New session issued [${newId}]`);
  };

  const handleUserActivity = () => {
    if (sessionState === 'active') {
      setIdleMinutes(0);
      addLog('User activity detected: Idle timeout reset to 0m (sliding window)');
    }
  };

  const handleSimulateIdleTimeout = () => {
    setIdleMinutes(16);
    setSessionState('idle_expired');
    addLog('Idle timeout threshold (15m) exceeded: Session invalidated in Redis');
  };

  const handleSimulateAbsoluteTimeout = () => {
    setAbsoluteHours(8.5);
    setSessionState('absolute_expired');
    addLog('Absolute timeout threshold (8h) exceeded: Session forced to expire regardless of activity');
  };

  const handleRegenerateSession = () => {
    const newId = 'sess_' + Math.random().toString(36).substring(2, 14);
    const oldId = sessionId;
    setSessionId(newId);
    addLog(`Privilege Change / Login: Regenerated session ID from ${oldId.substring(0, 10)}... to ${newId}`);
  };

  const handleLogout = () => {
    setSessionState('destroyed');
    addLog(`Session ${sessionId} destroyed in Redis. Set-Cookie: cosmos_sess=; Max-Age=0`);
  };

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Station 04 · Session Security
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              OWASP ASVS 3.3
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            Session Lifecycle &amp; Timeout Simulator
          </h3>
          <p className="text-xs text-muted-foreground">
            Test session generation, fixation defenses, sliding idle timeouts, and absolute expiration windows.
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Main Grid: Telemetry State + Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Session Telemetry */}
        <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-4">
          <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
            <span>CosmosApp Session State</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                sessionState === 'active'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              }`}
            >
              {sessionState.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-lg border border-border/70 bg-card flex items-center justify-between">
              <span className="text-muted-foreground">Session ID:</span>
              <span className="text-foreground font-bold truncate max-w-[200px]">
                {sessionState === 'destroyed' ? 'null (deleted)' : sessionId}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-border/70 bg-card flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" /> Idle Time:
              </span>
              <span className={idleMinutes >= 15 ? 'text-rose-500 font-bold' : 'text-foreground'}>
                {idleMinutes}m / 15m max
              </span>
            </div>

            <div className="p-3 rounded-lg border border-border/70 bg-card flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" /> Absolute Age:
              </span>
              <span className={absoluteHours >= 8 ? 'text-rose-500 font-bold' : 'text-foreground'}>
                {absoluteHours}h / 8.0h max
              </span>
            </div>

            <div className="p-3 rounded-lg border border-border/70 bg-card flex items-center justify-between">
              <span className="text-muted-foreground">Cookie Security:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                HttpOnly; Secure; SameSite=Lax
              </span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Action Triggers */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
            Simulate Lifecycle Events
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleUserActivity}
              disabled={sessionState !== 'active'}
              className="p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-emerald-500/50 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-500" /> User Activity
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Resets sliding idle timer to 0m.
              </p>
            </button>

            <button
              onClick={handleRegenerateSession}
              disabled={sessionState !== 'active'}
              className="p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-emerald-500/50 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-500" /> Regenerate ID
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Defends against Session Fixation.
              </p>
            </button>

            <button
              onClick={handleSimulateIdleTimeout}
              disabled={sessionState !== 'active'}
              className="p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-rose-500/50 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" /> Idle Timeout (15m)
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Simulate abandoned browser tab.
              </p>
            </button>

            <button
              onClick={handleSimulateAbsoluteTimeout}
              disabled={sessionState !== 'active'}
              className="p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-rose-500/50 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" /> Absolute Expiry (8h)
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Forces re-login regardless of usage.
              </p>
            </button>
          </div>

          <button
            onClick={sessionState === 'destroyed' ? handleLogin : handleLogout}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
              sessionState === 'destroyed'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-muted hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 text-foreground border border-border'
            }`}
          >
            {sessionState === 'destroyed' ? (
              <>
                <UserCheck className="w-4 h-4" /> Log In Again
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" /> Secure Logout (Purge Session)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 space-y-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Live Session Audit Log:
        </div>
        <div className="divide-y divide-slate-800/80">
          {logMessages.map((msg, i) => (
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
