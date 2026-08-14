'use client';

'use client';

import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Sparkles, Zap } from 'lucide-react';

type Disaster = 'penetration' | 'breakdown' | 'avalanche';

export function CacheDisasterSimulator() {
  const [disaster, setDisaster] = useState<Disaster>('penetration');
  const [defenseEnabled, setDefenseEnabled] = useState<boolean>(false);
  const [simState, setSimState] = useState<{
    dbQps: number;
    redisQps: number;
    dbStatus: 'Normal' | 'Overloaded' | 'Crashed';
    log: string;
  }>({
    dbQps: 10,
    redisQps: 990,
    dbStatus: 'Normal',
    log: 'Select a scenario and click "Simulate Traffic Surge" to observe DB stress.'
  });

  const runSurge = () => {
    if (disaster === 'penetration') {
      if (!defenseEnabled) {
        setSimState({
          dbQps: 5000,
          redisQps: 5000,
          dbStatus: 'Crashed',
          log: '🚨 DISASTER: Attacker requested 5,000 non-existent user IDs (user:-999). Every request bypassed Redis and hammered PostgreSQL, crashing the database connection pool!'
        });
      } else {
        setSimState({
          dbQps: 0,
          redisQps: 5000,
          dbStatus: 'Normal',
          log: '🛡️ DEFENDED: Bloom Filter intercepted all 5,000 non-existent keys in 0.01ms and returned 404 immediately. Zero requests reached PostgreSQL!'
        });
      }
    } else if (disaster === 'breakdown') {
      if (!defenseEnabled) {
        setSimState({
          dbQps: 3000,
          redisQps: 3000,
          dbStatus: 'Overloaded',
          log: '🚨 DISASTER: Super Bowl hot key (promo:deal) expired at 12:00:00. 3,000 concurrent threads simultaneously queried the DB to rebuild cache, causing catastrophic latency spike!'
        });
      } else {
        setSimState({
          dbQps: 1,
          redisQps: 3000,
          dbStatus: 'Normal',
          log: '🛡️ DEFENDED: Mutex Lock (Singleflight) allowed only 1 thread to query PostgreSQL while the other 2,999 waited for the single cache rebuild. DB load: 1 QPS!'
        });
      }
    } else {
      // Avalanche
      if (!defenseEnabled) {
        setSimState({
          dbQps: 10000,
          redisQps: 10000,
          dbStatus: 'Crashed',
          log: '🚨 DISASTER: 100,000 keys were set with standard 1-hour TTL. At exactly 1:00:00 PM, all 100k keys expired simultaneously, unleashing a tsunami of queries directly onto PostgreSQL!'
        });
      } else {
        setSimState({
          dbQps: 50,
          redisQps: 10000,
          dbStatus: 'Normal',
          log: '🛡️ DEFENDED: Random TTL Jitter (3600s + Math.random() * 300s) staggered key expirations across 5 minutes. DB load remained smooth and steady under 50 QPS!'
        });
      }
    }
  };

  return (
    <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-rose-600 dark:text-rose-400">
              High Availability Defense Arena
            </div>
            <h3 className="text-xl font-bold text-foreground">
              The &ldquo;Big 3&rdquo; Cache Disasters &amp; Defenses
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">Defense Protection:</span>
          <button
            onClick={() => {
              setDefenseEnabled((prev) => !prev);
              setSimState({
                dbQps: 10,
                redisQps: 990,
                dbStatus: 'Normal',
                log: 'Defense toggled. Click "Simulate Traffic Surge" to test.'
              });
            }}
            className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition flex items-center gap-1.5 ${
              defenseEnabled
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
            }`}
          >
            {defenseEnabled ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            <span>{defenseEnabled ? 'DEFENSE ACTIVE ✅' : 'VULNERABLE (NO DEFENSE) ❌'}</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'penetration' as const, name: '1. Cache Penetration', sub: 'Non-existent keys bypassing cache', defense: 'Bloom Filter / Cache Null' },
          { id: 'breakdown' as const, name: '2. Cache Breakdown', sub: 'Hot key expiry concurrent stampede', defense: 'Mutex Lock / Singleflight' },
          { id: 'avalanche' as const, name: '3. Cache Avalanche', sub: 'Mass synchronized key expirations', defense: 'Random TTL Jitter' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setDisaster(item.id);
              setSimState({
                dbQps: 10,
                redisQps: 990,
                dbStatus: 'Normal',
                log: 'Scenario selected. Click "Simulate Traffic Surge" to test.'
              });
            }}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              disaster === item.id
                ? 'bg-rose-600 text-white shadow-md border-rose-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-rose-500'
            }`}
          >
            <div className="font-bold">{item.name}</div>
            <div className={`text-[10px] ${disaster === item.id ? 'text-rose-100' : 'text-muted-foreground'}`}>
              {item.sub}
            </div>
            <div className={`text-[10px] pt-1 font-bold ${disaster === item.id ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
              🛡️ Fix: {item.defense}
            </div>
          </button>
        ))}
      </div>

      {/* Live Metrics Dashboard */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1 text-center">
          <span className="text-[11px] text-muted-foreground font-mono">Redis Query Rate</span>
          <div className="text-2xl font-extrabold text-foreground font-mono">{simState.redisQps} QPS</div>
          <span className="text-[10px] text-emerald-500 font-bold">Sub-millisecond RAM</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1 text-center">
          <span className="text-[11px] text-muted-foreground font-mono">SQL Database Load</span>
          <div className={`text-2xl font-extrabold font-mono ${
            simState.dbQps > 1000 ? 'text-rose-500 animate-bounce' : 'text-foreground'
          }`}>
            {simState.dbQps} QPS
          </div>
          <span className="text-[10px] text-muted-foreground">PostgreSQL Backend</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1 text-center">
          <span className="text-[11px] text-muted-foreground font-mono">Database Health</span>
          <div className={`text-lg font-extrabold ${
            simState.dbStatus === 'Normal' ? 'text-emerald-500' : 'text-rose-500'
          }`}>
            {simState.dbStatus === 'Normal' ? 'HEALTHY ✅' : 'CRITICAL OVERLOAD 🔥'}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">Status Indicator</span>
        </div>
      </div>

      {/* Simulation Log & Button */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-3 shadow-inner">
        <div className="leading-relaxed">
          <span className="text-rose-400 font-bold">Diagnostics:</span> {simState.log}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={runSurge}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Traffic Surge (5,000 Req/s)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
