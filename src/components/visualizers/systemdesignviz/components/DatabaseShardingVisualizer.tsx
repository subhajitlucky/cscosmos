'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Database, HardDrive, Layers, RefreshCw, Server, Sparkles, Zap } from 'lucide-react';

export function DatabaseShardingVisualizer() {
  const [shards] = useState<{ id: number; name: string; range: string; records: string[] }[]>([
    { id: 1, name: 'Shard 1 (DB Cluster US-East)', range: 'Users A - H', records: ['alice@corp.io', 'charlie@dev.net', 'bob@test.com'] },
    { id: 2, name: 'Shard 2 (DB Cluster US-West)', range: 'Users I - P', records: ['jack@scale.com', 'lisa@cloud.org', 'mike@ops.io'] },
    { id: 3, name: 'Shard 3 (DB Cluster EU-Central)', range: 'Users Q - Z', records: ['rachel@arch.net', 'sam@db.io', 'zack@data.ai'] },
  ]);

  const [inputUser, setInputUser] = useState<string>('sarah@corp.com');
  const [routedShard, setRoutedShard] = useState<number>(3);

  const handleRoute = (email: string) => {
    setInputUser(email);
    const firstChar = email.trim().toUpperCase()[0] || 'A';
    if (firstChar >= 'A' && firstChar <= 'H') {
      setRoutedShard(1);
    } else if (firstChar >= 'I' && firstChar <= 'P') {
      setRoutedShard(2);
    } else {
      setRoutedShard(3);
    }
  };

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Horizontal Database Partitioning
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Database Sharding &amp; Range-Key Routing Engine
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Target: Shard {routedShard}
        </span>
      </div>

      {/* Shard Key Input */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-2 font-mono text-xs">
        <span className="text-muted-foreground block font-bold">Test User Shard Key Routing (e.g. Email):</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputUser}
            onChange={(e) => handleRoute(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs border border-border outline-none shadow-inner"
          />
          <button
            onClick={() => handleRoute(inputUser)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md"
          >
            Calculate Shard Route
          </button>
        </div>
      </div>

      {/* Shards Grid */}
      <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
        {shards.map((s) => {
          const isTarget = routedShard === s.id;
          return (
            <div
              key={s.id}
              className={`p-5 rounded-3xl border space-y-3 transition-all ${
                isTarget
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-100 ring-2 ring-indigo-400 shadow-lg scale-105 font-bold'
                  : 'border-slate-800 bg-slate-950 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="font-extrabold text-sm text-foreground">Shard #{s.id}</span>
                <span className="text-[10px] text-indigo-400 font-bold">{s.range}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">{s.name}</div>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-500 block">Existing Records:</span>
                {s.records.map((rec, rIdx) => (
                  <div key={rIdx} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 text-[10px]">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
